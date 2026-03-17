import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, Heart } from "lucide-react";
import { fetchFeaturedProducts, fetchCategories } from "@/services/api";
import { toast } from "@/components/ui/sonner";
import { Product } from "@/lib/schemas";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const ProductCardSkeleton = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
    <Skeleton className="aspect-[3/4] w-full" />
    <div className="p-4 space-y-3">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/3" />
      <div className="flex items-center justify-between pt-1">
        <Skeleton className="h-9 w-28 rounded-full" />
        <Skeleton className="h-9 w-9 rounded-full" />
      </div>
    </div>
  </div>
);

const FeaturedProducts = () => {
  const { data: products, isLoading } = useQuery({
    queryKey: ["products", "featured"],
    queryFn: fetchFeaturedProducts,
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const addToCart = useCartStore((state) => state.addToCart);
  const addToWishlist = useWishlistStore((state) => state.addToWishlist);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist);

  const getCategoryName = (categoryId: number) => {
    return categories?.find((c) => c.id === categoryId)?.name || "Productos";
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast.success("Agregado al carrito", {
      description: `${product.name} se agregó a tu carrito.`,
    });
  };

  const handleAddToWishlist = (product: Product) => {
    addToWishlist(product);
    toast.success("Agregado a favoritos", {
      description: `${product.name} se agregó a tu lista de deseos.`,
    });
  };

  return (
    <section className="py-14 md:py-20 bg-youorganic-cream/40">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <motion.div
          className="text-center mb-10 md:mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-youorganic-green mb-3">
            Productos Destacados
          </h2>
          <p className="text-youorganic-dark/70 max-w-lg mx-auto text-sm md:text-base">
            Nuestras soluciones orgánicas más vendidas y preferidas por nuestras
            clientas
          </p>
        </motion.div>

        {/* Product grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {products?.map((product) => {
              const categoryName = getCategoryName(product.categoryId);
              const wishlisted = isInWishlist(product.id);

              return (
                <motion.div
                  key={product.id}
                  variants={cardVariants}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group"
                >
                  {/* Image */}
                  <Link
                    to={`/products/${categoryName.toLowerCase()}/${product.id}`}
                    className="block relative aspect-[3/4] overflow-hidden"
                  >
                    <img
                      src={product.imageUrl || "https://via.placeholder.com/400x533"}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute top-3 left-3 bg-youorganic-green/90 text-white text-xs px-2.5 py-1 rounded-full font-medium backdrop-blur-sm">
                      {categoryName}
                    </span>
                  </Link>

                  {/* Info */}
                  <div className="p-4">
                    <Link
                      to={`/products/${categoryName.toLowerCase()}/${product.id}`}
                      className="block"
                    >
                      <h3 className="font-serif text-base md:text-lg font-semibold text-youorganic-dark hover:text-youorganic-green transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>

                    <span className="block text-lg font-bold text-youorganic-green mt-1">
                      ${product.price.toFixed(2)}
                    </span>

                    <div className="flex items-center justify-between mt-3 gap-2">
                      <Button
                        size="sm"
                        className="flex-1 rounded-full bg-youorganic-green hover:bg-youorganic-green/90 text-white text-xs md:text-sm gap-1.5"
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingCart size={16} />
                        Agregar
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className={`shrink-0 rounded-full border border-youorganic-beige hover:bg-youorganic-cream ${
                          wishlisted
                            ? "text-red-500 bg-red-50"
                            : "text-youorganic-dark/50 hover:text-youorganic-green"
                        }`}
                        onClick={() => handleAddToWishlist(product)}
                      >
                        <Heart
                          size={18}
                          className={wishlisted ? "fill-current" : ""}
                        />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          className="text-center mt-10 md:mt-14"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Button
            asChild
            variant="outline"
            className="rounded-full px-8 border-youorganic-green text-youorganic-green hover:bg-youorganic-green hover:text-white transition-colors"
          >
            <Link to="/products/facial">Ver Todos</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
