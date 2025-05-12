
import { Link } from "react-router-dom";
import { Heart, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "@/components/ui/sonner";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, we would send this to an API
    toast.success("Thank you for subscribing to our newsletter!", {
      description: "You'll receive updates on our latest products and offers.",
    });
    setEmail("");
  };

  return (
    <footer className="bg-youorganic-cream pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Us */}
          <div>
            <h3 className="font-serif text-xl font-medium mb-4 text-youorganic-green">
              About YouOrganic
            </h3>
            <p className="text-youorganic-dark mb-4">
              We craft premium organic skincare products using natural ingredients.
              Our mission is to provide effective, sustainable beauty solutions.
            </p>
            <div className="flex items-center">
              <span className="text-sm text-youorganic-dark">Made with</span>
              <Heart size={16} className="mx-1 text-youorganic-green" />
              <span className="text-sm text-youorganic-dark">for your skin</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-xl font-medium mb-4 text-youorganic-green">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-youorganic-dark hover:text-youorganic-green transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/products/facial"
                  className="text-youorganic-dark hover:text-youorganic-green transition-colors"
                >
                  Shop All
                </Link>
              </li>
              <li>
                <Link
                  to="/assistant"
                  className="text-youorganic-dark hover:text-youorganic-green transition-colors"
                >
                  Beauty Assistant
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-youorganic-dark hover:text-youorganic-green transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-youorganic-dark hover:text-youorganic-green transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="font-serif text-xl font-medium mb-4 text-youorganic-green">
              Customer Care
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/shipping"
                  className="text-youorganic-dark hover:text-youorganic-green transition-colors"
                >
                  Shipping Information
                </Link>
              </li>
              <li>
                <Link
                  to="/returns"
                  className="text-youorganic-dark hover:text-youorganic-green transition-colors"
                >
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-youorganic-dark hover:text-youorganic-green transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-youorganic-dark hover:text-youorganic-green transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-youorganic-dark hover:text-youorganic-green transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-serif text-xl font-medium mb-4 text-youorganic-green">
              Newsletter
            </h3>
            <p className="text-youorganic-dark mb-4">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-youorganic-dark/60" size={18} />
                <Input
                  type="email"
                  placeholder="Your email address"
                  className="w-full pl-10 pr-4 py-2 rounded-full border-youorganic-light-green focus:border-youorganic-green"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-youorganic-green hover:bg-youorganic-green/90 text-white"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-youorganic-light-brown/30 mt-8 pt-6 text-center">
          <p className="text-sm text-youorganic-dark">
            © {new Date().getFullYear()} YouOrganic. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
