import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search, ShoppingCart, Heart, Menu, X, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useAuthStore } from "@/stores/authStore";
import { Badge } from "@/components/ui/badge";
import { fetchCategories } from "@/services/api";
import { toast } from "@/components/ui/sonner";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const wishlistItems = useWishlistStore((state) => state.wishlist.items.length);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    toast.success("Sesión cerrada correctamente");
    navigate("/");
    setIsMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-white/80 backdrop-blur-md"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-youorganic-green">
              YouOrganic
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-youorganic-dark hover:text-youorganic-green transition-colors"
            >
              Inicio
            </Link>
            {categories.slice(0, 4).map((category) => (
              <Link
                key={category.id}
                to={`/products/${category.name.toLowerCase()}`}
                className="text-youorganic-dark hover:text-youorganic-green transition-colors"
              >
                {category.name}
              </Link>
            ))}
            <Link
              to="/assistant"
              className="text-youorganic-dark hover:text-youorganic-green transition-colors"
            >
              Asistente de Belleza
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-youorganic-dark/60" size={18} />
                <Input
                  type="search"
                  placeholder="Buscar productos..."
                  className="w-full pl-10 pr-4 h-9 rounded-full bg-youorganic-cream border-youorganic-light-green focus:border-youorganic-green"
                />
              </div>
            </div>

            <Link to="/wishlist" className="relative p-2">
              <Heart size={24} className="text-youorganic-dark hover:text-youorganic-green transition-colors" />
              {wishlistItems > 0 && (
                <Badge
                  className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-youorganic-green text-white text-xs rounded-full"
                >
                  {wishlistItems}
                </Badge>
              )}
            </Link>

            <Link to="/cart" className="relative p-2">
              <ShoppingCart size={24} className="text-youorganic-dark hover:text-youorganic-green transition-colors" />
              {totalItems > 0 && (
                <Badge
                  className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-youorganic-green text-white text-xs rounded-full"
                >
                  {totalItems}
                </Badge>
              )}
            </Link>

            {/* Auth: user menu or login link */}
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <>
                  <span className="text-sm text-youorganic-dark truncate max-w-[120px]">
                    {user.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    title="Cerrar sesión"
                  >
                    <LogOut size={20} className="text-youorganic-dark hover:text-youorganic-green" />
                  </Button>
                </>
              ) : (
                <Link to="/login">
                  <Button variant="ghost" size="icon" title="Iniciar sesión">
                    <User size={24} className="text-youorganic-dark hover:text-youorganic-green" />
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-fade-in">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col space-y-4">
              <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-youorganic-dark/60" size={18} />
                <Input
                  type="search"
                  placeholder="Buscar productos..."
                  className="w-full pl-10 pr-4 h-9 rounded-full bg-youorganic-cream border-youorganic-light-green focus:border-youorganic-green"
                />
              </div>
              <Link
                to="/"
                className="py-2 text-youorganic-dark hover:text-youorganic-green transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/products/${category.name.toLowerCase()}`}
                  className="py-2 text-youorganic-dark hover:text-youorganic-green transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
              <Link
                to="/assistant"
                className="py-2 text-youorganic-dark hover:text-youorganic-green transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Asistente de Belleza
              </Link>

              {/* Mobile auth section */}
              <div className="border-t border-gray-100 pt-4">
                {user ? (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-youorganic-dark">{user.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                      className="text-youorganic-dark hover:text-youorganic-green"
                    >
                      <LogOut size={18} className="mr-2" />
                      Cerrar sesión
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Link to="/login" className="flex-1" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full">Iniciar Sesión</Button>
                    </Link>
                    <Link to="/register" className="flex-1" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full bg-youorganic-green hover:bg-youorganic-green/90">Registrarse</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
