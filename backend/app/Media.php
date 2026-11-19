<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Media extends Model
{
    use SoftDeletes;

    protected $table = 'media';

    protected $fillable = [
        'department_id',
        'uploaded_by',
        'category_id',
        'replaces_media_id',
        'reviewed_by',
        'title',
        'description',
        'original_name',
        'stored_name',
        'file_path',
        'mime_type',
        'extension',
        'file_size',
        'media_type',
        'alt_text',
        'caption',
        'display_order',
        'status',
        'review_comments',
        'delete_requested',
        'submitted_at',
        'reviewed_at',
        'published_at',
    ];

    protected $casts = [
        'file_size' => 'integer',
        'display_order' => 'integer',
        'delete_requested' => 'boolean',
        'submitted_at' => 'datetime',
        'reviewed_at' => 'datetime',
        'published_at' => 'datetime',
    ];

    protected $hidden = ['file_path', 'stored_name'];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function category()
    {
        return $this->belongsTo(MediaCategory::class, 'category_id');
    }

    public function submitter()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function replacement()
    {
        return $this->belongsTo(self::class, 'replaces_media_id');
    }
}
