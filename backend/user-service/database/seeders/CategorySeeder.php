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
                'image_url' => '/categories/cat-facial.jpg',
            ],
            [
                'name' => 'Masajes',
                'description' => 'Aceites relajantes y productos corporales para masajes',
                'image_url' => '/categories/cat-masajes.jpg',
            ],
            [
                'name' => 'Limpieza Facial',
                'description' => 'Productos de limpieza profunda para el cuidado facial',
                'image_url' => '/categories/cat-limpieza-facial.jpg',
            ],
            [
                'name' => 'Corporal',
                'description' => 'Productos completos para el cuidado del cuerpo',
                'image_url' => '/categories/cat-corporal.jpg',
            ],
            [
                'name' => 'Cabello',
                'description' => 'Productos para el cuidado de todo tipo de cabello',
                'image_url' => '/categories/cat-masajes.jpg',
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
