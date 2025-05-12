
import Wishlist from "@/components/wishlist/WishlistPage";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const WishlistPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-youorganic-cream/30">
        <Wishlist />
      </main>
      <Footer />
    </div>
  );
};

export default WishlistPage;
