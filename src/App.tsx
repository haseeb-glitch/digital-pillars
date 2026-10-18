'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { motion, useReducedMotion, useInView, animate, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, ChevronDown, Menu, Play, Globe2, Users2, Layers3, Code2, BarChart3, Bot, MessageCircle, Sparkles, Download, Check, X, Lock, Mail, ShieldCheck, Eye, EyeOff, Building2, Clock, Zap, Star, Send, Smile, Volume2, Keyboard, Loader2 } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import Testimonials from '@/components/testimonials';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useScrollAnimations } from './useScrollAnimations';
import { useHeroTransition } from './useHeroTransition';
import gsap from 'gsap';

const ease = [.22, 1, .36, 1] as const;
const navigation = [['Home', '#home'], ['Business', '#services'], ['Solutions', '#solutions'], ['Experience', '#results'], ['Websites', '#projects'], ['Reviews', '#reviews'], ['Contact Us', '#contact']];

export interface Solution {
  id: string;
  category: string;
  categoryGroup: 'growth' | 'tech' | 'creative' | 'strategy';
  title: string;
  eyebrow: string;
  tagline: string;
  summary: string;
  detailedDescription: string;
  image: string;
  deliverables: string[];
  metrics: { value: string; label: string }[];
  tags: string[];
  buttonText: string;
}

export const solutionsList: Solution[] = [
  {
    id: 'paid-social',
    category: 'Traffic & Acquisition',
    categoryGroup: 'growth',
    eyebrow: 'Traffic · Performance',
    title: 'Paid Social Advertising',
    tagline: 'Considered solutions. Meaningful experiences.',
    summary: 'Connect your brand with the right people, and turn attention into scalable opportunity.',
    detailedDescription: 'Reach the right audience with thoughtful creative, carefully targeted campaigns, and clear performance reporting. From first impression to conversion, every step works toward your business goals.',
    image: '/images/service-paid-social.jpg',
    deliverables: [
      'Audience Architecture & Precision Targeting',
      'Dynamic Creative Testing & Copy Iterations',
      'Full-Funnel Multi-Touch ROAS Attribution',
      'Daily Budget Rebalancing & Bid Optimization'
    ],
    metrics: [
      { value: '+247%', label: 'Average ROAS Lift' },
      { value: '3.2x', label: 'Return on Ad Spend' },
      { value: '14-Day', label: 'Sprint Deployment' }
    ],
    tags: ['Meta Ads', 'TikTok Ads', 'LinkedIn B2B', 'Dynamic Retargeting'],
    buttonText: 'Explore Service'
  },
  {
    id: 'web-dev',
    category: 'Engineering & Web',
    categoryGroup: 'tech',
    eyebrow: 'Architecture · Code',
    title: 'Website Development',
    tagline: 'Speed, precision, and modern web architecture.',
    summary: 'Create a powerful digital presence with responsive design, lightning speed, and seamless performance.',
    detailedDescription: 'Fast, responsive websites built around your brand. We bring design, content, and development together to make every interaction feel effortless, on every screen, with sub-second page loads and 100/100 Core Web Vitals.',
    image: '/images/service-web-dev.jpg',
    deliverables: [
      'Custom React & Next.js Architecture',
      'Headless CMS & Real-time Integrations',
      'Sub-second Page Load & Vitals Tuning',
      'Mobile-First Fluid Responsive UI'
    ],
    metrics: [
      { value: '< 0.8s', label: 'Avg Page Load' },
      { value: '99.9%', label: 'Platform Uptime' },
      { value: '100%', label: 'Mobile Responsive' }
    ],
    tags: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
    buttonText: 'View Solutions'
  },
  {
    id: 'brand-exp',
    category: 'Identity & Story',
    categoryGroup: 'creative',
    eyebrow: 'Create · Identity',
    title: 'Brand Experiences',
    tagline: 'Design-led strategy for unforgettable customer journeys.',
    summary: 'Design-led experiences that connect your identity, your story, and your audience across all touchpoints.',
    detailedDescription: 'Give your brand a consistent presence across every touchpoint, from digital identity and creative direction to engaging campaigns and memorable customer experiences that build lasting emotional connection.',
    image: '/images/service-brand-exp.jpg',
    deliverables: [
      'Complete Visual Identity & Design System',
      'Motion Guidelines & Micro-Interactions',
      'Omnichannel Digital Touchpoint Toolkit',
      'Interactive Storytelling & Brand Guidelines'
    ],
    metrics: [
      { value: '+133%', label: 'Brand Recall Lift' },
      { value: '500+', label: 'Identities Crafted' },
      { value: '5/5', label: 'Client Satisfaction' }
    ],
    tags: ['Visual Design', 'Design Systems', '3D Motion', 'Brand Identity'],
    buttonText: 'Learn More'
  },
  {
    id: 'retreats',
    category: 'Vision & Culture',
    categoryGroup: 'strategy',
    eyebrow: 'Gather · Connect',
    title: 'Retreats & Team Offsites',
    tagline: 'Curated space for clarity, culture, and alignment.',
    summary: 'Shared experiences, fresh perspectives, and space to shape what comes next for high-performing teams.',
    detailedDescription: 'Bring your team and your vision together. Thoughtfully designed experiences create space for fresh perspectives, meaningful connections, and a shared sense of direction for high-performing leadership.',
    image: '/images/service-retreats.jpg',
    deliverables: [
      'Executive Agenda & Session Facilitation',
      'Immersive Venue & Hospitality Curation',
      'Strategic Vision & Roadmap Workshops',
      'Post-Offsite Actionable Execution Framework'
    ],
    metrics: [
      { value: '98%', label: 'Leader Satisfaction' },
      { value: '100%', label: 'Team Alignment' },
      { value: '3x', label: 'Strategic Clarity' }
    ],
    tags: ['Executive Offsites', 'Strategic Vision', 'Team Alignment', 'Culture Building'],
    buttonText: 'Explore Retreats'
  },
  {
    id: 'ai-agents',
    category: 'Automation & AI',
    categoryGroup: 'tech',
    eyebrow: 'Next-Gen · Intelligence',
    title: 'AI Automation & Agents',
    tagline: 'Autonomous intelligence built directly into your operations.',
    summary: 'Deploy bespoke AI workflows, autonomous agents, and smart automations that eliminate friction and convert leads 24/7.',
    detailedDescription: 'Transform customer engagement and operational efficiency with custom AI agents. From 24/7 lead qualification chatbots to automated back-office pipelines, we integrate state-of-the-art LLMs securely into your business ecosystem.',
    image: '/images/service-ai-agents.jpg',
    deliverables: [
      'Custom Autonomous Agent Architecture',
      'RAG Enterprise Knowledge Integrations',
      '24/7 Intelligent Lead Qualification & Nurturing',
      'Zero-Friction Workflow & CRM Automation'
    ],
    metrics: [
      { value: '10x', label: 'Response Speed Lift' },
      { value: '70%', label: 'Manual Tasks Automated' },
      { value: '24/7', label: 'Continuous Availability' }
    ],
    tags: ['Autonomous AI', 'LLM Workflows', 'CRM Automation', 'Smart Agents'],
    buttonText: 'Explore AI Solutions'
  },
  {
    id: 'seo-organic',
    category: 'Organic Visibility',
    categoryGroup: 'growth',
    eyebrow: 'Search · Compound Growth',
    title: 'SEO & Organic Growth Engine',
    tagline: 'Topical authority engines for compound organic revenue.',
    summary: 'Dominate organic search with technical architecture optimization, topical authority mapping, and high-converting editorial engines.',
    detailedDescription: 'Capture high-intent customer search traffic organically. We construct technical crawl foundations, semantic topical clusters, and authoritative digital PR engines that build lasting search dominance.',
    image: '/images/service-seo-growth.jpg',
    deliverables: [
      'Comprehensive Technical SEO Architecture',
      'Topical Cluster Mapping & Intent Targeting',
      'Authority Backlink & Digital PR Outreach',
      'Conversion-Focused Content Sprints'
    ],
    metrics: [
      { value: '+380%', label: 'Organic Traffic Lift' },
      { value: 'Top 3', label: 'Competitive Keyword Ranks' },
      { value: '0$', label: 'Per-Click Ad Spend' }
    ],
    tags: ['Technical SEO', 'Content Clusters', 'Search Intent', 'Authority PR'],
    buttonText: 'Explore SEO'
  },
  {
    id: 'creative-video',
    category: 'Media & Motion',
    categoryGroup: 'creative',
    eyebrow: 'Media · Retention',
    title: 'Performance Creative & Video',
    tagline: 'High-retention visual assets engineered for social feeds.',
    summary: 'Cinematic short-form video, high-converting motion graphics, and dynamic visual assets engineered to convert.',
    detailedDescription: 'Stop the scroll and drive action with video creative engineered specifically for modern ad algorithms. We combine studio-grade production with direct-response testing to produce compelling, high-converting motion assets.',
    image: '/images/service-creative-video.jpg',
    deliverables: [
      'Short-Form Direct Response Video Production',
      'High-Impact 3D Product Visualizations',
      'Dynamic Hook & Angle Iteration Kits',
      'Multi-Platform Aspect Ratio Formatting'
    ],
    metrics: [
      { value: '4.8s+', label: 'Hook Retention Time' },
      { value: '+85%', label: 'Engagement Increase' },
      { value: '50+', label: 'Variations per Batch' }
    ],
    tags: ['Motion Graphics', 'Short-Form Video', '3D Visuals', 'Creative Sprints'],
    buttonText: 'View Media Production'
  },
  {
    id: 'cro-optimization',
    category: 'Revenue & Funnel',
    categoryGroup: 'growth',
    eyebrow: 'Revenue · Optimization',
    title: 'Conversion Rate Optimization',
    tagline: 'Scientific experimentation to maximize revenue per visitor.',
    summary: 'Turn existing traffic into qualified revenue through behavioral heatmaps, multivariate A/B testing, and frictionless UX design.',
    detailedDescription: 'Maximize the value of every visitor that lands on your site. Through behavioral heatmaps, clickstream analytics, and rigorous A/B experimentation, we systematically remove friction and increase checkout throughput.',
    image: '/images/service-cro.jpg',
    deliverables: [
      'Quantitative Funnel & Heatmap Analysis',
      'Hypothesis-Driven A/B & Multivariate Testing',
      'Checkout & Form Drop-off Elimination',
      'Personalized Dynamic Offer Frameworks'
    ],
    metrics: [
      { value: '+44%', label: 'Average Conversion Lift' },
      { value: '2.1x', label: 'Revenue Per Visitor' },
      { value: '95%+', label: 'Statistical Confidence' }
    ],
    tags: ['A/B Testing', 'Behavioral Heatmaps', 'Funnel UX', 'Checkout Optimization'],
    buttonText: 'View CRO Solutions'
  }
];

