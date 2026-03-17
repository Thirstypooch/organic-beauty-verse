import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FilterIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ProductCard from "./ProductCard";
import { useFilterStore } from "@/stores/filterStore";
import { fetchProducts, fetchCategories } from "@/services/api";
import { SortOption } from "@/lib/schemas";
import { motion } from "framer-motion";

const ProductListing = () => {
  const { category: categoryName } = useParams<{ category: string }>();
  const [localPriceRange, setLocalPriceRange] = useState([0, 100]);

  const { filters, setCategory, setPriceRange, setSortBy } = useFilterStore();

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

  /* ---------- Contenido compartido de filtros ---------- */
  const filterContent = (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-3 text-youorganic-dark">
          Rango de Precio
        </h3>
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

      <Separator className="bg-youorganic-light-green/30" />

      <div>
        <h3 className="font-medium mb-3 text-youorganic-dark">Ordenar por</h3>
        <Select onValueChange={handleSortChange} defaultValue={filters.sortBy}>
          <SelectTrigger className="w-full border-youorganic-light-green">
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
    </div>
  );

  /* ---------- Variantes de animación stagger ---------- */
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
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
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
      {/* Encabezado de categoría */}
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

      <div className="flex flex-col lg:flex-row gap-8">
        {/* ---- Filtros móvil: Sheet slide-up ---- */}
        <div className="lg:hidden mb-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="w-full min-h-[44px] flex items-center justify-center gap-2 border-youorganic-light-green text-youorganic-dark"
              >
                <FilterIcon size={18} />
                Filtros y Orden
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-2xl bg-youorganic-cream">
              <SheetHeader>
                <SheetTitle className="font-serif text-youorganic-dark">
                  Filtros
                </SheetTitle>
              </SheetHeader>
              <div className="py-4">{filterContent}</div>
            </SheetContent>
          </Sheet>
        </div>

        {/* ---- Filtros escritorio: sidebar ---- */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-white p-6 rounded-xl shadow-md sticky top-24">
            <h2 className="font-serif text-xl font-semibold mb-4 text-youorganic-dark">
              Filtros
            </h2>
            {filterContent}
          </div>
        </aside>

        {/* ---- Contenido principal ---- */}
        <div className="flex-1">
          {/* Barra superior: contador + sort (solo escritorio) */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-youorganic-dark text-sm sm:text-base">
              Mostrando {sortedProducts.length} productos
            </p>
            <div className="hidden lg:block">
              <Select
                onValueChange={handleSortChange}
                defaultValue={filters.sortBy}
              >
                <SelectTrigger className="w-[200px] border-youorganic-light-green">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name-asc">Nombre (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Nombre (Z-A)</SelectItem>
                  <SelectItem value="price-asc">
                    Precio (Menor a Mayor)
                  </SelectItem>
                  <SelectItem value="price-desc">
                    Precio (Mayor a Menor)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Grid de productos */}
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
              <p className="text-youorganic-dark mb-2">
                No se encontraron productos
              </p>
              <p className="text-youorganic-dark/70 text-sm">
                Intenta ajustar los filtros o explora nuestras otras categorías.
              </p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
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
      </div>
    </div>
  );
};

export default ProductListing;
