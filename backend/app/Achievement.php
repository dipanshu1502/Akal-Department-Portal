<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Achievement extends Model
{
    protected $fillable = [
        'department_id',
        'title',
        'description',
        'achievement_date',
        'category',
        'recipient_name',
        'award_by',
        'image_url',
        'certificate_url',
        'sort_order',
    ];

    protected $casts = [
        'achievement_date' => 'date',
    ];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }
}
