<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('media_categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('department_id')->nullable()->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('media_type')->default('both');
            $table->timestamps();
            $table->index(['department_id', 'media_type']);
        });

        Schema::create('media', function (Blueprint $table) {
            $table->id();
            $table->foreignId('department_id')->constrained()->cascadeOnDelete();
            $table->foreignId('uploaded_by')->constrained('users')->cascadeOnDelete();
            $table->foreignId('category_id')->nullable()->constrained('media_categories')->nullOnDelete();
            $table->foreignId('replaces_media_id')->nullable()->constrained('media')->nullOnDelete();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('original_name');
            $table->string('stored_name')->unique();
            $table->string('file_path')->unique();
            $table->string('mime_type', 150);
            $table->string('extension', 15);
            $table->unsignedBigInteger('file_size');
            $table->string('media_type', 20);
            $table->string('alt_text')->nullable();
            $table->text('caption')->nullable();
            $table->unsignedInteger('display_order')->default(0);
            $table->string('status', 20)->default('draft');
            $table->text('review_comments')->nullable();
            $table->boolean('delete_requested')->default(false);
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->index(['department_id', 'status', 'media_type']);
            $table->index(['category_id', 'created_at']);
        });

        $now = now();
        $categories = [
            ['Syllabus', 'document'],
            ['Academic Calendar', 'document'],
            ['Notices', 'document'],
            ['Circulars', 'document'],
            ['Annual Reports', 'document'],
            ['Department Brochures', 'document'],
            ['Admission Documents', 'document'],
            ['Examination Documents', 'document'],
            ['Research Publications', 'document'],
            ['Faculty Documents', 'document'],
            ['Student Documents', 'document'],
            ['Other Documents', 'document'],
            ['Department Gallery', 'image'],
            ['Events', 'image'],
            ['Workshops', 'image'],
            ['Seminars', 'image'],
            ['Faculty', 'image'],
            ['Laboratories', 'image'],
            ['Campus Activities', 'image'],
            ['Achievements', 'image'],
            ['Student Activities', 'image'],
            ['Homepage Banners', 'image'],
            ['Other Images', 'image'],
        ];

        foreach ($categories as [$name, $mediaType]) {
            DB::table('media_categories')->insert([
                'name' => $name,
                'media_type' => $mediaType,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('media');
        Schema::dropIfExists('media_categories');
    }
};
