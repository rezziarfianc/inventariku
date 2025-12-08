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
        $brands = [
            ['name' => 'Yona', 'description' => 'Description for Brand A', 'code' => 'yona'],
            ['name' => 'Endura', 'description' => 'Description for Brand B', 'code' => 'endura'],
            ['name' => 'Pedan', 'description' => 'Description for Brand C', 'code' => 'pedan'],
            ['name' => 'Hemato', 'description' => 'Description for Brand D', 'code' => 'hemato'],
        ];

        Brand::insert($brands);
    }
}