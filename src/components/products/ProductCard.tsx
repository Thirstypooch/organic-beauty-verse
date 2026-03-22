import { Link } from "react-router-dom";
import { ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { toast } from "@/components/ui/sonner";
import { Product } from "@/lib/schemas";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
  categoryName: string;
}

const ProductCard = ({ product, categoryName }: ProductCardProps) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const addToWishlist = useWishlistStore((state) => state.addToWishlist);
  const removeFromWishlist = useWishlistStore((state) => state.removeFromWishlist);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist);

  const imageUrl = product.imageUrl || "/placeholder.svg";
  const categoryUrl = categoryName.toLowerCase();
  const wishlisted = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success("Agregado al carrito", {
      description: `${product.name} se agregó a tu carrito.`,
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (wishlisted) {
      removeFromWishlist(product.id);
      toast.success("Eliminado de favoritos", {
        description: `${product.name} se eliminó de tu lista de deseos.`,
      });
    } else {
      addToWishlist(product);
      toast.success("Agregado a favoritos", {
        description: `${product.name} se agregó a tu lista de deseos.`,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group"
    >
      <Link
        to={`/products/${categoryUrl}/${product.id}`}
        className="block relative aspect-square overflow-hidden"
      >
        <div className="absolute inset-0 bg-youorganic-cream animate-pulse" />
        <img
          src={imageUrl}
          alt={product.name || "Imagen del producto"}
          className="relative w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Insignia de categoría — esquina superior izquierda */}
        <span className="absolute top-3 left-3 bg-youorganic-green text-white text-xs px-2.5 py-1 rounded-full font-medium">
          {categoryName}
        </span>

        {/* Botón de favoritos — esquina superior derecha */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          className={`absolute top-3 right-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm transition-colors ${
            wishlisted
              ? "text-youorganic-green"
              : "text-youorganic-dark/50 hover:text-youorganic-green"
          }`}
          aria-label={wishlisted ? "Quitar de favoritos" : "Agregar a favoritos"}
        >
          <Heart
            size={22}
            fill={wishlisted ? "#B8919F" : "none"}
            strokeWidth={wishlisted ? 0 : 2}
          />
        </button>
      </Link>

      <div className="p-4">
        <Link to={`/products/${categoryUrl}/${product.id}`} className="block">
          <h3 className="font-serif text-sm sm:text-base lg:text-lg font-semibold mb-1 text-youorganic-dark group-hover:text-youorganic-green transition-colors truncate">
            {product.name}
          </h3>
        </Link>

        <span className="block text-base sm:text-lg font-semibold text-youorganic-green mb-3">
          ${product.price.toFixed(2)}
        </span>

        <Button
          onClick={handleAddToCart}
          className="w-full sm:w-auto min-h-[44px] bg-youorganic-green hover:bg-youorganic-green/90 text-white rounded-lg flex items-center justify-center gap-2"
        >
          <ShoppingCart size={18} />
          <span className="hidden sm:inline">Agregar al carrito</span>
        </Button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
