<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SectionType extends Model
{
    protected $fillable = [
        'key',
        'name',
        'description',
        'icon',
        'schema',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'schema' => 'array',
        'is_active' => 'boolean',
    ];
}
