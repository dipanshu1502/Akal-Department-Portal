<?php

namespace Database\Seeders;

use App\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'super@akal.ac.in'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('Akal@123'),
                'role' => 'super_admin',
            ]
        );

        User::updateOrCreate(
            ['email' => 'deptadmin@akal.ac.in'],
            [
                'name' => 'Department Admin',
                'password' => Hash::make('Akal@123'),
                'role' => 'department_admin',
            ]
        );
    }
}
