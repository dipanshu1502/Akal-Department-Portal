<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $payload = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', Rule::unique('users')],
            'password' => ['required', 'min:8'],
            'role' => ['nullable', 'string', Rule::in(['super_admin', 'department_admin'])],
        ]);

        $user = User::create([
            'name' => $payload['name'],
            'email' => strtolower($payload['email']),
            'password' => Hash::make($payload['password']),
            'role' => $payload['role'] ?? 'department_admin',
        ]);

        $token = $user->createToken('akal-portal')->plainTextToken;

        return response()->json([
            'message' => 'User account created successfully.',
            'data' => [
                'user' => $user->load('departments'),
                'token' => $token,
            ],
        ], 201);
    }

    public function login(Request $request)
    {
        $payload = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', strtolower($payload['email']))->first();

        if (! $user || ! Hash::check($payload['password'], $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials.',
            ], 401);
        }

        $token = $user->createToken('akal-portal')->plainTextToken;

        return response()->json([
            'message' => 'Logged in successfully.',
            'data' => [
                'user' => $user->load('departments'),
                'token' => $token,
            ],
        ]);
    }

    public function me(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'data' => [
                'user' => $user->load('departments'),
            ],
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()?->currentAccessToken()?->delete();

        return response()->json([
            'message' => 'Logged out successfully.',
        ]);
    }
}