const serviceDescriptions: Record<string, string> = Object.fromEntries(
  solutionsList.map(s => [s.title, s.detailedDescription])
);
const projects = [
  { image: 'project-car.webp', name: 'Sarah M.', role: 'Automotive · Digital campaign', title: 'A new direction for automotive', text: 'A confident digital presence brings a premium vehicle range into focus. Clean design and carefully considered storytelling put the product first.' },
  { image: 'project-city.webp', name: 'James T.', role: 'Architecture · Brand experience', title: 'Built for a brighter tomorrow', text: 'An architectural brand experience inspired by the relationship between people, places, and possibility. Rich imagery meets a precise digital identity.' },
  { image: 'project-portrait.webp', name: 'Priya K.', role: 'Professional services · Website', title: 'People at the heart of the brand', text: 'A warm, professional website that makes expertise approachable. Clear information and thoughtful interactions help visitors take the next step.' }
];
const faqs = [
  ['What services do you offer?', 'Explore paid social advertising, website development, brand experiences, and retreats in Our Services. Each service card opens more detail.'],
  ['Will my website work on mobile?', 'Yes. The layout adapts to desktop, laptop, tablet, and mobile screens, with touch-friendly controls and reduced-motion support.'],
  ['How can I start a project?', 'Select Get in Touch to prepare a project brief. You can save it to your device and share it with your chosen team.'],
  ['Can I see your work?', 'Use the Featured Projects carousel to explore the three visual project examples. Select a card to see its overview.']
];

const heroParticles = [
  { left: 12, top: 18, size: 18, type: 'hero-orb', dur: 17, delay: -4, opacity: 0.65 },
  { left: 28, top: 35, size: 3, type: 'hero-star', dur: 12, delay: -7, opacity: 0.85 },
  { left: 45, top: 22, size: 14, type: 'hero-orb', dur: 15, delay: -11, opacity: 0.6 },
  { left: 62, top: 40, size: 4, type: 'hero-star', dur: 13, delay: -2, opacity: 0.9 },
  { left: 78, top: 28, size: 22, type: 'hero-orb', dur: 19, delay: -8, opacity: 0.55 },
  { left: 88, top: 55, size: 3, type: 'hero-star', dur: 11, delay: -14, opacity: 0.8 },
  { left: 20, top: 62, size: 12, type: 'hero-orb', dur: 16, delay: -5, opacity: 0.7 },
  { left: 36, top: 78, size: 26, type: 'hero-orb', dur: 21, delay: -13, opacity: 0.5 },
  { left: 54, top: 68, size: 4, type: 'hero-star', dur: 14, delay: -9, opacity: 0.85 },
  { left: 72, top: 82, size: 16, type: 'hero-orb', dur: 18, delay: -3, opacity: 0.65 },
  { left: 85, top: 75, size: 3, type: 'hero-star', dur: 12, delay: -10, opacity: 0.9 },
  { left: 8, top: 45, size: 4, type: 'hero-star', dur: 13, delay: -6, opacity: 0.8 },
  { left: 93, top: 32, size: 15, type: 'hero-orb', dur: 17, delay: -15, opacity: 0.6 }
];

const servicesAtmosphericParticles = [
  { left: 6, top: 4, size: 24, type: 'bokeh', blur: 4, opacity: 0.32, dur: 22, delay: -3 },
  { left: 18, top: 12, size: 3, type: 'sparkle', opacity: 0.95, dur: 11, delay: -8 },
  { left: 28, top: 8, size: 14, type: 'bubble', opacity: 0.7, dur: 17, delay: -12 },
  { left: 42, top: 3, size: 40, type: 'bokeh', blur: 5, opacity: 0.28, dur: 26, delay: -6 },
  { left: 58, top: 15, size: 3, type: 'sparkle', opacity: 0.85, dur: 13, delay: -2 },
  { left: 72, top: 7, size: 18, type: 'bubble', opacity: 0.65, dur: 19, delay: -15 },
  { left: 86, top: 14, size: 34, type: 'bokeh', blur: 4.5, opacity: 0.35, dur: 24, delay: -9 },
  { left: 94, top: 5, size: 2.5, type: 'sparkle', opacity: 0.9, dur: 12, delay: -5 },
  { left: 12, top: 28, size: 16, type: 'bubble', opacity: 0.68, dur: 18, delay: -11 },
  { left: 24, top: 38, size: 3, type: 'sparkle', opacity: 0.88, dur: 14, delay: -4 },
  { left: 35, top: 25, size: 48, type: 'bokeh', blur: 6, opacity: 0.25, dur: 28, delay: -14 },
  { left: 52, top: 34, size: 12, type: 'bubble', opacity: 0.72, dur: 16, delay: -7 },
  { left: 66, top: 26, size: 22, type: 'bokeh', blur: 3.5, opacity: 0.38, dur: 21, delay: -16 },
  { left: 82, top: 32, size: 3, type: 'sparkle', opacity: 0.92, dur: 12, delay: -1 },
  { left: 91, top: 42, size: 15, type: 'bubble', opacity: 0.62, dur: 19, delay: -10 },
  { left: 5, top: 52, size: 32, type: 'bokeh', blur: 5, opacity: 0.3, dur: 25, delay: -13 },
  { left: 16, top: 62, size: 2.5, type: 'sparkle', opacity: 0.85, dur: 13, delay: -8 },
  { left: 30, top: 56, size: 14, type: 'bubble', opacity: 0.7, dur: 17, delay: -3 },
  { left: 47, top: 48, size: 26, type: 'bokeh', blur: 4, opacity: 0.32, dur: 23, delay: -17 },
  { left: 63, top: 58, size: 3, type: 'sparkle', opacity: 0.9, dur: 12, delay: -9 },
  { left: 78, top: 50, size: 18, type: 'bubble', opacity: 0.65, dur: 18, delay: -5 },
  { left: 89, top: 64, size: 42, type: 'bokeh', blur: 5.5, opacity: 0.28, dur: 27, delay: -11 },
  { left: 8, top: 76, size: 15, type: 'bubble', opacity: 0.68, dur: 16, delay: -6 },
  { left: 22, top: 86, size: 3, type: 'sparkle', opacity: 0.88, dur: 14, delay: -15 },
  { left: 38, top: 78, size: 36, type: 'bokeh', blur: 4.5, opacity: 0.32, dur: 24, delay: -2 },
  { left: 54, top: 88, size: 12, type: 'bubble', opacity: 0.72, dur: 17, delay: -10 },
  { left: 70, top: 82, size: 2.5, type: 'sparkle', opacity: 0.95, dur: 11, delay: -7 },
  { left: 85, top: 90, size: 20, type: 'bubble', opacity: 0.6, dur: 20, delay: -14 },
  { left: 95, top: 80, size: 28, type: 'bokeh', blur: 4, opacity: 0.35, dur: 22, delay: -4 }
];

