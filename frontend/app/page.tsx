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
} from "lucide-react";

const criteria = [
  {
    icon: AudioWaveform,
    title: "Karakter Suara",
    desc: "Pilih preferensi suara Anda — bass yang kuat, treble yang detail, atau seimbang di seluruh frekuensi.",
  },
  {
    icon: BatteryFull,
    title: "Daya Tahan Baterai",
    desc: "Sesuaikan dengan kebutuhan pemakaian harian, perjalanan jauh, hingga penggunaan intensif.",
  },
  {
    icon: ShieldCheck,
    title: "Active Noise Cancellation",
    desc: "Kurangi kebisingan sekitar saat bekerja, berkomuter, atau menikmati musik dengan tenang.",
  },
  {
    icon: Gamepad2,
    title: "Mode Gaming",
    desc: "Latensi rendah agar audio tetap sinkron saat bermain game maupun menonton video.",
  },
];

const steps = [
  {
    number: "01",
    title: "Tentukan Preferensi",
    desc: "Pilih karakter suara, daya tahan baterai, dan fitur pendukung sesuai kebutuhan Anda.",
  },
  {
    number: "02",
    title: "Proses Pencocokan",
    desc: "Sistem menghitung tingkat kecocokan preferensi Anda terhadap spesifikasi tiap produk.",
  },
  {
    number: "03",
    title: "Tinjau Rekomendasi",
    desc: "Telusuri produk paling sesuai beserta ringkasan spesifikasi dan alasan rekomendasinya.",
  },
];

