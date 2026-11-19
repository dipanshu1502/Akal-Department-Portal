<?php

namespace App\Http\Controllers;

use App\ActivityLog;
use App\Department;
use App\Laboratory;
use Illuminate\Http\Request;

class LaboratoryController extends Controller
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
            'data' => $department->laboratories()->orderBy('sort_order')->get(),
        ]);
    }

    public function store(Request $request, Department $department)
    {
        $this->ensureAccess($request, $department);

        $payload = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'facilities' => ['nullable', 'string'],
            'equipment' => ['nullable', 'string'],
            'image_url' => ['nullable', 'string'],
            'location' => ['nullable', 'string', 'max:255'],
            'incharge_name' => ['nullable', 'string', 'max:255'],
            'sort_order' => ['nullable', 'integer'],
            'status' => ['nullable', 'string', 'in:active,inactive'],
        ]);

        $lab = $department->laboratories()->create($payload);

        ActivityLog::log('added_lab', "Added laboratory '{$lab->name}' in {$department->name}", $department->id);

        return response()->json([
            'message' => 'Laboratory added successfully.',
            'data' => $lab,
        ], 201);
    }

    public function update(Request $request, Laboratory $laboratory)
    {
        $this->ensureAccess($request, $laboratory->department);

        $payload = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'facilities' => ['nullable', 'string'],
            'equipment' => ['nullable', 'string'],
            'image_url' => ['nullable', 'string'],
            'location' => ['nullable', 'string', 'max:255'],
            'incharge_name' => ['nullable', 'string', 'max:255'],
            'sort_order' => ['nullable', 'integer'],
            'status' => ['nullable', 'string', 'in:active,inactive'],
        ]);

        $laboratory->update($payload);

        ActivityLog::log('updated_lab', "Updated laboratory '{$laboratory->name}'", $laboratory->department_id);

        return response()->json([
            'message' => 'Laboratory updated successfully.',
            'data' => $laboratory,
        ]);
    }

    public function destroy(Request $request, Laboratory $laboratory)
    {
        $this->ensureAccess($request, $laboratory->department);

        $name = $laboratory->name;
        $departmentId = $laboratory->department_id;
        $laboratory->delete();

        ActivityLog::log('deleted_lab', "Deleted laboratory '{$name}'", $departmentId);

        return response()->json([
            'message' => 'Laboratory removed successfully.',
        ]);
    }
}
