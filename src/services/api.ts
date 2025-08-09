import apiClient from '@/lib/apiClient';
import {
    categorySchema,
    productSchema,
    Category,
    Product,
} from '@/lib/schemas';
import { z } from 'zod';

// Fetches all categories from the API Gateway
export async function fetchCategories(): Promise<Category[]> {
    try {
        const response = await apiClient.get('/categories');
        // Validate the response data against our Zod schema
        return z.array(categorySchema).parse(response.data);
    } catch (error) {
        console.error('Failed to fetch categories:', error);
        // Re-throw the error so TanStack Query can handle it
        throw new Error('Could not fetch categories.');
    }
}

// Fetches products, optionally by category, from the API Gateway
export async function fetchProducts(category?: string): Promise<Product[]> {
    // The endpoint will be /products or /products/{category}
    const endpoint = category ? `/products/${category}` : '/products';
    try {
        const response = await apiClient.get(endpoint);
        // Validate the response data
        return z.array(productSchema).parse(response.data);
    } catch (error) {
        console.error(`Failed to fetch products for category "${category}":`, error);
        throw new Error('Could not fetch products.');
    }
}