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
        $categories = [
            ['name' => 'Nuggets', 'description' => 'Different Kinds of Nuggets', 'code' => 'nuggets'],
            ['name' => 'Burgers', 'description' => 'Different Kinds of Burgers', 'code' => 'burgers'],
            ['name' => 'Smoked Beef', 'description' => 'Different Kinds of Smoked Beef', 'code' => 'smoked_beef'],
            ['name' => 'Sausage', 'description' => 'Different Kind of sausage', 'code' => 'sausage'],
            ['name' => 'Chicken Wings', 'description' => 'Different Cuts of Chicken Wings', 'code' => 'chicken_wings'],
            ['name' => 'Meatballs', 'description' => 'Different Kinds of Meatballs', 'code' => 'meatballs'],
        ];

        Category::insert($categories);
    }
}
