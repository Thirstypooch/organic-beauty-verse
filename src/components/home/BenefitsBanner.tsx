
import { LeafIcon, Heart, Droplets, Check } from "lucide-react";

const BenefitsBanner = () => {
  const benefits = [
    {
      icon: <LeafIcon className="h-6 w-6" />,
      title: "100% Organic",
      description: "All ingredients sourced from certified organic farms"
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Cruelty-Free",
      description: "Never tested on animals, only on willing human volunteers"
    },
    {
      icon: <Droplets className="h-6 w-6" />,
      title: "No Harmful Chemicals",
      description: "Free from parabens, sulfates and synthetic fragrances"
    },
    {
      icon: <Check className="h-6 w-6" />,
      title: "Sustainable",
      description: "Eco-friendly packaging and responsible manufacturing"
    }
  ];

  return (
    <section className="py-12 bg-youorganic-beige/70">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="bg-youorganic-green/10 p-3 rounded-full text-youorganic-green">
                {benefit.icon}
              </div>
              <div>
                <h3 className="font-serif text-lg font-medium mb-2 text-youorganic-dark">
                  {benefit.title}
                </h3>
                <p className="text-youorganic-dark/70 text-sm">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsBanner;
