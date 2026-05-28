"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, ArrowUpRight } from "lucide-react";

type FaqItem = {
  q: string;
  a: string;
  category: string;
};

const faqs: FaqItem[] = [
  {
    category: "Dasar & Audio",
    q: "Apa itu TWS?",
    a: "TWS merupakan singkatan dari True Wireless Stereo — earphone tanpa kabel apa pun, termasuk antara earbud kiri dan kanan. Bentuk ini berbeda dengan earphone bluetooth generasi sebelumnya yang masih memiliki kabel penghubung di belakang leher.",
  },
  {
    category: "Dasar & Audio",
    q: "Apa perbedaan karakter suara bass, treble, dan balance?",
    a: "Bass menonjolkan nada rendah, cocok untuk genre EDM, hip-hop, atau RnB. Treble menonjolkan nada tinggi sehingga vokal dan instrumen terdengar lebih detail. Balance menempatkan ketiga frekuensi pada porsi seimbang, pilihan paling fleksibel untuk berbagai genre.",
  },
  {
    category: "Dasar & Audio",
    q: "Apa itu codec SBC, AAC, LDAC, LHDC, aptX, dan LC3?",
    a: "Codec adalah metode kompresi yang digunakan saat data audio dikirim melalui bluetooth. SBC adalah codec dasar, AAC lebih efisien terutama di iPhone. LDAC, LHDC, dan aptX Adaptive adalah codec hi-res dengan kualitas mendekati CD. LC3 adalah codec generasi baru yang lebih hemat daya.",
  },
  {
    category: "Fitur & Teknologi",
    q: "Apa fungsi ANC pada TWS?",
    a: "ANC (Active Noise Cancellation) meredam kebisingan lingkungan dengan memanfaatkan mikrofon dan gelombang suara berlawanan fase. Manfaatnya paling terasa saat menggunakan transportasi umum, bekerja di tempat ramai, atau bepergian dengan pesawat.",
  },
  {
    category: "Fitur & Teknologi",
    q: "Apakah mode Gaming memberi dampak nyata?",
    a: "Berpengaruh, terutama saat bermain game atau menonton film. Mode ini menurunkan jeda antara suara dan gambar dari kisaran 200ms menjadi 60-80ms, sehingga keduanya tetap sinkron.",
  },
  {
    category: "Fitur & Teknologi",
    q: "Apakah perbedaan bluetooth versi 5.0, 5.3, dan 6.0 signifikan?",
    a: "Versi yang lebih baru menawarkan jangkauan lebih jauh dan konsumsi daya lebih hemat. Namun untuk pemakaian sehari-hari, perbedaan antara 5.0 dan 5.3 cenderung kecil. Yang lebih penting adalah memastikan versi bluetooth TWS sama atau lebih tinggi dari perangkat yang digunakan.",
  },
  {
    category: "Ketahanan & Daya",
    q: "Apa arti rating IPX4, IP54, dan IP68?",
    a: "Angka pertama menunjukkan ketahanan debu (0-6), angka kedua ketahanan air (0-9). IPX4 tahan keringat dan cipratan. IP54 tahan debu ringan dan cipratan. IP68 tahan debu sepenuhnya dan bisa direndam lebih dalam.",
  },
  {
    category: "Ketahanan & Daya",
    q: "Apakah klaim baterai pada spesifikasi mencakup case?",
    a: "Angka besar yang dicantumkan biasanya merupakan total pemakaian termasuk pengisian ulang dari case. Earbud itu sendiri biasanya bertahan 5-10 jam. Sisa daya berasal dari case yang mampu mengisi ulang earbud 2-4 kali.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

function FaqAccordion({ item }: { item: FaqItem }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="rounded-2xl border transition-all overflow-hidden"
      style={{
        borderColor: open ? "color-mix(in srgb, var(--primary) 25%, transparent)" : "var(--border)",
        background: open ? "color-mix(in srgb, var(--primary) 3%, var(--surface))" : "var(--surface)",
        boxShadow: open ? "var(--card-shadow)" : "none",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-[var(--muted-bg)] active:scale-[0.99]"
      >
        <span className="text-[14px] font-semibold pr-4" style={{ color: "var(--foreground)" }}>{item.q}</span>
        <span
          className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full transition-all"
          style={{
            background: open ? "var(--primary)" : "var(--muted-bg)",
            color: open ? "white" : "var(--muted)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          {open ? <Minus className="h-3.5 w-3.5" strokeWidth={2} /> : <Plus className="h-3.5 w-3.5" strokeWidth={2} />}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div className="px-6 pb-5">
              <p className="text-[13px] leading-relaxed" style={{ color: "var(--muted)" }}>{item.a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FaqPage() {
  const categories = [...new Set(faqs.map((f) => f.category))];

  return (
    <main className="font-body relative min-h-screen" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />
        <div className="absolute top-[-20%] right-[10%] w-80 h-80 rounded-full opacity-20 pointer-events-none aurora-blob" style={{ background: "radial-gradient(circle, var(--primary), transparent 70%)", filter: "blur(80px)" }} />

        <div className="relative mx-auto max-w-3xl px-6 py-14 lg:py-16">
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.p variants={fadeUp} className="text-[11px] font-semibold uppercase tracking-[0.15em] mb-3" style={{ color: "var(--primary)" }}>
              Bantuan
            </motion.p>
            <motion.h1 variants={fadeUp} className="font-display text-[clamp(1.75rem,4vw,2.5rem)] leading-tight" style={{ color: "var(--foreground)" }}>
              Pertanyaan yang<br />sering diajukan.
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-4 text-[14px] leading-relaxed max-w-lg" style={{ color: "var(--muted)" }}>
              Temukan jawaban seputar TWS, karakter suara, fitur, dan cara kerja sistem rekomendasi.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="mx-auto max-w-3xl px-6 py-12">
        {categories.map((cat) => (
          <div key={cat} className="mb-10">
            <h2 className="font-display text-[15px] font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--foreground)" }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--primary)" }} />
              {cat}
            </h2>
            <div className="space-y-3">
              {faqs.filter((f) => f.category === cat).map((item, i) => (
                <FaqAccordion key={i} item={item} />
              ))}
            </div>
          </div>
        ))}

        {/* CTA */}
        <div className="mt-12 rounded-2xl p-8 text-center" style={{ background: "var(--muted-bg)", border: "1px dashed var(--border)" }}>
          <p className="text-[14px] font-semibold mb-1" style={{ color: "var(--foreground)" }}>Tidak menemukan jawaban?</p>
          <p className="text-[13px] mb-5" style={{ color: "var(--muted)" }}>Coba langsung sistem rekomendasi untuk melihat cara kerjanya.</p>
          <Link
            href="/recommend"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white transition-all hover:gap-3 active:scale-[0.97]"
            style={{ background: "var(--primary)" }}
          >
            Coba Rekomendasi
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