const ambientBubbles = [
  // Services & Solutions section
  { left: 8, top: 1.2, size: 22, type: 'bubble', opacity: 0.65, dur: 18, delay: -3 },
  { left: 22, top: 2.8, size: 12, type: 'bubble', opacity: 0.7, dur: 15, delay: -8 },
  { left: 45, top: 0.8, size: 38, type: 'bokeh', opacity: 0.35, dur: 22, delay: -12 },
  { left: 78, top: 2.1, size: 18, type: 'bubble', opacity: 0.6, dur: 17, delay: -5 },
  { left: 91, top: 3.5, size: 4, type: 'sparkle', opacity: 0.85, dur: 12, delay: -2 },
  { left: 14, top: 5.4, size: 30, type: 'bokeh', opacity: 0.38, dur: 20, delay: -9 },
  { left: 32, top: 6.2, size: 16, type: 'bubble', opacity: 0.65, dur: 16, delay: -14 },
  { left: 63, top: 4.8, size: 8, type: 'bubble', opacity: 0.75, dur: 14, delay: -7 },
  { left: 84, top: 7.0, size: 26, type: 'bubble', opacity: 0.55, dur: 19, delay: -11 },
  { left: 5, top: 9.5, size: 3, type: 'sparkle', opacity: 0.9, dur: 13, delay: -4 },
  { left: 48, top: 8.8, size: 14, type: 'bubble', opacity: 0.7, dur: 16, delay: -15 },
  { left: 71, top: 10.2, size: 42, type: 'bokeh', opacity: 0.32, dur: 24, delay: -6 },
  { left: 26, top: 12.0, size: 20, type: 'bubble', opacity: 0.6, dur: 18, delay: -10 },
  { left: 39, top: 13.5, size: 10, type: 'bubble', opacity: 0.75, dur: 15, delay: -1 },
  { left: 88, top: 12.8, size: 15, type: 'bubble', opacity: 0.65, dur: 17, delay: -13 },
  { left: 12, top: 15.2, size: 35, type: 'bokeh', opacity: 0.35, dur: 21, delay: -8 },
  { left: 56, top: 14.6, size: 4, type: 'sparkle', opacity: 0.85, dur: 14, delay: -4 },
  { left: 68, top: 16.5, size: 24, type: 'bubble', opacity: 0.58, dur: 19, delay: -16 },
  { left: 95, top: 17.2, size: 12, type: 'bubble', opacity: 0.7, dur: 16, delay: -3 },
  { left: 18, top: 19.0, size: 18, type: 'bubble', opacity: 0.65, dur: 18, delay: -7 },
  { left: 42, top: 18.2, size: 48, type: 'bokeh', opacity: 0.3, dur: 25, delay: -11 },
  { left: 81, top: 20.5, size: 9, type: 'bubble', opacity: 0.75, dur: 15, delay: -5 },
  { left: 29, top: 22.1, size: 14, type: 'bubble', opacity: 0.7, dur: 16, delay: -12 },
  { left: 62, top: 21.8, size: 3, type: 'sparkle', opacity: 0.9, dur: 13, delay: -2 },
  { left: 90, top: 23.9, size: 28, type: 'bokeh', opacity: 0.36, dur: 20, delay: -9 },

  // Results & Impact section
  { left: 7, top: 26.2, size: 22, type: 'bubble', opacity: 0.65, dur: 17, delay: -14 },
  { left: 24, top: 28.0, size: 12, type: 'bubble', opacity: 0.75, dur: 15, delay: -6 },
  { left: 49, top: 27.1, size: 36, type: 'bokeh', opacity: 0.34, dur: 23, delay: -18 },
  { left: 74, top: 29.5, size: 16, type: 'bubble', opacity: 0.65, dur: 18, delay: -3 },
  { left: 86, top: 27.8, size: 4, type: 'sparkle', opacity: 0.85, dur: 12, delay: -10 },
  { left: 15, top: 31.4, size: 10, type: 'bubble', opacity: 0.7, dur: 16, delay: -7 },
  { left: 38, top: 32.8, size: 26, type: 'bubble', opacity: 0.58, dur: 20, delay: -15 },
  { left: 65, top: 33.2, size: 44, type: 'bokeh', opacity: 0.3, dur: 24, delay: -8 },
  { left: 92, top: 34.6, size: 18, type: 'bubble', opacity: 0.62, dur: 17, delay: -1 },
  { left: 4, top: 36.5, size: 32, type: 'bokeh', opacity: 0.35, dur: 22, delay: -11 },
  { left: 28, top: 37.8, size: 14, type: 'bubble', opacity: 0.7, dur: 15, delay: -4 },
  { left: 52, top: 36.2, size: 3, type: 'sparkle', opacity: 0.9, dur: 13, delay: -9 },
  { left: 77, top: 39.0, size: 20, type: 'bubble', opacity: 0.65, dur: 19, delay: -13 },
  { left: 94, top: 41.2, size: 12, type: 'bubble', opacity: 0.75, dur: 16, delay: -6 },
  { left: 19, top: 42.5, size: 25, type: 'bubble', opacity: 0.6, dur: 18, delay: -16 },
  { left: 44, top: 43.1, size: 40, type: 'bokeh', opacity: 0.32, dur: 25, delay: -2 },
  { left: 69, top: 44.4, size: 8, type: 'bubble', opacity: 0.8, dur: 14, delay: -10 },

  // Featured Projects section
  { left: 11, top: 47.0, size: 16, type: 'bubble', opacity: 0.65, dur: 17, delay: -5 },
  { left: 34, top: 48.5, size: 4, type: 'sparkle', opacity: 0.85, dur: 12, delay: -8 },
  { left: 58, top: 46.8, size: 30, type: 'bokeh', opacity: 0.36, dur: 21, delay: -14 },
  { left: 83, top: 49.2, size: 22, type: 'bubble', opacity: 0.6, dur: 18, delay: -1 },
  { left: 6, top: 52.1, size: 38, type: 'bokeh', opacity: 0.33, dur: 23, delay: -9 },
  { left: 25, top: 53.4, size: 12, type: 'bubble', opacity: 0.7, dur: 15, delay: -17 },
  { left: 47, top: 51.9, size: 20, type: 'bubble', opacity: 0.65, dur: 19, delay: -4 },
  { left: 73, top: 54.6, size: 14, type: 'bubble', opacity: 0.72, dur: 16, delay: -12 },
  { left: 89, top: 55.8, size: 3, type: 'sparkle', opacity: 0.9, dur: 13, delay: -7 },
  { left: 16, top: 57.5, size: 26, type: 'bubble', opacity: 0.58, dur: 20, delay: -15 },
  { left: 39, top: 59.0, size: 10, type: 'bubble', opacity: 0.75, dur: 14, delay: -3 },
  { left: 63, top: 58.2, size: 46, type: 'bokeh', opacity: 0.28, dur: 26, delay: -10 },
  { left: 81, top: 61.4, size: 18, type: 'bubble', opacity: 0.65, dur: 18, delay: -18 },
  { left: 96, top: 62.5, size: 5, type: 'sparkle', opacity: 0.85, dur: 12, delay: -6 },
  { left: 22, top: 64.0, size: 15, type: 'bubble', opacity: 0.7, dur: 16, delay: -11 },

  // Reviews / Testimonials section
  { left: 8, top: 66.8, size: 34, type: 'bokeh', opacity: 0.35, dur: 22, delay: -4 },
  { left: 31, top: 68.2, size: 12, type: 'bubble', opacity: 0.75, dur: 15, delay: -13 },
  { left: 54, top: 67.4, size: 22, type: 'bubble', opacity: 0.6, dur: 19, delay: -8 },
  { left: 76, top: 69.8, size: 4, type: 'sparkle', opacity: 0.9, dur: 13, delay: -1 },
  { left: 88, top: 71.0, size: 28, type: 'bubble', opacity: 0.55, dur: 20, delay: -16 },
  { left: 14, top: 73.5, size: 16, type: 'bubble', opacity: 0.68, dur: 17, delay: -9 },
  { left: 42, top: 72.8, size: 48, type: 'bokeh', opacity: 0.3, dur: 25, delay: -5 },
  { left: 67, top: 75.2, size: 10, type: 'bubble', opacity: 0.75, dur: 14, delay: -14 },
  { left: 91, top: 76.5, size: 20, type: 'bubble', opacity: 0.62, dur: 18, delay: -2 },
  { left: 5, top: 78.8, size: 3, type: 'sparkle', opacity: 0.9, dur: 12, delay: -11 },
  { left: 27, top: 79.9, size: 18, type: 'bubble', opacity: 0.65, dur: 16, delay: -7 },
  { left: 59, top: 81.2, size: 32, type: 'bokeh', opacity: 0.36, dur: 21, delay: -15 },
  { left: 82, top: 82.0, size: 14, type: 'bubble', opacity: 0.7, dur: 17, delay: -4 },

  // Contact & Footer section
  { left: 12, top: 84.5, size: 24, type: 'bubble', opacity: 0.6, dur: 19, delay: -10 },
  { left: 36, top: 85.8, size: 12, type: 'bubble', opacity: 0.75, dur: 15, delay: -1 },
  { left: 60, top: 85.0, size: 4, type: 'sparkle', opacity: 0.85, dur: 13, delay: -8 },
  { left: 78, top: 87.4, size: 40, type: 'bokeh', opacity: 0.32, dur: 24, delay: -13 },
  { left: 93, top: 88.8, size: 16, type: 'bubble', opacity: 0.65, dur: 16, delay: -5 },
  { left: 18, top: 91.2, size: 36, type: 'bokeh', opacity: 0.34, dur: 22, delay: -17 },
  { left: 45, top: 92.0, size: 14, type: 'bubble', opacity: 0.7, dur: 17, delay: -3 },
  { left: 69, top: 93.6, size: 26, type: 'bubble', opacity: 0.58, dur: 20, delay: -11 },
  { left: 86, top: 94.8, size: 8, type: 'bubble', opacity: 0.8, dur: 14, delay: -7 },
  { left: 9, top: 96.5, size: 3, type: 'sparkle', opacity: 0.9, dur: 12, delay: -15 },
  { left: 33, top: 97.2, size: 20, type: 'bubble', opacity: 0.62, dur: 18, delay: -6 },
  { left: 58, top: 98.4, size: 30, type: 'bokeh', opacity: 0.35, dur: 23, delay: -12 },
  { left: 81, top: 99.1, size: 12, type: 'bubble', opacity: 0.72, dur: 15, delay: -2 }
];

