<?php

namespace Tests\Feature;

use App\Department;
use App\Media;
use App\MediaCategory;
use App\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class MediaUploadTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        Artisan::call('migrate:fresh', ['--force' => true]);
    }

    public function test_department_admin_uploads_media_for_review_and_public_api_excludes_it_until_published(): void
    {
        Storage::fake('public');
        [$department, $admin] = $this->makeDepartmentAndAdmin('cse');
        $category = MediaCategory::where('name', 'Syllabus')->firstOrFail();

        $response = $this->actingAs($admin)->post("/api/v1/admin/departments/{$department->id}/media", [
            'file' => UploadedFile::fake()->create('syllabus.pdf', 10, 'application/pdf'),
            'media_type' => 'document',
            'category_id' => $category->id,
            'title' => 'B.Tech Syllabus',
        ], ['Accept' => 'application/json']);

        $response->assertCreated()->assertJsonPath('data.status', 'pending');
        $mediaId = $response->json('data.id');
        $this->assertDatabaseHas('media', [
            'id' => $mediaId,
            'department_id' => $department->id,
            'status' => 'pending',
        ]);
        $this->getJson("/api/v1/public/departments/{$department->slug}/documents")->assertOk()->assertJsonCount(0, 'data');

        $superAdmin = User::create([
            'name' => 'Super Admin',
            'email' => 'super@example.test',
            'password' => 'password',
            'role' => 'super_admin',
        ]);
        $this->actingAs($superAdmin)
            ->postJson("/api/v1/admin/media/{$mediaId}/approve")
            ->assertOk();
        $this->postJson("/api/v1/admin/media/{$mediaId}/publish")->assertOk();

        $publicResponse = $this->getJson("/api/v1/public/departments/{$department->slug}/documents");
        $publicResponse->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('data.0.title', 'B.Tech Syllabus');
        $this->assertArrayNotHasKey('file_path', $publicResponse->json('data.0'));
    }

    public function test_department_admin_cannot_upload_to_an_unassigned_department_or_upload_an_executable_file(): void
    {
        Storage::fake('public');
        [$department, $admin] = $this->makeDepartmentAndAdmin('physics');
        $otherDepartment = Department::create([
            'name' => 'Chemistry',
            'slug' => 'chemistry',
            'is_active' => true,
            'is_published' => true,
        ]);

        $this->actingAs($admin)
            ->post("/api/v1/admin/departments/{$otherDepartment->id}/media", [
                'file' => UploadedFile::fake()->create('report.pdf', 10, 'application/pdf'),
                'media_type' => 'document',
            ], ['Accept' => 'application/json'])
            ->assertForbidden();

        $this->post("/api/v1/admin/departments/{$department->id}/media", [
            'file' => UploadedFile::fake()->create('script.php', 10, 'text/plain'),
            'media_type' => 'document',
        ], ['Accept' => 'application/json'])
            ->assertUnprocessable();
    }

    public function test_replacing_published_media_keeps_the_previous_version_published_until_approval(): void
    {
        Storage::fake('public');
        [$department, $admin] = $this->makeDepartmentAndAdmin('biology');
        $category = MediaCategory::where('name', 'Department Gallery')->firstOrFail();
        $original = Media::create([
            'department_id' => $department->id,
            'uploaded_by' => $admin->id,
            'category_id' => $category->id,
            'title' => 'Original photo',
            'original_name' => 'original.jpg',
            'stored_name' => 'original.jpg',
            'file_path' => "departments/{$department->id}/images/original.jpg",
            'mime_type' => 'image/jpeg',
            'extension' => 'jpg',
            'file_size' => 100,
            'media_type' => 'image',
            'status' => 'published',
            'published_at' => now(),
        ]);
        Storage::disk('public')->put($original->file_path, 'old');

        $this->actingAs($admin)->post("/api/v1/admin/media/{$original->id}/replace", [
            'file' => UploadedFile::fake()->createWithContent(
                'replacement.png',
                base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l2cAAAAASUVORK5CYII=')
            ),
        ], ['Accept' => 'application/json'])->assertCreated()->assertJsonPath('data.status', 'pending');

        $this->assertDatabaseHas('media', ['id' => $original->id, 'status' => 'published']);
        $this->getJson("/api/v1/public/departments/{$department->slug}/uploaded-gallery")
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.title', 'Original photo');
    }

    private function makeDepartmentAndAdmin(string $slug): array
    {
        $department = Department::create([
            'name' => ucfirst($slug),
            'slug' => $slug,
            'is_active' => true,
            'is_published' => true,
        ]);
        $admin = User::create([
            'name' => 'Department Admin',
            'email' => "{$slug}@example.test",
            'password' => 'password',
            'role' => 'department_admin',
        ]);
        $admin->departments()->attach($department->id);

        return [$department, $admin];
    }
}
