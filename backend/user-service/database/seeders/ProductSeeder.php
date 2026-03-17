<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $json = file_get_contents(database_path('seeders/data/products.json'));
        $products = json_decode($json, true);

        // Build a category name → ID lookup map
        $categoryMap = Category::pluck('id', 'name')->toArray();

        foreach ($products as $item) {
            Product::create([
                'external_id' => $item['external_id'],
                'name' => $item['name'],
                'price' => $item['price'],
                'description' => $item['description'],
                'category_id' => $categoryMap[$item['category']],
                'how_to_use' => $item['how_to_use'],
                'warnings' => $item['warnings'],
                'image_url' => $item['image'],
            ]);
        }
    }
}
