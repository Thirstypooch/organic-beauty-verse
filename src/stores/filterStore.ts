
import { create } from "zustand";
import { ProductFilter, SortOption } from "../types/product";

interface FilterState {
  filters: ProductFilter;
  setCategory: (category: string | undefined) => void;
  setPriceRange: (min: number | undefined, max: number | undefined) => void;
  setSortBy: (sortBy: SortOption | undefined) => void;
  setSearch: (search: string | undefined) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  filters: {
    category: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    sortBy: undefined,
    search: undefined,
  },
  setCategory: (category) => {
    set((state) => ({
      filters: { ...state.filters, category },
    }));
  },
  setPriceRange: (min, max) => {
    set((state) => ({
      filters: { ...state.filters, minPrice: min, maxPrice: max },
    }));
  },
  setSortBy: (sortBy) => {
    set((state) => ({
      filters: { ...state.filters, sortBy },
    }));
  },
  setSearch: (search) => {
    set((state) => ({
      filters: { ...state.filters, search },
    }));
  },
  resetFilters: () => {
    set({
      filters: {
        category: undefined,
        minPrice: undefined,
        maxPrice: undefined,
        sortBy: undefined,
        search: undefined,
      },
    });
  },
}));
