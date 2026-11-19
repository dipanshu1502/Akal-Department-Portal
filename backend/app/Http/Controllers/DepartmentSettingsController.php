<?php

namespace App\Http\Controllers;

use App\Department;
use App\DepartmentSetting;
use Illuminate\Http\Request;

class DepartmentSettingsController extends Controller
{
    protected function ensureAccess(Request $request, Department $department): void
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

    public function show(Request $request, Department $department)
    {
        if ($request->user() && $request->user()->role !== 'super_admin') {
            $this->ensureAccess($request, $department);
        }

        return response()->json([
            'data' => $department->settings()->firstOrCreate([
                'department_id' => $department->id,
            ]),
        ]);
    }

    public function update(Request $request, Department $department)
    {
        $this->ensureAccess($request, $department);

        $payload = $request->validate([
            'website_title' => ['nullable', 'string', 'max:255'],
            'tagline' => ['nullable', 'string', 'max:255'],
            'banner_title' => ['nullable', 'string', 'max:255'],
            'banner_text' => ['nullable', 'string'],
            'about_text' => ['nullable', 'string'],
            'hod_name' => ['nullable', 'string', 'max:255'],
            'hod_designation' => ['nullable', 'string', 'max:255'],
            'hod_message' => ['nullable', 'string'],
            'hod_photo' => ['nullable', 'string', 'max:2048'],
            'contact_email' => ['nullable', 'email'],
            'contact_phone' => ['nullable', 'string', 'max:50'],
            'contact_address' => ['nullable', 'string'],
            'primary_color' => ['nullable', 'string', 'max:20'],
            'accent_color' => ['nullable', 'string', 'max:20'],
            'navigation' => ['nullable', 'array'],
        ]);

        $settings = $department->settings()->firstOrCreate(['department_id' => $department->id]);
        $settings->fill($payload);
        $settings->save();

        return response()->json([
            'message' => 'Department settings saved successfully.',
            'data' => $settings->fresh(),
        ]);
    }
}
