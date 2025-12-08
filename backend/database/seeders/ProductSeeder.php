<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\SupplyFlow;
use Illuminate\Database\Seeder;
use \App\Models\Product;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = \Faker\Factory::create();
        $Products = [
            [
                'name' => 'Chicken Nugget',
                'price' => 35000,
                'description' => 'Delicious chicken nuggets',
                'low_stock_threshold' => 10,
                'category_code' => 'nuggets',
            ],
            [
                'name' => 'Beef Burger',
                'price' => 50000,
                'description' => 'Juicy beef burger',
                'low_stock_threshold' => 5,
                'category_code' => 'burgers',

            ],
            [
                'name' => 'Smoked Beef Slice',
                'price' => 75000,
                'description' => 'Tender smoked beef slices',
                'low_stock_threshold' => 3,
                'category_code' => 'smoked_beef',
            ],
            [
                'name' => 'Pork Sausage',
                'price' => 40000,
                'description' => 'Savory pork sausages',
                'low_stock_threshold' => 8,
                'category_code' => 'sausage',
            ],
            [
                'name' => 'Frozen Chicken Wings',
                'price' => 60000,
                'description' => 'Crispy frozen chicken wings',
                'low_stock_threshold' => 6,
                'category_code' => 'chicken_wings',
            ],
            [
                'name' => 'Meatball Pack',
                'price' => 45000,
                'description' => 'Tasty meatball pack',
                'low_stock_threshold' => 7,
                'category_code' => 'meatballs',
            ],
        ];

        $categories = Category::whereIn('code', collect($Products)->pluck('category_code'))->get()->keyBy('code');

        foreach ($Products as $product) {
            $category = $categories->where('code', $product['category_code'])->first();
            unset($product['category_code']);
            $product['category_id'] = $category ? $category->category_id : null;
            $product = Product::create($product);

            $product->supply()->create([
                'quantity' => $faker->numberBetween(50, 200),
            ]);

            $product->save();
            $product->refresh();

            SupplyFlow::create([
                'supply_id' => $product->supply->supply_id,
                'flow_type' => 'inbound',
                'product_id' => $product->product_id,
                'quantity' => $product->supply->quantity,
            ]);
        }

    }
}
