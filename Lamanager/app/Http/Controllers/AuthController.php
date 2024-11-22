<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\Enseignant;

class AuthController extends Controller
{
    public function authenticate(Request $request)
    {
        $credentials = $request->only('email', 'password');

        $enseignant = Enseignant::where('mail', $credentials['email'])->first();

        if ($enseignant && Hash::check($credentials['password'], $enseignant->mot_de_passe)) {
            $token = $enseignant->createToken('authToken')->plainTextToken;
            return response()->json(['token' => $token], 200);
        }

        return response()->json(['error' => 'Invalid credentials'], 401);
    }
}
