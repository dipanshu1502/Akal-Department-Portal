<?php

namespace App\Http\Controllers;

use App\ActivityLog;
use App\ContentRevision;
use App\Department;
use App\DepartmentSection;
use App\SectionType;
use Illuminate\Http\Request;

class DepartmentSectionController extends Controller
{
    protected function ensureDepartmentAccess(Request $request, Department $department): void
    {
        $user = $request->user();

        if (! $user) {
            abort(401, 'Authentication required.');
        }

        if ($user->role === 'super_admin') {
            return;
        }

        $isAssigned = $user->departments()->whereKey($department->id)->exists();

        if (! $isAssigned) {
            abort(403, 'You are not assigned to this department.');
        }
    }

    public function index(Request $request, Department $department)
    {
        $this->ensureDepartmentAccess($request, $department);

        return response()->json([
            'data' => $department->sections()->orderBy('display_order')->get(),
        ]);
    }

    public function layouts()
    {
        $types = SectionType::where('is_active', true)->orderBy('sort_order')->get();

        if ($types->isEmpty()) {
            return response()->json([
                'data' => [
                    ['key' => 'text', 'name' => 'Text Content', 'description' => 'Heading, rich text and overview content.'],
                    ['key' => 'image_text', 'name' => 'Image + Text', 'description' => 'Media and explanatory narrative.'],
                    ['key' => 'card_grid', 'name' => 'Card Grid', 'description' => 'Feature cards with title and summary.'],
                    ['key' => 'timeline', 'name' => 'Timeline', 'description' => 'Milestones and chronological entries.'],
                    ['key' => 'banner', 'name' => 'Banner / Highlight', 'description' => 'Callout area with strong message.'],
                    ['key' => 'statistics', 'name' => 'Statistics', 'description' => 'Key metrics and figures.'],
                    ['key' => 'gallery', 'name' => 'Gallery', 'description' => 'Image collections with captions.'],
                    ['key' => 'accordion', 'name' => 'Accordion / FAQ', 'description' => 'Expandable questions and answers.'],
                ],
            ]);
        }

        return response()->json([
            'data' => $types,
        ]);
    }

    public function store(Request $request, Department $department)
    {
        $this->ensureDepartmentAccess($request, $department);

        $payload = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'layout_type' => ['required', 'string', 'in:text,image_text,card_grid,timeline,banner,statistics,gallery,accordion'],
            'content' => ['nullable'],
            'settings' => ['nullable', 'array'],
            'enabled' => ['nullable', 'boolean'],
            'status' => ['nullable', 'string', 'in:draft,pending,approved,published'],
            'display_order' => ['nullable', 'integer'],
        ]);

        $maxOrder = $department->sections()->max('display_order') ?? 0;

        $section = $department->sections()->create([
            'title' => $payload['title'],
            'subtitle' => $payload['subtitle'] ?? null,
            'layout_type' => $payload['layout_type'],
            'content' => $payload['content'] ?? [],
            'settings' => $payload['settings'] ?? [],
            'enabled' => $payload['enabled'] ?? true,
            'status' => $payload['status'] ?? 'published',
            'display_order' => $payload['display_order'] ?? ($maxOrder + 1),
        ]);

        ActivityLog::log('created_section', "Created section '{$section->title}' in {$department->name}", $department->id);

        return response()->json([
            'message' => 'Section created successfully.',
            'data' => $section,
        ], 201);
    }

    public function show(Request $request, DepartmentSection $section)
    {
        $this->ensureDepartmentAccess($request, $section->department);

        return response()->json([
            'data' => $section,
        ]);
    }

    public function update(Request $request, DepartmentSection $section)
    {
        $this->ensureDepartmentAccess($request, $section->department);

        $payload = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'layout_type' => ['sometimes', 'string', 'in:text,image_text,card_grid,timeline,banner,statistics,gallery,accordion'],
            'content' => ['nullable'],
            'settings' => ['nullable', 'array'],
            'enabled' => ['nullable', 'boolean'],
            'status' => ['nullable', 'string', 'in:draft,pending,approved,published'],
            'display_order' => ['nullable', 'integer'],
        ]);

        $section->update($payload);

        ActivityLog::log('updated_section', "Updated section '{$section->title}' in {$section->department->name}", $section->department_id);

        return response()->json([
            'message' => 'Section updated successfully.',
            'data' => $section,
        ]);
    }

    public function destroy(Request $request, DepartmentSection $section)
    {
        $this->ensureDepartmentAccess($request, $section->department);

        $title = $section->title;
        $departmentId = $section->department_id;
        $section->delete();

        ActivityLog::log('deleted_section', "Deleted section '{$title}'", $departmentId);

        return response()->json([
            'message' => 'Section deleted successfully.',
        ]);
    }

    public function reorder(Request $request, Department $department)
    {
        $this->ensureDepartmentAccess($request, $department);

        $request->validate([
            'sections' => ['required', 'array'],
            'sections.*.id' => ['required', 'exists:department_sections,id'],
            'sections.*.order' => ['required', 'integer'],
        ]);

        foreach ($request->input('sections') as $item) {
            DepartmentSection::where('id', $item['id'])
                ->where('department_id', $department->id)
                ->update(['display_order' => $item['order']]);
        }

        ActivityLog::log('reordered_sections', "Reordered sections in {$department->name}", $department->id);

        return response()->json([
            'message' => 'Sections reordered successfully.',
            'data' => $department->sections()->orderBy('display_order')->get(),
        ]);
    }

    public function submitRevision(Request $request, DepartmentSection $section)
    {
        $this->ensureDepartmentAccess($request, $section->department);

        $user = $request->user();

        $revision = ContentRevision::create([
            'department_id' => $section->department_id,
            'section_id' => $section->id,
            'model_type' => 'section',
            'title' => "Revision for Section: {$section->title}",
            'payload' => [
                'title' => $section->title,
                'subtitle' => $section->subtitle,
                'layout_type' => $section->layout_type,
                'content' => $section->content,
                'settings' => $section->settings,
                'enabled' => $section->enabled,
            ],
            'status' => 'pending',
            'user_id' => $user->id,
            'submitted_at' => now(),
        ]);

        return response()->json([
            'message' => 'Section submitted for approval successfully.',
            'data' => $revision,
        ]);
    }
}
