import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "./ProductCard";
import { useFilterStore } from "@/stores/filterStore";
import { fetchProducts, fetchCategories } from "@/services/api";
import { SortOption } from "@/lib/schemas";
import { motion } from "framer-motion";

const ProductListing = () => {
  const { category: categoryName } = useParams<{ category: string }>();

  const { filters, setCategory, setSortBy } = useFilterStore();

  const {
    data: products,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products", categoryName],
    queryFn: () => fetchProducts(categoryName),
    enabled: !!categoryName,
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const categoryData = categories?.find(
    (c) => c.name.toLowerCase() === categoryName?.toLowerCase()
  );

  useEffect(() => {
    if (categoryName) {
      setCategory(categoryName);
    }
  }, [categoryName, setCategory]);

  const sortedProducts = React.useMemo(() => {
    if (!products) return [];
    return [...products].sort((a, b) => {
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
  }, [products, filters.sortBy]);

  const handleSortChange = (value: string) => {
    setSortBy(value as SortOption);
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
  };

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-red-500">
          Error al cargar los productos. Intenta de nuevo más tarde.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-youorganic-green mb-2">
          {categoryData?.name || <Skeleton className="h-10 w-48" />}
        </h1>
        <p className="text-youorganic-dark/70">
          {categoryData?.description || (
            <Skeleton className="h-5 w-80 mt-2" />
          )}
        </p>
      </div>

      {/* Sort bar + product count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-youorganic-dark text-sm sm:text-base">
          {isLoading ? (
            <span className="inline-flex items-center gap-2 text-youorganic-green/70 italic">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-youorganic-green animate-pulse" />
              Cargando tus productos...
            </span>
          ) : (
            `Mostrando ${sortedProducts.length} productos`
          )}
        </p>
        <Select onValueChange={handleSortChange} defaultValue={filters.sortBy}>
          <SelectTrigger className="w-[180px] sm:w-[200px] border-youorganic-light-green">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name-asc">Nombre (A-Z)</SelectItem>
            <SelectItem value="name-desc">Nombre (Z-A)</SelectItem>
            <SelectItem value="price-asc">Precio (Menor a Mayor)</SelectItem>
            <SelectItem value="price-desc">Precio (Mayor a Menor)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Product grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-[3/4] sm:aspect-square w-full rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : sortedProducts.length === 0 ? (
        <div className="bg-white p-8 rounded-xl text-center">
          <p className="text-youorganic-dark mb-2">No se encontraron productos</p>
          <p className="text-youorganic-dark/70 text-sm">
            Explora nuestras otras categorías.
          </p>
        </div>
      ) : (
        <motion.div
          key={categoryName}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {sortedProducts.map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
              <ProductCard
                product={product}
                categoryName={categoryData?.name || "Categoría"}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ProductListing;
