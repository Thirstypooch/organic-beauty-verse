import { z } from 'zod';

// Schema for a single Category based on product-service/models/Category.kt
export const categorySchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    imageUrl: z.string().nullable(),
});
export type Category = z.infer<typeof categorySchema>;

// Schema for a single Product based on product-service/models/Product.kt
// Note: price is a number here, as it's converted from BigDecimal in the service.
export const productSchema = z.object({
    id: z.number(),
    externalId: z.string().nullable(),
    name: z.string(),
    price: z.number(),
    description: z.string(),
    categoryId: z.number(),
    howToUse: z.string().nullable(),
    warnings: z.string().nullable(),
    imageUrl: z.string().nullable(),
});
export type Product = z.infer<typeof productSchema>;

// Schema for the User model, based on user-service/models/User.php
export const userSchema = z.object({
    id: z.number(),
    name: z.string(),
    email: z.string().email(),
    created_at: z.string(),
    updated_at: z.string(),
});
export type User = z.infer<typeof userSchema>;

// Schema for the successful authentication response (Register/Login)
export const authResponseSchema = z.object({
    message: z.string(),
    user: userSchema,
    token: z.string(),
});
export type AuthResponse = z.infer<typeof authResponseSchema>;

export type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc';

export interface ProductFilter {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: SortOption;
    search?: string;
}

export const registerFormSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});
export type RegisterFormData = z.infer<typeof registerFormSchema>;

// Schema for the login form
export const loginFormSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z.string().min(1, { message: "Password is required." }),
});
export type LoginFormData = z.infer<typeof loginFormSchema>;