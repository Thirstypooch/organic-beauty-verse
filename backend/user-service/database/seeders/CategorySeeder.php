<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Facial',
                'description' => 'Soluciones efectivas para el cuidado de tu rostro',
                'image_url' => 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?q=80&w=500',
            ],
            [
                'name' => 'Masajes',
                'description' => 'Aceites relajantes y productos corporales para masajes',
                'image_url' => 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=500',
            ],
            [
                'name' => 'Limpieza Facial',
                'description' => 'Productos de limpieza profunda para el cuidado facial',
                'image_url' => 'https://images.unsplash.com/photo-1519824145371-296894a0daa9?q=80&w=500',
            ],
            [
                'name' => 'Corporal',
                'description' => 'Productos completos para el cuidado del cuerpo',
                'image_url' => 'https://images.unsplash.com/photo-1570194065650-d99fb4abbd47?q=80&w=500',
            ],
            [
                'name' => 'Cabello',
                'description' => 'Productos para el cuidado de todo tipo de cabello',
                'image_url' => 'https://images.unsplash.com/photo-1595476108003-e467c597eca6?q=80&w=500',
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
