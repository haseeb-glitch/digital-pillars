import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

/**
 * Hook that initialises Lenis smooth scrolling and GSAP ScrollTrigger
 * reveal animations across the page. Call once from the root component.
 *
 * Important: This only *adds* scroll-driven animations on top of the
 * existing Framer Motion reveals. It does NOT touch layout, colours,
 * fonts, or any other visual property.
 */
export function useScrollAnimations() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    /* ── Respect user preference ─────────────────────────────── */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    /* ── Helper: batch-animate a selector ────────────────────── */
    const ctx = gsap.context(() => {
      const revealSection = (selector: string, trigger: string) => {
        const items = gsap.utils.toArray<HTMLElement>(selector);
        if (!items.length) return;

        gsap.timeline({
          scrollTrigger: {
            trigger,
            start: 'top 94%',
            end: 'top 52%',
            scrub: 0.35,
            invalidateOnRefresh: true,
          },
        }).fromTo(
          items,
          { x: -160, opacity: 0, filter: 'blur(8px)' },
          {
            x: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.6,
            stagger: 0.12,
            ease: 'power3.out',
          }
        );
      };

      // Matches the Services scroll-controlled slide, fade, blur and waterfall stagger.
      revealSection('.results .result-heading, .results .result-tile, .results .result-number, .results .result-chart', '.results');
      revealSection('.projects .section-heading-row, .projects .project-analytics > *, .projects .projects-gallery-title, .projects .projects-wrap, .projects .section-pagination', '.projects');
      revealSection('.testimonials-heading, .testimonials-carousel, .testimonials-controls', '.testimonials-section');
      revealSection('.contact-copy, .contact-visual', '.contact');
      revealSection('.footer-brand, .footer-column, .footer-bottom', '.footer');
    });

    /* Cleanup ──────────────────────────────────────────────── */
    return () => {
      ctx.revert();
    };
  }, []);
}
