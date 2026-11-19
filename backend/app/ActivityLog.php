<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    protected $fillable = [
        'user_id',
        'department_id',
        'action',
        'description',
        'ip_address',
        'properties',
    ];

    protected $casts = [
        'properties' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public static function log(string $action, string $description, ?int $departmentId = null, ?int $userId = null, ?array $properties = null): self
    {
        return self::create([
            'user_id' => $userId ?? auth()->id(),
            'department_id' => $departmentId,
            'action' => $action,
            'description' => $description,
            'ip_address' => request()->ip(),
            'properties' => $properties,
        ]);
    }
}
