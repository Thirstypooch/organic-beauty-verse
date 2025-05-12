
import { Link } from "react-router-dom";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart } from "lucide-react";
import { getFeaturedProducts } from "@/data/mockProducts";
import { toast } from "@/components/ui/sonner";

const FeaturedProducts = () => {
  const products = getFeaturedProducts();
  const addToCart = useCartStore((state) => state.addToCart);
  const addToWishlist = useWishlistStore((state) => state.addToWishlist);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist);

  const handleAddToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      addToCart(product);
      toast.success("Added to cart", {
        description: `${product.name} has been added to your cart.`,
      });
    }
  };

  const handleAddToWishlist = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      addToWishlist(product);
      toast.success("Added to wishlist", {
        description: `${product.name} has been added to your wishlist.`,
      });
    }
  };

  return (
    <section className="py-12 md:py-16 bg-youorganic-cream/40">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-youorganic-green mb-4">
            Featured Products
          </h2>
          <p className="text-youorganic-dark/80 max-w-xl mx-auto">
            Our bestselling organic skincare solutions loved by customers
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow group"
            >
              <Link
                to={`/products/${product.category.toLowerCase()}/${product.id}`}
                className="block relative aspect-square overflow-hidden"
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 bg-youorganic-green text-white text-xs px-2 py-1 rounded font-medium">
                  {product.category}
                </span>
              </Link>
              <div className="p-4">
                <Link
                  to={`/products/${product.category.toLowerCase()}/${product.id}`}
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
                      onClick={() => handleAddToWishlist(product.id)}
                    >
                      <Heart size={20} />
                    </Button>
                    <Button
                      variant="default"
                      size="icon"
                      className="rounded-full bg-youorganic-green hover:bg-youorganic-green/90"
                      onClick={() => handleAddToCart(product.id)}
                    >
                      <ShoppingCart size={18} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button
            asChild
            variant="outline"
            className="border-youorganic-green text-youorganic-green hover:bg-youorganic-green/10"
          >
            <Link to="/products/facial">Shop All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
