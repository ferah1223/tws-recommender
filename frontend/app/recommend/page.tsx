"use client";

import { useState } from "react";
import {
  Sparkles,
  SlidersHorizontal,
  AudioWaveform,
  ChevronRight,
} from "lucide-react";
import PreferenceForm from "../../components/PreferenceForm";
import RecommendationList from "../../components/RecommendationList";

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
    budget: number;
  }) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://localhost:8000/recommend?top_n=3", {
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
    <main className="relative min-h-screen bg-[#fcfaff] text-slate-900">
      {/* Background accents */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[480px] overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.18),transparent_30%),radial-gradient(circle_at_top_right,rgba(236,72,153,0.12),transparent_25%),linear-gradient(to_bottom,#faf5ff,#ffffff)]"
      />

      {/* Header / Intro */}
      <section className="border-b border-white/40 bg-white/70">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-200 bg-white/80 px-3.5 py-1.5 text-xs font-medium text-fuchsia-700 shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Halaman Rekomendasi
          </div>

          <h1 className="mt-5 max-w-3xl text-3xl font-bold tracking-tight text-slate-950 md:text-3xl">
            Temukan TWS yang tepat
            <span className="bg-linear-to-r from-fuchsia-500 via-violet-500 to-purple-600 bg-clip-text text-transparent">
              {" "}
              untuk kamu
            </span>
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
            Isi preferensi sesuai kebutuhanmu, lalu sistem akan menganalisis dan
            menampilkan rekomendasi TWS terbaik berdasarkan kecocokan fitur dan
            spesifikasi produk.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-6xl px-4 py-10 md:py-12">
        <div className="grid gap-6 lg:grid-cols-[390px_1fr]">
          {/* Left panel */}
          <div className="space-y-4">
            <div className="rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-[0_20px_60px_-30px_rgba(168,85,247,0.35)]">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-fuchsia-100 to-violet-100 text-fuchsia-700">
                  <SlidersHorizontal className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Input Preferensi
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Isi preferensi pengguna untuk mendapatkan rekomendasi TWS
                    yang paling sesuai.
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <PreferenceForm onSubmit={handleSubmit} loading={loading} />
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div className="space-y-4">
            <div className="rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-[0_20px_60px_-30px_rgba(168,85,247,0.25)]">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                    <AudioWaveform className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Hasil Rekomendasi
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Menampilkan produk TWS terbaik berdasarkan preferensi yang
                      dimasukkan.
                    </p>
                  </div>
                </div>

                {!loading && recommendations.length > 0 && (
                  <span className="rounded-full border border-fuchsia-200 bg-fuchsia-50 px-4 py-2 text-xs font-semibold text-fuchsia-700">
                    {recommendations.length} produk ditampilkan
                  </span>
                )}
              </div>
            </div>

            {loading && (
              <div className="rounded-[28px] border border-white/70 bg-white/85 p-8 text-center shadow-[0_20px_60px_-30px_rgba(168,85,247,0.25)]">
                <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-fuchsia-100 border-t-fuchsia-600" />
                <p className="font-semibold text-slate-900">
                  Sedang memproses rekomendasi...
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Sistem sedang menghitung produk yang paling sesuai dengan
                  preferensimu.
                </p>
              </div>
            )}

            {error && (
              <div className="rounded-[28px] border border-red-200 bg-red-50 p-5 shadow-sm">
                <h3 className="font-semibold text-red-700">
                  Terjadi Kesalahan
                </h3>
                <p className="mt-1 text-sm text-red-600">{error}</p>
              </div>
            )}

            {!loading && !error && recommendations.length === 0 && (
              <div className="rounded-[28px] border border-dashed border-slate-300 bg-white/70 p-10 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-fuchsia-50 text-fuchsia-600">
                  <ChevronRight className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
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
          </div>
        </div>
      </section>
    </main>
  );
}
