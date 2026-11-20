import type { LucideIcon } from 'lucide-react';
import { BadgeCheck, Bot, Box, ChartSpline, Cpu, Microscope, Zap } from 'lucide-react';

import collaborationStudio from '@/assets/images/collaboration-studio.jpg';
import heroServerRack from '@/assets/images/hero-server-rack.png';
import philosophyPavilion from '@/assets/images/philosophy-pavilion.jpg';

/**
 * Home page copy and data, transcribed from the Stitch design.
 * Kept out of the components so copy edits (or a future CMS) never touch markup.
 */

export interface ImageAsset {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export const heroContent = {
  description:
    'We partner with visionary leaders to bridge thoughtful software craftsmanship with frontier intelligence—creating high-impact platforms designed for global scale.',
  primaryCta: 'Start an Engagement',
  secondaryCta: 'Explore Capabilities',
  cluster: {
    title: 'HALCER COMPUTE CLUSTER // NODE 01',
    meta: ['40Gbps Fiber Ring', 'STATUS: OPTIMAL'],
    status: 'SYSTEM ONLINE',
    telemetry: {
      label: 'TELEMETRY RUNTIME',
      title: 'The bench for AI, GenAI, and data.',
      body: 'Low-latency deterministic orchestration delivered directly on high-density specialized compute blades.',
    },
  },
  image: {
    src: heroServerRack,
    alt: 'High performance computing server rack',
    width: 512,
    height: 288,
  } satisfies ImageAsset,
  stats: [
    {
      label: 'System Reliability',
      value: '99.999%',
      body: 'Continuous uptime across multi-region production clusters.',
    },
    {
      label: 'Production Scale',
      value: '340+',
      body: 'Active enterprise platforms serving millions of concurrent requests.',
    },
    {
      label: 'Volume Transacted',
      value: '$4.2B+',
      body: 'Secured transactions processed through verified software pipelines.',
    },
    {
      label: 'Inference Response',
      value: '<15ms',
      body: 'Average multi-agent latency across enterprise workloads.',
      highlight: true,
    },
  ],
} as const;

export const philosophyContent = {
  eyebrow: 'Our Philosophy & Craft',
  title: 'Most intelligence initiatives stumble before production.',
  titleMuted: 'We design the solution.',
  quote:
    '“Engineering rigor and creative intelligence are not opposites; rigorous craft is what allows intelligent systems to endure and flourish in the real world.”',
  quoteAuthor: 'Dr. Marcus Vogel',
  quoteRole: 'Head of Systems Design',
  paragraphs: [
    'While standard teams treat artificial intelligence as a generic API layer, we build integrated architectures that unify low-level distributed performance, real-time data streams, and transparent reasoning frameworks. True innovation requires dependability, not unpredictable experimentation.',
    'Our interdisciplinary methodology brings together the exactitude of aviation software and algorithmic engineering with fluid human interfaces. Every platform we deliver is built to remain resilient, performant, and completely aligned with your strategic vision.',
  ],
  image: {
    src: philosophyPavilion,
    alt: 'HALCER design studio and innovation pavilion in Zurich at dusk',
    width: 512,
    height: 382,
  } satisfies ImageAsset,
  imageCaption: 'Zurich Design Studio & Innovation Pavilion',
  facilities: ['Continuous Research Environments', 'Specialized Compute Facilities'],
  facilitiesHighlight: 'Global Delivery Hubs',
} as const;

export const capabilitiesContent = {
  eyebrow: 'Core Capabilities',
  titleStart: 'Engineered for',
  titleHighlight: 'deterministic',
  titleEnd: 'outcomes.',
  description:
    'Four specialized practice areas dedicated to computational verification, performance, and long-term platform resilience.',
  cta: 'Explore Practice',
  practices: [
    {
      title: 'Applied AI & Generative Intelligence',
      subtitle: 'Autonomous Agents & Foundation Models',
      body: 'Tailored enterprise model fine-tuning, deterministic retrieval pipelines with traceable citations, multi-agent collaboration, and inference latency optimization for seamless workflows.',
      tags: ['Custom Kernels', 'Agent Graphs', 'Vector Hybrid Indexing', 'Cache Optimization'],
    },
    {
      title: 'Distributed Systems & Platforms',
      subtitle: 'High-Throughput Backends',
      body: 'Zero-overhead networking architecture, resilient Rust and Go services, distributed state consensus, and event streaming architectures capable of millions of transactions per second.',
      tags: ['Rust Services', 'Event Streaming', 'Modern Protocols', 'Concurrent Design'],
    },
    {
      title: 'Cloud & Security Architecture',
      subtitle: 'Sovereign & Zero-Trust Frameworks',
      body: 'Multi-cloud sovereign perimeters, private container orchestration, differential privacy guardrails, automated governance, and confidential enclave computing architectures.',
      tags: [
        'Confidential Compute',
        'Sovereign Cloud',
        'Infrastructure as Code',
        'Telemetry Systems',
      ],
    },
    {
      title: 'Advisory & Architectural Auditing',
      subtitle: 'Principal Leadership & Delivery',
      body: 'Deployment of embedded principal systems squads, comprehensive technical evaluations, automated resilience testing suites, and production readiness certification.',
      tags: [
        'Resilience Auditing',
        'Service Level Assurances',
        'Security Compliance',
        'Continuous Profiling',
      ],
    },
  ],
} as const;

export interface DifferencePillar {
  eyebrow: string;
  icon: LucideIcon;
  title: string;
  body: string;
  footnote: string;
}

export const differenceContent = {
  eyebrow: 'Why Visionary Teams Partner With Us',
  aside: 'Architectural Foundations',
  title: 'Crafting enduring infrastructure with world-class engineering focus.',
  description:
    'Rather than wrapping off-the-shelf components, we engineer core technological foundations that eliminate bottlenecks and grant your organization complete strategic autonomy.',
  pillars: [
    {
      eyebrow: 'Production First',
      icon: Box,
      title: 'Built for Reality',
      body: 'We move past fragile experiments to build systems ready for real users from day one—engineered for failover, security, and consistent behavior under peak demand.',
      footnote: 'High-availability guarantees by design',
    },
    {
      eyebrow: 'Depth of Expertise',
      icon: Cpu,
      title: 'Direct Architect Leadership',
      body: 'Every collaboration is led directly by senior principal architects who write foundational systems code, design protocols, and optimize resource execution firsthand.',
      footnote: 'Senior engineering leadership in every room',
    },
    {
      eyebrow: 'Clear Outcomes',
      icon: BadgeCheck,
      title: 'Measurable Success',
      body: 'Transparent progress milestones, comprehensive testing suites, and clear service objectives tied directly to computational speed, reliability, and business impact.',
      footnote: 'Committed delivery with verifiable standards',
    },
  ] satisfies DifferencePillar[],
  collaboration: {
    eyebrow: 'Integrated Collaboration',
    title: 'Focused technical velocity without bureaucratic friction.',
    body: 'Our senior specialists integrate seamlessly alongside your product and platform teams, providing hands-on guidance, collaborative review, and immediate acceleration.',
    image: {
      src: collaborationStudio,
      alt: 'HALCER architects collaborating around a system diagram in the design studio',
      width: 512,
      height: 343,
    } satisfies ImageAsset,
    facts: [
      { label: 'Collaborative Presence', value: 'Zurich • London • San Francisco' },
      { label: 'Rapid Engagement', value: 'Dedicated Discovery Sprint' },
      {
        label: 'Direct Team Channels',
        value: 'Seamless Slack & Teams Integration',
        positive: true,
      },
    ],
  },
} as const;

export interface Industry {
  sector: string;
  icon: LucideIcon;
  title: string;
  body: string;
  metrics: readonly [{ label: string; value: string }, { label: string; value: string }];
}

export const industriesContent = {
  eyebrow: 'Domain Practices',
  titleStart: 'Sectors where',
  titleHighlight: 'technical precision',
  titleEnd: 'creates competitive advantage.',
  description:
    'Deploying deterministic computing architectures, verifiable security frameworks, and custom software runtime engines where failure is not an option.',
  industries: [
    {
      sector: 'Capital Markets',
      icon: ChartSpline,
      title: 'Financial Systems & Trading',
      body: 'Engineered for sub-millisecond settlement, custom kernel bypass networking, real-time risk evaluation gates, and deterministic execution under extreme market volatility.',
      metrics: [
        { label: 'Latency Profile', value: 'Sub-millisecond P99' },
        { label: 'Throughput Scale', value: '4.8M ops/second' },
      ],
    },
    {
      sector: 'Autonomous Systems',
      icon: Bot,
      title: 'Robotics & Physical Intelligence',
      body: 'Embedded sensor perception pipelines, synchronous multi-camera fusion, and low-power edge tensor execution certified for mission-critical industrial deployments.',
      metrics: [
        { label: 'Perception Sync', value: '120 FPS Synchronous' },
        { label: 'Safety Standard', value: 'ASIL-D Compliant' },
      ],
    },
    {
      sector: 'Health Sciences',
      icon: Microscope,
      title: 'Biomedical Intelligence & Multi-Omics',
      body: 'High-throughput clinical genomic sequence processing and confidential multi-party federated model development without transferring underlying patient records.',
      metrics: [
        { label: 'Data Privacy', value: 'Confidential Enclaves' },
        { label: 'Regulatory Ready', value: 'HIPAA & GDPR Verified' },
      ],
    },
    {
      sector: 'Smart Infrastructure',
      icon: Zap,
      title: 'Energy & Sovereign Grid Networks',
      body: 'Algorithmic load balancing, predictive resource distribution, and zero-trust telemetry protocols bridging modern control planes with critical industrial networks.',
      metrics: [
        { label: 'Node Scale', value: '1.2M Distributed Nodes' },
        { label: 'Failover Assurance', value: '<50ms Autonomous' },
      ],
    },
  ] satisfies Industry[],
} as const;

export const insightsContent = {
  eyebrow: 'Publications & Insights',
  titleStart: 'Technical briefs and',
  titleHighlight: 'architecture essays',
  allPublicationsCta: 'Explore All Publications',
  archive: {
    badge: 'Systems Archive #01',
    title:
      'Architectural whitepapers built for mission-critical systems and deterministic compute.',
    cta: 'Explore All Briefs',
  },
  cohort: {
    badge: 'Global Cohort',
    title: 'Trusted by tier-one engineering teams & enterprise infrastructure leaders worldwide.',
    body: 'Multi-region consensus protocols and sub-millisecond AI runtime verified.',
  },
  sla: {
    label: 'SLA Standard',
    value: '99.999%',
    body: 'Zero-downtime consensus execution across sovereign multi-region clusters.',
  },
  flagship: {
    badge: 'Flagship Architecture Note',
    title: 'Architecting High-Throughput Multi-Modal RAG Pipelines at 100k Queries/Sec.',
    body: 'Eliminating memory fragmentation in cross-modal vector buffers and scaling deterministic multi-tenant execution.',
    readTime: '24 min read',
    type: 'Research Report',
    cta: 'Read Technical Paper',
  },
} as const;

export const contactContent = {
  kicker: 'Open for any collaboration',
  titleLines: [
    'Book a free consultation now',
    'to discover how we can help',
    'your business to thrive!',
  ],
  responseTime: 'Typical response within 24 hours',
  assurances: ['Direct principal architect review', 'Strict NDA'],
  submit: 'Book consultation',
} as const;
