<?php

namespace App\Http\Controllers;

use App\Models\Semaine;
use Illuminate\Http\JsonResponse;

class SemaineController extends Controller
{
    public function index(): JsonResponse
    {
        $semaines = Semaine::select('id', 'numero')->get();

        return response()->json($semaines);
    }
}