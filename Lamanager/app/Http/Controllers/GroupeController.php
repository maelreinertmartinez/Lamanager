<?php

namespace App\Http\Controllers;

use App\Models\Groupe;
use Illuminate\Http\JsonResponse;

class GroupeController extends Controller
{
    public function show($promo_id): JsonResponse
    {
        $groupes = Groupe::where('promo_id', $promo_id)

            ->get();



        return response()->json($groupes);
    }
}
