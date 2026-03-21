import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ShippingFormData, shippingFormSchema } from "@/lib/schemas";
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
import { Package, MapPin, CreditCard, Loader2 } from "lucide-react";
import { MERCADOPAGO_PAYMENT_LINK } from "@/lib/constants";

type Step = "shipping" | "review";

const STEPS: { key: Step; label: string; icon: React.ReactNode }[] = [
  { key: "shipping", label: "Envío", icon: <MapPin size={18} /> },
  { key: "review", label: "Pago", icon: <CreditCard size={18} /> },
];

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>("shipping");
  const [shippingData, setShippingData] = useState<ShippingFormData | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
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

  const paymentMutation = useMutation({
    mutationFn: async () => {
      if (!shippingData) throw new Error("No shipping data");

      // Create the order in the backend
      const order = await createOrder({
        shippingAddress: shippingData,
        items: cartItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      });

      return order;
    },
    onSuccess: () => {
      setIsRedirecting(true);
      clearCart();
      toast.success("Pedido registrado. Redirigiendo a MercadoPago...");

      // Redirect to MercadoPago Link de Pago
      window.location.href = MERCADOPAGO_PAYMENT_LINK;
    },
    onError: () => {
      toast.error("Error al procesar el pedido. Intenta de nuevo.");
    },
  });

  const onShippingSubmit = (data: ShippingFormData) => {
    setShippingData(data);
    setCurrentStep("review");
  };

  const onPay = () => {
    paymentMutation.mutate();
  };

  if (cartItems.length === 0 && !isRedirecting) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center bg-youorganic-cream/30 p-4">
          <Card className="max-w-md w-full text-center">
            <CardContent className="pt-8 pb-8">
              <Package size={48} className="mx-auto mb-4 text-youorganic-dark/40" />
              <h2 className="text-xl font-semibold mb-2">Tu carrito está vacío</h2>
              <p className="text-youorganic-dark/60 mb-4">
                Agrega productos antes de continuar al checkout.
              </p>
              <Button
                onClick={() => navigate("/")}
                className="bg-youorganic-green hover:bg-youorganic-green/90"
              >
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
                  <div
                    className={`w-8 h-0.5 ${
                      i < stepIndex ? "bg-youorganic-green" : "bg-gray-200"
                    }`}
                  />
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
                      <Input id="city" placeholder="Lima" className="h-12" {...register("city")} />
                      {errors.city && <p className="text-red-500 text-xs">{errors.city.message}</p>}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="state">Departamento</Label>
                      <Input id="state" placeholder="Lima" className="h-12" {...register("state")} />
                      {errors.state && <p className="text-red-500 text-xs">{errors.state.message}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="zipCode">Código postal</Label>
                      <Input id="zipCode" placeholder="15001" className="h-12" inputMode="numeric" {...register("zipCode")} />
                      {errors.zipCode && <p className="text-red-500 text-xs">{errors.zipCode.message}</p>}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input id="phone" type="tel" placeholder="+51 999 888 777" className="h-12" inputMode="tel" {...register("phone")} />
                      {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-12 mt-2 bg-youorganic-green hover:bg-youorganic-green/90 text-base">
                    Continuar al pago
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Review & Pay */}
          {currentStep === "review" && shippingData && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Resumen del pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium text-sm text-youorganic-dark/60 mb-1">Enviar a:</h3>
                    <p className="text-sm">{shippingData.fullName}</p>
                    <p className="text-sm">{shippingData.street}</p>
                    <p className="text-sm">{shippingData.city}, {shippingData.state} {shippingData.zipCode}</p>
                    <p className="text-sm">{shippingData.phone}</p>
                  </div>

                  <Separator />

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

                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span>${cartSubtotal.toFixed(2)}</span>
                  </div>

                  <div className="bg-youorganic-blush/40 rounded-lg p-3 text-center">
                    <p className="text-xs text-youorganic-dark/60">
                      Serás redirigido a MercadoPago para completar el pago de forma segura.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 h-12"
                  onClick={() => setCurrentStep("shipping")}
                  disabled={paymentMutation.isPending || isRedirecting}
                >
                  Volver
                </Button>
                <Button
                  className="flex-1 h-12 bg-youorganic-dark hover:bg-youorganic-dark/90 text-white text-base"
                  onClick={onPay}
                  disabled={paymentMutation.isPending || isRedirecting}
                >
                  {paymentMutation.isPending || isRedirecting ? (
                    <>
                      <Loader2 size={18} className="mr-2 animate-spin" />
                      {isRedirecting ? "Redirigiendo..." : "Procesando..."}
                    </>
                  ) : (
                    <>
                      <CreditCard size={18} className="mr-2" />
                      Pagar con MercadoPago
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
