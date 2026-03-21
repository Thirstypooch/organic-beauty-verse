
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Index from "./pages/Index";
import ProductsPage from "./pages/ProductsPage";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import BeautyAssistantPage from "./pages/BeautyAssistantPage";
import CheckoutPage from "./pages/CheckoutPage";
import AccountPage from "./pages/AccountPage";
import CheckoutResultPage from "./pages/CheckoutResultPage";
import InfoPage from "./pages/InfoPage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import GuestRoute from "./components/auth/GuestRoute";
import BottomNav from "./components/layout/BottomNav";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="pb-16 md:pb-0">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
            <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
            <Route path="/products/:category" element={<ProductsPage />} />
            <Route path="/products/:category/:productId" element={<ProductsPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
            <Route path="/checkout/success" element={<ProtectedRoute><CheckoutResultPage status="success" /></ProtectedRoute>} />
            <Route path="/checkout/failure" element={<ProtectedRoute><CheckoutResultPage status="failure" /></ProtectedRoute>} />
            <Route path="/checkout/pending" element={<ProtectedRoute><CheckoutResultPage status="pending" /></ProtectedRoute>} />
            <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
            <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
            <Route path="/assistant" element={<BeautyAssistantPage />} />
            <Route path="/shipping" element={<InfoPage page="shipping" />} />
            <Route path="/returns" element={<InfoPage page="returns" />} />
            <Route path="/faq" element={<InfoPage page="faq" />} />
            <Route path="/privacy" element={<InfoPage page="privacy" />} />
            <Route path="/terms" element={<InfoPage page="terms" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <BottomNav />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
