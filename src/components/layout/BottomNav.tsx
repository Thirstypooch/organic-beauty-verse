import { Home, LayoutGrid, ShoppingBag, Heart, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const totalItems = useCartStore((state) => state.getTotalItems());
  const user = useAuthStore((state) => state.user);

  const tabs = [
    { label: "Inicio", icon: Home, path: "/" },
    { label: "Categorías", icon: LayoutGrid, path: "/products/facial" },
    { label: "Carrito", icon: ShoppingBag, path: "/cart", badge: totalItems },
    { label: "Favoritos", icon: Heart, path: "/wishlist" },
    {
      label: "Cuenta",
      icon: User,
      path: user ? "/account" : "/login",
    },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const active = isActive(tab.path);
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="flex flex-col items-center justify-center flex-1 py-2 relative"
              style={{ minHeight: "44px", minWidth: "44px" }}
              aria-label={tab.label}
            >
              {active && (
                <span
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                  style={{ backgroundColor: "#B8919F" }}
                />
              )}
              <span className="relative">
                <tab.icon
                  size={22}
                  strokeWidth={active ? 2.5 : 1.8}
                  style={{ color: active ? "#B8919F" : "#9CA3AF" }}
                />
                {tab.badge != null && tab.badge > 0 && (
                  <span
                    className="absolute -top-1.5 -right-2.5 flex items-center justify-center rounded-full text-white text-[10px] font-bold leading-none"
                    style={{
                      backgroundColor: "#4C7C44",
                      minWidth: "16px",
                      height: "16px",
                      padding: "0 4px",
                    }}
                  >
                    {tab.badge > 99 ? "99+" : tab.badge}
                  </span>
                )}
              </span>
              <span
                className="text-[10px] mt-1 font-medium"
                style={{ color: active ? "#B8919F" : "#9CA3AF" }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
