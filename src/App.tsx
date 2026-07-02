import React, { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "./components/Navbar";
import ScrollProgressTimeline from "./components/ScrollProgressTimeline";
import Hero from "./sections/Hero";
import Story from "./sections/Story";
import TechSection from "./sections/TechSection";
import WorkflowSection from "./sections/WorkflowSection";
import BenefitsSection from "./sections/BenefitsSection";
import CognitionSection from "./sections/CognitionSection";
import CaseStudies from "./sections/CaseStudies";
import Integrations from "./sections/Integrations";
import ComparisonTable from "./sections/ComparisonTable";
import Testimonials from "./sections/Testimonials";
import FAQSection from "./sections/FAQSection";
import CTASection from "./sections/CTASection";
import FooterSection from "./sections/FooterSection";

export default function App() {
  useEffect(() => {
    // 1. Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // fluid decelerating curve
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    // 2. Register ScrollTrigger & Synchronize with Lenis
    gsap.registerPlugin(ScrollTrigger);
    
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // 3. Cinematic Storytelling - Connect and Reveal Elements
    const sections = [
      "hero",
      "story",
      "tech",
      "workflow",
      "benefits",
      "cognition",
      "case-studies",
      "integrations",
      "comparison",
      "testimonials",
      "faq",
      "cta"
    ];

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      // Classy reveal of section headings via custom clip-path slide
      const heading = el.querySelector("h2");
      if (heading) {
        gsap.fromTo(
          heading,
          {
            opacity: 0,
            y: 35,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse",
            }
          }
        );
      }

      // Elegant staggered animation of primary visual grids & bento cards
      const cards = el.querySelectorAll(".grid > div");
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          {
            opacity: 0,
            y: 45
          },
          {
            opacity: 1,
            y: 0,
            duration: 1.0,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              toggleActions: "play none none reverse",
            }
          }
        );
      }
    });

    // Cleanup
    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white selection:bg-white selection:text-black font-sans relative overflow-hidden antialiased">
      {/* 1. Global Background Atmosphere */}
      <div className="absolute inset-0 bg-[#0a0a0b] pointer-events-none" />
      
      {/* 2. Floating Navbar & Interactive Timeline */}
      <Navbar />
      <ScrollProgressTimeline />

      {/* 3. Immersive Sections in sequential storytelling order */}
      <main className="relative z-10">
        <Hero />
        <Story />
        <TechSection />
        <WorkflowSection />
        <BenefitsSection />
        <CognitionSection />
        <CaseStudies />
        <Integrations />
        <ComparisonTable />
        <Testimonials />
        <FAQSection />
        <CTASection />
      </main>

      {/* 4. Cinematic Brand credits footer */}
      <FooterSection />
    </div>
  );
}
