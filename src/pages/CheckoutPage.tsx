import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ShippingFormData, shippingFormSchema, Order } from "@/lib/schemas";
import { createOrder } from "@/services/api";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CheckCircle, Package, MapPin, CreditCard } from "lucide-react";

type Step = "shipping" | "review" | "confirmation";

const STEPS: { key: Step; label: string; icon: React.ReactNode }[] = [
  { key: "shipping", label: "Envío", icon: <MapPin size={18} /> },
  { key: "review", label: "Revisión", icon: <CreditCard size={18} /> },
  { key: "confirmation", label: "Confirmación", icon: <CheckCircle size={18} /> },
];

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>("shipping");
  const [shippingData, setShippingData] = useState<ShippingFormData | null>(null);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const cartItems = useCartStore((state) => state.cart.items);
  const cartSubtotal = useCartStore((state) => state.cart.subtotal);
  const clearCart = useCartStore((state) => state.clearCart);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingFormSchema),
  });

  const orderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (order) => {
      setCompletedOrder(order);
      clearCart();
      setCurrentStep("confirmation");
      toast.success("Pedido realizado con éxito");
    },
    onError: () => {
      toast.error("Error al procesar el pedido. Intenta de nuevo.");
    },
  });

  const onShippingSubmit = (data: ShippingFormData) => {
    setShippingData(data);
    setCurrentStep("review");
  };

  const onConfirmOrder = () => {
    if (!shippingData) return;
    orderMutation.mutate({
      shippingAddress: shippingData,
      items: cartItems.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
    });
  };

  if (cartItems.length === 0 && currentStep !== "confirmation") {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center bg-youorganic-cream/30 p-4">
          <Card className="max-w-md w-full text-center">
            <CardContent className="pt-8 pb-8">
              <Package size={48} className="mx-auto mb-4 text-youorganic-dark/40" />
              <h2 className="text-xl font-semibold mb-2">Tu carrito está vacío</h2>
              <p className="text-youorganic-dark/60 mb-4">Agrega productos antes de continuar al checkout.</p>
              <Button onClick={() => navigate("/")} className="bg-youorganic-green hover:bg-youorganic-green/90">
                Ver productos
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const stepIndex = STEPS.findIndex((s) => s.key === currentStep);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-youorganic-cream/30 p-4">
        <div className="container mx-auto max-w-2xl">
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-8 mt-4">
            {STEPS.map((step, i) => (
              <div key={step.key} className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    i <= stepIndex
                      ? "bg-youorganic-green text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step.icon}
                  <span className="hidden sm:inline">{step.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-8 h-0.5 ${i < stepIndex ? "bg-youorganic-green" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Shipping */}
          {currentStep === "shipping" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Dirección de envío</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onShippingSubmit)} className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="fullName">Nombre completo</Label>
                    <Input id="fullName" placeholder="María García" className="h-12" {...register("fullName")} />
                    {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName.message}</p>}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="street">Dirección</Label>
                    <Input id="street" placeholder="Calle Ejemplo 123, Piso 2" className="h-12" {...register("street")} />
                    {errors.street && <p className="text-red-500 text-xs">{errors.street.message}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="city">Ciudad</Label>
                      <Input id="city" placeholder="Madrid" className="h-12" {...register("city")} />
                      {errors.city && <p className="text-red-500 text-xs">{errors.city.message}</p>}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="state">Estado / Provincia</Label>
                      <Input id="state" placeholder="Madrid" className="h-12" {...register("state")} />
                      {errors.state && <p className="text-red-500 text-xs">{errors.state.message}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="zipCode">Código postal</Label>
                      <Input id="zipCode" placeholder="28001" className="h-12" inputMode="numeric" {...register("zipCode")} />
                      {errors.zipCode && <p className="text-red-500 text-xs">{errors.zipCode.message}</p>}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input id="phone" type="tel" placeholder="+34 612 345 678" className="h-12" inputMode="tel" {...register("phone")} />
                      {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-12 mt-2 bg-youorganic-green hover:bg-youorganic-green/90 text-base">
                    Continuar a revisión
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Review */}
          {currentStep === "review" && shippingData && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Resumen del pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Shipping summary */}
                  <div>
                    <h3 className="font-medium text-sm text-youorganic-dark/60 mb-1">Enviar a:</h3>
                    <p className="text-sm">{shippingData.fullName}</p>
                    <p className="text-sm">{shippingData.street}</p>
                    <p className="text-sm">{shippingData.city}, {shippingData.state} {shippingData.zipCode}</p>
                    <p className="text-sm">{shippingData.phone}</p>
                  </div>

                  <Separator />

                  {/* Cart items */}
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.product.id} className="flex items-center gap-3">
                        <img
                          src={item.product.imageUrl || "/placeholder.svg"}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.product.name}</p>
                          <p className="text-sm text-youorganic-dark/60">Cantidad: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-semibold whitespace-nowrap">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Total */}
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span>${cartSubtotal.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 h-12"
                  onClick={() => setCurrentStep("shipping")}
                >
                  Volver
                </Button>
                <Button
                  className="flex-1 h-12 bg-youorganic-green hover:bg-youorganic-green/90 text-base"
                  onClick={onConfirmOrder}
                  disabled={orderMutation.isPending}
                >
                  {orderMutation.isPending ? "Procesando..." : "Confirmar pedido"}
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {currentStep === "confirmation" && completedOrder && (
            <Card className="text-center">
              <CardContent className="pt-8 pb-8 space-y-4">
                <CheckCircle size={64} className="mx-auto text-youorganic-green" />
                <h2 className="text-2xl font-bold">¡Pedido confirmado!</h2>
                <p className="text-youorganic-dark/60">
                  Tu pedido #{completedOrder.id} ha sido registrado exitosamente.
                </p>
                <div className="bg-youorganic-cream/50 rounded-lg p-4 text-left space-y-2">
                  <p className="text-sm"><span className="font-medium">Estado:</span> Pendiente</p>
                  <p className="text-sm"><span className="font-medium">Total:</span> ${completedOrder.total.toFixed(2)}</p>
                  <p className="text-sm"><span className="font-medium">Productos:</span> {completedOrder.items.length}</p>
                </div>
                <Button
                  onClick={() => navigate("/")}
                  className="bg-youorganic-green hover:bg-youorganic-green/90"
                >
                  Seguir comprando
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
