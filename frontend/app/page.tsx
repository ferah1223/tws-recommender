"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import {
  Headphones,
  AudioWaveform,
  BatteryFull,
  ShieldCheck,
  Gamepad2,
  ArrowUpRight,
  Zap,
  ChevronRight,
  Sparkles,
} from "lucide-react";

const criteria = [
  {
    icon: AudioWaveform,
    title: "Karakter Suara",
    desc: "Bass yang kuat, treble yang detail, atau seimbang di seluruh frekuensi.",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    icon: BatteryFull,
    title: "Daya Tahan Baterai",
    desc: "Dari pemakaian harian hingga perjalanan jauh tanpa charge.",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    icon: ShieldCheck,
    title: "Active Noise Cancellation",
    desc: "Redam kebisingan sekitar untuk pengalaman audio yang fokus.",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    icon: Gamepad2,
    title: "Mode Gaming",
    desc: "Latensi rendah supaya audio tetap sinkron saat gaming.",
    gradient: "from-amber-500 to-orange-600",
  },
];

const steps = [
  {
    number: "01",
    title: "Tentukan Preferensi",
    desc: "Pilih karakter suara, ANC, gaming, budget, dan kebutuhan lainnya.",
    icon: Sparkles,
  },
  {
    number: "02",
    title: "Pencocokan Cerdas",
    desc: "Cosine similarity membandingkan preferensi Anda dengan 141 produk.",
    icon: Zap,
  },
  {
    number: "03",
    title: "Dapatkan Rekomendasi",
    desc: "Lihat 3 produk terbaik beserta alasan kenapa cocok untuk Anda.",
    icon: ChevronRight,
  },
];

const sampleResults = [
  { name: "Sony WF-1000XM5", tag: "Balance · ANC · LDAC", score: 96 },
  { name: "Bose QuietComfort Ultra", tag: "Balance · ANC · aptX", score: 93 },
  { name: "Soundcore Liberty 4 NC", tag: "Bass · ANC · LDAC", score: 89 },
];

function AnimatedCounter({ value, duration = 1400 }: { value: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * value));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isInView, value, duration]);

  return <span ref={ref}>{display}</span>;
}

function FadeIn({ children, className = "", delay = 0, y = 24 }: { children: React.ReactNode; className?: string; delay?: number; y?: number }) {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isInView || prefersReduced ? 1 : 0,
        transform: isInView || prefersReduced ? "none" : `translateY(${y}px)`,
        transition: prefersReduced
          ? "none"
          : `opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 90 ? "bg-emerald-500" : score >= 80 ? "bg-amber-500" : "bg-slate-400";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold text-white ${color}`}>
      {score}
    </span>
  );
}

