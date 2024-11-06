<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Enseignement extends Model
{
    protected $fillable = [
        'alternant',
        'nom',
        'nombre_heure_cm',
        'nombre_heure_td',
        'nombre_heure_tp',
        'semestre',
        'nombre_heure_max',
    ];
}
