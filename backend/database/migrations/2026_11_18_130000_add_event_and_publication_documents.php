<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->string('report_file')->nullable();
        });

        Schema::table('publications', function (Blueprint $table) {
            $table->string('document_file')->nullable();
        });

        DB::table('media_categories')->insert([
            ['name' => 'Event Reports', 'media_type' => 'document', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Achievement Certificates', 'media_type' => 'document', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn('report_file');
        });

        Schema::table('publications', function (Blueprint $table) {
            $table->dropColumn('document_file');
        });

        DB::table('media_categories')
            ->whereIn('name', ['Event Reports', 'Achievement Certificates'])
            ->delete();
    }
};
