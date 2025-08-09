import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FilterIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "./ProductCard";
import { useFilterStore } from "@/stores/filterStore";
import { fetchProducts, fetchCategories } from "@/services/api";
import { SortOption } from "@/lib/schemas";

const ProductListing = () => {
  const { category: categoryName } = useParams<{ category: string }>();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [localPriceRange, setLocalPriceRange] = useState([0, 100]);

  const { filters, setCategory, setPriceRange, setSortBy } = useFilterStore();

  // Fetch products for the current category using TanStack Query
  const { data: products, isLoading, isError } = useQuery({
    queryKey: ['products', categoryName],
    queryFn: () => fetchProducts(categoryName),
    enabled: !!categoryName, // Only run the query if categoryName is defined
  });

  // Fetch all categories to get the current category's description for the header
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const categoryData = categories?.find(c => c.name.toLowerCase() === categoryName?.toLowerCase());

  useEffect(() => {
    if (categoryName) {
      setCategory(categoryName);
    }
  }, [categoryName, setCategory]);

  // Memoize filtered and sorted products to avoid re-calculating on every render
  const filteredProducts = React.useMemo(() => {
    if (!products) return [];
    return products.filter((product) => {
      const { minPrice, maxPrice } = filters;
      if (minPrice !== undefined && product.price < minPrice) return false;
      if (maxPrice !== undefined && product.price > maxPrice) return false;
      return true;
    });
  }, [products, filters]);

  const sortedProducts = React.useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      switch (filters.sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        default:
          return 0;
      }
    });
  }, [filteredProducts, filters.sortBy]);

  const handlePriceCommit = (values: number[]) => {
    setPriceRange(values[0], values[1]);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value as SortOption);
  };

  if (isError) {
    return (
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-red-500">Failed to load products. Please try again later.</p>
        </div>
    );
  }

  return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-youorganic-green mb-2">
            {categoryData?.name || <Skeleton className="h-10 w-48" />}
          </h1>
          <p className="text-youorganic-dark/70">
            {categoryData?.description || <Skeleton className="h-5 w-80 mt-2" />}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:hidden mb-4">
            <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2 border-youorganic-light-green text-youorganic-dark"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <FilterIcon size={18} />
              {isFilterOpen ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>

          <aside className={`w-full lg:w-64 ${isFilterOpen ? 'block' : 'hidden'} lg:block transition-all`}>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="font-serif text-xl font-semibold mb-4 text-youorganic-dark">Filters</h2>
              <div className="mb-6">
                <h3 className="font-medium mb-3 text-youorganic-dark">Price Range</h3>
                <Slider
                    value={localPriceRange}
                    max={100}
                    step={1}
                    onValueChange={setLocalPriceRange}
                    onValueCommit={handlePriceCommit}
                    className="mb-4"
                />
                <div className="flex justify-between text-sm text-youorganic-dark/70">
                  <span>${localPriceRange[0]}</span>
                  <span>${localPriceRange[1]}</span>
                </div>
              </div>
              <Separator className="my-6 bg-youorganic-light-green/30" />
            </div>
          </aside>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <p className="text-youorganic-dark mb-4 sm:mb-0">
                Showing {sortedProducts.length} products
              </p>
              <Select onValueChange={handleSortChange} defaultValue={filters.sortBy}>
                <SelectTrigger className="w-full sm:w-[180px] border-youorganic-light-green">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                  <SelectItem value="price-asc">Price (Low to High)</SelectItem>
                  <SelectItem value="price-desc">Price (High to Low)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-48 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                  ))}
                </div>
            ) : sortedProducts.length === 0 ? (
                <div className="bg-white p-8 rounded-lg text-center">
                  <p className="text-youorganic-dark mb-2">No products found</p>
                  <p className="text-youorganic-dark/70 text-sm">
                    Try adjusting your filters or check out our other categories.
                  </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedProducts.map((product) => (
                      <ProductCard
                          key={product.id}
                          product={product}
                          categoryName={categoryData?.name || 'Category'}
                      />
                  ))}
                </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default ProductListing;