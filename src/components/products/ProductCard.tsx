import { Link } from "react-router-dom";
import { ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { toast } from "@/components/ui/sonner";
import { Product } from "@/lib/schemas";

// The props now require a categoryName to be passed in
interface ProductCardProps {
  product: Product;
  categoryName: string;
}

const ProductCard = ({ product, categoryName }: ProductCardProps) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const addToWishlist = useWishlistStore((state) => state.addToWishlist);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist);

  // Fallback image in case imageUrl is null
  const imageUrl = product.imageUrl || "https://via.placeholder.com/400";
  const categoryUrl = categoryName.toLowerCase();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success("Added to cart", {
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToWishlist(product);
    toast.success("Added to wishlist", {
      description: `${product.name} has been added to your wishlist.`,
    });
  };

  return (
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow group">
        <Link
            to={`/products/${categoryUrl}/${product.id}`}
            className="block relative aspect-square overflow-hidden"
        >
          <img
              src={imageUrl}
              alt={product.name || 'Product Image'}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute top-3 left-3 bg-youorganic-green text-white text-xs px-2 py-1 rounded font-medium">
          {categoryName}
        </span>
        </Link>
        <div className="p-4">
          <Link
              to={`/products/${categoryUrl}/${product.id}`}
              className="block"
          >
            <h3 className="font-serif text-lg font-semibold mb-1 text-youorganic-dark hover:text-youorganic-green transition-colors truncate">
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
                  onClick={handleAddToWishlist}
              >
                <Heart size={20} />
              </Button>
              <Button
                  variant="default"
                  size="icon"
                  className="rounded-full bg-youorganic-green hover:bg-youorganic-green/90"
                  onClick={handleAddToCart}
              >
                <ShoppingCart size={18} />
              </Button>
            </div>
          </div>
        </div>
      </div>
  );
};

export default ProductCard;