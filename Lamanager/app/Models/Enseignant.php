<?php

namespace app\Models;

use Illuminate\Database\Eloquent\Model;

class Enseignant extends Model
{
    protected $fillable = [
        'idRole',
        'code',
        'actif',
        'motDePasse',
        'nom',
        'prenom',
        'mail',
    ];

    public function role()
    {
        return $this->belongsTo(Role::class, 'idRole');
    }
}
