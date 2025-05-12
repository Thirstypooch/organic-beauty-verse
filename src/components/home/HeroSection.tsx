
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative bg-youorganic-cream overflow-hidden">
      <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 z-10 mb-8 md:mb-0">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-youorganic-green leading-tight">
            Pure Organic <br />
            <span className="text-youorganic-dark">Skincare Solutions</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 text-youorganic-dark/80 max-w-md">
            Discover our natural, cruelty-free products crafted with organic
            ingredients to nourish your skin and respect the planet.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              asChild
              className="bg-youorganic-green hover:bg-youorganic-green/90 text-white"
              size="lg"
            >
              <Link to="/products/facial">Shop Now</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-youorganic-green text-youorganic-green hover:bg-youorganic-green/10"
              size="lg"
            >
              <Link to="/assistant">Beauty Assistant</Link>
            </Button>
          </div>
        </div>
        
        <div className="md:w-1/2 relative">
          <div className="rounded-full bg-white/80 backdrop-blur-sm shadow-xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1619451683787-65f631462ebb?q=80&w=1200"
              alt="Organic skincare products"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="absolute -bottom-4 -right-4 md:bottom-12 md:-right-8 bg-youorganic-green/90 backdrop-blur-sm rounded-lg p-3 md:p-4 shadow-lg transform rotate-3">
            <p className="text-white font-serif text-sm md:text-base">
              <span className="font-bold">100% Natural</span>
              <br />Organic Ingredients
            </p>
          </div>
          <div className="absolute top-8 -left-4 md:-left-8 bg-white/90 backdrop-blur-sm rounded-lg p-3 md:p-4 shadow-lg transform -rotate-2">
            <p className="text-youorganic-green font-serif text-sm md:text-base">
              <span className="font-bold">Cruelty-Free</span>
              <br />& Sustainable
            </p>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-1/3 left-10 w-24 h-24 rounded-full bg-youorganic-light-green/20 blur-xl"></div>
      <div className="absolute bottom-1/4 right-10 w-32 h-32 rounded-full bg-youorganic-beige blur-xl"></div>
    </section>
  );
};

export default HeroSection;
