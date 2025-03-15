<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Promoter extends Authenticatable
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'name',
        'email',
        'phone',
        'password',
    ];

    protected $hidden = [
        'password',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
