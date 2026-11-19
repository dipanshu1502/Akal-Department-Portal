<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Laboratory extends Model
{
    protected $fillable = [
        'department_id',
        'name',
        'description',
        'facilities',
        'equipment',
        'image_url',
        'location',
        'incharge_name',
        'sort_order',
        'status',
    ];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }
}
