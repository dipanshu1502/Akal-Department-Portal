<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('faculty_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('department_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('designation');
            $table->string('qualification')->nullable();
            $table->string('specialization')->nullable();
            $table->string('experience')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('office_location')->nullable();
            $table->text('research_interests')->nullable();
            $table->text('bio')->nullable();
            $table->string('profile_image')->nullable();
            $table->unsignedInteger('display_order')->default(0);
            $table->string('status')->default('active'); // active, on_leave, retired
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('faculty_members');
    }
};
