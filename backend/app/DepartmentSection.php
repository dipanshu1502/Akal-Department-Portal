<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class DepartmentSection extends Model
{
    protected $fillable = [
        'department_id',
        'title',
        'subtitle',
        'layout_type',
        'content',
        'settings',
        'enabled',
        'status',
        'display_order',
    ];

    protected $casts = [
        'content' => 'array',
        'settings' => 'array',
        'enabled' => 'boolean',
    ];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function revisions()
    {
        return $this->hasMany(ContentRevision::class, 'section_id')->orderBy('created_at', 'desc');
    }
}
