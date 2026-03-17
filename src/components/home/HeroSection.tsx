import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] md:min-h-[70vh] lg:min-h-[75vh] overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1920"
          alt="Mujer con skincare orgánico"
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay — stronger on mobile for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-youorganic-dark/90 via-youorganic-dark/50 to-youorganic-dark/20 md:bg-gradient-to-r md:from-youorganic-dark/85 md:via-youorganic-dark/60 md:to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex items-end md:items-center min-h-[85vh] md:min-h-[70vh] lg:min-h-[75vh]">
        <div className="flex flex-col md:flex-row items-center w-full pb-12 md:pb-0 md:py-20">
          {/* Text block */}
          <motion.div
            className="w-full md:w-1/2 text-center md:text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Floating badge */}
            <motion.div
              variants={fadeUp}
              className="inline-block mb-6"
            >
              <motion.span
                className="inline-flex items-center gap-1.5 bg-youorganic-green/90 backdrop-blur-sm text-white text-xs md:text-sm font-semibold px-4 py-2 rounded-full shadow-lg"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="w-2 h-2 bg-white rounded-full" />
                100% Orgánico
              </motion.span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white leading-tight"
            >
              Skincare Orgánico{" "}
              <br />
              <span className="text-youorganic-light-green">Puro y Natural</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-base md:text-lg lg:text-xl mb-8 text-white/85 max-w-md mx-auto md:mx-0"
            >
              Descubre nuestros productos naturales, libres de crueldad animal,
              elaborados con ingredientes orgánicos para nutrir tu piel y respetar
              el planeta.
            </motion.p>

            <motion.div variants={fadeUp}>
              <Button
                asChild
                size="lg"
                className="bg-youorganic-green hover:bg-youorganic-green/90 text-white text-base px-8 py-6 rounded-full shadow-xl w-full sm:w-auto"
              >
                <Link to="/products/facial">Comprar Ahora</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Desktop product showcase */}
          <motion.div
            className="hidden md:flex md:w-1/2 justify-center items-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          >
            <div className="relative">
              <div className="w-72 lg:w-80 h-72 lg:h-80 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1619451683787-65f631462ebb?q=80&w=1200"
                  alt="Productos orgánicos de skincare"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating card — top left */}
              <motion.div
                className="absolute -top-4 -left-8 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <p className="text-youorganic-green font-serif text-sm">
                  <span className="font-bold">Libre de Crueldad</span>
                  <br />y Sustentable
                </p>
              </motion.div>

              {/* Floating card — bottom right */}
              <motion.div
                className="absolute -bottom-4 -right-6 bg-youorganic-green/90 backdrop-blur-sm rounded-xl p-3 shadow-lg"
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                <p className="text-white font-serif text-sm">
                  <span className="font-bold">100% Natural</span>
                  <br />Ingredientes Orgánicos
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
