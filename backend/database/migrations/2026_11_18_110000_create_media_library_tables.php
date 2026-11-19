<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('media_categories')) {
            Schema::create('media_categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('department_id')->nullable()->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('media_type')->default('both');
            $table->timestamps();
            $table->index(['department_id', 'media_type']);
            });
        }

        if (! Schema::hasTable('media')) {
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
        } else {
            $columns = [
                'replaces_media_id' => fn (Blueprint $table) => $table->foreignId('replaces_media_id')->nullable()->constrained('media')->nullOnDelete(),
                'reviewed_by' => fn (Blueprint $table) => $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete(),
                'display_order' => fn (Blueprint $table) => $table->unsignedInteger('display_order')->default(0),
                'review_comments' => fn (Blueprint $table) => $table->text('review_comments')->nullable(),
                'delete_requested' => fn (Blueprint $table) => $table->boolean('delete_requested')->default(false),
                'submitted_at' => fn (Blueprint $table) => $table->timestamp('submitted_at')->nullable(),
                'reviewed_at' => fn (Blueprint $table) => $table->timestamp('reviewed_at')->nullable(),
                'published_at' => fn (Blueprint $table) => $table->timestamp('published_at')->nullable(),
                'deleted_at' => fn (Blueprint $table) => $table->softDeletes(),
            ];
            foreach ($columns as $name => $addColumn) {
                if (! Schema::hasColumn('media', $name)) {
                    Schema::table('media', $addColumn);
                }
            }
        }

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
            $values = [
                'name' => $name,
                'media_type' => $mediaType,
                'created_at' => $now,
                'updated_at' => $now,
            ];
            if (Schema::hasColumn('media_categories', 'slug')) {
                $values['slug'] = str($name)->slug();
            }
            if (! DB::table('media_categories')->where('name', $name)->exists()) {
                DB::table('media_categories')->insert($values);
            }
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('media');
        Schema::dropIfExists('media_categories');
    }
};
