<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class MediaCategory extends Model
{
    protected $fillable = ['department_id', 'name', 'media_type'];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }
}
