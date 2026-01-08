<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\SupplyFlow;
use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = \Faker\Factory::create();
        
        $Products = [
            // --- BAHAN BAKU (MATERIALS) ---
            [
                'name' => 'Mawar Merah (Per Batang)',
                'price' => 15000,
                'description' => 'Mawar merah segar semi holland kualitas terbaik',
                'low_stock_threshold' => 50,
                'category_code' => 'fresh_cut',
            ],
            [
                'name' => 'Lily Putih (Per Batang)',
                'price' => 35000,
                'description' => 'Bunga Lily putih wangi segar',
                'low_stock_threshold' => 20,
                'category_code' => 'fresh_cut',
            ],
            [
                'name' => 'Daun Ruscus',
                'price' => 5000,
                'description' => 'Daun pelengkap rangkaian buket',
                'low_stock_threshold' => 100,
                'category_code' => 'foliage',
            ],
            [
                'name' => 'Premium Wrapping Paper',
                'price' => 2500,
                'description' => 'Kertas cellophane waterproof berbagai warna',
                'low_stock_threshold' => 200,
                'category_code' => 'accessories',
            ],

            // --- PRODUK JADI (FINISHED GOODS) ---
            [
                'name' => 'Romantic Valentine Bouquet',
                'price' => 450000,
                'description' => 'Buket berisi 20 tangkai mawar merah dan baby breath',
                'low_stock_threshold' => 5,
                'category_code' => 'hand_bouquet',
            ],
            [
                'name' => 'Graduation Sunflowers',
                'price' => 250000,
                'description' => 'Buket bunga matahari cerah untuk wisuda',
                'low_stock_threshold' => 5,
                'category_code' => 'hand_bouquet',
            ],
            [
                'name' => 'Papan Ucapan Wedding Besar',
                'price' => 750000,
                'description' => 'Bunga papan ukuran 2x1.5m desain mewah',
                'low_stock_threshold' => 3,
                'category_code' => 'flower_board',
            ],
            [
                'name' => 'Papan Duka Cita Standard',
                'price' => 500000,
                'description' => 'Bunga papan duka cita nuansa tenang',
                'low_stock_threshold' => 3,
                'category_code' => 'flower_board',
            ],
            [
                'name' => 'Anggrek Bulan Pot Keramik',
                'price' => 600000,
                'description' => 'Rangkaian anggrek bulan putih dalam pot keramik',
                'low_stock_threshold' => 2,
                'category_code' => 'table_flower',
            ],
        ];

        // Ambil semua kategori yang sesuai dengan kode produk di atas
        $categories = Category::whereIn('code', collect($Products)->pluck('category_code'))->get()->keyBy('code');

        foreach ($Products as $product) {
            // Cari ID kategori berdasarkan code
            $category = $categories->where('code', $product['category_code'])->first();
            
            // Hapus 'category_code' dari array karena tabel produk butuhnya 'category_id'
            unset($product['category_code']);
            
            $product['category_id'] = $category ? $category->category_id : null;
            
            // Buat Produk
            $productModel = Product::create($product);

            // Buat Supply Awal (Stok)
            $productModel->supply()->create([
                'quantity' => $faker->numberBetween(10, 100), // Stok disesuaikan
            ]);

            $productModel->save();
            $productModel->refresh();

            // Catat Arus Barang Masuk (Inbound)
            SupplyFlow::create([
                'supply_id' => $productModel->supply->supply_id,
                'flow_type' => 'inbound',
                'product_id' => $productModel->product_id,
                'quantity' => $productModel->supply->quantity,
            ]);
        }
    }
}