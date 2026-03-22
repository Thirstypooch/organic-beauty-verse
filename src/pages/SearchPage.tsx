import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/products/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchProducts, fetchCategories } from "@/services/api";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.toLowerCase() || "";

  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProducts(),
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const getCategoryName = (categoryId: number) =>
    categories?.find((c) => c.id === categoryId)?.name || "Productos";

  const filtered = products?.filter(
    (p) =>
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
  ) || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-youorganic-cream/30">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="font-serif text-2xl lg:text-3xl font-bold text-youorganic-green mb-2">
              Resultados de búsqueda
            </h1>
            <p className="text-youorganic-dark/60 text-sm">
              {isLoading
                ? "Buscando..."
                : `${filtered.length} resultado${filtered.length !== 1 ? "s" : ""} para "${searchParams.get("q") || ""}"`}
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="aspect-square w-full rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <Search size={48} className="mx-auto mb-4 text-youorganic-dark/20" />
              <p className="text-youorganic-dark/60 mb-2">
                No encontramos productos que coincidan con tu búsqueda.
              </p>
              <p className="text-youorganic-dark/40 text-sm">
                Intenta con otros términos como "serum", "aceite" o "crema".
              </p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.08 } },
              }}
            >
              {filtered.map((product) => (
                <motion.div
                  key={product.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
                  }}
                >
                  <ProductCard
                    product={product}
                    categoryName={getCategoryName(product.categoryId)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SearchPage;
