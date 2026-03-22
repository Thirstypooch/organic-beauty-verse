import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { SUPABASE_STORAGE_URL } from "@/lib/constants";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
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

const MEDIA_ITEMS: { type: "image" | "video"; src: string }[] = [
  { type: "image", src: `${SUPABASE_STORAGE_URL}/hero/hero-landing.png` },
  { type: "video", src: `${SUPABASE_STORAGE_URL}/hero/video-1.mp4` },
  { type: "video", src: `${SUPABASE_STORAGE_URL}/hero/video-2.mp4` },
];

const IMAGE_HOLD_MS = 3000;
const FADE_IN = 1.2;
const FADE_OUT = 2.0;
const LG_BREAKPOINT = 1024;

const TRUST_BADGES = [
  { value: "100%", label: "Orgánico" },
  { value: "22+", label: "Productos" },
  { value: "0%", label: "Crueldad" },
];

const HeroSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const mobileVideoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const desktopVideoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const advance = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % MEDIA_ITEMS.length);
  }, []);

  useEffect(() => {
    const item = MEDIA_ITEMS[activeIndex];
    if (item.type === "image") {
      timerRef.current = setTimeout(advance, IMAGE_HOLD_MS);
    }
    if (item.type === "video") {
      // Pick the visible ref set based on viewport width
      const isDesktop = window.innerWidth >= LG_BREAKPOINT;
      const refs = isDesktop ? desktopVideoRefs : mobileVideoRefs;
      const video = refs.current[activeIndex];
      if (video) {
        video.currentTime = 0;
        video.play().catch(() => setTimeout(advance, 500));
      }
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [activeIndex, advance]);

  const handleVideoEnd = useCallback(
    (index: number) => { if (index === activeIndex) advance(); },
    [activeIndex, advance]
  );

  /* Reusable media carousel renderer */
  const renderMedia = (refs: React.MutableRefObject<(HTMLVideoElement | null)[]>) => (
    <>
      <AnimatePresence>
        {MEDIA_ITEMS.map((item, index) =>
          index === activeIndex ? (
            <motion.div
              key={index}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: FADE_IN, ease: "easeInOut" } }}
              exit={{ opacity: 0, transition: { duration: FADE_OUT, ease: "easeInOut" } }}
            >
              {item.type === "image" ? (
                <img src={item.src} alt="YouOrganic Skincare" className="w-full h-full object-cover" />
              ) : (
                <video
                  ref={(el) => { refs.current[index] = el; }}
                  src={item.src}
                  muted playsInline preload="auto"
                  onEnded={() => handleVideoEnd(index)}
                  className="w-full h-full object-cover brightness-[0.95] saturate-[0.9]"
                />
              )}
            </motion.div>
          ) : null
        )}
      </AnimatePresence>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {MEDIA_ITEMS.map((_, i) => (
          <span key={i} className={`block h-1.5 rounded-full transition-all duration-500 ${i === activeIndex ? "w-6 bg-white" : "w-1.5 bg-white/40"}`} />
        ))}
      </div>
    </>
  );

  return (
    <>
      {/* ═══ OVERLAY LAYOUT (< lg:1024px) — mobile + tablet ═══ */}
      <section className="lg:hidden relative min-h-[85vh] overflow-hidden">
        {/* Full-bleed media */}
        <div className="absolute inset-0 overflow-hidden">
          {renderMedia(mobileVideoRefs)}
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-youorganic-dark/85 via-youorganic-dark/40 to-youorganic-dark/10 z-[1]" />

        {/* Text at bottom */}
        <motion.div
          className="absolute bottom-20 left-0 right-0 px-5 sm:px-8 z-10 text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeUp} className="mb-4">
            <span className="inline-flex items-center gap-2 text-[10px] sm:text-xs tracking-[0.2em] uppercase font-medium text-white/90 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-white rounded-full" />
              Skincare 100% Orgánico
            </span>
          </motion.div>

          <motion.h1 variants={fadeUp} className="font-serif text-3xl sm:text-4xl font-bold leading-[1.1] text-white mb-3">
            Belleza que <span className="italic text-youorganic-light-green">nace</span>
            <br />de la naturaleza
          </motion.h1>

          <motion.p variants={fadeUp} className="text-sm sm:text-base text-white/75 max-w-sm mx-auto mb-5 leading-relaxed">
            Productos artesanales con ingredientes orgánicos puros.
          </motion.p>

          <motion.div variants={fadeUp}>
            <Button asChild size="lg" className="bg-white text-youorganic-dark hover:bg-white/90 text-sm tracking-wide px-8 py-5 rounded-full shadow-xl w-full sm:w-auto">
              <Link to="/products/facial">Explorar Colección</Link>
            </Button>
          </motion.div>

          <motion.div variants={fadeUp} className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-white/20">
            {TRUST_BADGES.map((stat) => (
              <div key={stat.label} className="text-center">
                <span className="block font-serif text-lg sm:text-xl font-bold text-white">{stat.value}</span>
                <span className="text-[9px] sm:text-[10px] text-white/60 tracking-wide uppercase">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ SPLIT LAYOUT (lg:1024px+) — desktop ═══ */}
      <section className="hidden lg:block overflow-hidden bg-youorganic-cream">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 items-center min-h-[80vh] gap-0">
            {/* Left — Text */}
            <motion.div className="pl-6 xl:pl-12 pr-12 xl:pr-20" variants={containerVariants} initial="hidden" animate="visible">
              <motion.div variants={fadeUp} className="mb-6">
                <span className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase font-medium text-youorganic-green bg-youorganic-blush/60 px-4 py-2 rounded-full">
                  <span className="w-1.5 h-1.5 bg-youorganic-green rounded-full" />
                  Skincare 100% Orgánico
                </span>
              </motion.div>

              <motion.h1 variants={fadeUp} className="font-serif text-4xl xl:text-6xl 2xl:text-7xl font-bold leading-[1.05] text-youorganic-dark mb-6">
                Belleza que{" "}
                <span className="italic text-youorganic-green">nace</span>
                <br />de la naturaleza
              </motion.h1>

              <motion.p variants={fadeUp} className="text-base xl:text-lg text-youorganic-dark/65 max-w-md mb-8 leading-relaxed">
                Productos artesanales elaborados con ingredientes orgánicos puros.
                Libres de crueldad, llenos de vida.
              </motion.p>

              <motion.div variants={fadeUp}>
                <Button asChild size="lg" className="bg-youorganic-dark hover:bg-youorganic-dark/90 text-white text-sm tracking-wide px-8 py-6 rounded-full shadow-lg">
                  <Link to="/products/facial">Explorar Colección</Link>
                </Button>
              </motion.div>

              <motion.div variants={fadeUp} className="flex items-center gap-6 mt-10 pt-6 border-t border-youorganic-light-green/30">
                {TRUST_BADGES.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <span className="block font-serif text-2xl xl:text-3xl font-bold text-youorganic-green">{stat.value}</span>
                    <span className="text-xs text-youorganic-dark/50 tracking-wide uppercase">{stat.label}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right — Media */}
            <motion.div
              className="relative h-[80vh] rounded-l-[3rem] overflow-hidden bg-youorganic-beige"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              {renderMedia(desktopVideoRefs)}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
