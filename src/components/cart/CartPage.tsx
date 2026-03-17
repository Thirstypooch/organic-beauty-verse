import { useCartStore } from "@/stores/cartStore";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, getTotal } = useCartStore();

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId: number) => {
    removeFromCart(productId);
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-center mb-4">
            <div className="bg-youorganic-cream p-4 rounded-full">
              <ShoppingBag size={32} className="text-youorganic-green" />
            </div>
          </div>
          <h1 className="font-serif text-2xl font-bold mb-4 text-youorganic-dark">
            Tu Carrito está Vacío
          </h1>
          <p className="text-youorganic-dark/70 mb-6">
            Parece que aún no has agregado productos a tu carrito.
          </p>
          <Button
            asChild
            className="bg-youorganic-green hover:bg-youorganic-green/90 text-white"
          >
            <Link to="/">Seguir Comprando</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="font-serif text-3xl font-bold mb-8 text-youorganic-green">
        Carrito de Compras
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="hidden md:grid md:grid-cols-5 text-sm font-medium text-youorganic-dark/70 mb-4">
                <span className="col-span-2">Producto</span>
                <span className="text-center">Precio</span>
                <span className="text-center">Cantidad</span>
                <span className="text-right">Total</span>
              </div>

              <Separator className="mb-6 bg-youorganic-light-green/30" />

              {cart.items.map((item) => (
                <div key={item.product.id} className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                    <div className="col-span-2 flex items-center space-x-4">
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

                    <div className="md:text-center">
                      <span className="md:hidden text-youorganic-dark/70 text-sm">
                        Precio:
                      </span>
                      <span className="font-medium text-youorganic-green">
                        {formatCurrency(item.product.price)}
                      </span>
                    </div>

                    <div className="flex items-center md:justify-center">
                      <div className="flex items-center border border-youorganic-light-green rounded-md">
                        <button
                          onClick={() =>
                            handleQuantityChange(item.product.id, item.quantity - 1)
                          }
                          className="px-2 py-1 text-youorganic-green"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-4 py-1 text-youorganic-dark">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityChange(item.product.id, item.quantity + 1)
                          }
                          className="px-2 py-1 text-youorganic-green"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center md:justify-end">
                      <span className="md:hidden text-youorganic-dark/70 text-sm">
                        Total:
                      </span>
                      <div className="flex items-center">
                        <span className="font-medium text-youorganic-dark">
                          {formatCurrency(item.product.price * item.quantity)}
                        </span>
                        <button
                          onClick={() => handleRemoveItem(item.product.id)}
                          className="ml-3 p-1 text-youorganic-dark/70 hover:text-youorganic-green"
                          aria-label="Eliminar producto"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                  {cart.items.indexOf(item) < cart.items.length - 1 && (
                    <Separator className="my-6 bg-youorganic-light-green/30" />
                  )}
                </div>
              ))}
            </div>

            <div className="bg-youorganic-cream/40 p-6 flex justify-between items-center">
              <Button
                variant="outline"
                className="border-youorganic-green text-youorganic-green hover:bg-youorganic-green/10"
                onClick={() => clearCart()}
              >
                Vaciar Carrito
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

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="font-serif text-xl font-semibold mb-4 text-youorganic-dark">
              Resumen del Pedido
            </h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-youorganic-dark">
                <span>Subtotal</span>
                <span>{formatCurrency(getTotal())}</span>
              </div>
              <div className="flex justify-between text-youorganic-dark">
                <span>Envío</span>
                <span>Se calcula al finalizar</span>
              </div>
              <Separator className="my-3 bg-youorganic-light-green/30" />
              <div className="flex justify-between font-semibold text-youorganic-dark">
                <span>Total</span>
                <span>{formatCurrency(getTotal())}</span>
              </div>
            </div>

            <Button
              asChild
              className="w-full bg-youorganic-green hover:bg-youorganic-green/90 text-white"
            >
              <Link to="/checkout">Proceder al Pago</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
