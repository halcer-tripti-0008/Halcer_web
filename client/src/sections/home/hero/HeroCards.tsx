import { ShieldCheck } from 'lucide-react';

import { StatusDot } from '@/components/ui/StatusDot';
import { heroContent } from '@/content/home';

const glass =
  'spotlight rounded-2xl border border-glow-500/25 bg-ink-glass/70 backdrop-blur-xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7),0_0_30px_rgba(0,210,255,0.08)]';

const BAR_COUNT = 7;

/**
 * Floating glass cards around the headline (screens 1400px wide and up). Each sits in three layers
 * so the effects never share a transform: [data-depth] = pointer parallax, [data-float] =
 * idle drift, and the card itself = entrance + 3D tilt (see PointerEffects).
 * Hero animation hooks: data-depth, data-float, data-hero-card, data-count, data-spark,
 * data-bar (all driven from HeroSection).
 */
export function HeroCards() {
  const { latency, throughput, reliability, platforms, volume } = heroContent.cards;

  return (
    <div
      data-hero-cards
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 hidden min-[1400px]:block"
    >
      {/* Latency + sparkline */}
      <div data-depth="0.9" className="absolute top-[24%] left-[2.5%] w-56">
        <div data-float>
          <article data-tilt data-hero-card className={`${glass} p-4`}>
            <p className="font-mono text-[10px] tracking-wider text-glow-300 uppercase">
              {latency.label}
            </p>
            <p className="mt-1 text-gradient-electric font-display text-3xl leading-none font-semibold tracking-tight">
              {latency.value}
            </p>
            <svg viewBox="0 0 200 56" className="mt-3 h-12 w-full overflow-visible" fill="none">
              <path
                data-spark
                pathLength={1}
                d="M0 44 C14 44 18 30 32 32 S52 48 66 40 S86 14 102 20 S126 40 142 28 S170 6 200 12"
                stroke="url(#spark)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="spark" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#00a3ff" stopOpacity="0.2" />
                  <stop offset="1" stopColor="#00e5ff" />
                </linearGradient>
              </defs>
              <circle cx="200" cy="12" r="3.5" fill="#00f0ff" />
            </svg>
            <p className="mt-2 text-[11px] text-mist">{latency.caption}</p>
          </article>
        </div>
      </div>

      {/* Throughput + bars */}
      <div data-depth="0.7" className="absolute top-[18%] right-[2.5%] w-60">
        <div data-float>
          <article data-tilt data-hero-card className={`${glass} p-4`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-[10px] tracking-wider text-glow-300 uppercase">
                  {throughput.label}
                </p>
                <p className="mt-1 font-display text-3xl leading-none font-semibold tracking-tight text-white">
                  <span data-count data-to={throughput.value} data-decimals="1">
                    {throughput.value.toFixed(1)}
                  </span>
                  <span className="ml-1 text-sm font-medium text-mist">{throughput.unit}</span>
                </p>
              </div>
              <StatusDot tone="signal" pulse />
            </div>
            <div className="mt-4 flex h-10 items-end gap-1.5">
              {Array.from({ length: BAR_COUNT }, (_, index) => (
                <span
                  key={index}
                  data-bar
                  className="h-full flex-1 origin-bottom rounded-sm bg-[linear-gradient(180deg,#00e5ff,rgba(0,163,255,0.25))]"
                />
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-white/[0.08] pt-3 text-[11px]">
              <span className="text-mist">{reliability.label}</span>
              <span className="font-mono font-semibold text-white">{reliability.value}</span>
            </div>
          </article>
        </div>
      </div>

      {/* Status chips */}
      <div data-depth="1.15" className="absolute bottom-[19%] left-[9%]">
        <div data-float>
          <div
            data-tilt
            data-hero-card
            className={`${glass} flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-white`}
          >
            <StatusDot tone="glow" />
            {platforms}
          </div>
        </div>
      </div>
      <div data-depth="0.5" className="absolute right-[8%] bottom-[22%]">
        <div data-float>
          <div
            data-tilt
            data-hero-card
            className={`${glass} flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-white`}
          >
            <ShieldCheck className="size-4 text-glow-400" strokeWidth={1.75} />
            {volume}
          </div>
        </div>
      </div>
    </div>
  );
}
