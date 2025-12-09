<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = now();
        $categories = [
            ['name' => 'Nuggets', 'description' => 'Different Kinds of Nuggets', 'code' => 'nuggets', 'created_at' => $now,],
            ['name' => 'Burgers', 'description' => 'Different Kinds of Burgers', 'code' => 'burgers', 'created_at' => $now,],
            ['name' => 'Smoked Beef', 'description' => 'Different Kinds of Smoked Beef', 'code' => 'smoked_beef', 'created_at' => $now,],
            ['name' => 'Sausage', 'description' => 'Different Kind of sausage', 'code' => 'sausage', 'created_at' => $now,],
            ['name' => 'Chicken Wings', 'description' => 'Different Cuts of Chicken Wings', 'code' => 'chicken_wings', 'created_at' => $now,],
            ['name' => 'Meatballs', 'description' => 'Different Kinds of Meatballs', 'code' => 'meatballs', 'created_at' => $now,],
        ];

        Category::insert($categories);
    }
}
