
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FilterIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { getProductsByCategory, getCategoryByName } from "@/data/mockProducts";
import { ProductFilter, SortOption } from "@/types/product";
import ProductCard from "./ProductCard";
import { useFilterStore } from "@/stores/filterStore";

const ProductListing = () => {
  const { category } = useParams<{ category: string }>();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [localPriceRange, setLocalPriceRange] = useState([0, 100]);
  const filters = useFilterStore((state) => state.filters);
  const setCategory = useFilterStore((state) => state.setCategory);
  const setPriceRange = useFilterStore((state) => state.setPriceRange);
  const setSortBy = useFilterStore((state) => state.setSortBy);
  
  const categoryData = category ? getCategoryByName(category) : null;
  const allProducts = category ? getProductsByCategory(category) : [];

  // Apply filters and sorting
  const filteredProducts = allProducts.filter((product) => {
    if (filters.minPrice && product.price < filters.minPrice) return false;
    if (filters.maxPrice && product.price > filters.maxPrice) return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
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

  useEffect(() => {
    if (category) {
      setCategory(category);
    }
  }, [category, setCategory]);

  const handlePriceChange = (values: number[]) => {
    setLocalPriceRange(values);
    setPriceRange(values[0], values[1]);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value as SortOption);
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  if (!categoryData) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p>Category not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-youorganic-green mb-2">
          {categoryData.name}
        </h1>
        <p className="text-youorganic-dark/70">
          {categoryData.description}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-4">
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2 border-youorganic-light-green text-youorganic-dark"
            onClick={toggleFilter}
          >
            <FilterIcon size={18} />
            {isFilterOpen ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>

        {/* Filters Sidebar */}
        <aside 
          className={`w-full lg:w-64 ${isFilterOpen ? 'block' : 'hidden'} lg:block`}
        >
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="font-serif text-xl font-semibold mb-4 text-youorganic-dark">
              Filters
            </h2>

            <div className="mb-6">
              <h3 className="font-medium mb-3 text-youorganic-dark">Price Range</h3>
              <Slider 
                defaultValue={localPriceRange} 
                max={100} 
                step={1} 
                onValueChange={handlePriceChange}
                className="mb-4"
              />
              <div className="flex justify-between text-sm text-youorganic-dark/70">
                <span>${localPriceRange[0]}</span>
                <span>${localPriceRange[1]}</span>
              </div>
            </div>

            <Separator className="my-6 bg-youorganic-light-green/30" />

            {/* More filters can be added here */}
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {/* Sorting and Results Count */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <p className="text-youorganic-dark mb-4 sm:mb-0">
              {sortedProducts.length} products
            </p>

            <Select onValueChange={handleSortChange} defaultValue={filters.sortBy || "name-asc"}>
              <SelectTrigger className="w-[180px] border-youorganic-light-green">
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

          {/* Products */}
          {sortedProducts.length === 0 ? (
            <div className="bg-white p-8 rounded-lg text-center">
              <p className="text-youorganic-dark mb-2">No products found</p>
              <p className="text-youorganic-dark/70 text-sm">
                Try adjusting your filters or check out our other categories.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListing;
