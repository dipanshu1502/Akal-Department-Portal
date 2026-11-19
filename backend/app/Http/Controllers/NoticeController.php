<?php

namespace App\Http\Controllers;

use App\ActivityLog;
use App\Department;
use App\Notice;
use Illuminate\Http\Request;

class NoticeController extends Controller
{
    protected function ensureAccess(Request $request, Department $department): void
    {
        $user = $request->user();
        if ($user->role === 'super_admin') return;
        if (!$user->departments()->whereKey($department->id)->exists()) {
            abort(403, 'Unauthorized access to this department.');
        }
    }

    public function index(Request $request, Department $department)
    {
        $this->ensureAccess($request, $department);
        return response()->json([
            'data' => $department->notices()->orderBy('publish_date', 'desc')->get(),
        ]);
    }

    public function store(Request $request, Department $department)
    {
        $this->ensureAccess($request, $department);

        $payload = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'category' => ['nullable', 'string', 'in:academic,exam,admission,general'],
            'publish_date' => ['required', 'date'],
            'expiry_date' => ['nullable', 'date'],
            'file_url' => ['nullable', 'string'],
            'is_important' => ['nullable', 'boolean'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $notice = $department->notices()->create($payload);

        ActivityLog::log('created_notice', "Created notice '{$notice->title}' in {$department->name}", $department->id);

        return response()->json([
            'message' => 'Notice created successfully.',
            'data' => $notice,
        ], 201);
    }

    public function update(Request $request, Notice $notice)
    {
        $this->ensureAccess($request, $notice->department);

        $payload = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'category' => ['nullable', 'string', 'in:academic,exam,admission,general'],
            'publish_date' => ['sometimes', 'date'],
            'expiry_date' => ['nullable', 'date'],
            'file_url' => ['nullable', 'string'],
            'is_important' => ['nullable', 'boolean'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $notice->update($payload);

        ActivityLog::log('updated_notice', "Updated notice '{$notice->title}'", $notice->department_id);

        return response()->json([
            'message' => 'Notice updated successfully.',
            'data' => $notice,
        ]);
    }

    public function destroy(Request $request, Notice $notice)
    {
        $this->ensureAccess($request, $notice->department);

        $title = $notice->title;
        $departmentId = $notice->department_id;
        $notice->delete();

        ActivityLog::log('deleted_notice', "Deleted notice '{$title}'", $departmentId);

        return response()->json([
            'message' => 'Notice deleted successfully.',
        ]);
    }
}
