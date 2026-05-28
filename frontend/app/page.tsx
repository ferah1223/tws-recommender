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

function AnimatedCounter({
  value,
  duration = 1400,
}: {
  value: number;
  duration?: number;
}) {
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

function FadeIn({
  children,
  className = "",
  delay = 0,
  y = 24,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
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
    <div className="font-body relative bg-white text-slate-900 overflow-hidden">
      {/* HERO */}
      <section className="relative grid-pattern flex min-h-[calc(100vh-72px)] items-center">
        <div className="absolute inset-0 bg-linear-to-br from-white via-white/95 to-violet-50/80 pointer-events-none" />
        <div className="absolute -top-24 left-1/4 h-80 w-80 rounded-full bg-violet-200/25 blur-2xl pointer-events-none" />

        <div className="relative mx-auto grid max-w-6xl gap-10 px-6 pt-10 pb-12 md:grid-cols-2 md:items-center lg:gap-14">
          {/* Left */}
          <div>
            <FadeIn delay={0.1}>
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-700 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse" />
                Content-Based Filtering
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <h1 className="font-display mt-5 text-[2.25rem] leading-[1.08] text-slate-950 md:text-[2.75rem] lg:text-[3rem]">
                Temukan TWS yang sesuai dengan preferensi Anda.
              </h1>
            </FadeIn>

            <FadeIn delay={0.3}>
              <p className="mt-4 max-w-md text-[15px] leading-7 text-slate-600">
                Sistem rekomendasi berbasis preferensi audio dan kebutuhan
                teknis Anda, dicocokkan dengan spesifikasi setiap produk
                dalam basis data.
              </p>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  href="/recommend"
                  className="group inline-flex items-center gap-2 rounded-full bg-violet-700 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-violet-600/20 transition-all hover:bg-violet-800 hover:gap-3"
                >
                  Mulai Rekomendasi
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="#cara-kerja"
                  className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-6 py-3 text-sm font-medium text-slate-700 backdrop-blur-sm transition-all hover:border-violet-300 hover:text-violet-700 hover:shadow-[0_0_0_4px_rgba(139,92,246,0.08)]"
                >
                  <span className="underline decoration-violet-300 decoration-2 underline-offset-4 group-hover:decoration-violet-500">
                    Pelajari Cara Kerja
                  </span>
                </Link>
              </div>
            </FadeIn>

            <FadeIn delay={0.5}>
              <div className="mt-7 flex items-center gap-6 border-t border-slate-100 pt-5">
                <div>
                  <p className="font-display text-2xl text-slate-900">
                    <AnimatedCounter value={100} />
                    <span className="text-violet-600">+</span>
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">Produk TWS</p>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div>
                  <p className="font-display text-2xl text-slate-900">
                    Top <span className="text-violet-600"><AnimatedCounter value={3} duration={900} /></span>
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">Rekomendasi</p>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div>
                  <p className="font-display text-2xl text-violet-700">
                    <AnimatedCounter value={7} duration={900} />
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">Parameter Preferensi</p>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Right — Hero Visual */}
          <FadeIn delay={0.3} y={20}>
            <div className="relative flex items-center justify-center">
              <div className="relative w-full max-w-md rounded-3xl border border-slate-200/70 bg-white p-6 shadow-[0_30px_80px_-20px_rgba(124,58,237,0.18)]">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-medium text-slate-500">
                      Hasil rekomendasi
                    </span>
                  </div>
                  <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-violet-700">
                    Top 3
                  </span>
                </div>

                <ul className="space-y-2.5">
                  {sampleResults.map((p, i) => (
                    <FadeIn key={p.name} delay={0.6 + i * 0.12} y={0}>
                      <li
                        className={`flex items-center gap-3 rounded-2xl border bg-white p-3 transition-colors hover:border-violet-200 ${
                          i === 0 ? "border-violet-200 shadow-[0_0_0_3px_rgba(139,92,246,0.08)]" : "border-slate-100"
                        }`}
                      >
                        <span className={`flex h-10 w-10 flex-none items-center justify-center rounded-xl ${
                          i === 0 ? "bg-violet-600 text-white" : "bg-violet-50 text-violet-700"
                        }`}>
                          <Headphones className="h-4 w-4" strokeWidth={1.75} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-slate-900">
                            {p.name}
                          </p>
                          <p className="truncate text-xs text-slate-500">
                            {p.tag}
                          </p>
                        </div>
                        <span className="font-display text-sm text-slate-400">
                          0{i + 1}
                        </span>
                      </li>
                    </FadeIn>
                  ))}
                </ul>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                  <p className="text-[11px] text-slate-500">
                    Disesuaikan dengan preferensi
                  </p>
                  <span className="text-[11px] font-medium text-violet-700">
                    Berdasarkan kemiripan
                  </span>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CRITERIA */}
      <section className="relative overflow-hidden bg-slate-950 py-24 md:py-28">
        <div className="absolute -top-40 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-violet-600/15 blur-2xl pointer-events-none" />
        <div className="relative mx-auto max-w-6xl px-6">
          <div className="mb-12 max-w-2xl">
            <FadeIn>
              <h2 className="font-display text-[1.85rem] leading-tight text-white md:text-[2.25rem]">
                Empat kriteria utama dalam penilaian rekomendasi.
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                Setiap preferensi dibandingkan dengan spesifikasi tiap produk,
                didukung parameter pendukung seperti anggaran, ketahanan air,
                dan codec audio untuk menyusun rekomendasi yang relevan.
              </p>
            </FadeIn>
          </div>

          <div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {criteria.map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.1}>
                <div className="group relative bg-slate-950 p-6 transition-colors hover:bg-slate-900">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 text-violet-300 shadow-[0_0_24px_-4px_rgba(139,92,246,0.45)] transition-transform group-hover:scale-110">
                    <item.icon className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-5 text-base font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {item.desc}
                  </p>
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
              <h2 className="font-display text-[1.85rem] text-slate-950 md:text-[2.25rem]">
                Tiga langkah menuju rekomendasi terbaik.
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Alur kerja sistem dari input preferensi hingga hasil rekomendasi.
              </p>
            </FadeIn>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((item, i) => (
              <FadeIn key={item.number} delay={i * 0.12}>
                <div className="relative">
                  {i < steps.length - 1 && (
                    <div className="absolute top-10 left-full z-10 hidden w-6 border-t-2 border-dashed border-violet-200 md:block" />
                  )}
                  <div className="group h-full rounded-2xl border border-slate-200 bg-white p-7 transition-all hover:-translate-y-1 hover:border-violet-300 hover:shadow-[0_12px_32px_-12px_rgba(124,58,237,0.3)]">
                    <div className="flex items-center gap-3">
                      <span className="font-display text-4xl font-semibold text-violet-600 transition-colors group-hover:text-violet-700">
                        {item.number}
                      </span>
                      <span className="h-px flex-1 bg-linear-to-r from-violet-300 via-violet-200 to-transparent" />
                    </div>
                    <h3 className="font-display mt-4 text-xl text-slate-900">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {item.desc}
                    </p>
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
          <div className="relative overflow-hidden rounded-2xl bg-slate-950 px-8 py-14 md:px-14 md:py-16">
            <div className="absolute -top-32 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-violet-600/20 blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
              <div className="max-w-xl">
                <h2 className="font-display text-[1.85rem] leading-tight text-white md:text-[2.25rem]">
                  Siap menemukan TWS yang tepat?
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  Tetapkan preferensi Anda untuk menerima rekomendasi yang
                  sesuai dengan kebutuhan.
                </p>
              </div>

              <div className="flex flex-shrink-0 flex-wrap items-center gap-3 md:flex-nowrap">
                <Link
                  href="/recommend"
                  className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-slate-950 transition-all hover:gap-3"
                >
                  Mulai Rekomendasi
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/product"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/5"
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