function Mark() { return <svg viewBox="0 0 28 38" fill="none" aria-hidden="true"><path d="M3 10 8 7v24l-5-3V10Zm8-7 6 3v29l-6-3V3Zm9 5 5 3v15l-5 3V8Z" fill="currentColor" /><path d="m11 3 6-3v3m-6 32v3l6-3" stroke="currentColor" strokeWidth="1.2" /></svg> }
function Reveal({ children, className = '', delay = 0, id }: { children: ReactNode, className?: string, delay?: number, id?: string }) {
  const reduce = useReducedMotion(); return <motion.div id={id} className={className} initial={reduce ? false : { opacity: 0, y: 24, filter: 'blur(3px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ once: true, amount: .12 }} transition={{ duration: .75, delay, ease }}>{children}</motion.div>
}
function NumberRise({ value, suffix = '' }: { value: number, suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null); const seen = useInView(ref, { once: true }); const reduce = useReducedMotion();
  useEffect(() => { if (!seen || !ref.current) return; if (reduce) { ref.current.textContent = `${value}${suffix}`; return; } const stop = animate(0, value, { duration: 1.8, ease, onUpdate: (n) => { if (ref.current) ref.current.textContent = `${Math.round(n)}${suffix}` } }); return () => stop.stop() }, [seen, reduce, value, suffix]);
  return <span ref={ref}>{value}{suffix}</span>
}
function LineChart({ gold = false, blue = false, id = 'chart', compact = false }: { gold?: boolean, blue?: boolean, id?: string, compact?: boolean }) {
  const reduce = useReducedMotion(); const color = gold ? '#eac992' : blue ? '#a5cedb' : '#84d7c7'; return <svg viewBox="0 0 300 105" className={'line-chart ' + (compact ? 'compact' : '')} role="img" aria-label="Performance trend chart"><defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity=".28" /><stop offset="100%" stopColor={color} stopOpacity="0" /></linearGradient></defs>{[22, 48, 74, 100].map(y => <path key={y} d={`M0 ${y}H300`} stroke="white" strokeOpacity=".055" />)}<path d="M0 94 22 80 35 85 55 55 76 65 96 36 114 47 137 21 151 27 172 61 190 67 208 49 228 54 246 35 267 40 285 14 300 7V105H0Z" fill={`url(#${id})`} /><motion.path d="M0 94 22 80 35 85 55 55 76 65 96 36 114 47 137 21 151 27 172 61 190 67 208 49 228 54 246 35 267 40 285 14 300 7" stroke={color} strokeWidth="1.8" fill="none" initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: reduce ? 0 : 2, ease }} /><circle cx="300" cy="7" r="3" fill={color} /></svg>
}
function Bars() { return <div className="bars" aria-label="Increasing conversion trend">{[19, 28, 40, 33, 55, 67, 59, 83, 91, 77, 96, 108].map((h, i) => <span key={i} style={{ height: `${h / 1.4}%`, animationDelay: `${i * .09}s` }} />)}</div> }
function Ring({ number = '98%', small = false }: { number?: string, small?: boolean }) { return <span className={'gauge-ring ' + (small ? 'small' : '')}><svg viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="21" stroke="currentColor" strokeOpacity=".15" fill="none" strokeWidth="4" /><circle cx="26" cy="26" r="21" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="116 132" transform="rotate(-90 26 26)" /></svg><b>{number}</b></span> }

