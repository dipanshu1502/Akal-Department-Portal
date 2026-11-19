<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class FacultyMember extends Model
{
    protected $fillable = [
        'department_id',
        'name',
        'designation',
        'qualification',
        'specialization',
        'experience',
        'email',
        'phone',
        'office_location',
        'research_interests',
        'bio',
        'profile_image',
        'display_order',
        'status',
    ];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }
}
