
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingCart, Heart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { Badge } from "@/components/ui/badge";
import { getAllCategories } from "@/data/mockProducts";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const wishlistItems = useWishlistStore((state) => state.wishlist.items.length);
  const categories = getAllCategories();

  // Handle scroll event for navbar styling
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
              Home
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
              Beauty Assistant
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-youorganic-dark/60" size={18} />
                <Input
                  type="search"
                  placeholder="Search products..."
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
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 h-9 rounded-full bg-youorganic-cream border-youorganic-light-green focus:border-youorganic-green"
                />
              </div>
              <Link
                to="/"
                className="py-2 text-youorganic-dark hover:text-youorganic-green transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
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
                Beauty Assistant
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
