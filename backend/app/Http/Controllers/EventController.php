<?php

namespace App\Http\Controllers;

use App\ActivityLog;
use App\Department;
use App\Event;
use Illuminate\Http\Request;

class EventController extends Controller
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
            'data' => $department->events()->orderBy('event_date', 'desc')->get(),
        ]);
    }

    public function store(Request $request, Department $department)
    {
        $this->ensureAccess($request, $department);

        $payload = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'event_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date'],
            'venue' => ['nullable', 'string', 'max:255'],
            'organizer' => ['nullable', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'in:academic,workshop,seminar,cultural,sports'],
            'image_url' => ['nullable', 'string'],
            'report_file' => ['nullable', 'string'],
            'registration_link' => ['nullable', 'string'],
            'is_featured' => ['nullable', 'boolean'],
            'status' => ['nullable', 'string', 'in:upcoming,ongoing,completed,cancelled'],
        ]);

        $event = $department->events()->create($payload);

        ActivityLog::log('created_event', "Created event '{$event->title}' in {$department->name}", $department->id);

        return response()->json([
            'message' => 'Event created successfully.',
            'data' => $event,
        ], 201);
    }

    public function update(Request $request, Event $event)
    {
        $this->ensureAccess($request, $event->department);

        $payload = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'event_date' => ['sometimes', 'date'],
            'end_date' => ['nullable', 'date'],
            'venue' => ['nullable', 'string', 'max:255'],
            'organizer' => ['nullable', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'in:academic,workshop,seminar,cultural,sports'],
            'image_url' => ['nullable', 'string'],
            'report_file' => ['nullable', 'string'],
            'registration_link' => ['nullable', 'string'],
            'is_featured' => ['nullable', 'boolean'],
            'status' => ['nullable', 'string', 'in:upcoming,ongoing,completed,cancelled'],
        ]);

        $event->update($payload);

        ActivityLog::log('updated_event', "Updated event '{$event->title}'", $event->department_id);

        return response()->json([
            'message' => 'Event updated successfully.',
            'data' => $event,
        ]);
    }

    public function destroy(Request $request, Event $event)
    {
        $this->ensureAccess($request, $event->department);

        $title = $event->title;
        $departmentId = $event->department_id;
        $event->delete();

        ActivityLog::log('deleted_event', "Deleted event '{$title}'", $departmentId);

        return response()->json([
            'message' => 'Event removed successfully.',
        ]);
    }
}
