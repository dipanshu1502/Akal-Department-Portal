<?php

namespace App\Http\Controllers;

use App\ActivityLog;
use App\Achievement;
use App\Department;
use Illuminate\Http\Request;

class AchievementController extends Controller
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
            'data' => $department->achievements()->orderBy('achievement_date', 'desc')->get(),
        ]);
    }

    public function store(Request $request, Department $department)
    {
        $this->ensureAccess($request, $department);

        $payload = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'achievement_date' => ['nullable', 'date'],
            'category' => ['nullable', 'string', 'in:student,faculty,department'],
            'recipient_name' => ['nullable', 'string', 'max:255'],
            'award_by' => ['nullable', 'string', 'max:255'],
            'image_url' => ['nullable', 'string'],
            'certificate_url' => ['nullable', 'string'],
            'sort_order' => ['nullable', 'integer'],
        ]);

        $achievement = $department->achievements()->create($payload);

        ActivityLog::log('added_achievement', "Added achievement '{$achievement->title}' in {$department->name}", $department->id);

        return response()->json([
            'message' => 'Achievement recorded successfully.',
            'data' => $achievement,
        ], 201);
    }

    public function update(Request $request, Achievement $achievement)
    {
        $this->ensureAccess($request, $achievement->department);

        $payload = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'achievement_date' => ['nullable', 'date'],
            'category' => ['nullable', 'string', 'in:student,faculty,department'],
            'recipient_name' => ['nullable', 'string', 'max:255'],
            'award_by' => ['nullable', 'string', 'max:255'],
            'image_url' => ['nullable', 'string'],
            'certificate_url' => ['nullable', 'string'],
            'sort_order' => ['nullable', 'integer'],
        ]);

        $achievement->update($payload);

        ActivityLog::log('updated_achievement', "Updated achievement '{$achievement->title}'", $achievement->department_id);

        return response()->json([
            'message' => 'Achievement updated successfully.',
            'data' => $achievement,
        ]);
    }

    public function destroy(Request $request, Achievement $achievement)
    {
        $this->ensureAccess($request, $achievement->department);

        $title = $achievement->title;
        $departmentId = $achievement->department_id;
        $achievement->delete();

        ActivityLog::log('deleted_achievement', "Deleted achievement '{$title}'", $departmentId);

        return response()->json([
            'message' => 'Achievement removed successfully.',
        ]);
    }
}
