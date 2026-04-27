import Link from "next/link";
import {
  Headphones,
  Sparkles,
  AudioWaveform,
  BatteryFull,
  ShieldCheck,
  Gamepad2,
  SlidersHorizontal,
  Star,
  ArrowUpRight,
} from "lucide-react";

const features = [
  {
    icon: AudioWaveform,
    title: "Preferensi Lebih Personal",
    desc: "Pilih karakter suara, fitur, dan kebutuhan utama untuk hasil rekomendasi yang lebih relevan.",
  },
  {
    icon: Sparkles,
    title: "Rekomendasi Lebih Cerdas",
    desc: "Sistem memanfaatkan Content-Based Filtering untuk mencocokkan preferensi pengguna dengan spesifikasi produk.",
  },
  {
    icon: SlidersHorizontal,
    title: "Informasi Jelas & Ringkas",
    desc: "Setiap hasil menampilkan skor kecocokan dan gambaran spesifikasi penting secara mudah dipahami.",
  },
];

const criteria = [
  {
    icon: AudioWaveform,
    title: "Karakter Suara",
    desc: "Bass, balance, atau detail treble sesuai selera mendengarmu.",
    color: "from-violet-500 to-purple-600",
    bg: "bg-violet-50",
  },
  {
    icon: BatteryFull,
    title: "Daya Tahan Baterai",
    desc: "Pilih TWS untuk aktivitas harian, kerja, atau penggunaan panjang.",
    color: "from-emerald-400 to-teal-500",
    bg: "bg-emerald-50",
  },
  {
    icon: ShieldCheck,
    title: "Fitur ANC",
    desc: "Temukan produk dengan peredam bising aktif untuk pengalaman lebih fokus.",
    color: "from-rose-400 to-pink-500",
    bg: "bg-rose-50",
  },
  {
    icon: Gamepad2,
    title: "Mode Gaming",
    desc: "Cocok untuk pengguna yang membutuhkan latensi rendah saat bermain.",
    color: "from-amber-400 to-orange-500",
    bg: "bg-amber-50",
  },
];

const steps = [
  {
    number: "01",
    title: "Isi Preferensi",
    desc: "Masukkan kebutuhan utama seperti suara, baterai, ANC, gaming, dan budget.",
  },
  {
    number: "02",
    title: "Sistem Menganalisis",
    desc: "Metode Content-Based Filtering menghitung tingkat kecocokan tiap produk.",
  },
  {
    number: "03",
    title: "Lihat Hasil Terbaik",
    desc: "Dapatkan rekomendasi TWS lengkap dengan skor dan ringkasan keunggulan produk.",
  },
];

