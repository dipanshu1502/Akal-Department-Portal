<?php

namespace App\Http\Controllers;

use App\ActivityLog;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'super_admin') {
            $logs = ActivityLog::with(['user', 'department'])->latest()->take(50)->get();
        } else {
            $deptIds = $user->departments()->pluck('departments.id');
            $logs = ActivityLog::with(['user', 'department'])
                ->whereIn('department_id', $deptIds)
                ->orWhere('user_id', $user->id)
                ->latest()
                ->take(50)
                ->get();
        }

        return response()->json([
            'data' => $logs,
        ]);
    }
}
