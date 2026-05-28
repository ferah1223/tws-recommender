"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  SlidersHorizontal,
  AudioWaveform,
  ChevronRight,
  Loader2,
} from "lucide-react";
import PreferenceForm from "../../components/PreferenceForm";
import RecommendationList from "../../components/RecommendationList";
import { API_BASE_URL } from "../../lib/api";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

type Recommendation = {
  id: string;
  nama: string;
  brand: string;
  harga: number;
  skor: number;
  alasan: string[];
  spesifikasi: {
    karakter_suara: string;
    battery_hours: number;
    anc: boolean;
    gaming: boolean;
    bluetooth_version?: string;
    codec?: string;
    water_resistance?: string;
    driver_size?: string;
    mic_count?: number;
    charging_port?: string;
    deskripsi?: string;
  };
};

export default function RecommendPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (formData: {
    karakter_suara: "bass" | "treble" | "balance";
    min_battery_hours: number;
    anc: boolean;
    gaming: boolean;
    hires: boolean;
    budget: number;
    water_resistance: "none" | "basic" | "sport";
  }) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/recommend?top_n=3`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Gagal mengambil rekomendasi");
      }

      const data = await response.json();
      setRecommendations(data.recommendations || []);
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan saat mengambil rekomendasi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="font-body relative min-h-screen bg-white text-slate-900">
      {/* ── HERO ── */}
      <section className="relative grid-pattern overflow-hidden border-b border-slate-100">
        <div className="absolute inset-0 bg-linear-to-br from-white via-white/95 to-violet-50/80 pointer-events-none" />
        <div className="absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-violet-200/30 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-6xl px-6 py-10 lg:px-10 lg:py-12">
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.08 } },
            }}
            className="max-w-2xl"
          >
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-700 backdrop-blur-sm"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse" />
              Halaman Rekomendasi
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="font-display mt-5 text-[2rem] leading-[1.1] text-slate-950 md:text-[2.5rem]"
            >
              Temukan TWS yang tepat{" "}
              <span className="bg-linear-to-r from-violet-600 via-violet-500 to-purple-600 bg-clip-text text-transparent">
                untuk Anda
              </span>
              .
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-4 max-w-xl text-[15px] leading-7 text-slate-600"
            >
              Isi preferensi sesuai kebutuhan Anda, lalu sistem akan
              menganalisis dan menampilkan rekomendasi TWS terbaik berdasarkan
              kecocokan fitur dan spesifikasi produk.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <section className="mx-auto max-w-6xl px-6 py-10 lg:px-10 lg:py-12">
        <div className="grid gap-6 lg:grid-cols-[390px_1fr]">
          {/* Left panel — Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] as const }}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_24px_-12px_rgba(124,58,237,0.15)]"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                <SlidersHorizontal className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-700">
                  Langkah 1
                </p>
                <h2 className="font-display mt-1 text-lg text-slate-950">
                  Input Preferensi
                </h2>
              </div>
            </div>

            <div className="mt-6">
              <PreferenceForm onSubmit={handleSubmit} loading={loading} />
            </div>
          </motion.div>

          {/* Right panel — Results */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2, ease: [0.22, 1, 0.36, 1] as const }}
            className="space-y-4"
          >
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_24px_-12px_rgba(124,58,237,0.15)]">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                    <AudioWaveform className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-700">
                      Langkah 2
                    </p>
                    <h2 className="font-display mt-1 text-lg text-slate-950">
                      Hasil Rekomendasi
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Menampilkan produk TWS terbaik berdasarkan preferensi
                      yang dimasukkan.
                    </p>
                  </div>
                </div>

                {!loading && recommendations.length > 0 && (
                  <span className="rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-xs font-semibold text-violet-700">
                    {recommendations.length} produk ditampilkan
                  </span>
                )}
              </div>
            </div>

            {loading && (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-[0_8px_24px_-12px_rgba(124,58,237,0.15)]">
                <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-violet-600" />
                <p className="font-display text-base text-slate-950">
                  Sedang memproses rekomendasi…
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Sistem sedang menghitung produk yang paling sesuai dengan
                  preferensi Anda.
                </p>
              </div>
            )}

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
                <h3 className="font-display text-base text-red-700">
                  Terjadi Kesalahan
                </h3>
                <p className="mt-1 text-sm leading-6 text-red-600">{error}</p>
              </div>
            )}

            {!loading && !error && recommendations.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                  <ChevronRight className="h-6 w-6" strokeWidth={1.75} />
                </div>
                <h3 className="font-display mt-4 text-lg text-slate-950">
                  Belum ada rekomendasi
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Silakan isi form preferensi terlebih dahulu untuk melihat
                  hasil rekomendasi TWS yang paling sesuai.
                </p>
              </div>
            )}

            {!loading && !error && recommendations.length > 0 && (
              <RecommendationList recommendations={recommendations} />
            )}
          </motion.div>
        </div>
      </section>
    </main>
  );
}
