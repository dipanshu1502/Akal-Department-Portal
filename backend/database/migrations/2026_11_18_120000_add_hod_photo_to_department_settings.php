<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('department_settings', function (Blueprint $table) {
            $table->string('hod_photo')->nullable()->after('hod_message');
        });
    }

    public function down(): void
    {
        Schema::table('department_settings', function (Blueprint $table) {
            $table->dropColumn('hod_photo');
        });
    }
};
