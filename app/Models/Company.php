<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'cnpj',
        'phone',
        'email',
    ];

    // Relacionamento: uma empresa pode ter vários promoters
    public function promoters()
    {
        return $this->hasMany(Promoter::class);
    }

    // Relacionamento: uma empresa pode ter vários eventos
    public function events()
    {
        return $this->hasMany(Event::class);
    }
}
