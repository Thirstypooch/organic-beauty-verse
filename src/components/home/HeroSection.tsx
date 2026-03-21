import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

const HeroSection = () => {
  return (
    <section className="relative min-h-[92vh] md:min-h-[85vh] overflow-hidden bg-youorganic-cream">
      <div className="container mx-auto px-4 h-full">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center min-h-[92vh] md:min-h-[85vh] gap-0">

          {/* Left — Text content */}
          <motion.div
            className="relative z-10 py-16 md:py-0 md:pr-12 lg:pr-20 order-2 md:order-1"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeUp} className="mb-6">
              <span className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase font-medium text-youorganic-green bg-youorganic-blush/60 px-4 py-2 rounded-full">
                <span className="w-1.5 h-1.5 bg-youorganic-green rounded-full" />
                Skincare 100% Orgánico
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] text-youorganic-dark mb-6"
            >
              Belleza que{" "}
              <span className="italic text-youorganic-green">nace</span>
              <br />
              de la naturaleza
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-base md:text-lg text-youorganic-dark/65 max-w-md mb-10 leading-relaxed"
            >
              Productos artesanales elaborados con ingredientes orgánicos puros.
              Libres de crueldad, llenos de vida.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3">
              <Button
                asChild
                size="lg"
                className="bg-youorganic-dark hover:bg-youorganic-dark/90 text-white text-sm tracking-wide px-8 py-6 rounded-full shadow-lg group"
              >
                <Link to="/products/facial">
                  Comprar Ahora
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-youorganic-green/40 text-youorganic-dark hover:bg-youorganic-blush/40 text-sm tracking-wide px-8 py-6 rounded-full"
              >
                <Link to="/products/corporal">Explorar Colección</Link>
              </Button>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              variants={fadeUp}
              className="flex items-center gap-6 mt-12 pt-8 border-t border-youorganic-light-green/30"
            >
              {[
                { value: "100%", label: "Orgánico" },
                { value: "22+", label: "Productos" },
                { value: "0%", label: "Crueldad" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <span className="block font-serif text-2xl md:text-3xl font-bold text-youorganic-green">
                    {stat.value}
                  </span>
                  <span className="text-xs text-youorganic-dark/50 tracking-wide uppercase">
                    {stat.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — Hero image */}
          <motion.div
            className="relative order-1 md:order-2 -mx-4 md:mx-0"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative h-[50vh] md:h-[85vh] md:rounded-l-[3rem] overflow-hidden">
              <img
                src="/hero-landing.png"
                alt="Mujer en campo de lavanda al atardecer"
                className="w-full h-full object-cover"
              />
              {/* Soft gradient overlay on mobile for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-youorganic-cream via-transparent to-transparent md:hidden" />
            </div>

            {/* Floating accent card */}
            <motion.div
              className="absolute bottom-8 left-4 md:bottom-12 md:-left-8 bg-white/90 backdrop-blur-md rounded-2xl px-5 py-4 shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
            >
              <p className="font-serif text-sm md:text-base text-youorganic-dark">
                <span className="font-semibold">Libre de Crueldad</span>
              </p>
              <p className="text-xs text-youorganic-dark/50">Ingredientes naturales y sustentables</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
