<?php

namespace App\Http\Controllers;

use App\SystemSetting;
use Illuminate\Http\Request;

class SystemSettingController extends Controller
{
    public function index(Request $request)
    {
        return response()->json([
            'data' => SystemSetting::all(),
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'super_admin') {
            abort(403, 'Only super administrators can manage system settings.');
        }

        $payload = $request->validate([
            'settings' => ['required', 'array'],
            'settings.*.key' => ['required', 'string'],
            'settings.*.value' => ['nullable'],
        ]);

        foreach ($payload['settings'] as $item) {
            SystemSetting::where('key', $item['key'])->update(['value' => $item['value']]);
        }

        return response()->json([
            'message' => 'System settings updated successfully.',
            'data' => SystemSetting::all(),
        ]);
    }
}
