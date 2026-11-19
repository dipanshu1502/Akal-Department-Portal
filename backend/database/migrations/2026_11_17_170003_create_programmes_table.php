<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('programmes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('department_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('code')->nullable();
            $table->string('level'); // undergraduate, postgraduate, doctoral, diploma, certificate
            $table->string('duration')->nullable(); // e.g. "4 Years (8 Semesters)"
            $table->text('eligibility')->nullable();
            $table->string('intake')->nullable();
            $table->text('description')->nullable();
            $table->text('curriculum_highlights')->nullable();
            $table->string('syllabus_file')->nullable();
            $table->string('status')->default('active');
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('programmes');
    }
};
