import { useWishlistStore } from "@/stores/wishlistStore";
import { useCartStore } from "@/stores/cartStore";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Trash2, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/sonner";

const WishlistPage = () => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlistStore();
  const addToCart = useCartStore((state) => state.addToCart);

  const handleRemoveItem = (productId: number) => {
    removeFromWishlist(productId);
  };

  const handleAddToCart = (productId: number) => {
    const product = wishlist.items.find(
      (item) => item.product.id === productId
    )?.product;

    if (product) {
      addToCart(product);
      toast.success("Agregado al carrito", {
        description: `${product.name} se agregó a tu carrito.`,
      });
    }
  };

  if (wishlist.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-center mb-4">
            <div className="bg-youorganic-cream p-4 rounded-full">
              <Heart size={32} className="text-youorganic-green" />
            </div>
          </div>
          <h1 className="font-serif text-2xl font-bold mb-4 text-youorganic-dark">
            Tu Lista de Deseos está Vacía
          </h1>
          <p className="text-youorganic-dark/70 mb-6">
            Guarda tus productos favoritos aquí para encontrarlos más fácilmente.
          </p>
          <Button
            asChild
            className="bg-youorganic-green hover:bg-youorganic-green/90 text-white"
          >
            <Link to="/">Explorar Productos</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="font-serif text-3xl font-bold mb-8 text-youorganic-green">
        Mi Lista de Deseos
      </h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="hidden md:grid md:grid-cols-12 text-sm font-medium text-youorganic-dark/70 mb-4">
            <span className="col-span-6">Producto</span>
            <span className="col-span-2 text-center">Precio</span>
            <span className="col-span-2 text-center">Fecha</span>
            <span className="col-span-2 text-right">Acciones</span>
          </div>

          <Separator className="mb-6 bg-youorganic-light-green/30" />

          {wishlist.items.map((item) => (
            <div key={item.product.id} className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="col-span-6 flex items-center space-x-4">
                  <div className="w-20 h-20 bg-youorganic-cream rounded-md overflow-hidden">
                    <img
                      src={item.product.imageUrl || "https://via.placeholder.com/100"}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="font-medium text-youorganic-dark line-clamp-2">
                      {item.product.name}
                    </span>
                  </div>
                </div>

                <div className="col-span-2 md:text-center">
                  <span className="md:hidden text-youorganic-dark/70 text-sm">
                    Precio:
                  </span>
                  <span className="font-medium text-youorganic-green">
                    ${item.product.price.toFixed(2)}
                  </span>
                </div>

                <div className="col-span-2 md:text-center">
                  <span className="md:hidden text-youorganic-dark/70 text-sm">
                    Fecha:
                  </span>
                  <span className="text-youorganic-dark/70 text-sm">
                    {new Date(item.addedAt).toLocaleDateString('es')}
                  </span>
                </div>

                <div className="col-span-2 flex justify-between md:justify-end items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-youorganic-green text-youorganic-green hover:bg-youorganic-green/10"
                    onClick={() => handleAddToCart(item.product.id)}
                  >
                    <ShoppingCart size={16} className="mr-1" />
                    <span className="hidden sm:inline">Agregar</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-youorganic-dark/70 hover:text-youorganic-green"
                    onClick={() => handleRemoveItem(item.product.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
              {wishlist.items.indexOf(item) < wishlist.items.length - 1 && (
                <Separator className="my-6 bg-youorganic-light-green/30" />
              )}
            </div>
          ))}
        </div>

        <div className="bg-youorganic-cream/40 p-6 flex justify-between items-center">
          <Button
            variant="outline"
            className="border-youorganic-green text-youorganic-green hover:bg-youorganic-green/10"
            onClick={() => clearWishlist()}
          >
            Vaciar Lista
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-youorganic-green text-youorganic-green hover:bg-youorganic-green/10"
          >
            <Link to="/">Seguir Comprando</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
