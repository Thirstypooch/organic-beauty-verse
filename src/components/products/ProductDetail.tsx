
import { useState } from "react";
import { useParams } from "react-router-dom";
import { ShoppingCart, Heart, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { getProductById, getRelatedProducts } from "@/data/mockProducts";
import { toast } from "@/components/ui/sonner";
import ProductCard from "./ProductCard";

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  const product = productId ? getProductById(productId) : null;
  const relatedProducts = product ? getRelatedProducts(product.id, product.category) : [];
  
  // Mock multiple product images
  const productImages = product ? [
    product.imageUrl,
    "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=500",
    "https://images.unsplash.com/photo-1615622231207-78f95c2d8772?q=80&w=500"
  ] : [];

  const addToCart = useCartStore((state) => state.addToCart);
  const addToWishlist = useWishlistStore((state) => state.addToWishlist);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p>Product not found</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success("Added to cart", {
      description: `${quantity} ${quantity > 1 ? 'items' : 'item'} of ${product.name} added to your cart.`,
    });
  };

  const handleAddToWishlist = () => {
    addToWishlist(product);
    toast.success("Added to wishlist", {
      description: `${product.name} has been added to your wishlist.`,
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
              src={productImages[activeImageIndex]}
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
              <span className="text-sm bg-youorganic-green/10 text-youorganic-green px-2 py-1 rounded">
                {product.category}
              </span>
            </div>
          </div>

          <p className="text-youorganic-dark/80 mb-6">
            {product.description}
          </p>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-youorganic-dark font-medium">Quantity</span>
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
                Add to Cart
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
                {isInWishlist(product.id) ? "In Wishlist" : "Add to Wishlist"}
              </Button>
            </div>
          </div>

          <Separator className="my-6 bg-youorganic-light-green/30" />

          <Tabs defaultValue="details">
            <TabsList className="w-full bg-youorganic-cream">
              <TabsTrigger value="details" className="flex-1">
                Details
              </TabsTrigger>
              <TabsTrigger value="ingredients" className="flex-1">
                Ingredients
              </TabsTrigger>
              <TabsTrigger value="how-to-use" className="flex-1">
                How to Use
              </TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="pt-4">
              <div className="prose text-youorganic-dark/80 text-sm">
                <p>{product.description}</p>
                {product.warnings && (
                  <div className="bg-youorganic-beige p-3 rounded-md mt-4">
                    <p className="font-medium text-youorganic-dark">Warnings:</p>
                    <p>{product.warnings}</p>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="ingredients" className="pt-4">
              <p className="text-youorganic-dark/80 text-sm">
                {product.ingredients || "No ingredients information available."}
              </p>
            </TabsContent>
            <TabsContent value="how-to-use" className="pt-4">
              <p className="text-youorganic-dark/80 text-sm">
                {product.howToUse || "No usage information available."}
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="font-serif text-2xl font-bold text-youorganic-green mb-6">
            You May Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
