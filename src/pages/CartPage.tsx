
import Cart from "@/components/cart/CartPage";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const CartPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-youorganic-cream/30">
        <Cart />
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;
