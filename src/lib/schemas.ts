import { z } from 'zod';

// Schema for a single Category based on the Laravel CategoryResource
export const categorySchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    imageUrl: z.string().nullable(),
});
export type Category = z.infer<typeof categorySchema>;

// Schema for a single Product based on the Laravel ProductResource
// Note: price is a number (float cast in the API Resource).
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

// Schema for the User model
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
    name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
    email: z.string().email({ message: "Por favor ingresa un correo electrónico válido." }),
    password: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres." }),
});
export type RegisterFormData = z.infer<typeof registerFormSchema>;

// Schema for the login form
export const loginFormSchema = z.object({
    email: z.string().email({ message: "Por favor ingresa un correo electrónico válido." }),
    password: z.string().min(1, { message: "La contraseña es obligatoria." }),
});
export type LoginFormData = z.infer<typeof loginFormSchema>;
