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
        $resorces = ['users', 'categories', 'products', 'supplies', 'supply_flows'];
        $actions = ['create', 'view', 'update', 'delete'];

        $role = Role::firstOrCreate(['name' => 'admin']);
        $createdAt = now();

        $guardName = config('auth.defaults.guard');
        $permissions = [];
        foreach ($resorces as $resource) {
            foreach ($actions as $action) {
                $permissionName = "{$resource}.{$action}";
                $permissions[] = ['name' => $permissionName, 'guard_name' => $guardName, 'created_at' => $createdAt];
            }
        }
        Permission::insert($permissions);

        $role->givePermissionTo(array_column($permissions, 'name'));
        $admin->assignRole('admin');
        $admin->givePermissionTo(array_column($permissions, 'name'));
    }
}
