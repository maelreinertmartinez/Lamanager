<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LiaisonGroupe extends Model
{
    use HasFactory;

    protected $table = 'liaison_groupes';

    protected $fillable = [
        'groupe_td_id',
        'groupe_tp_id',
    ];

    public function groupeTd()
    {
        return $this->belongsTo(Groupe::class, 'groupe_td_id');
    }

    public function groupeTp()
    {
        return $this->belongsTo(Groupe::class, 'groupe_tp_id');
    }
}
