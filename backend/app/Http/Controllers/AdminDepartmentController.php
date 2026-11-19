<?php

namespace App\Http\Controllers;

use App\ActivityLog;
use App\ContentRevision;
use App\Department;
use App\Faculty;
use App\FacultyMember;
use App\Programme;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminDepartmentController extends Controller
{
    protected function ensureDepartmentAccess(Request $request, ?Department $department = null): void
    {
        $user = $request->user();

        if (! $user) {
            abort(401, 'Authentication required.');
        }

        if ($user->role === 'super_admin') {
            return;
        }

        if ($department) {
            $isAssigned = $user->departments()->whereKey($department->id)->exists();

            if (! $isAssigned) {
                abort(403, 'You are not assigned to this department.');
            }
        }
    }

    public function index(Request $request)
    {
        $query = Department::with(['faculty', 'sections', 'settings', 'users'])->orderBy('sort_order');

        if ($request->user() && $request->user()->role !== 'super_admin') {
            $query->whereHas('users', function ($query) use ($request) {
                $query->where('users.id', $request->user()->id);
            });
        }

        return response()->json([
            'data' => $query->get(),
        ]);
    }

    public function stats(Request $request)
    {
        $user = $request->user();

        if (! $user) {
            abort(401, 'Unauthorized');
        }

        if ($user->role === 'super_admin') {
            $totalDepartments = Department::count();
            $publishedDepartments = Department::where('is_published', true)->count();
            $activeDepartments = Department::where('is_active', true)->count();
            $pendingApprovals = ContentRevision::where('status', 'pending')->count();
            $totalFaculty = FacultyMember::where('status', 'active')->count();
            $totalProgrammes = Programme::where('status', 'active')->count();
            $totalAdmins = User::where('role', 'department_admin')->count();

            return response()->json([
                'data' => [
                    'total_departments' => $totalDepartments,
                    'published_departments' => $publishedDepartments,
                    'active_departments' => $activeDepartments,
                    'pending_approvals' => $pendingApprovals,
                    'total_faculty' => $totalFaculty,
                    'total_programmes' => $totalProgrammes,
                    'total_admins' => $totalAdmins,
                    'recent_activities' => ActivityLog::with(['user', 'department'])->latest()->take(10)->get(),
                ],
            ]);
        }

        // For Department Admin
        $departmentIds = $user->departments()->pluck('departments.id');
        $myDepartments = Department::whereIn('id', $departmentIds)->count();
        $published = Department::whereIn('id', $departmentIds)->where('is_published', true)->count();
        $myPending = ContentRevision::whereIn('department_id', $departmentIds)->where('status', 'pending')->count();
        $myFaculty = FacultyMember::whereIn('department_id', $departmentIds)->count();
        $myProgrammes = Programme::whereIn('department_id', $departmentIds)->count();

        return response()->json([
            'data' => [
                'assigned_departments' => $myDepartments,
                'published_departments' => $published,
                'pending_revisions' => $myPending,
                'total_faculty' => $myFaculty,
                'total_programmes' => $myProgrammes,
                'recent_revisions' => ContentRevision::whereIn('department_id', $departmentIds)->latest()->take(5)->get(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        if (! $user || $user->role !== 'super_admin') {
            abort(403, 'Only super administrators can create departments.');
        }

        $payload = $request->validate([
            'faculty_id' => ['nullable', 'exists:faculties,id'],
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', Rule::unique('departments')],
            'code' => ['nullable', 'string', 'max:50'],
            'short_description' => ['nullable', 'string', 'max:500'],
            'description' => ['nullable', 'string'],
            'hero_image' => ['nullable', 'string'],
            'logo' => ['nullable', 'string'],
            'official_email' => ['nullable', 'email'],
            'contact_phone' => ['nullable', 'string'],
            'office_location' => ['nullable', 'string'],
            'is_active' => ['nullable', 'boolean'],
            'is_published' => ['nullable', 'boolean'],
            'sort_order' => ['nullable', 'integer'],
        ]);

        $department = Department::create($payload);

        // Create default settings
        $department->settings()->create([
            'website_title' => $department->name,
            'tagline' => 'Department of ' . $department->name,
            'primary_color' => '#087BB5',
            'accent_color' => '#F9B900',
        ]);

        ActivityLog::log('created_department', "Super Admin created department: {$department->name}", $department->id, $user->id);

        return response()->json([
            'message' => 'Department created successfully.',
            'data' => $department->load(['faculty', 'settings']),
        ], 201);
    }

    public function show(Request $request, Department $department)
    {
        $this->ensureDepartmentAccess($request, $department);

        return response()->json([
            'data' => $department->load([
                'faculty',
                'sections',
                'settings',
                'users',
                'facultyMembers',
                'programmes',
                'laboratories',
                'events',
                'achievements',
                'publications',
                'notices',
                'galleries',
                'revisions' => function ($q) {
                    $q->latest()->take(10);
                },
            ]),
        ]);
    }

    public function update(Request $request, Department $department)
    {
        $this->ensureDepartmentAccess($request, $department);

        $payload = $request->validate([
            'faculty_id' => ['nullable', 'exists:faculties,id'],
            'name' => ['sometimes', 'string', 'max:255'],
            'slug' => ['sometimes', 'string', 'max:255', Rule::unique('departments')->ignore($department->id)],
            'code' => ['nullable', 'string', 'max:50'],
            'short_description' => ['nullable', 'string', 'max:500'],
            'description' => ['nullable', 'string'],
            'hero_image' => ['nullable', 'string'],
            'logo' => ['nullable', 'string'],
            'official_email' => ['nullable', 'email'],
            'contact_phone' => ['nullable', 'string'],
            'office_location' => ['nullable', 'string'],
            'is_active' => ['nullable', 'boolean'],
            'is_published' => ['nullable', 'boolean'],
            'sort_order' => ['nullable', 'integer'],
        ]);

        $department->update($payload);

        ActivityLog::log('updated_department', "Updated department details for: {$department->name}", $department->id);

        return response()->json([
            'message' => 'Department updated successfully.',
            'data' => $department->load(['faculty', 'settings', 'sections', 'users']),
        ]);
    }

    public function destroy(Request $request, Department $department)
    {
        $user = $request->user();

        if (! $user || $user->role !== 'super_admin') {
            abort(403, 'Only super administrators can delete departments.');
        }

        $name = $department->name;
        $department->delete();

        ActivityLog::log('deleted_department', "Super Admin deleted department: {$name}");

        return response()->json([
            'message' => 'Department deleted successfully.',
        ]);
    }

    public function assignAdmin(Request $request, Department $department)
    {
        $user = $request->user();

        if (! $user || $user->role !== 'super_admin') {
            abort(403, 'Only super administrators can assign department admins.');
        }

        $payload = $request->validate([
            'email' => ['required', 'email'],
        ]);

        $targetUser = User::where('email', strtolower($payload['email']))->first();

        if (! $targetUser) {
            return response()->json([
                'message' => 'User with this email not found.',
            ], 404);
        }

        if ($targetUser->role !== 'department_admin') {
            $targetUser->update(['role' => 'department_admin']);
        }

        $department->users()->syncWithoutDetaching([$targetUser->id]);

        ActivityLog::log('assigned_admin', "Assigned {$targetUser->email} to department: {$department->name}", $department->id, $user->id);

        return response()->json([
            'message' => "Assigned {$targetUser->name} as Department Admin.",
            'data' => $department->load('users'),
        ]);
    }

    public function removeAdmin(Request $request, Department $department, User $user)
    {
        $currentUser = $request->user();

        if (! $currentUser || $currentUser->role !== 'super_admin') {
            abort(403, 'Only super administrators can remove department admins.');
        }

        $department->users()->detach($user->id);

        ActivityLog::log('removed_admin', "Removed {$user->email} from department: {$department->name}", $department->id, $currentUser->id);

        return response()->json([
            'message' => "Removed admin assignment for {$user->name}.",
            'data' => $department->load('users'),
        ]);
    }

    public function users(Request $request)
    {
        $user = $request->user();

        if (! $user || $user->role !== 'super_admin') {
            abort(403, 'Only super administrators can list all users.');
        }

        $users = User::with('departments')->orderBy('name')->get();

        return response()->json([
            'data' => $users,
        ]);
    }
}
