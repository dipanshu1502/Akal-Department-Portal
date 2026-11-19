<?php

namespace App\Http\Controllers;

use App\Department;
use App\Faculty;
use App\Media;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PublicDepartmentController extends Controller
{
    public function index(Request $request)
    {
        $query = Department::with(['faculty', 'settings'])
            ->where('is_active', true)
            ->where('is_published', true)
            ->orderBy('sort_order');

        if ($request->has('faculty_id') && $request->faculty_id !== 'all') {
            $query->where('faculty_id', $request->faculty_id);
        }

        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('short_description', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
            });
        }

        $departments = $query->get();
        $departments = $this->sanitizeMediaReferences(
            $departments->toArray(),
            $this->mediaPathMap($request, $departments->pluck('id')->all())
        );

        return response()->json([
            'data' => $departments,
        ]);
    }

    public function faculties(Request $request)
    {
        $faculties = Faculty::with(['departments' => function ($q) {
            $q->where('is_active', true)->where('is_published', true)->orderBy('sort_order');
        }])->where('is_active', true)->orderBy('sort_order')->get();

        $departmentIds = $faculties->flatMap(fn (Faculty $faculty) => $faculty->departments->pluck('id'))->unique()->values()->all();
        return response()->json([
            'data' => $this->sanitizeMediaReferences($faculties->toArray(), $this->mediaPathMap($request, $departmentIds)),
        ]);
    }

    public function show(Request $request, string $slug)
    {
        $department = Department::with([
            'faculty',
            'settings',
            'sections' => function ($q) {
                $q->where('enabled', true)->where('status', 'published')->orderBy('display_order');
            },
            'facultyMembers' => function ($q) {
                $q->where('status', 'active')->orderBy('display_order');
            },
            'programmes' => function ($q) {
                $q->where('status', 'active')->orderBy('sort_order');
            },
            'laboratories' => function ($q) {
                $q->where('status', 'active')->orderBy('sort_order');
            },
            'events' => function ($q) {
                $q->orderBy('event_date', 'desc');
            },
            'achievements' => function ($q) {
                $q->orderBy('achievement_date', 'desc');
            },
            'publications' => function ($q) {
                $q->orderBy('year', 'desc');
            },
            'notices' => function ($q) {
                $q->where('is_active', true)->orderBy('publish_date', 'desc');
            },
            'galleries' => function ($q) {
                $q->orderBy('display_order');
            },
        ])
        ->where('slug', $slug)
        ->where('is_active', true)
        ->where('is_published', true)
        ->firstOrFail();

        $mediaStatus = $this->mediaPathMap($request, [$department->id]);

        $publishedDocuments = Media::with('category:id,name')
            ->where('department_id', $department->id)
            ->where('media_type', 'document')
            ->where('status', 'published')
            ->orderByDesc('published_at')
            ->get()
            ->map(fn (Media $media) => $this->serializePublicMedia($request, $media));
        $publishedImages = Media::with('category:id,name')
            ->where('department_id', $department->id)
            ->where('media_type', 'image')
            ->where('status', 'published')
            ->where(function ($query) {
                $query->whereNull('category_id')
                    ->orWhereHas('category', function ($categoryQuery) {
                        $categoryQuery->whereIn('name', [
                            'Department Gallery', 'Events', 'Workshops', 'Seminars',
                            'Campus Activities', 'Achievements', 'Student Activities', 'Other Images',
                        ]);
                    });
            })
            ->orderBy('display_order')
            ->get()
            ->map(fn (Media $media) => $this->serializePublicMedia($request, $media));

        return response()->json([
            'data' => [
                'department' => $this->sanitizeMediaReferences($department->toArray(), $mediaStatus),
                'settings' => $this->sanitizeMediaReferences($department->settings?->toArray(), $mediaStatus),
                'sections' => $this->sanitizeMediaReferences($department->sections->toArray(), $mediaStatus),
                'faculty' => $this->sanitizeMediaReferences($department->facultyMembers->toArray(), $mediaStatus),
                'programmes' => $this->sanitizeMediaReferences($department->programmes->toArray(), $mediaStatus),
                'laboratories' => $this->sanitizeMediaReferences($department->laboratories->toArray(), $mediaStatus),
                'events' => $this->sanitizeMediaReferences($department->events->toArray(), $mediaStatus),
                'achievements' => $this->sanitizeMediaReferences($department->achievements->toArray(), $mediaStatus),
                'publications' => $this->sanitizeMediaReferences($department->publications->toArray(), $mediaStatus),
                'notices' => $this->sanitizeMediaReferences($department->notices->toArray(), $mediaStatus),
                'galleries' => $this->sanitizeMediaReferences($department->galleries->toArray(), $mediaStatus),
                'documents' => $publishedDocuments,
                'uploaded_gallery' => $publishedImages,
            ],
        ]);
    }

    public function faculty(string $slug)
    {
        $department = Department::where('slug', $slug)->firstOrFail();
        $data = $department->facultyMembers()->where('status', 'active')->orderBy('display_order')->get();
        return response()->json([
            'data' => $this->sanitizeMediaReferences($data->toArray(), $this->mediaPathMap(request(), [$department->id])),
        ]);
    }

    public function courses(string $slug)
    {
        $department = Department::where('slug', $slug)->firstOrFail();
        $data = $department->programmes()->where('status', 'active')->orderBy('sort_order')->get();
        return response()->json([
            'data' => $this->sanitizeMediaReferences($data->toArray(), $this->mediaPathMap(request(), [$department->id])),
        ]);
    }

    public function events(string $slug)
    {
        $department = Department::where('slug', $slug)->firstOrFail();
        $data = $department->events()->orderBy('event_date', 'desc')->get();
        return response()->json([
            'data' => $this->sanitizeMediaReferences($data->toArray(), $this->mediaPathMap(request(), [$department->id])),
        ]);
    }

    public function research(string $slug)
    {
        $department = Department::where('slug', $slug)->firstOrFail();
        $data = $department->publications()->orderBy('year', 'desc')->get();
        return response()->json([
            'data' => $this->sanitizeMediaReferences($data->toArray(), $this->mediaPathMap(request(), [$department->id])),
        ]);
    }

    public function gallery(Request $request, string $slug)
    {
        $department = Department::where('slug', $slug)->firstOrFail();
        $data = $department->galleries()->orderBy('display_order')->get();
        $media = Media::with('category:id,name')
            ->where('department_id', $department->id)
            ->where('media_type', 'image')
            ->where('status', 'published')
            ->where(function ($query) {
                $query->whereNull('category_id')
                    ->orWhereHas('category', function ($categoryQuery) {
                        $categoryQuery->whereIn('name', [
                            'Department Gallery', 'Events', 'Workshops', 'Seminars',
                            'Campus Activities', 'Achievements', 'Student Activities', 'Other Images',
                        ]);
                    });
            })
            ->orderBy('display_order')
            ->get()
            ->map(function (Media $item) use ($request) {
                $media = $this->serializePublicMedia($request, $item);
                $media['image_url'] = $media['url'];
                return $media;
            });
        return response()->json([
            'data' => array_merge(
                $this->sanitizeMediaReferences($data->toArray(), $this->mediaPathMap(request(), [$department->id])),
                $media->all()
            ),
        ]);
    }

    public function notices(string $slug)
    {
        $department = Department::where('slug', $slug)->firstOrFail();
        $data = $department->notices()->where('is_active', true)->orderBy('publish_date', 'desc')->get();
        return response()->json([
            'data' => $this->sanitizeMediaReferences($data->toArray(), $this->mediaPathMap(request(), [$department->id])),
        ]);
    }

    private function sanitizeMediaReferences($value, array $mediaStatus)
    {
        if (is_array($value)) {
            foreach ($value as $key => $child) {
                $value[$key] = $this->sanitizeMediaReferences($child, $mediaStatus);
            }
            return $value;
        }

        if (is_string($value) && array_key_exists($value, $mediaStatus)) {
            return $mediaStatus[$value];
        }

        return $value;
    }

    private function mediaPathMap(Request $request, array $departmentIds): array
    {
        $media = Media::withTrashed()
            ->whereIn('department_id', $departmentIds)
            ->get(['id', 'file_path', 'status', 'deleted_at', 'replaces_media_id']);
        $publishedReplacements = Media::whereIn('replaces_media_id', $media->pluck('id'))
            ->where('status', 'published')
            ->get(['replaces_media_id', 'file_path']);
        $replacementUrls = $publishedReplacements->mapWithKeys(function (Media $replacement) use ($request) {
            return [
                $replacement->replaces_media_id => $this->storageUrl($request, $replacement->file_path),
            ];
        });

        return $media->mapWithKeys(function (Media $item) use ($request, $replacementUrls, $media) {
            $parent = $item->replaces_media_id ? $media->firstWhere('id', $item->replaces_media_id) : null;
            $parentUrl = $parent && $parent->status === 'published' && ! $parent->trashed()
                ? $this->storageUrl($request, $parent->file_path)
                : ($parent ? ($replacementUrls[$parent->id] ?? null) : null);
            $url = $item->status === 'published' && ! $item->trashed()
                ? $this->storageUrl($request, $item->file_path)
                : ($replacementUrls[$item->id] ?? $parentUrl);
            return [$item->file_path => $url];
        })->all();
    }

    private function serializePublicMedia(Request $request, Media $media): array
    {
        $data = $media->toArray();
        $data['url'] = $this->storageUrl($request, $media->file_path);
        $data['file_size_human'] = $media->file_size < 1024
            ? $media->file_size.' B'
            : number_format($media->file_size / 1024, 1).' KB';
        return $data;
    }

    private function storageUrl(Request $request, string $path): string
    {
        $url = Storage::disk('public')->url($path);
        return str_starts_with($url, 'http') ? $url : $request->getSchemeAndHttpHost().'/'.ltrim($url, '/');
    }
}
