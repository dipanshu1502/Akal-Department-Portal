<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Programme extends Model
{
    protected $fillable = [
        'department_id',
        'name',
        'code',
        'level',
        'duration',
        'eligibility',
        'intake',
        'description',
        'curriculum_highlights',
        'syllabus_file',
        'status',
        'sort_order',
    ];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }
}
