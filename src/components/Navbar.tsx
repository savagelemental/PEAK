import React, { useState, useEffect } from "react";
import { ChevronRight, Menu, X, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import RGB3DButton from "./RGB3DButton";
import Logo3DCanvas from "./Logo3DCanvas";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out px-6 md:px-16 py-5 ${
        scrolled
          ? "bg-[#0a0a0b]/80 backdrop-blur-xl border-b border-white/[0.04] py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo minimalista */}
        <a href="#hero" className="flex items-center space-x-3 group">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-sm overflow-hidden border border-white/5 bg-black/40 group-hover:border-[#00f2ff]/30 transition-all">
            <Logo3DCanvas />
          </div>
          <span className="font-sans font-black text-lg tracking-[-0.08em] uppercase text-white">
            PEAK
          </span>
          <span className="font-mono text-[9px] text-gray-500 border border-white/10 px-1.5 py-0.5 rounded tracking-[0.2em] uppercase">
            Cognitive
          </span>
        </a>

        {/* Links de navegación de diseño editorial */}
        <nav className="hidden md:flex items-center space-x-10 font-sans text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400">
          <a href="#story" className="hover:text-white transition-colors duration-300 relative py-1 group">
            La Historia
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full" />
          </a>
          <a href="#tech" className="hover:text-white transition-colors duration-300 relative py-1 group">
            Tecnología
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full" />
          </a>
          <a href="#workflow" className="hover:text-white transition-colors duration-300 relative py-1 group">
            Proceso
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full" />
          </a>
          <a href="#cognition" className="hover:text-white transition-colors duration-300 relative py-1 group">
            Cognición AI
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full" />
          </a>
          <a href="#comparison" className="hover:text-white transition-colors duration-300 relative py-1 group">
            Comparativa
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full" />
          </a>
        </nav>

        {/* Botón de acceso de marca exclusivo */}
        <div className="hidden md:flex items-center space-x-4">
          <RGB3DButton label="Contacto" href="#cta" />
        </div>

        {/* Botón móvil */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-gray-400 hover:text-white focus:outline-none"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Menú móvil expandido con estilo Glassmorphism sutil */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="md:hidden fixed inset-x-0 top-[60px] bottom-0 bg-[#0a0a0b]/95 backdrop-blur-2xl z-40 px-6 py-8 flex flex-col justify-between border-t border-white/[0.04]"
          >
            <nav className="flex flex-col space-y-6 font-sans text-sm font-bold uppercase tracking-[0.2em] text-gray-400">
              <a
                href="#story"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-white py-2 border-b border-white/[0.03]"
              >
                La Historia
              </a>
              <a
                href="#tech"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-white py-2 border-b border-white/[0.03]"
              >
                Tecnología
              </a>
              <a
                href="#workflow"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-white py-2 border-b border-white/[0.03]"
              >
                Proceso
              </a>
              <a
                href="#cognition"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-white py-2 border-b border-white/[0.03]"
              >
                Cognición AI
              </a>
              <a
                href="#comparison"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-white py-2 border-b border-white/[0.03]"
              >
                Comparativa
              </a>
            </nav>

            <div className="space-y-4">
              <RGB3DButton
                label="Contacto"
                href="#cta"
                onClick={() => {
                  setMobileMenuOpen(false);
                  const el = document.querySelector("#cta");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
