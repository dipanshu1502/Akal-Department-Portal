<?php

namespace App\Http\Controllers;

use App\ActivityLog;
use App\Department;
use App\Media;
use App\MediaCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class MediaController extends Controller
{
    private const DOCUMENT_EXTENSIONS = 'pdf,doc,docx,ppt,pptx,xls,xlsx,txt';

    private function ensureDepartmentAccess(Request $request, Department $department): void
    {
        $user = $request->user();
        if ($user->role !== 'super_admin' && ! $user->departments()->whereKey($department->id)->exists()) {
            abort(403, 'You are not assigned to this department.');
        }
    }

    private function ensureMediaAccess(Request $request, Media $media): void
    {
        $this->ensureDepartmentAccess($request, $media->department);
    }

    private function fileRules(string $mediaType): array
    {
        if ($mediaType === 'image') {
            return ['required', 'file', 'mimes:jpg,jpeg,png,webp', 'extensions:jpg,jpeg,png,webp', 'max:5120', 'dimensions:max_width=6000,max_height=6000'];
        }

        if ($mediaType === 'document') {
            return ['required', 'file', 'mimes:pdf,doc,docx,ppt,pptx,xls,xlsx,txt', 'extensions:'.self::DOCUMENT_EXTENSIONS, 'max:20480'];
        }

        throw ValidationException::withMessages(['media_type' => 'Choose either an image or a document upload.']);
    }

    private function publicUrl(Request $request, Media $media): string
    {
        $url = Storage::disk('public')->url($media->file_path);
        return str_starts_with($url, 'http') ? $url : $request->getSchemeAndHttpHost().'/'.ltrim($url, '/');
    }

    public function index(Request $request)
    {
        $request->validate([
            'department_id' => ['nullable', 'integer', 'exists:departments,id'],
            'media_type' => ['nullable', 'in:document,image'],
            'category_id' => ['nullable', 'integer', 'exists:media_categories,id'],
            'status' => ['nullable', 'in:draft,pending,approved,rejected,published,archived'],
            'date_from' => ['nullable', 'date'],
            'date_to' => ['nullable', 'date', 'after_or_equal:date_from'],
            'search' => ['nullable', 'string', 'max:255'],
        ]);
        $user = $request->user();
        $query = Media::with(['department:id,name', 'category:id,name,media_type', 'submitter:id,name,email'])
            ->latest();

        if ($user->role !== 'super_admin') {
            $query->whereIn('department_id', $user->departments()->select('departments.id'));
        }

        if ($request->filled('department_id')) {
            $query->where('department_id', $request->integer('department_id'));
        }

        foreach (['media_type', 'category_id', 'status'] as $filter) {
            if ($request->filled($filter)) {
                $query->where($filter, $request->input($filter));
            }
        }

        if ($request->filled('search')) {
            $search = $request->string('search')->toString();
            $query->where(function ($builder) use ($search) {
                $builder->where('title', 'like', "%{$search}%")
                    ->orWhere('original_name', 'like', "%{$search}%");
            });
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->input('date_from'));
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->input('date_to'));
        }

        $items = $query->get()->map(function (Media $media) use ($request) {
            return $this->serializeMedia($request, $media);
        });

        return response()->json(['data' => $items]);
    }

    public function show(Request $request, Media $media)
    {
        $this->ensureMediaAccess($request, $media);

        return response()->json(['data' => $this->serializeMedia($request, $media->load(['department', 'category', 'submitter', 'reviewer']))]);
    }

    public function store(Request $request, Department $department)
    {
        $this->ensureDepartmentAccess($request, $department);
        $type = $request->input('media_type');
        $request->validate([
            'media_type' => ['required', 'in:document,image'],
            'category_id' => ['nullable', 'exists:media_categories,id'],
            'title' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'alt_text' => ['nullable', 'string', 'max:255'],
            'caption' => ['nullable', 'string', 'max:2000'],
            'status' => ['nullable', 'in:draft,pending'],
            'file' => $this->fileRules($type),
        ]);

        $category = $request->filled('category_id') ? MediaCategory::findOrFail($request->integer('category_id')) : null;
        if ($category && $category->department_id && (int) $category->department_id !== (int) $department->id) {
            abort(403, 'This category does not belong to the selected department.');
        }
        if ($category && $category->media_type !== 'both' && $category->media_type !== $type) {
            throw ValidationException::withMessages(['category_id' => 'The selected category does not match this file type.']);
        }

        $file = $request->file('file');
        $directory = "departments/{$department->id}/".($type === 'image' ? 'images' : 'documents');
        $path = $file->store($directory, 'public');
        $status = $request->input('status', 'pending');

        try {
            $media = Media::create([
                'department_id' => $department->id,
                'uploaded_by' => $request->user()->id,
                'category_id' => $category?->id,
                'title' => $request->input('title') ?: pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME),
                'description' => $request->input('description'),
                'original_name' => basename($file->getClientOriginalName()),
                'stored_name' => basename($path),
                'file_path' => $path,
                'mime_type' => $file->getMimeType(),
                'extension' => strtolower($file->getClientOriginalExtension()),
                'file_size' => $file->getSize(),
                'media_type' => $type,
                'alt_text' => $request->input('alt_text'),
                'caption' => $request->input('caption'),
                'status' => $status,
                'submitted_at' => $status === 'pending' ? now() : null,
            ]);
        } catch (\Throwable $exception) {
            Storage::disk('public')->delete($path);
            throw $exception;
        }

        ActivityLog::log('uploaded_media', "Uploaded {$type} '{$media->title}' to {$department->name}", $department->id, $request->user()->id);

        return response()->json([
            'message' => $status === 'pending' ? 'File uploaded and submitted for approval.' : 'File saved as a draft.',
            'data' => $this->serializeMedia($request, $media->load(['department', 'category'])),
        ], 201);
    }

    public function update(Request $request, Media $media)
    {
        $this->ensureMediaAccess($request, $media);
        $payload = $request->validate([
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'category_id' => ['nullable', 'exists:media_categories,id'],
            'alt_text' => ['nullable', 'string', 'max:255'],
            'caption' => ['nullable', 'string', 'max:2000'],
            'display_order' => ['sometimes', 'integer', 'min:0'],
        ]);

        if (array_key_exists('category_id', $payload) && $payload['category_id']) {
            $category = MediaCategory::find($payload['category_id']);
            if ($category && $category->department_id && (int) $category->department_id !== (int) $media->department_id) {
                abort(403, 'This category does not belong to the media department.');
            }
            if ($category && $category->media_type !== 'both' && $category->media_type !== $media->media_type) {
                throw ValidationException::withMessages(['category_id' => 'The selected category does not match this file type.']);
            }
        }

        $media->update($payload);
        return response()->json(['message' => 'Media details updated.', 'data' => $this->serializeMedia($request, $media->fresh(['department', 'category']))]);
    }

    public function submit(Request $request, Media $media)
    {
        $this->ensureMediaAccess($request, $media);
        if (! in_array($media->status, ['draft', 'rejected'], true)) {
            abort(422, 'Only draft or rejected media can be submitted.');
        }

        $media->update([
            'status' => 'pending',
            'submitted_at' => now(),
            'review_comments' => null,
            'reviewed_by' => null,
            'reviewed_at' => null,
        ]);

        ActivityLog::log('submitted_media', "Submitted media '{$media->title}' for approval", $media->department_id, $request->user()->id);
        return response()->json(['message' => 'Media submitted for approval.', 'data' => $media->fresh()]);
    }

    public function replace(Request $request, Media $media)
    {
        $this->ensureMediaAccess($request, $media);
        $request->validate([
            'category_id' => ['nullable', 'exists:media_categories,id'],
            'title' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'alt_text' => ['nullable', 'string', 'max:255'],
            'caption' => ['nullable', 'string', 'max:2000'],
            'file' => $this->fileRules($media->media_type),
        ]);
        if ($request->filled('category_id')) {
            $category = MediaCategory::findOrFail($request->integer('category_id'));
            if ($category->department_id && (int) $category->department_id !== (int) $media->department_id) {
                abort(403, 'This category does not belong to the media department.');
            }
            if ($category->media_type !== 'both' && $category->media_type !== $media->media_type) {
                throw ValidationException::withMessages(['category_id' => 'The selected category does not match this file type.']);
            }
        }

        $file = $request->file('file');
        $directory = "departments/{$media->department_id}/".($media->media_type === 'image' ? 'images' : 'documents');
        $path = $file->store($directory, 'public');
        try {
            $replacement = Media::create([
                'department_id' => $media->department_id,
                'uploaded_by' => $request->user()->id,
                'category_id' => $request->input('category_id', $media->category_id),
                'replaces_media_id' => $media->id,
                'title' => $request->input('title', $media->title),
                'description' => $request->input('description', $media->description),
                'original_name' => basename($file->getClientOriginalName()),
                'stored_name' => basename($path),
                'file_path' => $path,
                'mime_type' => $file->getMimeType(),
                'extension' => strtolower($file->getClientOriginalExtension()),
                'file_size' => $file->getSize(),
                'media_type' => $media->media_type,
                'alt_text' => $request->input('alt_text', $media->alt_text),
                'caption' => $request->input('caption', $media->caption),
                'status' => 'pending',
                'submitted_at' => now(),
            ]);
        } catch (\Throwable $exception) {
            Storage::disk('public')->delete($path);
            throw $exception;
        }

        ActivityLog::log('replaced_media', "Submitted replacement for media '{$media->title}'", $media->department_id, $request->user()->id);
        return response()->json(['message' => 'Replacement uploaded for approval; the current version remains available.', 'data' => $this->serializeMedia($request, $replacement)], 201);
    }

    public function destroy(Request $request, Media $media)
    {
        $this->ensureMediaAccess($request, $media);
        if ($media->status === 'deleted') {
            abort(404);
        }

        $media->update(['delete_requested' => true]);
        ActivityLog::log('requested_media_deletion', "Requested deletion of media '{$media->title}'", $media->department_id, $request->user()->id);
        return response()->json(['message' => 'Deletion submitted for Super Admin approval.']);
    }

    public function categories(Request $request)
    {
        $query = MediaCategory::query()->orderBy('name');
        if ($request->user()->role !== 'super_admin') {
            $departmentIds = $request->user()->departments()->select('departments.id');
            $query->where(function ($builder) use ($departmentIds) {
                $builder->whereNull('department_id')->orWhereIn('department_id', $departmentIds);
            });
        }

        return response()->json(['data' => $query->get()]);
    }

    public function createCategory(Request $request)
    {
        abort_unless($request->user()->role === 'super_admin', 403, 'Only Super Admin can manage media categories.');
        $payload = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'media_type' => ['required', 'in:document,image,both'],
            'department_id' => ['nullable', 'exists:departments,id'],
        ]);

        $category = MediaCategory::create($payload);
        return response()->json(['message' => 'Media category created.', 'data' => $category], 201);
    }

    public function updateCategory(Request $request, MediaCategory $category)
    {
        abort_unless($request->user()->role === 'super_admin', 403, 'Only Super Admin can manage media categories.');
        $category->update($request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:100'],
            'media_type' => ['sometimes', 'required', 'in:document,image,both'],
        ]));

        return response()->json(['message' => 'Media category updated.', 'data' => $category->fresh()]);
    }

    public function deleteCategory(Request $request, MediaCategory $category)
    {
        abort_unless($request->user()->role === 'super_admin', 403, 'Only Super Admin can manage media categories.');
        if (Media::where('category_id', $category->id)->exists()) {
            abort(409, 'Reassign or remove the category from its media before deleting it.');
        }

        $category->delete();
        return response()->json(['message' => 'Media category deleted.']);
    }

    public function pending(Request $request)
    {
        abort_unless($request->user()->role === 'super_admin', 403, 'Only Super Admin can review media.');
        $query = Media::with(['department:id,name', 'category:id,name', 'submitter:id,name,email'])
            ->where(function ($builder) {
                $builder->whereIn('status', ['pending', 'approved'])->orWhere('delete_requested', true);
            })
            ->latest();

        if ($request->filled('department_id')) {
            $query->where('department_id', $request->integer('department_id'));
        }

        return response()->json(['data' => $query->get()->map(fn (Media $media) => $this->serializeMedia($request, $media))]);
    }

    public function approve(Request $request, Media $media)
    {
        abort_unless($request->user()->role === 'super_admin', 403, 'Only Super Admin can review media.');
        if ($media->delete_requested) {
            $media->update([
                'status' => 'deleted',
                'delete_requested' => false,
                'reviewed_by' => $request->user()->id,
                'reviewed_at' => now(),
                'review_comments' => $request->input('comments', 'Deletion approved.'),
            ]);
            $media->delete();
            $action = 'approved_media_deletion';
            $message = 'Media deletion approved.';
        } else {
            abort_unless($media->status === 'pending', 422, 'Only pending media can be approved.');
            $media->update([
                'status' => 'approved',
                'reviewed_by' => $request->user()->id,
                'reviewed_at' => now(),
                'review_comments' => $request->input('comments'),
            ]);
            $action = 'approved_media';
            $message = 'Media approved. Publish it to make it public.';
        }

        ActivityLog::log($action, "Reviewed media '{$media->title}'", $media->department_id, $request->user()->id);
        return response()->json(['message' => $message, 'data' => $media->fresh()]);
    }

    public function reject(Request $request, Media $media)
    {
        abort_unless($request->user()->role === 'super_admin', 403, 'Only Super Admin can review media.');
        $payload = $request->validate(['comments' => ['required', 'string', 'max:2000']]);

        $media->update([
            'status' => $media->delete_requested ? $media->status : 'rejected',
            'delete_requested' => false,
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
            'review_comments' => $payload['comments'],
        ]);

        ActivityLog::log('rejected_media', "Rejected media request '{$media->title}'", $media->department_id, $request->user()->id);
        return response()->json(['message' => 'Media request rejected with feedback.', 'data' => $media->fresh()]);
    }

    public function publish(Request $request, Media $media)
    {
        abort_unless($request->user()->role === 'super_admin', 403, 'Only Super Admin can publish media.');
        abort_unless($media->status === 'approved', 422, 'Approve the media before publishing it.');

        if ($media->replaces_media_id) {
            $media->replacement()->update(['status' => 'archived']);
        }
        $media->update(['status' => 'published', 'published_at' => now()]);
        ActivityLog::log('published_media', "Published media '{$media->title}'", $media->department_id, $request->user()->id);
        return response()->json(['message' => 'Media published.', 'data' => $this->serializeMedia($request, $media->fresh(['department', 'category']))]);
    }

    public function download(Request $request, Media $media)
    {
        $this->ensureMediaAccess($request, $media);
        abort_unless(Storage::disk('public')->exists($media->file_path), 404, 'The stored file is unavailable.');

        return Storage::disk('public')->download($media->file_path, $media->original_name);
    }

    public function publicDocuments(Request $request, string $slug)
    {
        return $this->publicMediaResponse($request, $slug, 'document');
    }

    public function publicGallery(Request $request, string $slug)
    {
        return $this->publicMediaResponse($request, $slug, 'image');
    }

    private function publicMediaResponse(Request $request, string $slug, string $type)
    {
        $department = Department::where('slug', $slug)->where('is_active', true)->where('is_published', true)->firstOrFail();
        $items = Media::with('category:id,name')
            ->where('department_id', $department->id)
            ->where('media_type', $type)
            ->where('status', 'published')
            ->when($type === 'image', function ($query) {
                $query->where(function ($builder) {
                    $builder->whereNull('category_id')
                        ->orWhereHas('category', function ($categoryQuery) {
                            $categoryQuery->whereIn('name', [
                                'Department Gallery', 'Events', 'Workshops', 'Seminars',
                                'Campus Activities', 'Achievements', 'Student Activities', 'Other Images',
                            ]);
                        });
                });
            })
            ->orderBy('display_order')
            ->orderByDesc('published_at')
            ->get()
            ->map(fn (Media $media) => $this->serializePublicMedia($request, $media));

        return response()->json(['data' => $items]);
    }

    private function serializeMedia(Request $request, Media $media): array
    {
        $data = $media->toArray();
        $data['file_path'] = $media->file_path;
        $data['url'] = $this->publicUrl($request, $media);
        $data['file_size_human'] = $this->humanFileSize($media->file_size);
        return $data;
    }

    private function serializePublicMedia(Request $request, Media $media): array
    {
        $data = $media->toArray();
        $data['url'] = $this->publicUrl($request, $media);
        $data['file_size_human'] = $this->humanFileSize($media->file_size);
        return $data;
    }

    private function humanFileSize(int $bytes): string
    {
        if ($bytes < 1024) {
            return $bytes.' B';
        }

        $units = ['KB', 'MB', 'GB'];
        $size = $bytes / 1024;
        foreach ($units as $unit) {
            if ($size < 1024 || $unit === 'GB') {
                return number_format($size, 1).' '.$unit;
            }
            $size /= 1024;
        }

        return number_format($size, 1).' GB';
    }
}
