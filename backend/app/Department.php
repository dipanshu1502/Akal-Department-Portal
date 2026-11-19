<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    protected $fillable = [
        'faculty_id',
        'name',
        'slug',
        'code',
        'short_description',
        'description',
        'hero_image',
        'logo',
        'official_email',
        'contact_phone',
        'office_location',
        'is_active',
        'is_published',
        'published_at',
        'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_published' => 'boolean',
        'published_at' => 'datetime',
    ];

    public function faculty()
    {
        return $this->belongsTo(Faculty::class);
    }

    public function sections()
    {
        return $this->hasMany(DepartmentSection::class)->orderBy('display_order');
    }

    public function settings()
    {
        return $this->hasOne(DepartmentSetting::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'department_user')->withTimestamps();
    }

    public function facultyMembers()
    {
        return $this->hasMany(FacultyMember::class)->orderBy('display_order');
    }

    public function programmes()
    {
        return $this->hasMany(Programme::class)->orderBy('sort_order');
    }

    public function laboratories()
    {
        return $this->hasMany(Laboratory::class)->orderBy('sort_order');
    }

    public function events()
    {
        return $this->hasMany(Event::class)->orderBy('event_date', 'desc');
    }

    public function achievements()
    {
        return $this->hasMany(Achievement::class)->orderBy('achievement_date', 'desc');
    }

    public function publications()
    {
        return $this->hasMany(Publication::class)->orderBy('year', 'desc');
    }

    public function galleries()
    {
        return $this->hasMany(Gallery::class)->orderBy('display_order');
    }

    public function notices()
    {
        return $this->hasMany(Notice::class)->orderBy('publish_date', 'desc');
    }

    public function revisions()
    {
        return $this->hasMany(ContentRevision::class)->orderBy('created_at', 'desc');
    }

    public function activityLogs()
    {
        return $this->hasMany(ActivityLog::class)->orderBy('created_at', 'desc');
    }
}
