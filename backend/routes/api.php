<?php

use App\Http\Controllers\AchievementController;
use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\AdminDepartmentController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ContentRevisionController;
use App\Http\Controllers\DepartmentSectionController;
use App\Http\Controllers\DepartmentSettingsController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\FacultyMemberController;
use App\Http\Controllers\GalleryController;
use App\Http\Controllers\LaboratoryController;
use App\Http\Controllers\MediaController;
use App\Http\Controllers\NoticeController;
use App\Http\Controllers\ProgrammeController;
use App\Http\Controllers\PublicationController;
use App\Http\Controllers\PublicDepartmentController;
use App\Http\Controllers\SystemSettingController;
use Illuminate\Support\Facades\Route;

Route::get('/health', fn () => response()->json([
    'data' => ['status' => 'ok', 'application' => 'Akal Department Portal API'],
    'message' => 'API is available.',
]));

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login'])->name('login');
    Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
});

Route::prefix('public')->group(function () {
    Route::get('/departments', [PublicDepartmentController::class, 'index']);
    Route::get('/departments/{slug}', [PublicDepartmentController::class, 'show']);
    Route::get('/departments/{slug}/faculty', [PublicDepartmentController::class, 'faculty']);
    Route::get('/departments/{slug}/courses', [PublicDepartmentController::class, 'courses']);
    Route::get('/departments/{slug}/events', [PublicDepartmentController::class, 'events']);
    Route::get('/departments/{slug}/research', [PublicDepartmentController::class, 'research']);
    Route::get('/departments/{slug}/gallery', [PublicDepartmentController::class, 'gallery']);
    Route::get('/departments/{slug}/notices', [PublicDepartmentController::class, 'notices']);
    Route::get('/departments/{slug}/documents', [MediaController::class, 'publicDocuments']);
    Route::get('/departments/{slug}/uploaded-gallery', [MediaController::class, 'publicGallery']);
    Route::get('/faculties', [PublicDepartmentController::class, 'faculties']);
});

Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/stats', [AdminDepartmentController::class, 'stats']);

    // Departments
    Route::get('/departments', [AdminDepartmentController::class, 'index']);
    Route::post('/departments', [AdminDepartmentController::class, 'store']);
    Route::get('/departments/{department}', [AdminDepartmentController::class, 'show']);
    Route::put('/departments/{department}', [AdminDepartmentController::class, 'update']);
    Route::delete('/departments/{department}', [AdminDepartmentController::class, 'destroy']);
    Route::post('/departments/{department}/assign-admin', [AdminDepartmentController::class, 'assignAdmin']);
    Route::delete('/departments/{department}/admins/{user}', [AdminDepartmentController::class, 'removeAdmin']);
    Route::get('/users', [AdminDepartmentController::class, 'users']);

    // Department Settings
    Route::get('/departments/{department}/settings', [DepartmentSettingsController::class, 'show']);
    Route::put('/departments/{department}/settings', [DepartmentSettingsController::class, 'update']);

    // Section Layouts & Sections
    Route::get('/section-layouts', [DepartmentSectionController::class, 'layouts']);
    Route::get('/departments/{department}/sections', [DepartmentSectionController::class, 'index']);
    Route::post('/departments/{department}/sections', [DepartmentSectionController::class, 'store']);
    Route::get('/sections/{section}', [DepartmentSectionController::class, 'show']);
    Route::put('/sections/{section}', [DepartmentSectionController::class, 'update']);
    Route::delete('/sections/{section}', [DepartmentSectionController::class, 'destroy']);
    Route::post('/departments/{department}/sections/reorder', [DepartmentSectionController::class, 'reorder']);
    Route::post('/sections/{section}/submit', [DepartmentSectionController::class, 'submitRevision']);

    // Faculty Members
    Route::get('/departments/{department}/faculty', [FacultyMemberController::class, 'index']);
    Route::post('/departments/{department}/faculty', [FacultyMemberController::class, 'store']);
    Route::put('/faculty/{faculty}', [FacultyMemberController::class, 'update']);
    Route::delete('/faculty/{faculty}', [FacultyMemberController::class, 'destroy']);

    // Academic Programmes
    Route::get('/departments/{department}/programmes', [ProgrammeController::class, 'index']);
    Route::post('/departments/{department}/programmes', [ProgrammeController::class, 'store']);
    Route::put('/programmes/{programme}', [ProgrammeController::class, 'update']);
    Route::delete('/programmes/{programme}', [ProgrammeController::class, 'destroy']);

    // Laboratories
    Route::get('/departments/{department}/laboratories', [LaboratoryController::class, 'index']);
    Route::post('/departments/{department}/laboratories', [LaboratoryController::class, 'store']);
    Route::put('/laboratories/{laboratory}', [LaboratoryController::class, 'update']);
    Route::delete('/laboratories/{laboratory}', [LaboratoryController::class, 'destroy']);

    // Events
    Route::get('/departments/{department}/events', [EventController::class, 'index']);
    Route::post('/departments/{department}/events', [EventController::class, 'store']);
    Route::put('/events/{event}', [EventController::class, 'update']);
    Route::delete('/events/{event}', [EventController::class, 'destroy']);

    // Achievements
    Route::get('/departments/{department}/achievements', [AchievementController::class, 'index']);
    Route::post('/departments/{department}/achievements', [AchievementController::class, 'store']);
    Route::put('/achievements/{achievement}', [AchievementController::class, 'update']);
    Route::delete('/achievements/{achievement}', [AchievementController::class, 'destroy']);

    // Publications
    Route::get('/departments/{department}/publications', [PublicationController::class, 'index']);
    Route::post('/departments/{department}/publications', [PublicationController::class, 'store']);
    Route::put('/publications/{publication}', [PublicationController::class, 'update']);
    Route::delete('/publications/{publication}', [PublicationController::class, 'destroy']);

    // Notices
    Route::get('/departments/{department}/notices', [NoticeController::class, 'index']);
    Route::post('/departments/{department}/notices', [NoticeController::class, 'store']);
    Route::put('/notices/{notice}', [NoticeController::class, 'update']);
    Route::delete('/notices/{notice}', [NoticeController::class, 'destroy']);

    // Galleries
    Route::get('/departments/{department}/galleries', [GalleryController::class, 'index']);
    Route::post('/departments/{department}/galleries', [GalleryController::class, 'store']);
    Route::put('/galleries/{gallery}', [GalleryController::class, 'update']);
    Route::delete('/galleries/{gallery}', [GalleryController::class, 'destroy']);

    // Content Approval Center
    Route::get('/revisions', [ContentRevisionController::class, 'index']);
    Route::get('/revisions/{revision}', [ContentRevisionController::class, 'show']);
    Route::post('/revisions', [ContentRevisionController::class, 'store']);
    Route::post('/revisions/{revision}/approve', [ContentRevisionController::class, 'approve']);
    Route::post('/revisions/{revision}/reject', [ContentRevisionController::class, 'reject']);
    Route::post('/revisions/{revision}/publish', [ContentRevisionController::class, 'publish']);

    // Activity Logs
    Route::get('/activity-logs', [ActivityLogController::class, 'index']);

    // Media Library
    Route::get('/media', [MediaController::class, 'index']);
    Route::get('/media/categories', [MediaController::class, 'categories']);
    Route::post('/media/categories', [MediaController::class, 'createCategory']);
    Route::put('/media/categories/{category}', [MediaController::class, 'updateCategory']);
    Route::delete('/media/categories/{category}', [MediaController::class, 'deleteCategory']);
    Route::get('/media/pending', [MediaController::class, 'pending']);
    Route::get('/media/{media}', [MediaController::class, 'show']);
    Route::put('/media/{media}', [MediaController::class, 'update']);
    Route::delete('/media/{media}', [MediaController::class, 'destroy']);
    Route::post('/media/{media}/submit', [MediaController::class, 'submit']);
    Route::post('/media/{media}/replace', [MediaController::class, 'replace']);
    Route::get('/media/{media}/download', [MediaController::class, 'download']);
    Route::post('/departments/{department}/media', [MediaController::class, 'store']);
    Route::post('/media/{media}/approve', [MediaController::class, 'approve']);
    Route::post('/media/{media}/reject', [MediaController::class, 'reject']);
    Route::post('/media/{media}/publish', [MediaController::class, 'publish']);

    // System Settings
    Route::get('/settings', [SystemSettingController::class, 'index']);
    Route::put('/settings', [SystemSettingController::class, 'update']);
});

// Backward compatibility alias for super-admin route
Route::middleware('auth:sanctum')->prefix('super-admin')->group(function () {
    Route::post('/departments/{department}/admins', [AdminDepartmentController::class, 'assignAdmin']);
});
