<?php

namespace App\Http\Controllers;

use App\ActivityLog;
use App\Department;
use App\Gallery;
use Illuminate\Http\Request;

class GalleryController extends Controller
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
            'data' => $department->galleries()->orderBy('display_order')->get(),
        ]);
    }

    public function store(Request $request, Department $department)
    {
        $this->ensureAccess($request, $department);

        $payload = $request->validate([
            'title' => ['nullable', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'in:labs,events,academic,student_life,campus'],
            'image_url' => ['required', 'string'],
            'caption' => ['nullable', 'string'],
            'alt_text' => ['nullable', 'string'],
            'display_order' => ['nullable', 'integer'],
        ]);

        $item = $department->galleries()->create($payload);

        ActivityLog::log('added_gallery_image', "Added image '{$item->title}' to {$department->name}", $department->id);

        return response()->json([
            'message' => 'Gallery image added successfully.',
            'data' => $item,
        ], 201);
    }

    public function update(Request $request, Gallery $gallery)
    {
        $this->ensureAccess($request, $gallery->department);

        $payload = $request->validate([
            'title' => ['nullable', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'in:labs,events,academic,student_life,campus'],
            'image_url' => ['sometimes', 'string'],
            'caption' => ['nullable', 'string'],
            'alt_text' => ['nullable', 'string'],
            'display_order' => ['nullable', 'integer'],
        ]);

        $gallery->update($payload);

        return response()->json([
            'message' => 'Gallery image updated successfully.',
            'data' => $gallery,
        ]);
    }

    public function destroy(Request $request, Gallery $gallery)
    {
        $this->ensureAccess($request, $gallery->department);

        $departmentId = $gallery->department_id;
        $gallery->delete();

        ActivityLog::log('deleted_gallery_image', "Deleted gallery image #{$gallery->id}", $departmentId);

        return response()->json([
            'message' => 'Gallery image removed successfully.',
        ]);
    }
}