export default function HomePage() {
  return (
    <div className="font-body relative overflow-hidden" style={{ background: "var(--background)", color: "var(--foreground)" }}>

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-[calc(100vh-72px)] flex items-center overflow-hidden">
        {/* Aurora blobs */}
        <div className="aurora-blob absolute top-[-10%] left-[15%] w-[500px] h-[500px] rounded-full opacity-30 pointer-events-none" style={{ background: "radial-gradient(circle, var(--primary), transparent 70%)" }} />
        <div className="aurora-blob-2 absolute bottom-[-15%] right-[10%] w-[400px] h-[400px] rounded-full opacity-20 pointer-events-none" style={{ background: "radial-gradient(circle, #ec4899, transparent 70%)" }} />
        <div className="aurora-blob-3 absolute top-[30%] right-[25%] w-[300px] h-[300px] rounded-full opacity-15 pointer-events-none" style={{ background: "radial-gradient(circle, #06b6d4, transparent 70%)" }} />
        {/* Grid */}
        <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />

        <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-[1fr_420px] md:items-center lg:gap-16">
          {/* Left */}
          <div>
            <FadeIn delay={0.1}>
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em]" style={{ background: "color-mix(in srgb, var(--primary) 8%, var(--surface))", color: "var(--primary)", border: "1px solid color-mix(in srgb, var(--primary) 15%, transparent)" }}>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: "var(--primary)" }} />
                  <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "var(--primary)" }} />
                </span>
                Content-Based Filtering
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <h1 className="font-display mt-6 text-[clamp(2rem,5vw,3.25rem)] leading-[1.06] tracking-tight" style={{ color: "var(--foreground)" }}>
                Temukan TWS yang<br />
                <span className="gradient-text">tepat untuk Anda.</span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.3}>
              <p className="mt-5 max-w-lg text-[15px] leading-relaxed" style={{ color: "var(--muted)" }}>
                Sistem menganalisis preferensi audio Anda lalu mencocokkannya dengan 141 produk TWS dari 45 brand menggunakan perhitungan cosine similarity.
              </p>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/recommend"
                  className="group relative inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:gap-3 hover:shadow-xl active:scale-[0.97]"
                  style={{ background: "var(--primary)", boxShadow: "0 8px 25px color-mix(in srgb, var(--primary) 30%, transparent)" }}
                >
                  Mulai Rekomendasi
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="#cara-kerja"
                  className="inline-flex items-center gap-2 rounded-full border px-7 py-3.5 text-sm font-medium transition-all hover:bg-[var(--muted-bg)] active:scale-[0.97]"
                  style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
                >
                  Cara Kerja
                </Link>
              </div>
            </FadeIn>

            {/* Stats */}
            <FadeIn delay={0.55}>
              <div className="mt-10 flex items-center gap-8 pt-6" style={{ borderTop: "1px solid var(--border-light)" }}>
                {[
                  { value: 141, suffix: "", label: "Produk" },
                  { value: 45, suffix: "", label: "Brand" },
                  { value: 7, suffix: "", label: "Parameter" },
                ].map((s, i) => (
                  <div key={i}>
                    <p className="font-display text-xl tabular-nums" style={{ color: "var(--foreground)" }}>
                      <AnimatedCounter value={s.value} />
                      {s.suffix}
                    </p>
                    <p className="text-[11px] mt-0.5" style={{ color: "var(--text-subtle)" }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>

          {/* Right — Glass card preview */}
          <FadeIn delay={0.35} y={20}>
            <div className="relative">
              {/* Glow behind card */}
              <div className="absolute -inset-4 rounded-3xl opacity-50 blur-2xl pointer-events-none" style={{ background: "linear-gradient(135deg, color-mix(in srgb, var(--primary) 20%, transparent), transparent)" }} />
              <div className="relative glass rounded-3xl p-6 shadow-xl" style={{ boxShadow: "var(--card-shadow-hover)" }}>
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "var(--primary)" }}>
                      <Headphones className="h-4 w-4 text-white" strokeWidth={1.75} />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-subtle)" }}>Rekomendasi</p>
                      <p className="text-xs font-medium" style={{ color: "var(--foreground)" }}>Top 3 Match</p>
                    </div>
                  </div>
                  <span className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider" style={{ background: "color-mix(in srgb, var(--primary) 12%, transparent)", color: "var(--primary)" }}>
                    Live
                  </span>
                </div>

                {/* Results */}
                <ul className="space-y-2.5">
                  {sampleResults.map((p, i) => (
                    <FadeIn key={p.name} delay={0.5 + i * 0.1} y={0}>
                      <li
                        className="flex items-center gap-3 rounded-2xl border p-3.5 transition-all hover:shadow-md active:scale-[0.98] cursor-default"
                        style={{
                          borderColor: i === 0 ? "color-mix(in srgb, var(--primary) 25%, transparent)" : "var(--border-light)",
                          background: i === 0 ? "color-mix(in srgb, var(--primary) 4%, var(--surface))" : "var(--surface)",
                        }}
                      >
                        <span
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold"
                          style={{
                            background: i === 0 ? "var(--primary)" : "var(--muted-bg)",
                            color: i === 0 ? "white" : "var(--muted)",
                          }}
                        >
                          {i + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold" style={{ color: "var(--foreground)" }}>{p.name}</p>
                          <p className="truncate text-[11px] mt-0.5" style={{ color: "var(--muted)" }}>{p.tag}</p>
                        </div>
                        <ScoreBadge score={p.score} />
                      </li>
                    </FadeIn>
                  ))}
                </ul>

                {/* Footer */}
                <div className="mt-4 pt-3 flex items-center justify-between text-[10px]" style={{ borderTop: "1px solid var(--border-light)", color: "var(--text-subtle)" }}>
                  <span>Berdasarkan cosine similarity</span>
                  <span className="font-medium" style={{ color: "var(--primary)" }}>Lihat semua →</span>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ CRITERIA ═══ */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--foreground)" }} />
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, var(--primary), transparent)", opacity: 0.3 }} />

        <div className="relative mx-auto max-w-6xl px-6">
          <FadeIn>
            <div className="mb-14 max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] mb-3" style={{ color: "var(--primary)" }}>Kriteria Rekomendasi</p>
              <h2 className="font-display text-[clamp(1.5rem,3.5vw,2.25rem)] leading-tight" style={{ color: "var(--background)" }}>
                Empat aspek yang dianalisis<br />untuk setiap produk.
              </h2>
            </div>
          </FadeIn>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {criteria.map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.08}>
                <div className="group relative rounded-2xl p-6 transition-all hover:-translate-y-1" style={{ background: "color-mix(in srgb, var(--background) 5%, var(--foreground))", border: "1px solid color-mix(in srgb, var(--background) 8%, transparent)" }}>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl mb-4 transition-transform group-hover:scale-110" style={{ background: "color-mix(in srgb, var(--primary) 15%, transparent)" }}>
                    <item.icon className="h-5 w-5" style={{ color: "var(--primary)" }} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-[15px] font-semibold mb-1.5" style={{ color: "var(--background)" }}>{item.title}</h3>
                  <p className="text-[13px] leading-relaxed" style={{ color: "color-mix(in srgb, var(--background) 45%, transparent)" }}>{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ STEPS ═══ */}
      <section id="cara-kerja" className="relative py-24 md:py-32">
        <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />
        <div className="relative mx-auto max-w-6xl px-6">
          <FadeIn>
            <div className="mb-14 max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] mb-3" style={{ color: "var(--primary)" }}>Alur Kerja</p>
              <h2 className="font-display text-[clamp(1.5rem,3.5vw,2.25rem)] leading-tight" style={{ color: "var(--foreground)" }}>
                Tiga langkah menuju<br />rekomendasi terbaik.
              </h2>
            </div>
          </FadeIn>

          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((item, i) => (
              <FadeIn key={item.number} delay={i * 0.1}>
                <div className="group relative rounded-2xl p-7 transition-all hover:-translate-y-1" style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "var(--card-shadow)" }}>
                  {/* Step number */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-display text-3xl font-bold" style={{ color: "var(--primary)" }}>{item.number}</span>
                    <div className="h-px flex-1" style={{ background: "linear-gradient(to right, color-mix(in srgb, var(--primary) 30%, transparent), transparent)" }} />
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors" style={{ background: "color-mix(in srgb, var(--primary) 8%, transparent)" }}>
                      <item.icon className="h-4 w-4" style={{ color: "var(--primary)" }} strokeWidth={1.5} />
                    </div>
                  </div>
                  <h3 className="text-[15px] font-semibold mb-2" style={{ color: "var(--foreground)" }}>{item.title}</h3>
                  <p className="text-[13px] leading-relaxed" style={{ color: "var(--muted)" }}>{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="mx-auto max-w-6xl px-6 pb-24 md:pb-32">
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl p-10 md:p-14" style={{ background: "var(--foreground)" }}>
            {/* Decorative blobs */}
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-20 pointer-events-none" style={{ background: "var(--primary)", filter: "blur(60px)" }} />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-10 pointer-events-none" style={{ background: "#ec4899", filter: "blur(50px)" }} />

            <div className="relative z-10 flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
              <div className="max-w-lg">
                <h2 className="font-display text-[clamp(1.5rem,3.5vw,2rem)] leading-tight" style={{ color: "var(--background)" }}>
                  Siap menemukan TWS<br />yang tepat?
                </h2>
                <p className="mt-3 text-[14px] leading-relaxed" style={{ color: "color-mix(in srgb, var(--background) 50%, transparent)" }}>
                  Masukkan preferensi Anda, dapatkan rekomendasi dalam hitungan detik.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/recommend"
                  className="group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition-all hover:gap-3 active:scale-[0.97]"
                  style={{ background: "var(--background)", color: "var(--foreground)" }}
                >
                  Mulai Sekarang
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/product"
                  className="inline-flex items-center gap-2 rounded-full border px-7 py-3.5 text-sm font-medium transition-colors hover:opacity-80 active:scale-[0.97]"
                  style={{ borderColor: "color-mix(in srgb, var(--background) 15%, transparent)", color: "var(--background)" }}
                >
                  Lihat Katalog
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
