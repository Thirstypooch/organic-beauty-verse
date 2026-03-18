import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { User as UserIcon, Package, LogOut, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuthStore } from "@/stores/authStore";
import { fetchOrders, updateProfile } from "@/services/api";
import { toast } from "@/components/ui/sonner";
import { Order } from "@/lib/schemas";
import { motion } from "framer-motion";

const profileSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
  email: z.string().email({ message: "Por favor ingresa un correo electrónico válido." }),
});
type ProfileFormData = z.infer<typeof profileSchema>;

type Tab = "profile" | "orders";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: "Pendiente", color: "bg-yellow-100 text-yellow-800" },
  processing: { label: "En proceso", color: "bg-blue-100 text-blue-800" },
  shipped: { label: "Enviado", color: "bg-purple-100 text-purple-800" },
  delivered: { label: "Entregado", color: "bg-green-100 text-green-800" },
  cancelled: { label: "Cancelado", color: "bg-red-100 text-red-800" },
};

const OrderCard = ({ order }: { order: Order }) => {
  const [expanded, setExpanded] = useState(false);
  const status = STATUS_LABELS[order.status] || STATUS_LABELS.pending;
  const date = new Date(order.createdAt).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card className="overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left"
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-youorganic-dark">
              Pedido #{order.id}
            </span>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${status.color}`}>
              {status.label}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm text-youorganic-dark/60">
            <span>{date}</span>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-youorganic-green">
                ${order.total.toFixed(2)}
              </span>
              <ChevronRight
                size={16}
                className={`transition-transform ${expanded ? "rotate-90" : ""}`}
              />
            </div>
          </div>
        </CardContent>
      </button>

      {expanded && (
        <div className="border-t border-gray-100 px-4 pb-4">
          {/* Items */}
          <div className="space-y-3 mt-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <img
                  src={item.productImageUrl || "/placeholder.svg"}
                  alt={item.productName}
                  className="w-12 h-12 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.productName}</p>
                  <p className="text-xs text-youorganic-dark/60">
                    Cantidad: {item.quantity} &times; ${item.price.toFixed(2)}
                  </p>
                </div>
                <span className="text-sm font-medium whitespace-nowrap">
                  ${(item.quantity * item.price).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Shipping */}
          <Separator className="my-3" />
          <div className="text-xs text-youorganic-dark/60">
            <p className="font-medium text-youorganic-dark mb-1">Enviar a:</p>
            <p>{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.street}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
              {order.shippingAddress.zipCode}
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};

const AccountPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const updateUser = useAuthStore((state) => state.updateUser);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  const profileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (updatedUser) => {
      updateUser(updatedUser);
      toast.success("Perfil actualizado correctamente");
    },
    onError: () => {
      toast.error("Error al actualizar el perfil");
    },
  });

  const {
    data: orders,
    isLoading: ordersLoading,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
    enabled: activeTab === "orders",
  });

  const onProfileSubmit = (data: ProfileFormData) => {
    profileMutation.mutate(data);
  };

  const handleLogout = () => {
    logout();
    toast.success("Sesión cerrada correctamente");
    navigate("/");
  };

  const tabs = [
    { key: "profile" as Tab, label: "Mi Perfil", icon: <UserIcon size={18} /> },
    { key: "orders" as Tab, label: "Mis Pedidos", icon: <Package size={18} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-youorganic-cream/30">
        <div className="container mx-auto px-4 py-6 md:py-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6"
          >
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-youorganic-green">
              Mi Cuenta
            </h1>
            <p className="text-youorganic-dark/60 text-sm mt-1">
              Hola, {user?.name || ""}
            </p>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar / Tab selector */}
            <div className="md:w-56 flex-shrink-0">
              {/* Mobile: horizontal tabs */}
              <div className="flex md:flex-col gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors flex-1 md:flex-none min-h-[44px] ${
                      activeTab === tab.key
                        ? "bg-youorganic-green text-white"
                        : "bg-white text-youorganic-dark hover:bg-youorganic-cream"
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-red-600 bg-white hover:bg-red-50 transition-colors min-h-[44px]"
                >
                  <LogOut size={18} />
                  <span className="hidden md:inline">Cerrar Sesión</span>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              {/* Profile tab */}
              {activeTab === "profile" && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Información Personal</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit(onProfileSubmit)} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nombre</Label>
                          <Input
                            id="name"
                            className="h-12"
                            {...register("name")}
                          />
                          {errors.name && (
                            <p className="text-red-500 text-xs">{errors.name.message}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Correo Electrónico</Label>
                          <Input
                            id="email"
                            type="email"
                            className="h-12"
                            {...register("email")}
                          />
                          {errors.email && (
                            <p className="text-red-500 text-xs">{errors.email.message}</p>
                          )}
                        </div>
                        <Button
                          type="submit"
                          className="w-full md:w-auto h-12 bg-youorganic-green hover:bg-youorganic-green/90"
                          disabled={!isDirty || profileMutation.isPending}
                        >
                          {profileMutation.isPending
                            ? "Guardando..."
                            : "Guardar Cambios"}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Orders tab */}
              {activeTab === "orders" && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <h2 className="font-serif text-lg font-semibold text-youorganic-dark">
                    Historial de Pedidos
                  </h2>

                  {ordersLoading ? (
                    <div className="space-y-3">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-24 w-full rounded-xl" />
                      ))}
                    </div>
                  ) : !orders || orders.length === 0 ? (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <Package
                          size={48}
                          className="mx-auto mb-4 text-youorganic-dark/30"
                        />
                        <p className="text-youorganic-dark/60 mb-4">
                          Aún no tienes pedidos realizados.
                        </p>
                        <Button
                          onClick={() => navigate("/")}
                          className="bg-youorganic-green hover:bg-youorganic-green/90"
                        >
                          Explorar Productos
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-3">
                      {orders.map((order) => (
                        <OrderCard key={order.id} order={order} />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AccountPage;
