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
            // Kategori Bahan Baku (Raw Materials)
            ['name' => 'Bunga Potong Segar', 'description' => 'Bahan baku bunga asli segar', 'code' => 'fresh_cut'],
            ['name' => 'Daun & Foliage', 'description' => 'Bahan baku dedaunan pelengkap', 'code' => 'foliage'],
            ['name' => 'Wrapping & Aksesoris', 'description' => 'Kertas tisu, pita, dan perlengkapan', 'code' => 'accessories'],
            
            // Kategori Produk Jadi (Finished Products)
            ['name' => 'Hand Bouquet', 'description' => 'Rangkaian buket bunga tangan', 'code' => 'hand_bouquet'],
            ['name' => 'Bunga Papan', 'description' => 'Papan ucapan selamat atau duka cita', 'code' => 'flower_board'],
            ['name' => 'Bunga Meja', 'description' => 'Rangkaian bunga dalam vas/pot', 'code' => 'table_flower'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}