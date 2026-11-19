<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Publication extends Model
{
    protected $fillable = [
        'department_id',
        'title',
        'authors',
        'journal_conference',
        'year',
        'doi',
        'link',
        'abstract',
        'document_file',
        'citation',
        'sort_order',
    ];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }
}