export default function Home() {
  const [scene, setScene] = useState(0);
  const [active, setActive] = useState(0);
  const [projectDirection, setProjectDirection] = useState(1);
  const [expandedSolution, setExpandedSolution] = useState<string | null>('web-dev');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [modal, setModal] = useState<string | null>(null);
  const [briefSaved, setBriefSaved] = useState(false);
  const [enquiryStatus, setEnquiryStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [enquiryClientName, setEnquiryClientName] = useState('');
  const [customBudget, setCustomBudget] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);
  const [faqActiveItem, setFaqActiveItem] = useState<number | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{ id: string; sender: 'user' | 'bot'; text: string; isBriefAction?: boolean }[]>([]);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const chatboxRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const projectDragRef = useRef<{ x: number; y: number } | null>(null);
  const reduce = useReducedMotion();

  useHeroTransition();
  useScrollAnimations();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (faqOpen && chatboxRef.current && !chatboxRef.current.contains(e.target as Node)) {
        const launcher = document.querySelector('.assistant-widget');
        if (launcher && launcher.contains(e.target as Node)) return;
        setFaqOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [faqOpen]);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatHistory, faqActiveItem]);

  useEffect(() => {
    const el = chatboxRef.current;
    if (!el || !faqOpen) return;

    const handleWheel = (e: WheelEvent) => {
      e.stopPropagation();
      const bodyEl = chatScrollRef.current;
      if (!bodyEl) return;

      const isScrollable = bodyEl.scrollHeight > bodyEl.clientHeight;
      if (isScrollable) {
        bodyEl.scrollTop += e.deltaY;
        e.preventDefault();
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', handleWheel);
    };
  }, [faqOpen]);

  function handleSendChatMessage(text?: string) {
    const query = (text || chatInput).trim();
    if (!query) return;

    const userMsgId = 'msg-' + Date.now();
    const botMsgId = 'bot-' + (Date.now() + 1);

    const lower = query.toLowerCase();
    let botReply = '';
    let isBriefAction = false;

    const matchedFaq = faqs.find(([q]) => q.toLowerCase().includes(lower) || lower.includes(q.toLowerCase().slice(0, 15)));
    if (matchedFaq) {
      botReply = matchedFaq[1];
      if (matchedFaq[0].includes('start a project')) isBriefAction = true;
    } else if (lower.includes('service') || lower.includes('offer') || lower.includes('work')) {
      botReply = 'We specialize in Paid Social Advertising, High-Conversion Web Development, Brand Identity & Media, and Executive Strategy.';
    } else if (lower.includes('price') || lower.includes('cost') || lower.includes('budget') || lower.includes('hire') || lower.includes('start')) {
      botReply = 'You can prepare an instant confidential Project Brief or connect with our team directly. Scope discovery begins within 24 hours.';
      isBriefAction = true;
    } else if (lower.includes('contact') || lower.includes('email') || lower.includes('phone') || lower.includes('reach')) {
      botReply = 'Reach our Global Intake Desk directly at partners@digitalpillars.agency, or use our Project Brief intake tool.';
      isBriefAction = true;
    } else {
      botReply = `Thanks for asking. For "${query}", our senior leads can structure a tailored proposal. Would you like to prepare a project brief?`;
      isBriefAction = true;
    }

    setChatHistory(prev => [
      ...prev,
      { id: userMsgId, sender: 'user', text: query },
      { id: botMsgId, sender: 'bot', text: botReply, isBriefAction }
    ]);
    setChatInput('');
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 70);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);


  function parallax(event: React.PointerEvent) {
    if (reduce) return;
    const r = event.currentTarget.getBoundingClientRect();
    sceneRef.current?.style.setProperty('--mx', `${(event.clientX - r.left) / r.width - .5}`);
    sceneRef.current?.style.setProperty('--my', `${(event.clientY - r.top) / r.height - .5}`);
  }

  function glassPointer(event: React.PointerEvent) {
    if (reduce) return;
    const card = (event.target as Element).closest<HTMLElement>('.glass');
    if (!card) return;
    const r = card.getBoundingClientRect(), x = (event.clientX - r.left) / r.width, y = (event.clientY - r.top) / r.height;
    card.style.setProperty('--glass-x', `${x * 100}%`);
    card.style.setProperty('--glass-y', `${y * 100}%`);
    card.style.setProperty('--glass-axis-x', `${-(y - .5)}`);
    card.style.setProperty('--glass-axis-y', `${x - .5}`);
    card.style.setProperty('--glass-angle', `${Math.hypot(x - .5, y - .5) * (card.classList.contains('testimonial-card') ? 6 : 12)}deg`);

    document.querySelectorAll('.is-touched').forEach((el) => {
      if (el !== card) el.classList.remove('is-touched');
    });
    card.classList.add('is-touched');
  }

  function glassOut(event: React.PointerEvent) {
    const card = (event.target as Element).closest<HTMLElement>('.glass');
    if (card && (event.type === 'pointerup' || event.type === 'pointercancel' || !card.contains(event.relatedTarget as Node))) {
      setTimeout(() => {
        card.style.setProperty('--glass-angle', '0deg');
        card.style.setProperty('--glass-x', '22%');
        card.style.setProperty('--glass-y', '0%');
        card.classList.remove('is-touched');
      }, 300);
    }
  }

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginState, setLoginState] = useState<'idle' | 'loading' | 'authenticated'>('idle');

  function openBrief() {
    setBriefSaved(false);
    setEnquiryStatus('idle');
    setEnquiryClientName('');
    setModal('contact');
  }

  function handleLoginSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoginState('loading');
    setTimeout(() => {
      setLoginState('authenticated');
    }, 600);
  }

  function viewSolutionDetail(idOrTitle: string) {
    const match = solutionsList.find(s => s.id === idOrTitle || s.title === idOrTitle);
    const targetId = match ? match.id : idOrTitle;
    setExpandedSolution(prev => (prev === targetId ? null : targetId));
    const el = document.getElementById('solutions');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function cycle(direction: number) {
    setProjectDirection(direction);
    setActive(n => (n + direction + projects.length) % projects.length);
  }

  async function handleSendEnquiry(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEnquiryStatus('sending');
    const data = new FormData(e.currentTarget);

    const name = (data.get('name') as string)?.trim() || 'N/A';
    const email = (data.get('email') as string)?.trim() || 'N/A';
    const company = (data.get('company') as string)?.trim() || 'N/A';
    const service = (data.get('service') as string)?.trim() || 'General Inquiry / Full Ecosystem';
    const budget = data.get('budget') === 'Custom budget'
      ? ((data.get('customBudget') as string)?.trim() || 'Custom budget')
      : ((data.get('budget') as string)?.trim() || 'Flexible / To be scoped');
    const timeline = (data.get('timeline') as string)?.trim() || '1 - 3 Months';
    const details = (data.get('details') as string)?.trim() || '';

    setEnquiryClientName(name);

    const emailSubject = `Project Enquiry: ${service} — ${name}${company !== 'N/A' ? ` (${company})` : ''}`;
    const emailBody = `DIGITAL PILLARS — NEW PROJECT ENQUIRY
Generated: ${new Date().toLocaleDateString('en-US', { dateStyle: 'full' })}

--------------------------------------------------
CLIENT INFORMATION
--------------------------------------------------
Name:     ${name}
Email:    ${email}
Company:  ${company}

--------------------------------------------------
ENGAGEMENT SCOPE
--------------------------------------------------
Service:  ${service}
Budget:   ${budget}
Timeline: ${timeline}

--------------------------------------------------
PROJECT VISION & OBJECTIVES
--------------------------------------------------
${details}

--------------------------------------------------
Submitted via Digital Pillars Project Intake
To: partners@digitalpillars.agency
--------------------------------------------------`;

    // Attempt direct background form dispatch
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      await fetch('https://formsubmit.co/ajax/partners@digitalpillars.agency', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: emailSubject,
          Name: name,
          Email: email,
          Company: company,
          Service: service,
          Budget: budget,
          Timeline: timeline,
          VisionAndGoals: details,
          _template: 'table'
        }),
        signal: controller.signal
      }).catch(() => null);
      clearTimeout(timeoutId);
    } catch {
      // Ignore background network errors
    }

    // Launch email composer pre-filled with the exact details addressed to partners@digitalpillars.agency
    const mailtoUrl = `mailto:partners@digitalpillars.agency?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    const link = document.createElement('a');
    link.href = mailtoUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();

    setEnquiryStatus('sent');
  }

  const categories = [
    { id: 'all', label: `All Solutions (${solutionsList.length})` },
    { id: 'growth', label: 'Traffic & Growth' },
    { id: 'tech', label: 'Engineering & AI' },
    { id: 'creative', label: 'Identity & Media' },
    { id: 'strategy', label: 'Vision & Culture' }
  ];

  const displayedSolutions = activeCategory === 'all'
    ? solutionsList
    : solutionsList.filter(s => s.categoryGroup === activeCategory);

  return <>
    <a className="skip-link" href="#services">Skip to content</a>
    <header className={'site-header ' + (scrolled ? 'scrolled' : '')}>
      <div className="nav-shell">
        <a href="#home" className="brand" aria-label="Digital Pillars home">
          <Mark />
          <span>Digital<span className="brand-full"> Pillars</span></span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map(([label, href]) => (
            <a key={label} href={href} className={label === 'Home' ? 'active' : ''}>
              {label}
            </a>
          ))}
        </nav>
        <div className="nav-actions">
          <button className="login-link" onClick={() => setModal('login')}>Log In</button>
          <button className="button gold nav-cta" onClick={openBrief}>Get in Touch</button>
          <button className="menu-button" aria-label="Open navigation" onClick={() => setMobileMenu(true)}>
            <Menu size={22} />
          </button>
        </div>
      </div>
    </header>

    <main
      onPointerDown={glassPointer}
      onPointerMove={glassPointer}
      onPointerUp={glassOut}
      onPointerCancel={glassOut}
      onPointerOut={glassOut}
    >
      <section
        className={'hero scene-' + scene}
        id="home"
        onPointerDown={parallax}
        onPointerMove={parallax}
        onPointerUp={() => { sceneRef.current?.style.setProperty('--mx', '0'); sceneRef.current?.style.setProperty('--my', '0'); }}
        onPointerLeave={() => { sceneRef.current?.style.setProperty('--mx', '0'); sceneRef.current?.style.setProperty('--my', '0'); }}
        onPointerCancel={() => { sceneRef.current?.style.setProperty('--mx', '0'); sceneRef.current?.style.setProperty('--my', '0'); }}
      >
        <div className="hero-scene" ref={sceneRef}>
          <div className="hero-environment hero-bg" aria-hidden="true">
            <img className="hero-art glass-tower" src="/images/citadel.png" alt="" />
            <picture>
              <source media="(max-width: 959px)" srcSet="/images/citadel.png" />
              <img className="hero-art city-tower" src="/images/citadel.png" alt="Futuristic crystal citadel among radiant atmospheric clouds" fetchPriority="high" />
            </picture>
            <div className="atmosphere" />
            <div className="sunlight" />
          </div>
          <div className="hero-overlay" aria-hidden="true" />
          <div className="ghost-plane plane-one" />
          <div className="ghost-plane plane-two" />
          <div className="ghost-plane plane-three" />
          <div className="hero-copy">
            <motion.h1 initial={reduce ? false : { opacity: 0, y: 15, filter: 'blur(4px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 1, delay: .4, ease }}>
              Digital Foundations<br /><span>for a Brighter Tomorrow</span>
            </motion.h1>
            <motion.p initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .65, duration: .8, ease }}>
              Build your digital future on solid foundations.<br />Creating brands, experiences, and room to grow.
            </motion.p>
            <motion.div className="button-row" initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .8, duration: .8, ease }}>
              <a className="button gold" href="#services">Learn More</a>
              <a className="button outline" href="#projects">Our Work <ArrowRight size={14} /></a>
            </motion.div>
          </div>
          <div className="metric-position traffic-position hero-card">
            <div className="glass hero-metric traffic">
              <div className="dashboard-heading"><span><Mark /> Digital Pillars</span><i>↗</i></div>
              <small>Traffic growth</small>
              <strong>+247<span>%</span></strong>
              <LineChart gold id="traffic-gradient" />
            </div>
          </div>
          <div className="metric-position conversion-position hero-card">
            <div className="glass hero-metric conversion">
              <div className="dashboard-heading"><span>Growth Performance</span><i>•••</i></div>
              <div className="dashboard-subhead"><b>Built to grow.</b><span>Overview <ChevronRight size={10} /></span></div>
              <LineChart blue id="growth-gradient" />
              <div className="axis-labels"><span>JAN</span><span>MAR</span><span>MAY</span><span>JUL</span><span>SEP</span></div>
              <div className="dashboard-bottom">
                <div><Ring number="68%" small /><span><small>Return</small><b>4.3x</b></span></div>
                <div><small>Traffic growth</small><b>+247%</b></div>
                <div><small>Conversion</small><b>3.2%</b></div>
              </div>
            </div>
          </div>
          <div className="metric-position uptime-position hero-card">
            <div className="glass hero-metric uptime">
              <div className="dashboard-heading"><span><Mark /> Conversion Overview</span><i>•••</i></div>
              <div className="dashboard-project"><span><small>Always connected</small><b>99.99%</b><small>Uptime</small></span><img src="/images/citadel.png" alt="" /></div>
              <div className="dashboard-summary"><span><small>Conversion</small><b>3.2%</b></span><span><small>Growth</small><b>+247%</b></span></div>
              <div className="dashboard-rings"><span><small>Performance</small><b>98%</b></span><Ring number="68%" small /><Ring number="98%" small /></div>
            </div>
          </div>
          <div className="metric-position latency-position hero-card">
            <div className="glass hero-metric latency">
              <div className="dashboard-heading"><span>Fast · Reliable</span><i>↗</i></div>
              <strong>98<span>ms</span></strong>
              <LineChart blue id="latency-gradient" />
            </div>
          </div>
          <div className="metric-position return-position hero-card">
            <div className="glass hero-metric return-card">
              <div className="dashboard-heading"><span>Digital Connections</span><i>↗</i></div>
              <strong>3,331</strong>
              <LineChart id="connections-gradient" />
              <div className="dashboard-footnote"><span>THIS YEAR</span><b>↗ 1.40%</b></div>
            </div>
          </div>
          <div className="hero-particles" aria-hidden="true">
            {heroParticles.map((p, i) => (
              <i key={i} className={p.type} style={{ left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size, opacity: p.opacity, animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s` } as CSSProperties} />
            ))}
          </div>
        </div>
        <div className="hero-fade" />
        <div className="pagination hero-pagination" aria-label="Hero scene">
          {[0, 1, 2].map(n => (
            <button key={n} aria-label={`Show hero scene ${n + 1}`} aria-pressed={n === scene} className={n === scene ? 'selected' : ''} onClick={() => setScene(n)} />
          ))}
        </div>
      </section>

      <div className="page-body">
        <div className="ambient-particles" aria-hidden="true">
          {ambientBubbles.map((b, i) => (
            <span key={i} className={`ambient-bubble type-${b.type}`} style={{ left: `${b.left}%`, top: `${b.top}%`, width: b.size, height: b.size, opacity: b.opacity, animationDuration: `${b.dur}s`, animationDelay: `${b.delay}s` } as CSSProperties} />
          ))}
        </div>

        <section className="services section-shell" id="services">

          {/* Floating Atmospheric Dust, Star Specks & Bokeh Particles */}
          <div className="services-particles" aria-hidden="true">
            {servicesAtmosphericParticles.map((p, i) => (
              <span
                key={i}
                className={`services-particle type-${p.type}`}
                style={{
                  left: `${p.left}%`,
                  top: `${p.top}%`,
                  width: p.size,
                  height: p.size,
                  opacity: p.opacity,
                  filter: p.blur ? `blur(${p.blur}px)` : undefined,
                  animationDuration: `${p.dur}s`,
                  animationDelay: `${p.delay}s`,
                } as CSSProperties}
              />
            ))}
          </div>

          <h2 className="section-title centered services-title">Our Services</h2>
          <div className="services-feature">
            <div className="feature-copy">
              <span className="eyebrow">Expertise · Your next chapter</span>
              <h2>Complete Digital<br />Solutions for<br />Modern Brands</h2>
              <p>Leave lasting impressions. We build the digital experiences that move your business and your brand forward.</p>
              <div className="button-row">
                <button className="button gold" onClick={() => viewSolutionDetail('web-dev')}>Explore Solutions</button>
                <button className="round-button" aria-label="Explore our approach" onClick={() => setModal('approach')}><Play size={14} /></button>
              </div>
            </div>
            <div className="device-feature glass">
              <span className="glass-rim-glint glint-top" aria-hidden="true" />
              <img src="/images/devices.webp" alt="Desktop monitor, tablet and mobile phone showing digital analytics" loading="lazy" />
              <div className="device-float device-stat glass">
                <small>Performance</small>
                <b>+247%</b>
                <span>Built for growth</span>
              </div>
              <div className="device-float device-note glass">
                <Globe2 />
                <span><b>Digital experiences</b><small>One vision. Every screen.</small></span>
              </div>
              <button className="device-arrow" aria-label="View website development solution" onClick={() => viewSolutionDetail('web-dev')}>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Solutions Category Filter Tabs */}
          <div className="solutions-filter-bar" role="tablist" aria-label="Filter solutions">
            {categories.map(c => (
              <button
                key={c.id}
                role="tab"
                aria-selected={activeCategory === c.id}
                className={`filter-tab ${activeCategory === c.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Solutions Mosaic Grid with Dynamic In-Card Enlargement */}
          <div className="service-mosaic" id="solutions">
            {displayedSolutions.map((s) => {
              const isExpanded = expandedSolution === s.id;
              if (isExpanded) {
                return (
                  <article
                    key={s.id}
                    id={`solution-card-${s.id}`}
                    className={`service-card service-tile glass is-expanded ${s.categoryGroup}-card`}
                    role="region"
                    aria-label={`${s.title} detailed overview`}
                  >
                    <span className="glass-rim-glint glint-top" aria-hidden="true" />
                    <span className="glass-rim-glint glint-bottom" aria-hidden="true" />
                    <div className="card-expanded-media">
                      <img src={s.image} alt={s.title} loading="lazy" />
                      <div className="card-media-fade" />
                    </div>
                    <div className="card-expanded-content">
                      <h3>{s.title}</h3>
                      <p>{s.detailedDescription}</p>
                      <div className="card-footer-row">
                        <button
                          className="small-button cta-pill"
                          onClick={(e) => {
                            e.stopPropagation();
                            openBrief();
                          }}
                        >
                          Let’s Talk <ArrowRight size={13} style={{ marginLeft: 3 }} />
                        </button>
                        <button
                          className="card-circle-arrow"
                          aria-label={`Collapse ${s.title}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedSolution(null);
                          }}
                        >
                          <ArrowRight size={15} />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              }

              return (
                <article
                  key={s.id}
                  id={`solution-card-${s.id}`}
                  className={`service-card service-tile glass ${s.categoryGroup}-card`}
                  onClick={() => setExpandedSolution(s.id)}
                  role="button"
                  tabIndex={0}
                  aria-expanded="false"
                  aria-label={`Expand ${s.title}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setExpandedSolution(s.id);
                    }
                  }}
                >
                  <span className="glass-rim-glint glint-top" aria-hidden="true" />
                  <span className="glass-rim-glint glint-bottom" aria-hidden="true" />
                  <div className="card-top-row">
                    <span className="eyebrow">{s.eyebrow}</span>
                  </div>
                  <h3>{s.title}</h3>
                  <p>{s.summary}</p>
                  <div className="card-footer-row">
                    <button
                      className="small-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedSolution(s.id);
                      }}
                    >
                      {s.buttonText}
                    </button>
                    <button
                      className="card-circle-arrow"
                      aria-label={`Open ${s.title} details`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedSolution(s.id);
                      }}
                    >
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="results section-shell" id="results">
          <Reveal className="result-heading">
            <span className="eyebrow">Strategy · Real impact</span>
            <h2 className="section-title">Data-Driven.<br />Results That Matter.</h2>
          </Reveal>
          <Reveal className="result-top">
            <div className="glass result-tile">
              <strong><NumberRise value={500} suffix="+" /></strong>
              <span>Projects Delivered</span>
            </div>
            <div className="glass result-tile">
              <strong><NumberRise value={98} suffix="%" /></strong>
              <span>Client Retention</span>
            </div>
          </Reveal>
          <Reveal className="result-bottom">
            <div className="result-number glass">
              <Users2 />
              <strong><NumberRise value={500} suffix="+" /></strong>
              <span>Projects Delivered</span>
            </div>
            <div className="result-number glass">
              <Layers3 />
              <strong><NumberRise value={98} suffix="%" /></strong>
              <span>Client Retention</span>
            </div>
            <div className="glass result-chart">
              <div><b>Growth, by design.</b><span>THIS YEAR ↗</span></div>
              <LineChart id="results-gradient" />
              <div className="axis-labels"><span>JAN</span><span>MAR</span><span>MAY</span><span>JUL</span><span>SEP</span></div>
            </div>
          </Reveal>
        </section>

        <section className="projects section-shell" id="projects">
          <Reveal>
            <div className="section-heading-row">
              <div>
                <span className="eyebrow">Design · Built for you</span>
                <h2 className="section-title">Featured Projects</h2>
              </div>
              <span className="project-counter">0{active + 1} <span>/ 03</span></span>
            </div>
            <div className="project-analytics">
              <div className="project-analytics-totals">
                <div className="glass project-total">
                  <strong><NumberRise value={970} suffix="+" /></strong>
                  <span>Projects Delivered</span>
                </div>
                <div className="glass project-total">
                  <strong><NumberRise value={133} suffix="%" /></strong>
                  <span>Brand Growth</span>
                </div>
              </div>
              <div className="project-analytics-detail">
                <div className="glass project-activity">
                  <div><strong><NumberRise value={3331} /></strong><span>Digital Connections</span></div>
                  <div><small>Performance</small><b>↗ 1.40%</b><span>Moving forward</span></div>
                </div>
                <div className="glass result-chart">
                  <div><b>Project performance</b><span>GROWTH ↗</span></div>
                  <LineChart id="project-performance-gradient" />
                  <div className="axis-labels"><span>JAN</span><span>MAR</span><span>MAY</span><span>JUL</span><span>SEP</span></div>
                </div>
              </div>
            </div>
            <h2 className="section-title projects-gallery-title">Featured Projects</h2>
            <div
              className="projects-wrap"
              role="region"
              aria-roledescription="carousel"
              aria-label="Featured projects"
              onKeyDown={e => {
                if (e.key === 'ArrowRight') { e.preventDefault(); cycle(1); }
                if (e.key === 'ArrowLeft') { e.preventDefault(); cycle(-1); }
              }}
              tabIndex={0}
              onPointerDown={e => {
                if ((e.target as Element).closest('button, .project-open, .carousel-arrow')) return;
                projectDragRef.current = { x: e.clientX, y: e.clientY };
              }}
              onPointerUp={e => {
                if (!projectDragRef.current) return;
                const dx = e.clientX - projectDragRef.current.x;
                const dy = e.clientY - projectDragRef.current.y;
                projectDragRef.current = null;
                if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
                  cycle(dx < 0 ? 1 : -1);
                }
              }}
            >
              <button className="round-button carousel-arrow previous" aria-label="Previous project" onClick={() => cycle(-1)}>
                <ChevronLeft size={18} />
              </button>

              <div className="projects-grid-viewport">
                <AnimatePresence mode="popLayout" custom={projectDirection} initial={false}>
                  <motion.div
                    className="project-grid"
                    ref={carouselRef}
                    key={active}
                    custom={projectDirection}
                    variants={{
                      enter: (direction: number) => ({
                        x: direction > 0 ? 70 : -70,
                        opacity: 0,
                        filter: 'blur(2px)',
                      }),
                      center: {
                        x: 0,
                        opacity: 1,
                        filter: 'blur(0px)',
                        transition: {
                          x: { type: 'spring', stiffness: 280, damping: 28 },
                          opacity: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
                          filter: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
                        }
                      },
                      exit: (direction: number) => ({
                        x: direction > 0 ? -70 : 70,
                        opacity: 0,
                        filter: 'blur(2px)',
                        transition: {
                          x: { type: 'spring', stiffness: 280, damping: 28 },
                          opacity: { duration: 0.24, ease: [0.22, 1, 0.36, 1] },
                          filter: { duration: 0.24, ease: [0.22, 1, 0.36, 1] }
                        }
                      })
                    }}
                    initial={reduce ? false : "enter"}
                    animate="center"
                    exit={reduce ? undefined : "exit"}
                  >
                    {[0, 1, 2].map((slot) => {
                      const p = projects[(slot + active) % 3];
                      const isCenter = slot === 1;
                      return (
                        <div
                          className={'project-card glass project-slot-' + slot + (isCenter ? ' is-active' : '')}
                          key={`slot-${slot}-${p.name}`}
                          onClick={() => {
                            if (slot === 0) cycle(-1);
                            else if (slot === 2) cycle(1);
                            else setModal('project:' + projects.indexOf(p));
                          }}
                          role="button"
                          tabIndex={0}
                          aria-label={isCenter ? `Featured project: ${p.title}. Click to view details` : `Switch to ${p.name}'s project`}
                          onKeyDown={e => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              if (slot === 0) cycle(-1);
                              else if (slot === 2) cycle(1);
                              else setModal('project:' + projects.indexOf(p));
                            }
                          }}
                        >
                          <img className="project-photo" src={'/images/' + p.image} alt={p.title} loading="lazy" />
                          <div className="project-shade" />
                          <div className="project-caption">
                            <div className="project-person">
                              <img src="/images/project-portrait.webp" alt="" loading="lazy" />
                              <div className="project-person-info">
                                <h3>{p.name}</h3>
                                <p>{p.role}</p>
                              </div>
                            </div>
                            <div className="project-caption-bottom">
                              <span className="stars" aria-label="5 out of 5 stars">
                                {[0, 1, 2, 3, 4].map((star) => (
                                  <Star key={star} size={14} fill="currentColor" aria-hidden="true" />
                                ))}
                              </span>
                              <span
                                className="project-open"
                                aria-label={`View ${p.title}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setModal('project:' + projects.indexOf(p));
                                }}
                              >
                                <ArrowRight size={14} />
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                </AnimatePresence>
              </div>

              <button className="round-button carousel-arrow next" aria-label="Next project" onClick={() => cycle(1)}>
                <ChevronRight size={18} />
              </button>
            </div>
            <div className="pagination section-pagination" aria-label="Project selection">
              {projects.map((p, i) => (
                <button key={p.name} aria-label={`Show project collection ${i + 1}`} aria-pressed={active === i} onClick={() => { if (i !== active) { setProjectDirection(i > active ? 1 : -1); setActive(i); } }} className={active === i ? 'selected' : ''} />
              ))}
            </div>
          </Reveal>
        </section>

        <Testimonials />

        <section className="contact section-shell" id="contact">
          <Reveal className="contact-inner">
            <div className="contact-copy">
              <span className="eyebrow">Create · Your future</span>
              <h2>Ready to Grow<br />Your Brand?<br /><em>Build a Brighter</em><br />Digital Future.</h2>
              <p>Great ideas deserve strong foundations. Let’s bring your vision to life with considered design and digital experiences that make a difference.</p>
              <button className="button gold" onClick={openBrief}>Let’s Talk <ArrowRight size={15} /></button>
            </div>
            <div className="contact-visual">
              <span className="contact-orbit" />
              <div className="contact-car glass">
                <img src="/images/project-car.webp" alt="Premium blue SUV in a modern city" loading="lazy" />
              </div>
              <div className="glass contact-performance">
                <span>Performance</span>
                <div>
                  <strong>500.5<span>%</span></strong>
                  <Ring number="98%" small />
                </div>
                <small>Growth that goes further</small>
                <div className="green-track" />
                <div className="tiny-labels">
                  <span>DIGITAL IMPACT</span>
                  <span>↗ 12%</span>
                </div>
              </div>
              <div className="contact-device glass">
                <img src="/images/devices.webp" alt="A website designed for every screen" loading="lazy" />
              </div>
            </div>
          </Reveal>
        </section>

        <footer className="footer section-shell">
          <div className="footer-main">
            <div className="footer-brand">
              <a href="#home">Digital Pillars</a>
              <p>Strong foundations. Lasting impressions.<br />Digital experiences built around you.</p>
              <span><Globe2 size={14} /> Designed for a connected world.</span>
            </div>
            <div className="footer-column">
              <h3>Company</h3>
              <a href="#home">Home</a>
              <button onClick={() => setModal('approach')}>About</button>
              <a href="#projects">Our Work</a>
              <button onClick={() => setModal('privacy')}>Privacy Policy</button>
            </div>
            <div className="footer-column">
              <h3>Our Services</h3>
              <button onClick={() => viewSolutionDetail('paid-social')}>Paid Social</button>
              <button onClick={() => viewSolutionDetail('web-dev')}>Website Development</button>
              <button onClick={() => viewSolutionDetail('brand-exp')}>Brand Experiences</button>
              <button onClick={() => viewSolutionDetail('retreats')}>Retreats & Offsites</button>
              <button onClick={() => viewSolutionDetail('ai-agents')}>AI Automation</button>
              <button onClick={() => viewSolutionDetail('seo-organic')}>SEO & Growth</button>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Digital Pillars. All rights reserved.</span>
            <button onClick={() => setModal('privacy')}>Privacy</button>
            <a href="#home">Back to top ↑</a>
          </div>
        </footer>
      </div>
    </main>

    <div className={`assistant-widget ${faqOpen ? 'widget-hidden' : ''}`}>
      <button className="assistant-bot" aria-label="Open FAQ assistant" onClick={() => setFaqOpen(!faqOpen)}>
        <Bot size={36} />
        <span />
      </button>
      <button className="assistant-label" onClick={() => setFaqOpen(!faqOpen)} aria-expanded={faqOpen}>
        <span>AI Assistant FAQ</span>
        <i><MessageCircle size={18} /></i>
      </button>
    </div>

    <AnimatePresence>
      {faqOpen && (
        <motion.div
          ref={chatboxRef}
          className="chatbot-card-box"
          data-lenis-prevent="true"
          data-lenis-prevent-wheel="true"
          data-lenis-prevent-touch="true"
          initial={{ opacity: 0, y: 22, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 22, scale: 0.94 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Protruding top avatar circle */}
          <div className="chatbot-avatar-pill">
            <div className="chatbot-avatar-circle">
              <Bot size={26} />
            </div>
          </div>

          {/* Close button top right */}
          <button
            type="button"
            className="chatbot-close-btn"
            onClick={() => setFaqOpen(false)}
            aria-label="Close assistant"
          >
            <X size={18} />
          </button>

          {/* Header */}
          <div className="chatbot-header">
            <h3 className="chatbot-title">AI FAQ Assistant</h3>
            <p className="chatbot-subtitle">Lightweight, premium glass assistant</p>
          </div>

          {/* Chat / FAQ Body */}
          <div
            className="chatbot-body"
            ref={chatScrollRef}
            data-lenis-prevent="true"
            data-lenis-prevent-wheel="true"
            data-lenis-prevent-touch="true"
          >
            <div className="chatbot-bubble-row">
              <div className="chatbot-inline-avatar">
                <Bot size={15} />
                <span className="online-badge" />
              </div>
              <div className="chatbot-bubble">
                <p>Welcome to Digital Pillars! How can I assist you with your project today? Explore common topics below or write a message:</p>
              </div>
            </div>

            {/* Accordion FAQ Pills */}
            <div className="chatbot-faq-list">
              {faqs.map(([q, a], i) => {
                const isOpen = faqActiveItem === i;
                return (
                  <div key={q} className={`chatbot-faq-pill ${isOpen ? 'active' : ''}`}>
                    <button
                      type="button"
                      className="chatbot-faq-trigger"
                      onClick={() => setFaqActiveItem(isOpen ? null : i)}
                      aria-expanded={isOpen}
                    >
                      <span>{q}</span>
                      <ChevronDown size={16} className={`chevron-icon ${isOpen ? 'rotated' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="chatbot-faq-content">
                        <p>{a}</p>
                        {q.includes('start a project') && (
                          <button
                            type="button"
                            className="chatbot-action-btn"
                            onClick={() => { setFaqOpen(false); openBrief(); }}
                          >
                            Prepare a Project Brief <ArrowRight size={13} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* User message stream */}
            {chatHistory.map(msg => (
              <div key={msg.id} className={`chatbot-message-row ${msg.sender}`}>
                {msg.sender === 'bot' && (
                  <div className="chatbot-inline-avatar">
                    <Bot size={15} />
                    <span className="online-badge" />
                  </div>
                )}
                <div className={`chatbot-bubble ${msg.sender === 'user' ? 'user-bubble' : ''}`}>
                  <p>{msg.text}</p>
                  {msg.isBriefAction && (
                    <button
                      type="button"
                      className="chatbot-action-btn"
                      onClick={() => { setFaqOpen(false); openBrief(); }}
                    >
                      Prepare a Project Brief <ArrowRight size={13} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom input footer */}
          <form
            className="chatbot-footer"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendChatMessage();
            }}
          >
            <div className="chatbot-input-capsule">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Write a message"
                className="chatbot-input"
              />
              <div className="chatbot-input-actions">
                <button type="button" className="chatbot-tool-btn" title="Keyboard" aria-label="Keyboard">
                  <Keyboard size={15} />
                </button>
                <button type="button" className="chatbot-tool-btn" title="Audio" aria-label="Audio">
                  <Volume2 size={15} />
                </button>
                <button type="button" className="chatbot-tool-btn" title="Emoji" aria-label="Emoji">
                  <Smile size={15} />
                </button>
              </div>
              <button
                type="submit"
                className="chatbot-send-btn"
                aria-label="Send message"
                disabled={!chatInput.trim()}
              >
                <Send size={14} />
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>

    <Sheet open={mobileMenu} onOpenChange={setMobileMenu}>
      <SheetContent className="navigation-sheet glass">
        <SheetTitle><span className="brand"><Mark />Digital Pillars</span></SheetTitle>
        <SheetDescription>Explore Digital Pillars</SheetDescription>
        <nav aria-label="Mobile navigation">
          {navigation.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setMobileMenu(false)}>
              {label}<ArrowUpRight size={16} />
            </a>
          ))}
          <button className="mobile-login-action" onClick={() => { setMobileMenu(false); setModal('login'); }}>
            <Lock size={15} /> Client Portal Sign In
          </button>
        </nav>
        <button className="button gold" onClick={() => { setMobileMenu(false); openBrief(); }}>Get in Touch</button>
      </SheetContent>
    </Sheet>

    <Dialog open={!!modal} onOpenChange={v => { if (!v) setModal(null); }}>
      <DialogContent showCloseButton={modal !== 'contact' && modal !== 'login'} className={'detail-dialog glass ' + (modal === 'contact' ? 'brief-dialog' : modal === 'login' ? 'login-dialog' : '')}>
        {modal === 'contact' ? (
          <div className="brief-modal-shell">
            <DialogClose className="brief-close-button" aria-label="Close project brief">
              <X size={18} />
              <span>Close</span>
            </DialogClose>
            <div className="brief-modal-editorial">
              <div className="brief-pill-badge">
                <Sparkles size={13} />
                <span>START A PROJECT</span>
              </div>
              <DialogTitle className="brief-main-title">Let's build your next chapter.</DialogTitle>
              <DialogDescription className="sr-only">
                Start a project with Digital Pillars. Provide your project vision, timeline, and budget.
              </DialogDescription>

              <div className="brief-perks-list">
                <div className="brief-perk-item">
                  <div className="brief-perk-icon"><Zap size={18} aria-hidden="true" /></div>
                  <div className="brief-perk-info">
                    <strong>24-Hour Scope Intake</strong>
                    <p>Receive a preliminary timeline and project estimate within one business day.</p>
                  </div>
                </div>
                <div className="brief-perk-item">
                  <div className="brief-perk-icon"><Building2 size={18} aria-hidden="true" /></div>
                  <div className="brief-perk-info">
                    <strong>Senior Team Attention</strong>
                    <p>Work directly with experienced engineering and design leads.</p>
                  </div>
                </div>
                <div className="brief-perk-item">
                  <div className="brief-perk-icon"><ShieldCheck size={18} aria-hidden="true" /></div>
                  <div className="brief-perk-info">
                    <strong>Confidential by Default</strong>
                    <p>Your project discussion is handled with enterprise-grade confidentiality.</p>
                  </div>
                </div>
              </div>
              <div className="brief-contact-card">
                <span className="contact-card-label">Global Intake Desk</span>
                <span className="contact-card-val">partners@digitalpillars.agency</span>
                <span className="contact-card-sub">New York / London / Dubai / Zurich</span>
              </div>
            </div>

            <div className="brief-modal-form-side">
              <form className="brief-form-revamped" onSubmit={handleSendEnquiry}>
                <div className="form-row">
                  <label className="field-block">
                    <span className="field-label">Your Name <span className="req">*</span></span>
                    <input name="name" required autoComplete="name" placeholder="e.g. Jordan Vance" />
                  </label>
                  <label className="field-block">
                    <span className="field-label">Work Email <span className="req">*</span></span>
                    <input name="email" type="email" required autoComplete="email" placeholder="jordan@company.com" />
                  </label>
                </div>

                <div className="form-row">
                  <label className="field-block">
                    <span className="field-label">Company / Brand</span>
                    <input name="company" placeholder="e.g. Apex Studio" />
                  </label>
                  <label className="field-block">
                    <span className="field-label">Target Timeline</span>
                    <select name="timeline" defaultValue="1-3 Months">
                      <option value="Immediate (< 1 Month)">Immediate (&lt; 1 Month)</option>
                      <option value="1-3 Months">1 - 3 Months</option>
                      <option value="3-6 Months">3 - 6 Months</option>
                      <option value="Ongoing Advisory">Ongoing Advisory</option>
                    </select>
                  </label>
                </div>

                <div className="form-row">
                  <label className="field-block">
                    <span className="field-label">Primary Pillar / Service</span>
                    <select name="service" defaultValue="">
                      <option value="" disabled>Select a service...</option>
                      {solutionsList.map(s => (
                        <option key={s.id} value={s.title}>{s.title}</option>
                      ))}
                    </select>
                  </label>
                  <label className="field-block">
                    <span className="field-label">Target Investment</span>
                    <select name="budget" defaultValue="$30k - $60k" onChange={(e) => setCustomBudget(e.target.value === 'Custom budget')}>
                      <option value="$15k - $30k">$15,000 - $30,000</option>
                      <option value="$30k - $60k">$30,000 - $60,000</option>
                      <option value="$60k - $120k">$60,000 - $120,000</option>
                      <option value="$120k+">$120,000+</option>
                      <option value="Custom budget">Custom budget</option>
                    </select>
                  </label>
                </div>

                {customBudget && (
                  <label className="field-block custom-budget-field">
                    <span className="field-label">Your custom budget</span>
                    <input name="customBudget" inputMode="decimal" placeholder="e.g. $45,000 or a monthly retainer" autoFocus />
                  </label>
                )}
                <label className="field-block">
                  <span className="field-label">Project Vision & Goals <span className="req">*</span></span>
                  <textarea
                    name="details"
                    rows={3}
                    required
                    placeholder="Tell us what you want to build, your current challenges, and your goals..."
                  />
                </label>

                <div className="form-bottom-actions">
                  <button
                    className="button gold brief-download-btn"
                    type="submit"
                    disabled={enquiryStatus === 'sending'}
                  >
                    {enquiryStatus === 'sending' ? (
                      <><Loader2 size={16} className="animate-spin" /> Sending Enquiry...</>
                    ) : enquiryStatus === 'sent' ? (
                      <><Check size={16} /> Enquiry Sent Successfully</>
                    ) : (
                      <><Send size={16} /> Send Enquiry</>
                    )}
                  </button>
                  {enquiryStatus === 'sent' && (
                    <div className="brief-success-badge">
                      <Check size={14} /> Thank you, {enquiryClientName || 'there'}! Your enquiry has been sent to <strong>partners@digitalpillars.agency</strong>. Our senior team will review and reply within 24 hours.
                    </div>
                  )}
                  <p className="brief-local-privacy">
                    <ShieldCheck size={13} /> Routed directly to partners@digitalpillars.agency. Enterprise-grade confidentiality.
                  </p>
                </div>
              </form>
            </div>
          </div>
        ) : modal === 'login' ? (
          <div className="login-modal-shell">
            <DialogClose className="login-close-button" aria-label="Close client portal">
              <X size={18} />
              <span>Close</span>
            </DialogClose>
            <div className="login-modal-header">
              <div className="login-icon-wrap">
                <Building2 size={24} />
              </div>
              <div className="login-pill-badge">
                <Lock size={12} />
                <span>SECURE CLIENT PORTAL</span>
              </div>
              <DialogTitle className="login-main-title">Secure Client Portal</DialogTitle>
              <DialogDescription className="login-main-desc">
                Sign in to view your project workspace, deliverables, staging links, and progress updates.
              </DialogDescription>
            </div>

            {loginState === 'authenticated' ? (
              <div className="login-authenticated-card">
                <div className="auth-status-pill">
                  <Check size={14} /> Active Workspace: Verified Client
                </div>
                <div className="auth-account-box">
                  <div className="auth-avatar">DP</div>
                  <div>
                    <h4 className="auth-client-name">{loginEmail || 'enterprise.partner@apex.io'}</h4>
                    <p className="auth-tier">Digital Pillars Client Workspace - Active</p>
                  </div>
                </div>

                <div className="auth-grid-metrics">
                  <div className="auth-metric">
                    <span className="auth-val">Sprint 04</span>
                    <span className="auth-lbl">Current Stage</span>
                  </div>
                  <div className="auth-metric">
                    <span className="auth-val">v2.4.1</span>
                    <span className="auth-lbl">Staging Build</span>
                  </div>
                  <div className="auth-metric">
                    <span className="auth-val">100%</span>
                    <span className="auth-lbl">SLA Health</span>
                  </div>
                </div>

                <div className="auth-actions-group">
                  <button className="button gold" onClick={() => { setModal(null); }}>
                    Open Workspace <ArrowRight size={15} />
                  </button>
                  <button className="button outline" onClick={() => { setLoginState('idle'); setLoginEmail(''); setLoginPassword(''); }}>
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <form className="login-form-revamped" onSubmit={handleLoginSubmit}>
                <div className="field-block">
                  <span className="field-label">Email Address</span>
                  <div className="input-icon-shell">
                    <Mail size={16} className="input-svg-icon" />
                    <input
                      type="email"
                      required
                      autoComplete="username"
                      placeholder="client@enterprise.com"
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="field-block">
                  <div className="field-label-split">
                    <span className="field-label">Password</span>
                    <button
                      type="button"
                      className="inline-reset-btn"
                      onClick={() => alert('A secure verification token has been dispatched to your corporate email.')}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="input-icon-shell">
                    <Lock size={16} className="input-svg-icon" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="eye-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div className="login-remember-row">
                  <label className="remember-chk-label">
                    <input type="checkbox" defaultChecked />
                    <span>Keep me signed in on this device</span>
                  </label>
                </div>

                <button className="button gold login-submit-button" type="submit" disabled={loginState === 'loading'}>
                  {loginState === 'loading' ? (
                    <span>Signing you in...</span>
                  ) : (
                    <>
                      <span>Sign In Securely</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>

                <div className="login-demo-pill-wrap">
                  <button
                    type="button"
                    className="quick-demo-btn"
                    onClick={() => {
                      setLoginEmail('alexander@apex-enterprise.com');
                      setLoginPassword('demo-access');
                      setLoginState('authenticated');
                    }}
                  >
                    <Sparkles size={13} />
                    <span>Use Demo Workspace</span>
                  </button>
                </div>

                <div className="login-footer-switch">
                  <span>New to Digital Pillars?</span>
                  <button type="button" className="switch-to-brief-btn" onClick={openBrief}>
                    Start a Project Brief <ArrowRight size={13} />
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : modal?.startsWith('project:') ? (() => {
          const p = projects[Number(modal.split(':')[1])];
          return (
            <>
              <img className="dialog-project-image" src={'/images/' + p.image} alt={p.title} />
              <DialogTitle>{p.title}</DialogTitle>
              <DialogDescription>{p.role}</DialogDescription>
              <p>{p.text}</p>
              <button className="button gold" onClick={openBrief}>Start a Similar Project <ArrowRight size={15} /></button>
            </>
          );
        })() : modal === 'approach' ? (
          <>
            <DialogTitle>Built on strong foundations.</DialogTitle>
            <DialogDescription>Strategy, design, and development. Working together.</DialogDescription>
            <div className="approach-steps">
              <p><b>01 · Understand</b>Start with your audience, your goals, and your vision.</p>
              <p><b>02 · Create</b>Turn clear thinking into a distinctive digital experience.</p>
              <p><b>03 · Grow</b>Learn from performance and keep moving forward.</p>
            </div>
            <button className="button gold" onClick={openBrief}>Let’s Talk <ArrowRight size={15} /></button>
          </>
        ) : modal === 'privacy' ? (
          <>
            <DialogTitle>Your Privacy</DialogTitle>
            <DialogDescription>This preview keeps things simple.</DialogDescription>
            <p>The project brief is created in your browser and downloaded to your device. Its contents are not sent to a server. The FAQ uses fixed answers, and no third-party analytics are installed on this page.</p>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  </>;
}
