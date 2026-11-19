<?php

namespace App\Http\Controllers;

use App\ActivityLog;
use App\ContentRevision;
use App\Department;
use App\DepartmentSection;
use App\DepartmentSetting;
use App\Media;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ContentRevisionController extends Controller
{
    protected function ensureAccess(Request $request, ContentRevision $revision): void
    {
        $user = $request->user();

        if (! $user) {
            abort(401);
        }

        if ($user->role === 'super_admin') {
            return;
        }

        if (! $user->departments()->where('departments.id', $revision->department_id)->exists()) {
            abort(403, 'Unauthorized access to this revision.');
        }
    }

    public function index(Request $request)
    {
        $user = $request->user();
        $query = ContentRevision::with(['department', 'submitter', 'reviewer', 'section'])->latest();

        if ($user->role !== 'super_admin') {
            $departmentIds = $user->departments()->pluck('departments.id');
            $query->whereIn('department_id', $departmentIds);
        }

        if ($request->has('status') && !empty($request->status) && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->has('department_id') && !empty($request->department_id)) {
            $query->where('department_id', $request->department_id);
        }

        return response()->json([
            'data' => $query->get(),
        ]);
    }

    public function show(Request $request, ContentRevision $revision)
    {
        $this->ensureAccess($request, $revision);

        return response()->json([
            'data' => $revision->load(['department', 'submitter', 'reviewer', 'section']),
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        $payload = $request->validate([
            'department_id' => ['required', 'exists:departments,id'],
            'section_id' => ['nullable', 'exists:department_sections,id'],
            'model_type' => ['nullable', 'string', 'in:section,settings,general'],
            'title' => ['required', 'string', 'max:255'],
            'payload' => ['required', 'array'],
            'status' => ['nullable', 'string', 'in:draft,pending'],
        ]);

        // Check department access
        if ($user->role !== 'super_admin' && ! $user->departments()->where('departments.id', $payload['department_id'])->exists()) {
            abort(403, 'You are not assigned to this department.');
        }

        $status = $payload['status'] ?? 'pending';

        $revision = DB::transaction(function () use ($payload, $status, $user) {
            if (($payload['model_type'] ?? 'section') === 'settings' && $status === 'pending') {
                $query = ContentRevision::query()
                    ->where('department_id', $payload['department_id'])
                    ->where('model_type', 'settings')
                    ->where('status', 'pending');

                // Return the existing pending submission instead of creating duplicates.
                $existing = $query->lockForUpdate()->latest()->first();
                if ($existing) {
                    return $existing;
                }
            }

            return ContentRevision::create([
                'department_id' => $payload['department_id'],
                'section_id' => $payload['section_id'] ?? null,
                'model_type' => $payload['model_type'] ?? 'section',
                'title' => $payload['title'],
                'payload' => $payload['payload'],
                'status' => $status,
                'user_id' => $user->id,
                'submitted_at' => $status === 'pending' ? now() : null,
            ]);
        });


        if (! $revision->wasRecentlyCreated) {
            return response()->json([
                'message' => 'A settings update is already pending review.',
                'data' => $revision->load(['department', 'submitter']),
            ]);
        }

        ActivityLog::log(
            'submitted_revision',
            "Submitted revision: {$revision->title} for department: {$revision->department->name}",
            $revision->department_id,
            $user->id
        );

        return response()->json([
            'message' => 'Revision saved successfully.',
            'data' => $revision->load(['department', 'submitter']),
        ], 201);
    }

    public function approve(Request $request, ContentRevision $revision)
    {
        $user = $request->user();

        if (! $user || $user->role !== 'super_admin') {
            abort(403, 'Only super administrators can approve revisions.');
        }

        DB::transaction(function () use ($revision, $user, $request) {
            $approvedAt = now();
            $revision->update([
                // Settings are live site configuration, so approval applies them immediately.
                'status' => $revision->model_type === 'settings' ? 'published' : 'approved',
                'reviewer_id' => $user->id,
                'reviewed_at' => $approvedAt,
                'review_comments' => $request->input('comments', 'Approved by Super Admin.'),
                'published_at' => $revision->model_type === 'settings' ? $approvedAt : null,
            ]);

            if ($revision->model_type === 'settings') {
                $settings = DepartmentSetting::firstOrCreate(['department_id' => $revision->department_id]);
                $settings->update($revision->payload);

                // A HOD photo uploaded through this profile is part of the same
                // settings submission, so publish that referenced image with it.
                $photoPath = $revision->payload['hod_photo'] ?? null;
                if ($photoPath) {
                    $photo = Media::where('department_id', $revision->department_id)
                        ->where('file_path', $photoPath)
                        ->where('media_type', 'image')
                        ->whereIn('status', ['pending', 'approved'])
                        ->first();

                    if ($photo) {
                        if ($photo->replaces_media_id) {
                            $photo->replacement()->update(['status' => 'archived']);
                        }
                        $photo->update([
                            'status' => 'published',
                            'reviewer_id' => $user->id,
                            'reviewed_at' => $approvedAt,
                            'published_at' => $approvedAt,
                            'review_comments' => 'Published with approved department profile settings.',
                        ]);
                    }
                }
            }
        });

        $isSettings = $revision->model_type === 'settings';

        ActivityLog::log(
            'approved_revision',
            "Approved revision: {$revision->title} for department: {$revision->department->name}",
            $revision->department_id,
            $user->id
        );

        return response()->json([
            'message' => $isSettings
                ? 'Settings approved and published to the live department website.'
                : 'Revision approved successfully. You may now publish it.',
            'data' => $revision->load(['department', 'submitter', 'reviewer']),
        ]);
    }

    public function reject(Request $request, ContentRevision $revision)
    {
        $user = $request->user();

        if (! $user || $user->role !== 'super_admin') {
            abort(403, 'Only super administrators can reject revisions.');
        }

        $request->validate([
            'comments' => ['required', 'string'],
        ]);

        $revision->update([
            'status' => 'rejected',
            'reviewer_id' => $user->id,
            'reviewed_at' => now(),
            'review_comments' => $request->input('comments'),
        ]);

        ActivityLog::log(
            'rejected_revision',
            "Rejected revision: {$revision->title} with feedback: {$request->input('comments')}",
            $revision->department_id,
            $user->id
        );

        return response()->json([
            'message' => 'Revision rejected with comments.',
            'data' => $revision->load(['department', 'submitter', 'reviewer']),
        ]);
    }

    public function publish(Request $request, ContentRevision $revision)
    {
        $user = $request->user();

        if (! $user || $user->role !== 'super_admin') {
            abort(403, 'Only super administrators can publish content.');
        }

        $data = $revision->payload;

        // Apply changes based on model_type
        if ($revision->model_type === 'section') {
            if ($revision->section_id && $section = DepartmentSection::find($revision->section_id)) {
                $section->update([
                    'title' => $data['title'] ?? $section->title,
                    'subtitle' => $data['subtitle'] ?? $section->subtitle,
                    'layout_type' => $data['layout_type'] ?? $section->layout_type,
                    'content' => $data['content'] ?? $section->content,
                    'settings' => $data['settings'] ?? $section->settings,
                    'enabled' => $data['enabled'] ?? $section->enabled,
                    'status' => 'published',
                ]);
            } else {
                // Create new section
                $maxOrder = DepartmentSection::where('department_id', $revision->department_id)->max('display_order') ?? 0;
                $newSection = DepartmentSection::create([
                    'department_id' => $revision->department_id,
                    'title' => $data['title'] ?? $revision->title,
                    'subtitle' => $data['subtitle'] ?? null,
                    'layout_type' => $data['layout_type'] ?? 'text',
                    'content' => $data['content'] ?? [],
                    'settings' => $data['settings'] ?? [],
                    'enabled' => $data['enabled'] ?? true,
                    'status' => 'published',
                    'display_order' => $maxOrder + 1,
                ]);
                $revision->update(['section_id' => $newSection->id]);
            }
        } elseif ($revision->model_type === 'settings') {
            $settings = DepartmentSetting::firstOrCreate(['department_id' => $revision->department_id]);
            $settings->update($data);
        }

        $revision->update([
            'status' => 'published',
            'reviewer_id' => $user->id,
            'published_at' => now(),
        ]);

        ActivityLog::log(
            'published_revision',
            "Published revision to live website: {$revision->title}",
            $revision->department_id,
            $user->id
        );

        return response()->json([
            'message' => 'Revision successfully published to the live department website.',
            'data' => $revision->load(['department', 'section']),
        ]);
    }
}
