import { Link } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '@/services/api';
import { Skeleton } from '@/components/ui/skeleton';

const CategoryShowcase = () => {
  const { data: categories, isLoading, isError } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  if (isLoading) {
    return (
        <section className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-64 w-full rounded-lg" />
              ))}
            </div>
          </div>
        </section>
    );
  }

  if (isError) {
    return <div className="text-center py-12">No se pudieron cargar las categorías.</div>;
  }
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-youorganic-green mb-4">
            Explora Nuestras Categorías
          </h2>
          <p className="text-youorganic-dark/80 max-w-xl mx-auto">
            Descubre nuestra gama de soluciones orgánicas para el cuidado de la piel
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories?.slice(0, 6).map((category) => (
            <Link
              key={category.id}
              to={`/products/${category.name.toLowerCase()}`}
              className="group relative rounded-lg overflow-hidden h-64 shadow-md hover:shadow-xl transition-shadow"
            >
              <img
                src={category.imageUrl}
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase;
