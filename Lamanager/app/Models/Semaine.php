<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Semaine extends Model
{

    protected $fillable = [
        'numero',
    ];

    public function cases()
    {
        return $this->hasMany(CaseTableau::class);
    }

}
