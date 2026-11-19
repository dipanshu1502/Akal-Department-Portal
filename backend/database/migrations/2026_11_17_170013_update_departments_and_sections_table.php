<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('departments', function (Blueprint $table) {
            if (!Schema::hasColumn('departments', 'code')) {
                $table->string('code')->nullable()->after('slug');
            }
            if (!Schema::hasColumn('departments', 'logo')) {
                $table->string('logo')->nullable()->after('hero_image');
            }
            if (!Schema::hasColumn('departments', 'official_email')) {
                $table->string('official_email')->nullable()->after('description');
            }
            if (!Schema::hasColumn('departments', 'contact_phone')) {
                $table->string('contact_phone')->nullable()->after('official_email');
            }
            if (!Schema::hasColumn('departments', 'office_location')) {
                $table->string('office_location')->nullable()->after('contact_phone');
            }
        });

        Schema::table('department_sections', function (Blueprint $table) {
            if (!Schema::hasColumn('department_sections', 'status')) {
                $table->string('status')->default('published')->after('enabled');
            }
        });
    }

    public function down(): void
    {
        Schema::table('departments', function (Blueprint $table) {
            $table->dropColumn(['code', 'logo', 'official_email', 'contact_phone', 'office_location']);
        });

        Schema::table('department_sections', function (Blueprint $table) {
            $table->dropColumn(['status']);
        });
    }
};
