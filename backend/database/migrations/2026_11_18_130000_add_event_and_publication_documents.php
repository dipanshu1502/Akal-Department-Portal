<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('events', 'report_file')) {
            Schema::table('events', function (Blueprint $table) {
                $table->string('report_file')->nullable();
            });
        }

        if (! Schema::hasColumn('publications', 'document_file')) {
            Schema::table('publications', function (Blueprint $table) {
                $table->string('document_file')->nullable();
            });
        }

        foreach (['Event Reports', 'Achievement Certificates'] as $name) {
            $category = ['name' => $name, 'media_type' => 'document', 'created_at' => now(), 'updated_at' => now()];
            if (Schema::hasColumn('media_categories', 'slug')) {
                $category['slug'] = str($name)->slug();
            }
            if (! DB::table('media_categories')->where('name', $name)->exists()) {
                DB::table('media_categories')->insert($category);
            }
        }
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
