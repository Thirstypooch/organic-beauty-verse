import apiClient from '@/lib/apiClient';
import {
    authResponseSchema,
    AuthResponse,
    RegisterFormData,
    LoginFormData,
    categorySchema,
    productSchema,
    orderSchema,
    userSchema,
    Category,
    Product,
    Order,
    User,
    ShippingFormData,
} from '@/lib/schemas';
import { z } from 'zod';

// Fetches all categories from the API
export async function fetchCategories(): Promise<Category[]> {
    try {
        const response = await apiClient.get('/categories');
        return z.array(categorySchema).parse(response.data);
    } catch (error) {
        console.error('Failed to fetch categories:', error);
        throw new Error('Could not fetch categories.');
    }
}

// Fetches products, optionally filtered by category name
export async function fetchProducts(category?: string): Promise<Product[]> {
    const endpoint = category ? `/products/${category}` : '/products';
    try {
        const response = await apiClient.get(endpoint);
        return z.array(productSchema).parse(response.data);
    } catch (error) {
        console.error(`Failed to fetch products for category "${category}":`, error);
        throw new Error('Could not fetch products.');
    }
}

// Fetches a single product by ID
export async function fetchProductById(id: number): Promise<Product> {
    try {
        const response = await apiClient.get(`/products/${id}`);
        return productSchema.parse(response.data);
    } catch (error) {
        console.error(`Failed to fetch product ${id}:`, error);
        throw new Error('Could not fetch product.');
    }
}

// Fetches featured products (first 4 products)
export async function fetchFeaturedProducts(): Promise<Product[]> {
    try {
        const response = await apiClient.get('/products/featured');
        return z.array(productSchema).parse(response.data);
    } catch (error) {
        console.error('Failed to fetch featured products:', error);
        throw new Error('Could not fetch featured products.');
    }
}

export async function registerUser(data: RegisterFormData): Promise<AuthResponse> {
    try {
        const response = await apiClient.post('/register', data);
        return authResponseSchema.parse(response.data);
    } catch (error) {
        console.error('Registration failed:', error);
        throw new Error('Could not register user.');
    }
}

// Orders
export async function createOrder(data: {
    shippingAddress: ShippingFormData;
    items: { productId: number; quantity: number }[];
}): Promise<Order> {
    try {
        const response = await apiClient.post('/orders', data);
        return orderSchema.parse(response.data);
    } catch (error) {
        console.error('Failed to create order:', error);
        throw new Error('No se pudo crear el pedido.');
    }
}

export async function fetchOrders(): Promise<Order[]> {
    try {
        const response = await apiClient.get('/orders');
        return z.array(orderSchema).parse(response.data);
    } catch (error) {
        console.error('Failed to fetch orders:', error);
        throw new Error('No se pudieron obtener los pedidos.');
    }
}

export async function fetchOrderById(id: number): Promise<Order> {
    try {
        const response = await apiClient.get(`/orders/${id}`);
        return orderSchema.parse(response.data);
    } catch (error) {
        console.error(`Failed to fetch order ${id}:`, error);
        throw new Error('No se pudo obtener el pedido.');
    }
}

// Profile
export async function updateProfile(data: { name?: string; email?: string }): Promise<User> {
    try {
        const response = await apiClient.put('/user', data);
        return userSchema.parse(response.data.user);
    } catch (error) {
        console.error('Failed to update profile:', error);
        throw new Error('No se pudo actualizar el perfil.');
    }
}

export async function loginUser(data: LoginFormData): Promise<AuthResponse> {
    try {
        const response = await apiClient.post('/login', data);
        return authResponseSchema.parse(response.data);
    } catch (error) {
        console.error('Login failed:', error);
        throw new Error('Invalid credentials.');
    }
}
