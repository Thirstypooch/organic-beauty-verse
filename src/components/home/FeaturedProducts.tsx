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

const FeaturedProducts = () => {
  const { data: products, isLoading } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: fetchFeaturedProducts,
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
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
    <section className="py-12 md:py-16 bg-youorganic-cream/40">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-youorganic-green mb-4">
            Productos Destacados
          </h2>
          <p className="text-youorganic-dark/80 max-w-xl mx-auto">
            Nuestras soluciones orgánicas más vendidas y preferidas por nuestras clientas
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="aspect-square w-full" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))
            : products?.map((product) => {
                const categoryName = getCategoryName(product.categoryId);
                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow group"
                  >
                    <Link
                      to={`/products/${categoryName.toLowerCase()}/${product.id}`}
                      className="block relative aspect-square overflow-hidden"
                    >
                      <img
                        src={product.imageUrl || "https://via.placeholder.com/400"}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute top-3 left-3 bg-youorganic-green text-white text-xs px-2 py-1 rounded font-medium">
                        {categoryName}
                      </span>
                    </Link>
                    <div className="p-4">
                      <Link
                        to={`/products/${categoryName.toLowerCase()}/${product.id}`}
                        className="block"
                      >
                        <h3 className="font-serif text-lg font-semibold mb-1 text-youorganic-dark hover:text-youorganic-green transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-youorganic-light-brown mb-3 text-sm line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-youorganic-green">
                          ${product.price.toFixed(2)}
                        </span>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`rounded-full hover:bg-youorganic-cream hover:text-youorganic-green ${
                              isInWishlist(product.id)
                                ? "text-youorganic-green"
                                : "text-youorganic-dark"
                            }`}
                            onClick={() => handleAddToWishlist(product)}
                          >
                            <Heart size={20} />
                          </Button>
                          <Button
                            variant="default"
                            size="icon"
                            className="rounded-full bg-youorganic-green hover:bg-youorganic-green/90"
                            onClick={() => handleAddToCart(product)}
                          >
                            <ShoppingCart size={18} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>

        <div className="text-center mt-10">
          <Button
            asChild
            variant="outline"
            className="border-youorganic-green text-youorganic-green hover:bg-youorganic-green/10"
          >
            <Link to="/products/facial">Ver Todos los Productos</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
