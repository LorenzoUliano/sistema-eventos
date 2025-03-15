<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Promoter extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'name',
        'email',
        'phone',
        'password_hash',
    ];

    // Relacionamento: um promoter pertence a uma empresa
    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
