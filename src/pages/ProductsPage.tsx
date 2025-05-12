
import { useParams } from "react-router-dom";
import ProductListing from "@/components/products/ProductListing";
import ProductDetail from "@/components/products/ProductDetail";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const ProductsPage = () => {
  const { productId } = useParams<{ productId: string }>();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-youorganic-cream/30">
        {productId ? <ProductDetail /> : <ProductListing />}
      </main>
      <Footer />
    </div>
  );
};

export default ProductsPage;
