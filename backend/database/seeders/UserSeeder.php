<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => 'password',
        ]);

        $role = Role::firstOrCreate(['name' => 'admin']);

        $guardName = config('auth.defaults.guard');
        Permission::insert([
            ['name' => 'users.*', 'guard_name' => $guardName],
            ['name' => 'categories.*', 'guard_name' => $guardName],
            ['name' => 'products.*', 'guard_name' => $guardName],
            ['name' => 'supplies.*', 'guard_name' => $guardName],
            ['name' => 'supply_flows.*', 'guard_name' => $guardName],
        ]);

        $role->givePermissionTo(['users.*', 'categories.*', 'products.*', 'supplies.*', 'supply_flows.*']);
        $admin->assignRole('admin');
    }
}
