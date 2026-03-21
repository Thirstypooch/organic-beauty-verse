import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { SUPABASE_STORAGE_URL } from "@/lib/constants";

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

// Media items: image holds for 3s, videos play to completion
const MEDIA_ITEMS: { type: "image" | "video"; src: string }[] = [
  { type: "image", src: `${SUPABASE_STORAGE_URL}/hero/hero-landing.png` },
  { type: "video", src: `${SUPABASE_STORAGE_URL}/hero/video-1.mp4` },
  { type: "video", src: `${SUPABASE_STORAGE_URL}/hero/video-2.mp4` },
];

const IMAGE_HOLD_MS = 3000;
const FADE_IN_DURATION = 1.2;
const FADE_OUT_DURATION = 2.0;

const HeroSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const advance = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % MEDIA_ITEMS.length);
  }, []);

  // Handle transitions: image uses a timer, video uses the `ended` event
  useEffect(() => {
    const item = MEDIA_ITEMS[activeIndex];

    if (item.type === "image") {
      timerRef.current = setTimeout(advance, IMAGE_HOLD_MS);
    }

    if (item.type === "video") {
      const videoIndex = activeIndex;
      const video = videoRefs.current[videoIndex];
      if (video) {
        video.currentTime = 0;
        video.play().catch(() => {
          // Autoplay blocked — skip to next
          setTimeout(advance, 500);
        });
      }
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [activeIndex, advance]);

  const handleVideoEnd = useCallback(
    (index: number) => {
      if (index === activeIndex) {
        advance();
      }
    },
    [activeIndex, advance]
  );

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

            <motion.div variants={fadeUp}>
              <Button
                asChild
                size="lg"
                className="bg-youorganic-dark hover:bg-youorganic-dark/90 text-white text-sm tracking-wide px-8 py-6 rounded-full shadow-lg w-full sm:w-auto"
              >
                <Link to="/products/facial">Explorar Colección</Link>
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

          {/* Right — Media carousel */}
          <div className="relative order-1 md:order-2 -mx-4 md:mx-0">
            <div className="relative h-[50vh] md:h-[85vh] md:rounded-l-[3rem] overflow-hidden bg-youorganic-beige">
              <AnimatePresence>
                {MEDIA_ITEMS.map((item, index) =>
                  index === activeIndex ? (
                    <motion.div
                      key={index}
                      className="absolute inset-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { duration: FADE_IN_DURATION, ease: "easeInOut" } }}
                      exit={{ opacity: 0, transition: { duration: FADE_OUT_DURATION, ease: "easeInOut" } }}
                    >
                      {item.type === "image" ? (
                        <img
                          src={item.src}
                          alt="Mujer en campo de lavanda al atardecer"
                          className="w-full h-full object-cover brightness-[1.02]"
                        />
                      ) : (
                        <video
                          ref={(el) => {
                            videoRefs.current[index] = el;
                          }}
                          src={item.src}
                          muted
                          playsInline
                          preload="auto"
                          onEnded={() => handleVideoEnd(index)}
                          className="w-full h-full object-cover brightness-[0.95] saturate-[0.9]"
                        />
                      )}
                    </motion.div>
                  ) : null
                )}
              </AnimatePresence>

              {/* Subtle vignette overlay for cohesion */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-youorganic-cream/20 via-transparent to-transparent" />

              {/* Progress dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {MEDIA_ITEMS.map((_, i) => (
                  <span
                    key={i}
                    className={`block h-1.5 rounded-full transition-all duration-500 ${
                      i === activeIndex
                        ? "w-6 bg-white"
                        : "w-1.5 bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Mobile gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-youorganic-cream via-transparent to-transparent md:hidden pointer-events-none" />
    </section>
  );
};

export default HeroSection;
