<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LiaisonGroupe extends Model
{
    use HasFactory;

    protected $table = 'liaison_groupes';

    protected $fillable = [
        'groupe_td_id',
        'groupe_tp_id',
    ];


    public function groupeTD(): BelongsTo
    {
        return $this->belongsTo(Groupe::class, 'groupe_td_id');
    }
    public function groupeTP(): BelongsTo
    {
        return $this->belongsTo(Groupe::class, 'groupe_tp_id');
    }
}
