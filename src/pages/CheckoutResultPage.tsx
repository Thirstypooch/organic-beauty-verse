import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { fetchOrderById } from "@/services/api";

interface CheckoutResultPageProps {
  status: "success" | "failure" | "pending";
}

const STATUS_CONFIG = {
  success: {
    icon: CheckCircle,
    iconClass: "text-green-500",
    title: "¡Pago exitoso!",
    description: "Tu pedido ha sido confirmado y está siendo procesado.",
    showOrder: true,
  },
  failure: {
    icon: XCircle,
    iconClass: "text-red-500",
    title: "El pago no se completó",
    description: "Hubo un problema con tu pago. Puedes intentarlo de nuevo.",
    showOrder: false,
  },
  pending: {
    icon: Clock,
    iconClass: "text-yellow-500",
    title: "Pago pendiente",
    description:
      "Tu pago está siendo procesado. Recibirás una confirmación cuando se complete.",
    showOrder: true,
  },
};

const CheckoutResultPage = ({ status }: CheckoutResultPageProps) => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => fetchOrderById(Number(orderId)),
    enabled: !!orderId && config.showOrder,
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center bg-youorganic-cream/30 p-4">
        <Card className="max-w-lg w-full">
          <CardContent className="pt-8 pb-8 text-center space-y-5">
            <Icon size={64} className={`mx-auto ${config.iconClass}`} />
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-youorganic-dark">
              {config.title}
            </h1>
            <p className="text-youorganic-dark/60">{config.description}</p>

            {/* Order details */}
            {config.showOrder && orderId && (
              <div className="bg-youorganic-cream/50 rounded-lg p-4 text-left space-y-2 mt-4">
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ) : order ? (
                  <>
                    <p className="text-sm">
                      <span className="font-medium">Pedido:</span> #{order.id}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Total:</span> $
                      {order.total.toFixed(2)}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Productos:</span>{" "}
                      {order.items.length}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Estado:</span>{" "}
                      {order.status === "paid"
                        ? "Pagado"
                        : order.status === "pending"
                        ? "Pendiente"
                        : order.status}
                    </p>
                  </>
                ) : null}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              {status === "failure" && (
                <Button asChild className="bg-youorganic-dark hover:bg-youorganic-dark/90">
                  <Link to="/cart">Volver al carrito</Link>
                </Button>
              )}
              <Button
                asChild
                variant={status === "failure" ? "outline" : "default"}
                className={
                  status !== "failure"
                    ? "bg-youorganic-green hover:bg-youorganic-green/90"
                    : ""
                }
              >
                <Link to="/">Seguir comprando</Link>
              </Button>
              {config.showOrder && (
                <Button asChild variant="outline">
                  <Link to="/account">Ver mis pedidos</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutResultPage;
