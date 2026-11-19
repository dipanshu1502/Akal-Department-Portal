<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $fillable = [
        'department_id',
        'title',
        'description',
        'event_date',
        'end_date',
        'venue',
        'organizer',
        'category',
        'image_url',
        'report_file',
        'registration_link',
        'is_featured',
        'status',
    ];

    protected $casts = [
        'event_date' => 'date',
        'end_date' => 'date',
        'is_featured' => 'boolean',
    ];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }
}