const sampleResults = [
  { name: "Sony WF-1000XM5", tag: "Balance · ANC" },
  { name: "Bose QuietComfort Ultra", tag: "Balance · ANC" },
  { name: "Anker Soundcore Liberty 4 NC", tag: "Bass · ANC" },
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

export default function HomePage() {
  return (
    <div className="font-body relative overflow-hidden" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      {/* HERO */}
      <section className="relative grid-pattern flex min-h-[calc(100vh-72px)] items-center">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(135deg, var(--background), color-mix(in srgb, var(--primary) 5%, var(--background)))" }} />
        <div className="absolute -top-24 left-1/4 h-80 w-80 rounded-full blur-2xl pointer-events-none" style={{ background: "color-mix(in srgb, var(--primary) 15%, transparent)" }} />

        <div className="relative mx-auto grid max-w-6xl gap-10 px-6 pt-10 pb-12 md:grid-cols-2 md:items-center lg:gap-14">
          <div>
            <FadeIn delay={0.1}>
              <div className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] backdrop-blur-sm" style={{ borderColor: "color-mix(in srgb, var(--primary) 30%, transparent)", background: "color-mix(in srgb, var(--primary) 5%, var(--surface))", color: "var(--primary)" }}>
                <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: "var(--primary)" }} />
                Content-Based Filtering
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <h1 className="font-display mt-5 text-[2.25rem] leading-[1.08] md:text-[2.75rem] lg:text-[3rem]" style={{ color: "var(--foreground)" }}>
                Temukan TWS yang sesuai dengan <span style={{ color: "var(--primary)" }}>preferensi</span> Anda.
              </h1>
            </FadeIn>

            <FadeIn delay={0.3}>
              <p className="mt-4 max-w-md text-[15px] leading-7" style={{ color: "var(--muted)" }}>
                Sistem rekomendasi berbasis preferensi audio dan kebutuhan teknis Anda, dicocokkan dengan spesifikasi setiap produk dalam basis data.
              </p>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  href="/recommend"
                  className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white shadow-lg transition-all hover:gap-3 hover:opacity-90"
                  style={{ background: "var(--primary)" }}
                >
                  Mulai Rekomendasi
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="#cara-kerja"
                  className="group inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-medium backdrop-blur-sm transition-all hover:border-[var(--primary)]"
                  style={{ borderColor: "var(--border)", color: "var(--foreground)", background: "color-mix(in srgb, var(--surface) 80%, transparent)" }}
                >
                  <span className="underline decoration-2 underline-offset-4" style={{ textDecorationColor: "color-mix(in srgb, var(--primary) 50%, transparent)" }}>
                    Pelajari Cara Kerja
                  </span>
                </Link>
              </div>
            </FadeIn>

            <FadeIn delay={0.5}>
              <div className="mt-7 flex items-center gap-6 pt-5" style={{ borderTop: "1px solid var(--border)" }}>
                <div>
                  <p className="font-display text-2xl" style={{ color: "var(--foreground)" }}>
                    <AnimatedCounter value={100} />
                    <span style={{ color: "var(--primary)" }}>+</span>
                  </p>
                  <p className="mt-0.5 text-xs" style={{ color: "var(--muted)" }}>Produk TWS</p>
                </div>
                <div className="h-8 w-px" style={{ background: "var(--border)" }} />
                <div>
                  <p className="font-display text-2xl" style={{ color: "var(--foreground)" }}>
                    Top <span style={{ color: "var(--primary)" }}><AnimatedCounter value={3} duration={900} /></span>
                  </p>
                  <p className="mt-0.5 text-xs" style={{ color: "var(--muted)" }}>Rekomendasi</p>
                </div>
                <div className="h-8 w-px" style={{ background: "var(--border)" }} />
                <div>
                  <p className="font-display text-2xl" style={{ color: "var(--primary)" }}>
                    <AnimatedCounter value={7} duration={900} />
                  </p>
                  <p className="mt-0.5 text-xs" style={{ color: "var(--muted)" }}>Parameter</p>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Right — Hero Card */}
          <FadeIn delay={0.3} y={20}>
            <div className="relative flex items-center justify-center">
              <div className="relative w-full max-w-md rounded-3xl border p-6" style={{ borderColor: "color-mix(in srgb, var(--border) 70%, transparent)", background: "var(--surface)", boxShadow: "var(--card-shadow-hover)" }}>
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-medium" style={{ color: "var(--muted)" }}>Hasil rekomendasi</span>
                  </div>
                  <span className="rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider" style={{ background: "color-mix(in srgb, var(--primary) 10%, transparent)", color: "var(--primary)" }}>Top 3</span>
                </div>

                <ul className="space-y-2.5">
                  {sampleResults.map((p, i) => (
                    <FadeIn key={p.name} delay={0.6 + i * 0.12} y={0}>
                      <li
                        className="flex items-center gap-3 rounded-2xl border p-3 transition-all hover:shadow-md active:scale-[0.98]"
                        style={{
                          borderColor: i === 0 ? "color-mix(in srgb, var(--primary) 30%, transparent)" : "var(--border)",
                          background: "var(--surface)",
                          boxShadow: i === 0 ? "0 0 0 3px color-mix(in srgb, var(--primary) 8%, transparent)" : "none",
                        }}
                      >
                        <span
                          className="flex h-10 w-10 flex-none items-center justify-center rounded-xl"
                          style={{
                            background: i === 0 ? "var(--primary)" : "color-mix(in srgb, var(--primary) 10%, transparent)",
                            color: i === 0 ? "white" : "var(--primary)",
                          }}
                        >
                          <Headphones className="h-4 w-4" strokeWidth={1.75} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium" style={{ color: "var(--foreground)" }}>{p.name}</p>
                          <p className="truncate text-xs" style={{ color: "var(--muted)" }}>{p.tag}</p>
                        </div>
                        <span className="font-display text-sm" style={{ color: "var(--muted)" }}>0{i + 1}</span>
                      </li>
                    </FadeIn>
                  ))}
                </ul>

                <div className="mt-5 flex items-center justify-between pt-4" style={{ borderTop: "1px solid var(--border)" }}>
                  <p className="text-[11px]" style={{ color: "var(--muted)" }}>Disesuaikan dengan preferensi</p>
                  <span className="text-[11px] font-medium" style={{ color: "var(--primary)" }}>Berdasarkan kemiripan</span>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CRITERIA */}
      <section className="relative overflow-hidden py-24 md:py-28" style={{ background: "var(--foreground)" }}>
        <div className="absolute -top-40 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full blur-2xl pointer-events-none" style={{ background: "var(--primary)", opacity: 0.1 }} />
        <div className="relative mx-auto max-w-6xl px-6">
          <div className="mb-12 max-w-2xl">
            <FadeIn>
              <h2 className="font-display text-[1.85rem] leading-tight md:text-[2.25rem]" style={{ color: "var(--background)" }}>
                Empat kriteria utama dalam penilaian rekomendasi.
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="mt-3 text-sm leading-7" style={{ color: "color-mix(in srgb, var(--background) 50%, transparent)" }}>
                Setiap preferensi dibandingkan dengan spesifikasi tiap produk untuk menyusun rekomendasi yang relevan.
              </p>
            </FadeIn>
          </div>

          <div className="grid gap-px overflow-hidden rounded-2xl border sm:grid-cols-2 lg:grid-cols-4" style={{ borderColor: "color-mix(in srgb, var(--background) 10%, transparent)", background: "color-mix(in srgb, var(--background) 5%, transparent)" }}>
            {criteria.map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.1}>
                <div className="group relative p-6 transition-colors hover:opacity-90" style={{ background: "var(--foreground)" }}>
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl transition-transform group-hover:scale-110" style={{ border: "1px solid color-mix(in srgb, var(--primary) 30%, transparent)", background: "color-mix(in srgb, var(--primary) 15%, transparent)", color: "var(--primary)" }}>
                    <item.icon className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-5 text-base font-semibold" style={{ color: "var(--background)" }}>{item.title}</h3>
                  <p className="mt-2 text-sm leading-6" style={{ color: "color-mix(in srgb, var(--background) 50%, transparent)" }}>{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section id="cara-kerja" className="relative py-24 md:py-28">
        <div className="relative mx-auto max-w-6xl px-6">
          <div className="mb-10 max-w-2xl">
            <FadeIn>
              <h2 className="font-display text-[1.85rem] md:text-[2.25rem]" style={{ color: "var(--foreground)" }}>
                Tiga langkah menuju rekomendasi terbaik.
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="mt-3 text-sm leading-7" style={{ color: "var(--muted)" }}>Alur kerja sistem dari input preferensi hingga hasil rekomendasi.</p>
            </FadeIn>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((item, i) => (
              <FadeIn key={item.number} delay={i * 0.12}>
                <div className="relative">
                  {i < steps.length - 1 && (
                    <div className="absolute top-10 left-full z-10 hidden w-6 md:block" style={{ borderTop: "2px dashed color-mix(in srgb, var(--primary) 30%, transparent)" }} />
                  )}
                  <div className="group h-full rounded-2xl border p-7 transition-all hover:-translate-y-1 hover:shadow-lg" style={{ borderColor: "var(--border)", background: "var(--surface)", boxShadow: "var(--card-shadow)" }}>
                    <div className="flex items-center gap-3">
                      <span className="font-display text-4xl font-semibold transition-colors group-hover:opacity-80" style={{ color: "var(--primary)" }}>{item.number}</span>
                      <span className="h-px flex-1" style={{ background: `linear-gradient(to right, var(--primary), transparent)` }} />
                    </div>
                    <h3 className="font-display mt-4 text-xl" style={{ color: "var(--foreground)" }}>{item.title}</h3>
                    <p className="mt-2 text-sm leading-6" style={{ color: "var(--muted)" }}>{item.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 pt-8 pb-24 md:pb-28">
        <FadeIn>
          <div className="relative overflow-hidden rounded-2xl px-8 py-14 md:px-14 md:py-16" style={{ background: "var(--foreground)" }}>
            <div className="absolute -top-32 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full blur-2xl pointer-events-none" style={{ background: "var(--primary)", opacity: 0.15 }} />
            <div className="relative z-10 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
              <div className="max-w-xl">
                <h2 className="font-display text-[1.85rem] leading-tight md:text-[2.25rem]" style={{ color: "var(--background)" }}>
                  Siap menemukan TWS yang tepat?
                </h2>
                <p className="mt-3 text-sm leading-7" style={{ color: "color-mix(in srgb, var(--background) 50%, transparent)" }}>
                  Tetapkan preferensi Anda untuk menerima rekomendasi yang sesuai dengan kebutuhan.
                </p>
              </div>
              <div className="flex flex-shrink-0 flex-wrap items-center gap-3 md:flex-nowrap">
                <Link
                  href="/recommend"
                  className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all hover:gap-3"
                  style={{ background: "var(--background)", color: "var(--foreground)" }}
                >
                  Mulai Rekomendasi
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/product"
                  className="inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-medium transition-colors"
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
