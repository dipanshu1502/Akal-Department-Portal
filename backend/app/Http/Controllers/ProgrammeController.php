<?php

namespace App\Http\Controllers;

use App\ActivityLog;
use App\Department;
use App\Programme;
use Illuminate\Http\Request;

class ProgrammeController extends Controller
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
            'data' => $department->programmes()->orderBy('sort_order')->get(),
        ]);
    }

    public function store(Request $request, Department $department)
    {
        $this->ensureAccess($request, $department);

        $payload = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'code' => ['nullable', 'string', 'max:50'],
            'level' => ['required', 'string', 'in:undergraduate,postgraduate,doctoral,diploma,certificate'],
            'duration' => ['nullable', 'string', 'max:100'],
            'eligibility' => ['nullable', 'string'],
            'intake' => ['nullable', 'string', 'max:50'],
            'description' => ['nullable', 'string'],
            'curriculum_highlights' => ['nullable', 'string'],
            'syllabus_file' => ['nullable', 'string'],
            'status' => ['nullable', 'string', 'in:active,inactive'],
            'sort_order' => ['nullable', 'integer'],
        ]);

        $programme = $department->programmes()->create($payload);

        ActivityLog::log('added_programme', "Added programme '{$programme->name}' in {$department->name}", $department->id);

        return response()->json([
            'message' => 'Academic programme added successfully.',
            'data' => $programme,
        ], 201);
    }

    public function update(Request $request, Programme $programme)
    {
        $this->ensureAccess($request, $programme->department);

        $payload = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'code' => ['nullable', 'string', 'max:50'],
            'level' => ['sometimes', 'string', 'in:undergraduate,postgraduate,doctoral,diploma,certificate'],
            'duration' => ['nullable', 'string', 'max:100'],
            'eligibility' => ['nullable', 'string'],
            'intake' => ['nullable', 'string', 'max:50'],
            'description' => ['nullable', 'string'],
            'curriculum_highlights' => ['nullable', 'string'],
            'syllabus_file' => ['nullable', 'string'],
            'status' => ['nullable', 'string', 'in:active,inactive'],
            'sort_order' => ['nullable', 'integer'],
        ]);

        $programme->update($payload);

        ActivityLog::log('updated_programme', "Updated programme '{$programme->name}'", $programme->department_id);

        return response()->json([
            'message' => 'Academic programme updated successfully.',
            'data' => $programme,
        ]);
    }

    public function destroy(Request $request, Programme $programme)
    {
        $this->ensureAccess($request, $programme->department);

        $name = $programme->name;
        $departmentId = $programme->department_id;
        $programme->delete();

        ActivityLog::log('deleted_programme', "Deleted programme '{$name}'", $departmentId);

        return response()->json([
            'message' => 'Academic programme removed successfully.',
        ]);
    }
}
