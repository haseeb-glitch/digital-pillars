import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

/**
 * =====================================================================
 * HERO → SERVICES SCROLL-DRIVEN TRANSITION HOOK
 * =====================================================================
 * 
 * Implements a single scroll-scrubbed GSAP timeline on a pinned Hero,
 * smoothly cross-fading the Hero exit and Services entrance.
 * 
 * TUNABLE KNOBS (see documentation for adjustments):
 * 1. SCROLL_DISTANCE: Distance the transition occupies (default: '+=120%', mobile: '+=80%')
 * 2. SCRUB_SMOOTHING: Smoothing delay in seconds (default: 1s)
 * 3. STAGGER_GAP: Delay between card/tile movements (0.08s cards, 0.12s tiles)
 * 4. Y_DISTANCES: Travel offsets (cards: -160, title: 90, feature: 110, tiles: 100)
 * 5. OVERLAP_TIMES: Start positions on timeline (cards: 0, title: 0.30, feature: 0.40, tiles: 0.50)
 */

export function useHeroTransition() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Accessibility check: Skip all pinning & animation if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const screenW = window.innerWidth;
    const isMobile = screenW < 768;

    // ── 1. Lenis Smooth Scroll Setup ──────────────────────────────────
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.5,
      infinite: false,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);
    const tickerCallback = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // ── 2. GSAP Context for Safe React Cleanup ────────────────────────
    const ctx = gsap.context(() => {
      const hero = document.querySelector<HTMLElement>('.hero');
      const heroScene = document.querySelector<HTMLElement>('.hero-scene');
      const heroCards = gsap.utils.toArray<HTMLElement>('.hero-card');
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const supportsFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      let removeMouseListeners = () => { };
      let introFinished = false;

      if (hero && heroScene && heroCards.length) {
        gsap.set(heroScene, { perspective: 1200, transformStyle: 'preserve-3d' });

        // ── 2a. Flying Cards Entrance From Respective Sides ─────────────
        const heroBounds = hero.getBoundingClientRect();
        const heroCenterX = heroBounds.left + heroBounds.width / 2;

        const cardFlyConfigs = heroCards.map((card) => {
          const cardRect = card.getBoundingClientRect();
          const cardCenterX = cardRect.left + cardRect.width / 2;
          const isRight = cardCenterX >= heroCenterX;

          // Safe, moderate lateral offset: keeps the whole card 100% complete and visible
          const startScale = isMobile ? 0.88 : 0.84;
          const shrinkPerSide = (cardRect.width * (1 - startScale)) / 2;

          let fromX = 0;
          if (isRight) {
            const maxRight = window.innerWidth - (cardRect.right - shrinkPerSide) - 20;
            fromX = Math.max(Math.min(maxRight, isMobile ? 55 : 95), 30);
          } else {
            const maxLeft = (cardRect.left + shrinkPerSide) - 20;
            fromX = -Math.max(Math.min(maxLeft, isMobile ? 55 : 95), 30);
          }

          const rotY = isRight ? (isMobile ? -8 : -14) : (isMobile ? 8 : 14);
          const rotZ = isRight ? (isMobile ? 1.5 : 2.5) : (isMobile ? -1.5 : -2.5);

          return {
            el: card,
            fromX,
            rotY,
            rotZ,
            startScale,
            // Bring ALL cards in once together - no staggered lag or half-card delay
            delay: 0.1,
            // Reduced pace: relaxed, unhurried, silky-smooth glide
            duration: isMobile ? 1.25 : 1.45,
          };
        });

        const isScrolledAtStart = window.scrollY > 40;

        if (!isScrolledAtStart) {
          // Set initial starting positions (complete card fully visible, never clipped or cut in half)
          cardFlyConfigs.forEach(({ el, fromX, rotY, rotZ, startScale }) => {
            gsap.set(el, {
              x: fromX,
              y: 0,
              rotateY: rotY,
              rotateZ: rotZ,
              scale: startScale,
              opacity: 0,
              transformPerspective: 1200,
              transformOrigin: 'center center',
            });
          });

          // Orchestrate flying entrance timeline
          const introTimeline = gsap.timeline({
            onComplete: () => {
              introFinished = true;
              cardFlyConfigs.forEach(({ el }) => {
                gsap.set(el, { clearProps: 'transformPerspective' });
              });
            },
          });

          cardFlyConfigs.forEach(({ el, fromX, rotY, rotZ, startScale, delay, duration }) => {
            introTimeline.fromTo(
              el,
              {
                x: fromX,
                y: 0,
                rotateY: rotY,
                rotateZ: rotZ,
                scale: startScale,
                opacity: 0,
              },
              {
                x: 0,
                y: 0,
                rotateY: 0,
                rotateZ: 0,
                scale: 1,
                opacity: 1,
                duration,
                ease: 'power2.out',
              },
              delay
            );
          });

          // If the user scrolls during the entrance flight, fast-forward to resting position
          const onEarlyScroll = () => {
            if (!introFinished) {
              introTimeline.progress(1);
              introFinished = true;
            }
            window.removeEventListener('scroll', onEarlyScroll);
          };
          window.addEventListener('scroll', onEarlyScroll, { passive: true });
        } else {
          introFinished = true;
          heroCards.forEach((card) => {
            gsap.set(card, { x: 0, y: 0, rotateY: 0, rotateZ: 0, scale: 1, opacity: 1, filter: 'none' });
          });
        }

        // ── 2b. 3D Mouse Parallax (activates once cards have landed) ───────
        const depths = [0.65, 1, 0.8, 1.2, 0.9];
        const cardAnimations = heroCards.map((card, index) => {
          const depth = depths[index % depths.length];
          return {
            rotX: gsap.quickTo(card, 'rotateX', { duration: 0.6, ease: 'power2.out' }),
            rotY: gsap.quickTo(card, 'rotateY', { duration: 0.6, ease: 'power2.out' }),
            x: gsap.quickTo(card, 'x', { duration: 0.6, ease: 'power2.out' }),
            y: gsap.quickTo(card, 'y', { duration: 0.6, ease: 'power2.out' }),
            depth,
          };
        });

        const onPointerMove = (event: PointerEvent) => {
          if (!introFinished) return;
          const bounds = hero.getBoundingClientRect();
          if (bounds.bottom < 0 || bounds.top > window.innerHeight) return;
          const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
          const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
          cardAnimations.forEach((animation) => {
            animation.rotX(-y * 6 * animation.depth);
            animation.rotY(x * 6 * animation.depth);
            animation.x(x * (isMobile ? 8 : 14) * animation.depth);
            animation.y(y * (isMobile ? 8 : 12) * animation.depth);
          });
        };

        const resetCards = () => {
          if (!introFinished) return;
          cardAnimations.forEach((animation) => {
            animation.rotX(0);
            animation.rotY(0);
            animation.x(0);
            animation.y(0);
          });
        };

        hero.addEventListener('pointermove', onPointerMove);
        hero.addEventListener('pointerdown', onPointerMove);
        hero.addEventListener('pointerleave', resetCards);
        hero.addEventListener('pointerup', resetCards);
        hero.addEventListener('pointercancel', resetCards);
        removeMouseListeners = () => {
          hero.removeEventListener('pointermove', onPointerMove);
          hero.removeEventListener('pointerdown', onPointerMove);
          hero.removeEventListener('pointerleave', resetCards);
          hero.removeEventListener('pointerup', resetCards);
          hero.removeEventListener('pointercancel', resetCards);
        };
      }

      // ── 2c. Scroll-scrubbed Hero Exit & Services Entrance Timeline ──
      const cardsY = isMobile ? -100 : -160;
      const titleY = isMobile ? 55 : 90;
      const featureY = isMobile ? 65 : 110;
      const scrollDistance = isMobile ? '+=80%' : '+=120%';
      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: scrollDistance,
          scrub: 1,
          pin: true,
          pinSpacing: false,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      timeline
        // Slow zoom in on the hero art (citadel & radiant clouds expand and draw closer)
        .fromTo(
          '.hero-art',
          { scale: 1, transformOrigin: isMobile ? '58% 38%' : '54% 45%' },
          {
            scale: isMobile ? 1.24 : 1.32,
            duration: 1,
            ease: 'none',
          },
          0
        )
        // Gentle background vertical parallax
        .to('.hero-bg', { yPercent: isMobile ? -8 : -10, duration: 1, ease: 'none' }, 0)
        // Cloud sunlight glow expands as clouds draw nearer
        .to('.sunlight', { scale: 1.35, opacity: 0.9, duration: 1, ease: 'none', transformOrigin: 'center center' }, 0)
        // Ambient glass ghost-planes dissolve and float away
        .to('.ghost-plane', { y: -60, scale: 0.88, opacity: 0, duration: 0.3, ease: 'power2.in' }, 0)
        // Foreground hero-copy recedes away into the distance ("while you are going away")
        .fromTo(
          '.hero-copy',
          { y: 0, opacity: 1, scale: 1, filter: 'blur(0px)' },
          {
            y: isMobile ? -50 : -85,
            opacity: 0,
            scale: 0.92,
            filter: 'blur(6px)',
            ease: 'power2.in',
            duration: 0.35,
          },
          0
        )
        // Floating metric cards recede and drift away in 3D
        .fromTo(
          '.hero-card',
          { y: 0, opacity: 1, scale: 1, rotateX: 0 },
          { y: cardsY, opacity: 0, scale: 0.90, rotateX: 8, stagger: { each: 0.08, from: 'end' }, ease: 'power2.in', duration: 0.35 },
          0
        )
        // Atmospheric overlay cross-fade into services
        .to('.hero-overlay', { opacity: 0.88, duration: 0.55, ease: 'none' }, 0.15)
        .fromTo('.services-title', { y: titleY, opacity: 0, filter: 'blur(6px)' }, { y: 0, opacity: 1, filter: 'blur(0px)', ease: 'power3.out', duration: 0.25 }, 0.3)
        .fromTo('.services-feature', { y: featureY, opacity: 0, scale: 0.97 }, { y: 0, opacity: 1, scale: 1, ease: 'power3.out', duration: 0.35 }, 0.4);

      const deviceImage = document.querySelector('.device-feature img');
      if (deviceImage) {
        timeline.fromTo(deviceImage, { yPercent: 8 }, { yPercent: 0, ease: 'power3.out', duration: 0.35 }, 0.4);
      }

      // SERVICES CARDS: scroll-scrubbed left slide, fade and blur with a waterfall stagger.
      const serviceCards = gsap.utils.toArray<HTMLElement>('.service-mosaic .service-card');
      if (serviceCards.length) {
        gsap.timeline({
          scrollTrigger: {
            trigger: '.service-mosaic',
            start: 'top 94%',
            end: 'top 52%',
            scrub: 0.35,
            invalidateOnRefresh: true,
          },
        }).fromTo(
          serviceCards,
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
      }

      return () => {
        removeMouseListeners();
      };
    });

    // Refresh ScrollTrigger after window load to ensure exact geometries
    const handleLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', handleLoad);

    // ── 3. Cleanup on Unmount ─────────────────────────────────────────
    return () => {
      window.removeEventListener('load', handleLoad);
      ctx.revert();
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);
}
