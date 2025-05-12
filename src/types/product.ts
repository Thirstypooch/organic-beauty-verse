
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  howToUse?: string;
  warnings?: string;
  imageUrl: string;
  ingredients?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
}

export type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc';

export interface ProductFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: SortOption;
  search?: string;
}