export default function HomePage() {
  return (
    <>
      <main className="font-body relative min-h-screen bg-white text-slate-900 overflow-hidden">
        {/* ── HERO ── */}
        <section className="relative grid-pattern">
          {/* Gradient overlay over grid */}
          <div className="absolute inset-0 bg-linear-to-br from-white via-white/95 to-violet-50/80 pointer-events-none" />

          {/* Decorative blobs */}
          <div className="absolute top-20 -left-20 h-72 w-72 rounded-full bg-violet-200/40 blur-3xl pointer-events-none" />
          <div className="absolute top-10 right-10 h-56 w-56 rounded-full bg-fuchsia-200/30 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/2 h-40 w-96 rounded-full bg-purple-100/60 blur-2xl pointer-events-none" />

          <div className="relative mx-auto grid max-w-6xl gap-12 px-6 pt-24 pb-20 md:grid-cols-2 md:items-center lg:gap-16">
            {/* Left */}
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-violet-600">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse" />
                Sistem Rekomendasi TWS
              </div>

              {/* Headline */}
              <h1 className="font-display mt-6 text-4xl leading-[1.15] tracking-tight text-slate-950 md:text-5xl lg:text-6xl">
                Temukan TWS yang
                <span className="block italic text-shimmer">paling cocok</span>
                untuk kebutuhanmu
              </h1>

              <p className="mt-6 text-base leading-8 text-slate-500 max-w-md">
                Sistem ini membantu pengguna menemukan produk True Wireless
                Stereo terbaik berdasarkan kecocokan spesifikasi dengan
                preferensi pribadi — suara, baterai, ANC, hingga gaming.
              </p>

              {/* CTA */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/recommend"
                  className="group inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-violet-700 hover:gap-3"
                >
                  Mulai Rekomendasi
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-6 py-3 text-sm font-medium text-slate-700 transition hover:border-violet-300 hover:text-violet-700"
                >
                  Pelajari Sistem
                </Link>
              </div>

              {/* Social proof strip */}
              <div className="mt-10 flex items-center gap-6 border-t border-slate-100 pt-6">
                <div>
                  <p className="font-display text-2xl text-slate-900">50+</p>
                  <p className="text-xs text-slate-400 mt-0.5">Produk TWS</p>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div>
                  <p className="font-display text-2xl text-slate-900">4</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Kriteria Penilaian
                  </p>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div>
                  <p className="font-display text-2xl text-slate-900">CBF</p>
                  <p className="text-xs text-slate-400 mt-0.5">Metode AI</p>
                </div>
              </div>
            </div>

            {/* Right — Hero Visual */}
            <div className="relative flex items-center justify-center">
              {/* Main card */}
              <div className="relative w-full max-w-sm rounded-[2.5rem] border border-slate-200/80 bg-white/90 p-8 shadow-[0_30px_80px_-20px_rgba(109,40,217,0.25)] backdrop-blur-sm">
                {/* Floating tags */}
                <div className="absolute -top-4 -left-4 rounded-2xl border border-violet-100 bg-white px-4 py-2.5 shadow-lg">
                  <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400">
                    Metode
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-slate-900">
                    CBF Matching
                  </p>
                </div>
                <div className="absolute -top-2 -right-4 rounded-2xl border border-slate-100 bg-white px-4 py-2.5 shadow-lg">
                  <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400">
                    Akurasi
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-violet-600">
                    Tinggi
                  </p>
                </div>
                <div className="absolute -bottom-4 -right-3 rounded-2xl bg-slate-950 px-4 py-2.5 shadow-lg">
                  <p className="text-[9px] font-semibold uppercase tracking-widest text-white/50">
                    Output
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-white">
                    Lebih Terarah
                  </p>
                </div>

                {/* Center icon */}
                <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full bg-linear-to-br from-violet-500 via-purple-500 to-fuchsia-600 animate-float animate-pulse-ring shadow-2xl shadow-violet-300/40">
                  <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white/20">
                    <Headphones
                      className="h-14 w-14 text-white"
                      strokeWidth={1.5}
                    />
                  </div>
                </div>

                {/* Match score bar */}
                <div className="mt-6 rounded-2xl bg-slate-50 px-4 py-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-slate-500">
                      Skor Kecocokan
                    </span>
                    <span className="text-xs font-bold text-violet-600">
                      94%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-200">
                    <div className="h-1.5 w-[94%] rounded-full bg-linear-to-r from-violet-500 to-fuchsia-500" />
                  </div>
                  <p className="mt-2 text-[11px] text-slate-400">
                    Berdasarkan preferensimu
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-4 md:grid-cols-3">
            {features.map((item, i) => (
              <div
                key={item.title}
                className="card-hover group relative rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white group-hover:bg-violet-600 transition-colors duration-300">
                  <item.icon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <h3 className="font-display mt-5 text-lg font-normal text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-500">
                  {item.desc}
                </p>
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="h-4 w-4 text-violet-400" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CRITERIA ── */}
        <section className="bg-slate-950 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-12">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
                Kriteria Penilaian
              </p>
              <h2 className="font-display mt-3 text-3xl text-white md:text-4xl">
                Faktor yang digunakan
                <span className="block italic text-slate-400">
                  dalam rekomendasi
                </span>
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400">
                Sistem mempertimbangkan beberapa aspek utama agar hasil yang
                muncul terasa lebih relevan dengan kebutuhan pengguna.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {criteria.map((item) => (
                <div
                  key={item.title}
                  className="card-hover rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm hover:border-white/20"
                >
                  <div
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br ${item.color} text-white shadow-lg`}
                  >
                    <item.icon className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-5 text-base font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── STEPS ── */}
        <section className="relative bg-violet-50/50 py-20">
          <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none" />
          <div className="relative mx-auto max-w-6xl px-6">
            <div className="mb-12 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-500">
                Cara Kerja
              </p>
              <h2 className="font-display mt-3 text-3xl tracking-tight text-slate-950 md:text-4xl">
                Tiga langkah sederhana
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-500">
                Hanya perlu beberapa menit untuk mulai menemukan TWS yang
                sesuai.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {steps.map((item, i) => (
                <div key={item.number} className="relative">
                  {/* Connector line */}
                  {i < steps.length - 1 && (
                    <div className="absolute top-8 left-full z-10 hidden w-6 border-t-2 border-dashed border-violet-200 md:block" />
                  )}
                  <div className="card-hover rounded-3xl border border-white bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                      <span className="font-display text-4xl text-violet-200">
                        {item.number}
                      </span>
                      <Star className="h-3 w-3 text-violet-300" />
                    </div>
                    <h3 className="font-display mt-4 text-xl text-slate-900">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="relative overflow-hidden rounded-[2rem] bg-linear-to-br from-violet-600 via-purple-600 to-fuchsia-700 px-8 py-12 text-white md:px-14 md:py-14">
            {/* Decorative shapes */}
            <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-white/10" />
            <div className="absolute -bottom-16 -left-8 h-48 w-48 rounded-full bg-white/5" />
            <div className="absolute top-8 right-32 h-20 w-20 rounded-full bg-fuchsia-400/30" />

            <div className="relative z-10 flex flex-col justify-between gap-8 md:flex-row md:items-center">
              <div className="max-w-lg">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-200">
                  Mulai Sekarang
                </p>
                <h2 className="font-display mt-3 text-3xl leading-tight md:text-4xl">
                  Temukan TWS pilihanmu hari ini
                </h2>
                <p className="mt-4 text-sm leading-7 text-violet-200">
                  Gunakan sistem rekomendasi ini untuk mempercepat proses
                  memilih produk yang paling sesuai dengan kebutuhan dan
                  preferensimu.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row md:flex-col md:items-start lg:flex-row">
                <Link
                  href="/recommend"
                  className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-violet-700 transition-all hover:bg-violet-50 hover:gap-3"
                >
                  Coba Sekarang
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  Pelajari lebih lanjut
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
