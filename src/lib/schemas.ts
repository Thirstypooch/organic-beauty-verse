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

// Order schemas
export const orderItemSchema = z.object({
    id: z.number(),
    productId: z.number(),
    productName: z.string(),
    productImageUrl: z.string().nullable(),
    quantity: z.number(),
    price: z.number(),
});
export type OrderItem = z.infer<typeof orderItemSchema>;

export const orderSchema = z.object({
    id: z.number(),
    status: z.string(),
    total: z.number(),
    shippingAddress: z.object({
        fullName: z.string(),
        street: z.string(),
        city: z.string(),
        state: z.string(),
        zipCode: z.string(),
        phone: z.string(),
    }),
    items: z.array(orderItemSchema),
    createdAt: z.string(),
});
export type Order = z.infer<typeof orderSchema>;

// Shipping address form schema
export const shippingFormSchema = z.object({
    fullName: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
    street: z.string().min(5, { message: "La dirección debe tener al menos 5 caracteres." }),
    city: z.string().min(2, { message: "La ciudad es obligatoria." }),
    state: z.string().min(2, { message: "El estado/provincia es obligatorio." }),
    zipCode: z.string().min(3, { message: "El código postal es obligatorio." }),
    phone: z.string().min(7, { message: "El teléfono debe tener al menos 7 dígitos." }),
});
export type ShippingFormData = z.infer<typeof shippingFormSchema>;
