import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Category } from "@/lib/schemas";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.08,
      duration: 0.5,
      ease: "easeOut" as const,
    },
  }),
};

const CategoryShowcase = () => {
  const { data: categories, isLoading, isError } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  if (isLoading) {
    return (
      <section className="py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4">
          <Skeleton className="h-8 w-64 mx-auto mb-3 rounded-lg" />
          <Skeleton className="h-5 w-80 mx-auto mb-10 rounded-lg" />

          {/* Mobile/Tablet: 2-col skeleton */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[3/4] w-full rounded-2xl" />
            ))}
          </div>

          {/* Desktop: 3-col skeleton */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12 text-youorganic-dark/70">
        No se pudieron cargar las categorías.
      </div>
    );
  }

  return (
    <section id="categorias" className="py-12 lg:py-16 bg-white scroll-mt-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          className="text-center mb-8 lg:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-youorganic-green mb-3">
            Explora Nuestras Categorías
          </h2>
          <p className="text-youorganic-dark/80 max-w-xl mx-auto text-sm lg:text-base">
            Descubre nuestra gama de soluciones orgánicas para el cuidado de la piel
          </p>
        </motion.div>

        {/* Mobile/Tablet: 2-col grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:hidden">
          {categories?.map((category: Category, i: number) => (
            <motion.div
              key={category.id}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-30px" }}
            >
              <Link
                to={`/products/${category.name.toLowerCase()}`}
                className="block relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md active:scale-[0.98] transition-transform duration-150"
              >
                <img
                  src={category.imageUrl ?? ""}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-youorganic-dark/80 via-youorganic-dark/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                  <h3 className="text-white font-serif text-base sm:text-lg font-semibold leading-tight">
                    {category.name}
                  </h3>
                  <p className="text-white/70 text-[11px] sm:text-xs mt-1 line-clamp-1">
                    {category.description}
                  </p>
                  <span className="text-white/80 text-[11px] sm:text-xs mt-1.5 inline-block font-medium">
                    Ver Colección →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Desktop: 3-col grid */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6">
          {categories?.map((category: Category, i: number) => (
            <motion.div
              key={category.id}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
            >
              <Link
                to={`/products/${category.name.toLowerCase()}`}
                className="group relative block rounded-xl overflow-hidden h-64 shadow-md hover:shadow-xl transition-shadow"
              >
                <img
                  src={category.imageUrl ?? ""}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-youorganic-dark/70 to-transparent flex items-end p-6">
                  <div className="w-full">
                    <h3 className="text-white font-serif text-2xl font-semibold mb-1">
                      {category.name}
                    </h3>
                    <p className="text-white/80 text-sm line-clamp-2">
                      {category.description}
                    </p>
                    <div className="mt-2 inline-block text-white text-sm border-b border-white/0 group-hover:border-white transition-all duration-300">
                      Ver Colección
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase;
