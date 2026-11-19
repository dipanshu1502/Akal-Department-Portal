<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Gallery extends Model
{
    protected $fillable = [
        'department_id',
        'title',
        'category',
        'image_url',
        'caption',
        'alt_text',
        'display_order',
    ];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }
}
