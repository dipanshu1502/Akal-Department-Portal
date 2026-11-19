<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ContentRevision extends Model
{
    protected $fillable = [
        'department_id',
        'section_id',
        'model_type',
        'model_id',
        'title',
        'payload',
        'status',
        'user_id',
        'reviewer_id',
        'review_comments',
        'submitted_at',
        'reviewed_at',
        'published_at',
    ];

    protected $casts = [
        'payload' => 'array',
        'submitted_at' => 'datetime',
        'reviewed_at' => 'datetime',
        'published_at' => 'datetime',
    ];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function section()
    {
        return $this->belongsTo(DepartmentSection::class, 'section_id');
    }

    public function submitter()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }
}
