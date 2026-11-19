<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class DepartmentSetting extends Model
{
    protected $fillable = [
        'department_id',
        'website_title',
        'tagline',
        'banner_title',
        'banner_text',
        'about_text',
        'hod_name',
        'hod_designation',
        'hod_message',
        'hod_photo',
        'contact_email',
        'contact_phone',
        'contact_address',
        'primary_color',
        'accent_color',
        'navigation',
    ];

    protected $casts = [
        'navigation' => 'array',
    ];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }
}
