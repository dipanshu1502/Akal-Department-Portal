<?php

namespace App\Http\Controllers;

use App\ActivityLog;
use App\Department;
use App\FacultyMember;
use Illuminate\Http\Request;

class FacultyMemberController extends Controller
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
            'data' => $department->facultyMembers()->orderBy('display_order')->get(),
        ]);
    }

    public function store(Request $request, Department $department)
    {
        $this->ensureAccess($request, $department);

        $payload = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'designation' => ['required', 'string', 'max:255'],
            'qualification' => ['nullable', 'string', 'max:255'],
            'specialization' => ['nullable', 'string', 'max:255'],
            'experience' => ['nullable', 'string', 'max:100'],
            'email' => ['nullable', 'email'],
            'phone' => ['nullable', 'string', 'max:50'],
            'office_location' => ['nullable', 'string', 'max:255'],
            'research_interests' => ['nullable', 'string'],
            'bio' => ['nullable', 'string'],
            'profile_image' => ['nullable', 'string'],
            'display_order' => ['nullable', 'integer'],
            'status' => ['nullable', 'string', 'in:active,on_leave,retired'],
        ]);

        $faculty = $department->facultyMembers()->create($payload);

        ActivityLog::log('added_faculty', "Added faculty member '{$faculty->name}' in {$department->name}", $department->id);

        return response()->json([
            'message' => 'Faculty member added successfully.',
            'data' => $faculty,
        ], 201);
    }

    public function update(Request $request, FacultyMember $faculty)
    {
        $this->ensureAccess($request, $faculty->department);

        $payload = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'designation' => ['sometimes', 'string', 'max:255'],
            'qualification' => ['nullable', 'string', 'max:255'],
            'specialization' => ['nullable', 'string', 'max:255'],
            'experience' => ['nullable', 'string', 'max:100'],
            'email' => ['nullable', 'email'],
            'phone' => ['nullable', 'string', 'max:50'],
            'office_location' => ['nullable', 'string', 'max:255'],
            'research_interests' => ['nullable', 'string'],
            'bio' => ['nullable', 'string'],
            'profile_image' => ['nullable', 'string'],
            'display_order' => ['nullable', 'integer'],
            'status' => ['nullable', 'string', 'in:active,on_leave,retired'],
        ]);

        $faculty->update($payload);

        ActivityLog::log('updated_faculty', "Updated faculty member '{$faculty->name}'", $faculty->department_id);

        return response()->json([
            'message' => 'Faculty member updated successfully.',
            'data' => $faculty,
        ]);
    }

    public function destroy(Request $request, FacultyMember $faculty)
    {
        $this->ensureAccess($request, $faculty->department);

        $name = $faculty->name;
        $departmentId = $faculty->department_id;
        $faculty->delete();

        ActivityLog::log('deleted_faculty', "Deleted faculty member '{$name}'", $departmentId);

        return response()->json([
            'message' => 'Faculty member removed successfully.',
        ]);
    }
}
