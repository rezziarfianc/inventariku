<?php

namespace Database\Seeders;

use App\Models\Brand;
use Illuminate\Database\Seeder;

class BrandSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = now();
        $brands = [
            ['name' => 'Yona', 'description' => 'Description for Brand A', 'code' => 'yona', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Endura', 'description' => 'Description for Brand B', 'code' => 'endura', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Pedan', 'description' => 'Description for Brand C', 'code' => 'pedan', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Hemato', 'description' => 'Description for Brand D', 'code' => 'hemato', 'created_at' => $now, 'updated_at' => $now],
        ];

        Brand::insert($brands);
    }
}