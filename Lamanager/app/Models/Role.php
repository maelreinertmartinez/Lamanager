<?php

namespace app\Models;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    protected $fillable = [
        'nom',
        'nombreHeure',
    ];

    public function enseignants()
    {
        return $this->hasMany(Enseignant::class, 'idRole');
    }
}
