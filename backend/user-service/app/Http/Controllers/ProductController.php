<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Models\Category;

class ProductController extends Controller
{
    public function index()
    {
        return ProductResource::collection(Product::all());
    }

    public function show(Product $product)
    {
        return new ProductResource($product);
    }

    public function featured()
    {
        $products = Product::limit(4)->get();
        return ProductResource::collection($products);
    }

    /**
     * Get products by category name (URL-friendly lowercase match).
     */
    public function byCategory(string $categoryName)
    {
        $category = Category::whereRaw('LOWER(name) = ?', [strtolower($categoryName)])->first();

        if (!$category) {
            return response()->json([], 200);
        }

        $products = Product::where('category_id', $category->id)->get();
        return ProductResource::collection($products);
    }
}
