import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ShoppingCart,
  Heart,
  Minus,
  Plus,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { fetchProductById, fetchProducts, fetchCategories } from "@/services/api";
import { toast } from "@/components/ui/sonner";
import { Product } from "@/lib/schemas";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "./ProductCard";

const AccordionSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-youorganic-light-green/30">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-4 text-left text-youorganic-dark font-medium"
      >
        {title}
        <ChevronDown
          size={20}
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pb-4 text-sm text-youorganic-dark/80">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const [quantity, setQuantity] = useState(1);

  const numericId = productId ? parseInt(productId, 10) : undefined;

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", numericId],
    queryFn: () => fetchProductById(numericId!),
    enabled: !!numericId,
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const categoryName = categories?.find(
    (c) => c.id === product?.categoryId
  )?.name;

  const { data: allCategoryProducts } = useQuery({
    queryKey: ["products", categoryName?.toLowerCase()],
    queryFn: () => fetchProducts(categoryName?.toLowerCase()),
    enabled: !!categoryName,
  });

  const relatedProducts =
    allCategoryProducts?.filter((p) => p.id !== product?.id).slice(0, 4) || [];

  const addToCart = useCartStore((state) => state.addToCart);
  const addToWishlist = useWishlistStore((state) => state.addToWishlist);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-youorganic-dark text-lg">Producto no encontrado</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success("Agregado al carrito", {
      description: `${quantity} ${
        quantity > 1 ? "unidades" : "unidad"
      } de ${product.name} agregado a tu carrito.`,
    });
  };

  const handleAddToWishlist = () => {
    addToWishlist(product);
    toast.success("Agregado a favoritos", {
      description: `${product.name} se agregó a tu lista de deseos.`,
    });
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  return (
    <div className="pb-36 md:pb-0">
      <div className="container mx-auto px-4 py-4 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
          {/* Product Image */}
          <div className="relative">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white shadow-md">
              <img
                src={product.imageUrl || "https://via.placeholder.com/500"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {/* Category badge */}
              {categoryName && (
                <span className="absolute top-3 left-3 bg-youorganic-green text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                  {categoryName}
                </span>
              )}
            </div>
          </div>

          {/* Product Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* Name & Price */}
            <div className="mb-4">
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-youorganic-dark mb-2">
                {product.name}
              </h1>
              <span className="text-2xl md:text-3xl font-semibold text-youorganic-green">
                ${product.price.toFixed(2)}
              </span>
            </div>

            <p className="text-youorganic-dark/80 text-sm md:text-base mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* Quantity & Actions — desktop only */}
            <div className="hidden md:block mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-youorganic-dark font-medium">
                  Cantidad
                </span>
                <div className="flex items-center border border-youorganic-light-green rounded-lg">
                  <button
                    onClick={decreaseQuantity}
                    className="flex items-center justify-center w-11 h-11 text-youorganic-green hover:bg-youorganic-green/10 transition-colors rounded-l-lg"
                    aria-label="Disminuir cantidad"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-12 text-center font-medium text-youorganic-dark">
                    {quantity}
                  </span>
                  <button
                    onClick={increaseQuantity}
                    className="flex items-center justify-center w-11 h-11 text-youorganic-green hover:bg-youorganic-green/10 transition-colors rounded-r-lg"
                    aria-label="Aumentar cantidad"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  className="bg-youorganic-green hover:bg-youorganic-green/90 text-white flex items-center justify-center gap-2 h-12"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart size={18} />
                  Agregar al Carrito
                </Button>
                <Button
                  variant="outline"
                  className={`border-youorganic-light-green hover:bg-youorganic-green/10 flex items-center justify-center gap-2 h-12 ${
                    isInWishlist(product.id)
                      ? "text-youorganic-green"
                      : "text-youorganic-dark"
                  }`}
                  onClick={handleAddToWishlist}
                >
                  <Heart
                    size={18}
                    fill={isInWishlist(product.id) ? "currentColor" : "none"}
                  />
                  {isInWishlist(product.id)
                    ? "En Favoritos"
                    : "Agregar a Favoritos"}
                </Button>
              </div>
            </div>

            {/* Wishlist button — mobile only (cart is in sticky bar) */}
            <div className="md:hidden mb-6">
              <Button
                variant="outline"
                className={`w-full border-youorganic-light-green hover:bg-youorganic-green/10 flex items-center justify-center gap-2 h-12 ${
                  isInWishlist(product.id)
                    ? "text-youorganic-green"
                    : "text-youorganic-dark"
                }`}
                onClick={handleAddToWishlist}
              >
                <Heart
                  size={18}
                  fill={isInWishlist(product.id) ? "currentColor" : "none"}
                />
                {isInWishlist(product.id)
                  ? "En Favoritos"
                  : "Agregar a Favoritos"}
              </Button>
            </div>

            <Separator className="my-6 bg-youorganic-light-green/30" />

            {/* Mobile: Accordion sections */}
            <div className="md:hidden">
              <AccordionSection title="Descripción">
                <p>{product.description}</p>
              </AccordionSection>
              <AccordionSection title="Modo de Uso">
                <p>
                  {product.howToUse || "Información de uso no disponible."}
                </p>
              </AccordionSection>
              {product.warnings && (
                <AccordionSection title="Advertencias">
                  <div className="bg-youorganic-cream p-3 rounded-lg">
                    <p>{product.warnings}</p>
                  </div>
                </AccordionSection>
              )}
            </div>

            {/* Desktop: Tabs */}
            <div className="hidden md:block">
              <Tabs defaultValue="details">
                <TabsList className="w-full bg-youorganic-cream">
                  <TabsTrigger value="details" className="flex-1">
                    Descripción
                  </TabsTrigger>
                  <TabsTrigger value="how-to-use" className="flex-1">
                    Modo de Uso
                  </TabsTrigger>
                  {product.warnings && (
                    <TabsTrigger value="warnings" className="flex-1">
                      Advertencias
                    </TabsTrigger>
                  )}
                </TabsList>
                <TabsContent value="details" className="pt-4">
                  <p className="text-youorganic-dark/80 text-sm leading-relaxed">
                    {product.description}
                  </p>
                </TabsContent>
                <TabsContent value="how-to-use" className="pt-4">
                  <p className="text-youorganic-dark/80 text-sm leading-relaxed">
                    {product.howToUse || "Información de uso no disponible."}
                  </p>
                </TabsContent>
                {product.warnings && (
                  <TabsContent value="warnings" className="pt-4">
                    <div className="bg-youorganic-cream p-4 rounded-lg">
                      <p className="text-youorganic-dark/80 text-sm leading-relaxed">
                        {product.warnings}
                      </p>
                    </div>
                  </TabsContent>
                )}
              </Tabs>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 md:mt-16">
            <h2 className="font-serif text-xl md:text-2xl font-bold text-youorganic-green mb-6">
              También Te Puede Gustar
            </h2>

            {/* Mobile: horizontal scroll */}
            <div className="md:hidden -mx-4 px-4">
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
                {relatedProducts.map((relProduct) => (
                  <div
                    key={relProduct.id}
                    className="flex-shrink-0 w-[70vw] max-w-[280px] snap-start"
                  >
                    <ProductCard
                      product={relProduct}
                      categoryName={categoryName || "Productos"}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop: grid */}
            <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relProduct) => (
                <ProductCard
                  key={relProduct.id}
                  product={relProduct}
                  categoryName={categoryName || "Productos"}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Add to Cart bar — mobile only */}
      <div className="fixed bottom-16 left-0 right-0 z-40 bg-white border-t border-youorganic-light-green/30 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] px-4 py-3 md:hidden">
        <div className="flex items-center gap-3">
          {/* Price */}
          <span className="text-lg font-bold text-youorganic-green whitespace-nowrap">
            ${product.price.toFixed(2)}
          </span>

          {/* Quantity selector */}
          <div className="flex items-center border border-youorganic-light-green rounded-lg">
            <button
              onClick={decreaseQuantity}
              className="flex items-center justify-center w-[44px] h-[44px] text-youorganic-green active:bg-youorganic-green/10 transition-colors rounded-l-lg"
              aria-label="Disminuir cantidad"
            >
              <Minus size={18} />
            </button>
            <span className="w-8 text-center font-medium text-youorganic-dark text-sm">
              {quantity}
            </span>
            <button
              onClick={increaseQuantity}
              className="flex items-center justify-center w-[44px] h-[44px] text-youorganic-green active:bg-youorganic-green/10 transition-colors rounded-r-lg"
              aria-label="Aumentar cantidad"
            >
              <Plus size={18} />
            </button>
          </div>

          {/* Add to cart button */}
          <Button
            className="flex-1 bg-youorganic-green hover:bg-youorganic-green/90 active:bg-youorganic-green/80 text-white flex items-center justify-center gap-2 h-[44px] text-sm font-semibold"
            onClick={handleAddToCart}
          >
            <ShoppingCart size={16} />
            Agregar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
