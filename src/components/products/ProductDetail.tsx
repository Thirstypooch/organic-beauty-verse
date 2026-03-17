import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ShoppingCart, Heart, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { fetchProductById, fetchProducts, fetchCategories } from "@/services/api";
import { toast } from "@/components/ui/sonner";
import ProductCard from "./ProductCard";

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const numericId = productId ? parseInt(productId, 10) : undefined;

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', numericId],
    queryFn: () => fetchProductById(numericId!),
    enabled: !!numericId,
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const categoryName = categories?.find((c) => c.id === product?.categoryId)?.name;

  // Fetch related products from same category
  const { data: allCategoryProducts } = useQuery({
    queryKey: ['products', categoryName?.toLowerCase()],
    queryFn: () => fetchProducts(categoryName?.toLowerCase()),
    enabled: !!categoryName,
  });

  const relatedProducts = allCategoryProducts
    ?.filter((p) => p.id !== product?.id)
    .slice(0, 3) || [];

  const productImages = product ? [product.imageUrl].filter(Boolean) as string[] : [];

  const addToCart = useCartStore((state) => state.addToCart);
  const addToWishlist = useWishlistStore((state) => state.addToWishlist);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p>Producto no encontrado</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success("Agregado al carrito", {
      description: `${quantity} ${quantity > 1 ? 'unidades' : 'unidad'} de ${product.name} agregado a tu carrito.`,
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

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev < productImages.length - 1 ? prev + 1 : 0));
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : productImages.length - 1));
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {/* Product Images */}
        <div className="relative">
          <div className="relative aspect-square rounded-lg overflow-hidden bg-white shadow-md">
            <img
              src={productImages[activeImageIndex] || "https://via.placeholder.com/500"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {productImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-youorganic-dark rounded-full p-2"
                >
                  <ArrowLeft size={20} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-youorganic-dark rounded-full p-2"
                >
                  <ArrowRight size={20} />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {productImages.length > 1 && (
            <div className="flex justify-center space-x-3 mt-4">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`w-16 h-16 rounded-md overflow-hidden border-2 ${
                    activeImageIndex === index
                      ? "border-youorganic-green"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Information */}
        <div>
          <div className="mb-6">
            <h1 className="font-serif text-3xl font-bold text-youorganic-dark mb-2">
              {product.name}
            </h1>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-semibold text-youorganic-green">
                ${product.price.toFixed(2)}
              </span>
              {categoryName && (
                <span className="text-sm bg-youorganic-green/10 text-youorganic-green px-2 py-1 rounded">
                  {categoryName}
                </span>
              )}
            </div>
          </div>

          <p className="text-youorganic-dark/80 mb-6">
            {product.description}
          </p>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-youorganic-dark font-medium">Cantidad</span>
              <div className="flex items-center border border-youorganic-light-green rounded-md">
                <button
                  onClick={decreaseQuantity}
                  className="px-3 py-1 text-youorganic-green border-r border-youorganic-light-green"
                >
                  -
                </button>
                <span className="px-4 py-1">{quantity}</span>
                <button
                  onClick={increaseQuantity}
                  className="px-3 py-1 text-youorganic-green border-l border-youorganic-light-green"
                >
                  +
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                className="bg-youorganic-green hover:bg-youorganic-green/90 text-white flex items-center justify-center gap-2"
                onClick={handleAddToCart}
              >
                <ShoppingCart size={18} />
                Agregar al Carrito
              </Button>
              <Button
                variant="outline"
                className={`border-youorganic-light-green hover:bg-youorganic-green/10 flex items-center justify-center gap-2 ${
                  isInWishlist(product.id)
                    ? "text-youorganic-green"
                    : "text-youorganic-dark"
                }`}
                onClick={handleAddToWishlist}
              >
                <Heart size={18} />
                {isInWishlist(product.id) ? "En Favoritos" : "Agregar a Favoritos"}
              </Button>
            </div>
          </div>

          <Separator className="my-6 bg-youorganic-light-green/30" />

          <Tabs defaultValue="details">
            <TabsList className="w-full bg-youorganic-cream">
              <TabsTrigger value="details" className="flex-1">
                Detalles
              </TabsTrigger>
              <TabsTrigger value="how-to-use" className="flex-1">
                Modo de Uso
              </TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="pt-4">
              <div className="prose text-youorganic-dark/80 text-sm">
                <p>{product.description}</p>
                {product.warnings && (
                  <div className="bg-youorganic-beige p-3 rounded-md mt-4">
                    <p className="font-medium text-youorganic-dark">Advertencias:</p>
                    <p>{product.warnings}</p>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="how-to-use" className="pt-4">
              <p className="text-youorganic-dark/80 text-sm">
                {product.howToUse || "Información de uso no disponible."}
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="font-serif text-2xl font-bold text-youorganic-green mb-6">
            También Te Puede Gustar
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
  );
};

export default ProductDetail;
