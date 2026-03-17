import { LeafIcon, Heart, Droplets, Check } from "lucide-react";
import { motion } from "framer-motion";
import { type ReactNode } from "react";

interface Benefit {
  icon: ReactNode;
  title: string;
  description: string;
}

const benefits: Benefit[] = [
  {
    icon: <LeafIcon className="h-7 w-7" />,
    title: "100% Orgánico",
    description:
      "Ingredientes provenientes de granjas orgánicas certificadas",
  },
  {
    icon: <Heart className="h-7 w-7" />,
    title: "Libre de Crueldad",
    description:
      "Nunca probado en animales, solo en voluntarios humanos",
  },
  {
    icon: <Droplets className="h-7 w-7" />,
    title: "Sin Químicos Dañinos",
    description:
      "Libre de parabenos, sulfatos y fragancias sintéticas",
  },
  {
    icon: <Check className="h-7 w-7" />,
    title: "Sustentable",
    description:
      "Empaques ecológicos y manufactura responsable",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

const BenefitsBanner = () => {
  return (
    <section className="py-10 md:py-14 bg-youorganic-beige/70">
      <div className="container mx-auto px-4">
        {/* Mobile: horizontal scrollable strip */}
        <motion.div
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-2 md:hidden"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="min-w-[200px] flex-shrink-0 snap-start bg-white/60 backdrop-blur-sm rounded-2xl p-5 text-center"
            >
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-youorganic-green/10 text-youorganic-green">
                {benefit.icon}
              </div>
              <h3 className="font-serif text-base font-semibold text-youorganic-dark mb-1.5">
                {benefit.title}
              </h3>
              <p className="text-youorganic-dark/65 text-xs leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Desktop: 4-column grid with stagger animation */}
        <motion.div
          className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/80 transition-colors"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-youorganic-green/10 text-youorganic-green">
                {benefit.icon}
              </div>
              <h3 className="font-serif text-lg font-semibold text-youorganic-dark mb-2">
                {benefit.title}
              </h3>
              <p className="text-youorganic-dark/65 text-sm leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BenefitsBanner;
