<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('department_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('department_id')->constrained()->cascadeOnDelete();
            $table->string('website_title')->nullable();
            $table->string('tagline')->nullable();
            $table->string('banner_title')->nullable();
            $table->text('banner_text')->nullable();
            $table->text('about_text')->nullable();
            $table->string('hod_name')->nullable();
            $table->string('hod_designation')->nullable();
            $table->text('hod_message')->nullable();
            $table->string('contact_email')->nullable();
            $table->string('contact_phone')->nullable();
            $table->text('contact_address')->nullable();
            $table->string('primary_color')->nullable();
            $table->string('accent_color')->nullable();
            $table->json('navigation')->nullable();
            $table->timestamps();

            $table->unique('department_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('department_settings');
    }
};
