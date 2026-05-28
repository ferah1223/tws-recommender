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
    <main className="font-body relative min-h-screen" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      {/* HERO */}
      <section className="relative grid-pattern overflow-hidden" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(135deg, var(--background), color-mix(in srgb, var(--primary) 3%, var(--background)))" }} />
        <div className="absolute -top-24 left-1/4 h-72 w-72 rounded-full blur-3xl pointer-events-none opacity-30" style={{ background: "var(--primary)" }} />

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
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em]"
              style={{ border: "1px solid color-mix(in srgb, var(--primary) 20%, transparent)", background: "color-mix(in srgb, var(--primary) 5%, var(--surface))", color: "var(--primary)" }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: "var(--primary)" }} />
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "var(--primary)" }} />
              </span>
              Halaman Rekomendasi
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="font-display mt-5 text-[clamp(1.5rem,3.5vw,2.5rem)] leading-[1.1]"
              style={{ color: "var(--foreground)" }}
            >
              Temukan TWS yang tepat{" "}
              <span className="gradient-text">untuk Anda.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-4 max-w-xl text-[15px] leading-7"
              style={{ color: "var(--muted)" }}
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
            className="rounded-2xl border p-6"
            style={{ borderColor: "var(--border)", background: "var(--surface)", boxShadow: "var(--card-shadow)" }}
          >
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: "color-mix(in srgb, var(--primary) 10%, transparent)", color: "var(--primary)" }}>
                <SlidersHorizontal className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--primary)" }}>Langkah 1</p>
                <h2 className="font-display mt-1 text-lg" style={{ color: "var(--foreground)" }}>Input Preferensi</h2>
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
            <div className="rounded-2xl border p-6" style={{ borderColor: "var(--border)", background: "var(--surface)", boxShadow: "var(--card-shadow)" }}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: "color-mix(in srgb, var(--primary) 10%, transparent)", color: "var(--primary)" }}>
                    <AudioWaveform className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--primary)" }}>
                      Langkah 2
                    </p>
                    <h2 className="font-display mt-1 text-lg" style={{ color: "var(--foreground)" }}>
                      Hasil Rekomendasi
                    </h2>
                    <p className="mt-1 text-sm leading-6" style={{ color: "var(--muted)" }}>
                      Menampilkan produk TWS terbaik berdasarkan preferensi
                      yang dimasukkan.
                    </p>
                  </div>
                </div>

                {!loading && recommendations.length > 0 && (
                  <span className="rounded-full px-4 py-2 text-xs font-semibold" style={{ background: "color-mix(in srgb, var(--primary) 10%, transparent)", color: "var(--primary)", border: "1px solid color-mix(in srgb, var(--primary) 20%, transparent)" }}>
                    {recommendations.length} produk ditampilkan
                  </span>
                )}
              </div>
            </div>

            {loading && (
              <div className="rounded-2xl border p-10 text-center" style={{ borderColor: "var(--border)", background: "var(--surface)", boxShadow: "var(--card-shadow)" }}>
                <div className="mx-auto mb-4 h-10 w-10 skeleton rounded-full" />
                <div className="mx-auto h-4 w-48 skeleton mb-2" />
                <div className="mx-auto h-3 w-64 skeleton" />
              </div>
            )}

            {error && (
              <div className="rounded-2xl border p-5" style={{ borderColor: "color-mix(in srgb, #ef4444 30%, transparent)", background: "color-mix(in srgb, #ef4444 5%, var(--surface))" }}>
                <h3 className="font-display text-base" style={{ color: "#ef4444" }}>
                  Terjadi Kesalahan
                </h3>
                <p className="mt-1 text-sm leading-6" style={{ color: "color-mix(in srgb, #ef4444 80%, var(--foreground))" }}>{error}</p>
              </div>
            )}

            {!loading && !error && recommendations.length === 0 && (
              <div className="rounded-2xl border p-10 text-center" style={{ borderColor: "var(--border)", borderStyle: "dashed", background: "var(--surface)" }}>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl" style={{ background: "color-mix(in srgb, var(--primary) 8%, transparent)", color: "var(--primary)" }}>
                  <ChevronRight className="h-6 w-6" strokeWidth={1.75} />
                </div>
                <h3 className="font-display mt-4 text-lg" style={{ color: "var(--foreground)" }}>
                  Belum ada rekomendasi
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6" style={{ color: "var(--muted)" }}>
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
