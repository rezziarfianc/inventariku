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
        $superAdmin = User::factory()->create([
            'name' => 'Super Admin',
            'email' => 'superadmin@example.com',
            'password' => 'password',
        ]);

        $admin = User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => 'password',
        ]);

        $staff = User::factory()->create([
            'name' => 'Staff',
            'email' => 'staff@example.com',
            'password' => 'password',
        ]);

        $manager = User::factory()->create([
            'name' => 'Manager',
            'email' => 'manager@example.com',
            'password' => 'password',
        ]);

        $resorces = ['users', 'categories', 'products', 'supplies', 'brands'];
        $actions = ['create', 'view', 'update', 'delete'];

        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $superAdminRole = Role::firstOrCreate(['name' => 'super_admin']);
        $staffRole = Role::firstOrCreate(['name' => 'staff']);
        $managerRole = Role::firstOrCreate(['name' => 'manager']);

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

        $permissions = collect(array_column($permissions, 'name'));

        //super admin
        $superAdminRole->givePermissionTo($permissions);
        $superAdmin->assignRole('admin');
        $superAdmin->givePermissionTo($permissions);

        // admin
        $adminPermissions = $permissions->filter(function ($permission) {
            return !str_starts_with($permission, 'users.');
        })->toArray();
        $adminRole->givePermissionTo($adminPermissions);
        $admin->assignRole('admin');

        // staff
        $staffPermissions = $permissions->filter(function ($permission) {
            return str_starts_with($permission, 'supplies.') || str_starts_with($permission, 'supply_flows.');
        })->toArray();
        $staffRole->givePermissionTo($staffPermissions);
        $staff->assignRole('staff');

        // manager
        $managerPermissions = $permissions->filter(function ($permission) {
            return str_contains($permission, 'view') && !str_starts_with($permission, 'users.');
        })->toArray();

        $managerRole->givePermissionTo($managerPermissions);
        $manager->assignRole('manager');

    }
}
