import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Category } from "@/lib/schemas";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut",
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
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <Skeleton className="h-8 w-64 mx-auto mb-3 rounded-lg" />
          <Skeleton className="h-5 w-80 mx-auto mb-10 rounded-lg" />

          {/* Mobile: horizontal scroll skeletons */}
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide md:hidden pb-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton
                key={i}
                className="min-w-[160px] h-48 rounded-xl flex-shrink-0 snap-start"
              />
            ))}
          </div>

          {/* Desktop: grid skeletons */}
          <div className="hidden md:grid md:grid-cols-3 gap-6">
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
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          className="text-center mb-8 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-youorganic-green mb-3">
            Explora Nuestras Categorías
          </h2>
          <p className="text-youorganic-dark/80 max-w-xl mx-auto text-sm md:text-base">
            Descubre nuestra gama de soluciones orgánicas para el cuidado de la piel
          </p>
        </motion.div>

        {/* Mobile: horizontal scroll strip */}
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide md:hidden pb-4 -mx-4 px-4">
          {categories?.map((category: Category, i: number) => (
            <motion.div
              key={category.id}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex-shrink-0 snap-start"
            >
              <Link
                to={`/products/${category.name.toLowerCase()}`}
                className="block relative w-[160px] h-48 rounded-xl overflow-hidden shadow-md active:scale-95 transition-transform"
              >
                <img
                  src={category.imageUrl ?? ""}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-youorganic-dark/75 via-youorganic-dark/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="text-white font-serif text-base font-semibold leading-tight">
                    {category.name}
                  </h3>
                  <span className="text-white/70 text-xs mt-1 inline-block">
                    Ver más
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Tablet / Desktop: grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-6">
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
