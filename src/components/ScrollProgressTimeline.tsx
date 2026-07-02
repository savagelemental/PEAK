import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface TimelineItem {
  id: string;
  label: string;
  num: string;
}

export default function ScrollProgressTimeline() {
  const [activeSection, setActiveSection] = useState("hero");

  const items: TimelineItem[] = [
    { id: "hero", label: "Hero", num: "01" },
    { id: "story", label: "Historia", num: "02" },
    { id: "tech", label: "Tecnología", num: "03" },
    { id: "workflow", label: "Proceso", num: "04" },
    { id: "benefits", label: "Beneficios", num: "05" },
    { id: "cognition", label: "Cognición", num: "06" },
    { id: "case-studies", label: "Casos", num: "07" },
    { id: "integrations", label: "Ecosistema", num: "08" },
    { id: "comparison", label: "Comparativa", num: "09" },
    { id: "testimonials", label: "Opiniones", num: "10" },
    { id: "faq", label: "FAQ", num: "11" },
    { id: "cta", label: "Suscripción", num: "12" }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (let i = 0; i < items.length; i++) {
        const el = document.getElementById(items[i].id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;

          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(items[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const activeIndex = items.findIndex((item) => item.id === activeSection);

  return (
    <div
      className="fixed right-6 md:right-8 top-1/2 transform -translate-y-1/2 z-40 hidden lg:flex flex-col items-center select-none pointer-events-none"
      id="peak-timeline-indicator"
    >
      <div className="relative flex flex-col items-center py-4">
        {/* Track Line */}
        <div className="w-[1px] h-[320px] bg-white/5 relative flex flex-col items-center">
          {/* Active Highlight Line with glowing effects */}
          <div
            className="absolute top-0 w-[1px] bg-gradient-to-b from-[#00f2ff] to-cyan-500 transition-all duration-700 ease-out shadow-[0_0_8px_#00f2ff]"
            style={{
              height: `${((activeIndex + 1) / items.length) * 320}px`
            }}
          />
        </div>

        {/* Floating Active Info Bubble */}
        <div className="absolute -left-20 flex flex-col items-end text-right transition-all duration-500 ease-out"
             style={{ top: `${(activeIndex / items.length) * 320 + 10}px` }}>
          <span className="font-mono text-[9px] text-gray-500 uppercase tracking-widest leading-none">PHASE</span>
          <span className="font-sans font-black text-xs text-white tracking-widest mt-1">
            {items[activeIndex]?.num}
          </span>
          <span className="font-mono text-[8px] text-[#00f2ff] tracking-[0.2em] uppercase mt-0.5">
            {items[activeIndex]?.label}
          </span>
        </div>

        {/* Hoverable Interactive Navigation Dots */}
        <div className="absolute inset-0 flex flex-col justify-between py-4 pointer-events-auto">
          {items.map((item, idx) => {
            const isActive = item.id === activeSection;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="group flex items-center justify-center w-4 h-4 relative"
                title={item.label}
              >
                {/* Visual Dot */}
                <span
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                    isActive
                      ? "bg-[#00f2ff] scale-150 shadow-[0_0_12px_#00f2ff]"
                      : "bg-white/20 group-hover:bg-white/60"
                  }`}
                />

                {/* Hover Label tag */}
                <span className="absolute right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none bg-black/90 border border-white/10 text-white font-mono text-[8px] uppercase tracking-wider py-1 px-2.5 rounded whitespace-nowrap shadow-xl">
                  {item.num} • {item.label}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
