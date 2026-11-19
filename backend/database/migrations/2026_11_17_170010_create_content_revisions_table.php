<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('content_revisions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('department_id')->constrained()->cascadeOnDelete();
            $table->foreignId('section_id')->nullable()->constrained('department_sections')->nullOnDelete();
            $table->string('model_type')->default('section'); // section, settings, general
            $table->unsignedBigInteger('model_id')->nullable();
            $table->string('title');
            $table->json('payload'); // proposed data
            $table->string('status')->default('draft'); // draft, pending, approved, rejected, published
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete(); // submitter
            $table->foreignId('reviewer_id')->nullable()->constrained('users')->nullOnDelete(); // reviewer
            $table->text('review_comments')->nullable();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('content_revisions');
    }
};
