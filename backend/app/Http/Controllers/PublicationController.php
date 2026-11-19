<?php

namespace App\Http\Controllers;

use App\ActivityLog;
use App\Department;
use App\Publication;
use Illuminate\Http\Request;

class PublicationController extends Controller
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
            'data' => $department->publications()->orderBy('year', 'desc')->get(),
        ]);
    }

    public function store(Request $request, Department $department)
    {
        $this->ensureAccess($request, $department);

        $payload = $request->validate([
            'title' => ['required', 'string', 'max:500'],
            'authors' => ['required', 'string', 'max:500'],
            'journal_conference' => ['required', 'string', 'max:255'],
            'year' => ['required', 'integer', 'min:1980', 'max:2030'],
            'doi' => ['nullable', 'string', 'max:255'],
            'link' => ['nullable', 'string'],
            'abstract' => ['nullable', 'string'],
            'document_file' => ['nullable', 'string'],
            'citation' => ['nullable', 'string'],
            'sort_order' => ['nullable', 'integer'],
        ]);

        $publication = $department->publications()->create($payload);

        ActivityLog::log('added_publication', "Added publication '{$publication->title}' in {$department->name}", $department->id);

        return response()->json([
            'message' => 'Publication added successfully.',
            'data' => $publication,
        ], 201);
    }

    public function update(Request $request, Publication $publication)
    {
        $this->ensureAccess($request, $publication->department);

        $payload = $request->validate([
            'title' => ['sometimes', 'string', 'max:500'],
            'authors' => ['sometimes', 'string', 'max:500'],
            'journal_conference' => ['sometimes', 'string', 'max:255'],
            'year' => ['sometimes', 'integer', 'min:1980', 'max:2030'],
            'doi' => ['nullable', 'string', 'max:255'],
            'link' => ['nullable', 'string'],
            'abstract' => ['nullable', 'string'],
            'document_file' => ['nullable', 'string'],
            'citation' => ['nullable', 'string'],
            'sort_order' => ['nullable', 'integer'],
        ]);

        $publication->update($payload);

        ActivityLog::log('updated_publication', "Updated publication '{$publication->title}'", $publication->department_id);

        return response()->json([
            'message' => 'Publication updated successfully.',
            'data' => $publication,
        ]);
    }

    public function destroy(Request $request, Publication $publication)
    {
        $this->ensureAccess($request, $publication->department);

        $title = $publication->title;
        $departmentId = $publication->department_id;
        $publication->delete();

        ActivityLog::log('deleted_publication', "Deleted publication '{$title}'", $departmentId);

        return response()->json([
            'message' => 'Publication removed successfully.',
        ]);
    }
}
