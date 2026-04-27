import {
  AudioWaveform,
  BatteryFull,
  ShieldCheck,
  Gamepad2,
  Scale,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

// ─── Data ───────────────────────────────────────────────────────────────────

const criteria = [
  {
    icon: AudioWaveform,
    title: "Karakter Suara",
    weight: 40,
    desc: "Diberi bobot tertinggi karena preferensi suara bersifat sangat subjektif — bass tidak bisa dikompensasi oleh treble meskipun fitur lain cocok.",
    pill: "Bobot tertinggi",
  },
  {
    icon: BatteryFull,
    title: "Daya Tahan Baterai",
    weight: 20,
    desc: "Dinilai secara gradual: produk yang melebihi kebutuhan minimal mendapat skor penuh, yang kurang mendapat penalti proporsional.",
    pill: "Gradual scoring",
  },
  {
    icon: ShieldCheck,
    title: "Fitur ANC",
    weight: 20,
    desc: "Hanya dihitung jika pengguna membutuhkan ANC. Jika dibutuhkan tapi tidak ada, produk mendapat penalti.",
    pill: "Opsional",
  },
  {
    icon: Gamepad2,
    title: "Mode Gaming",
    weight: 20,
    desc: "Hanya dihitung jika pengguna membutuhkan mode gaming (latensi rendah). Serupa dengan mekanisme ANC.",
    pill: "Opsional",
  },
  {
    icon: Scale,
    title: "Budget",
    weight: null,
    desc: "Merupakan hard constraint — bukan preferensi yang bisa dikompromikan. Produk di atas budget langsung dibuang sebelum scoring dimulai.",
    pill: "Hard constraint",
  },
];

const steps = [
  {
    num: "01",
    title: "Input Preferensi",
    desc: "Pengguna mengisi karakter suara, kebutuhan baterai minimal, apakah butuh ANC, apakah butuh mode gaming, dan budget maksimal.",
  },
  {
    num: "02",
    title: "Filter Budget",
    desc: "Sistem langsung membuang semua produk yang harganya melebihi budget. Budget adalah batasan mutlak, bukan preferensi yang bisa ditawar.",
  },
  {
    num: "03",
    title: "Hitung Skor CBF",
    desc: "Setiap produk dalam budget diberi skor berdasarkan kecocokan atribut dengan preferensi pengguna. Skor dinormalisasi ke rentang 0–100.",
  },
  {
    num: "04",
    title: "Tampilkan Rekomendasi",
    desc: "Produk diurutkan dari skor tertinggi. Top 3 terbaik ditampilkan lengkap dengan skor kecocokan dan alasan rekomendasi.",
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@300;400;500;600&display=swap');

        :root {
          --orchid:       #b05ecf;
          --orchid-light: #d49ee8;
          --orchid-pale:  #f3e8fb;
          --orchid-bg:    #faf4fe;
          --orchid-dark:  #7b3fa0;
          --ink:          #1a1025;
          --ink-soft:     #4a3f5c;
          --white:        #ffffff;
          --border:       #e8d8f5;
        }

        .font-serif  { font-family: 'Instrument Serif', Georgia, serif; }
        .font-sans   { font-family: 'Outfit', system-ui, sans-serif; }

        .noise::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          border-radius: inherit;
        }

        .card-lift {
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease;
        }
        .card-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 36px -8px rgba(176,94,207,0.16);
        }

        .weight-bar-fill {
          transition: width 1s cubic-bezier(0.22, 1, 0.36, 1);
        }

        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up    { animation: fade-up 0.6s ease both; }
        .fade-up-d1 { animation: fade-up 0.6s 0.1s ease both; }
        .fade-up-d2 { animation: fade-up 0.6s 0.2s ease both; }
      `}</style>

      <main className="font-sans min-h-screen" style={{ background: "var(--orchid-bg)", color: "var(--ink)" }}>

        {/* ── HEADER ───────────────────────────────────────────────────── */}
        <section className="mx-auto max-w-5xl px-6 pt-16 pb-10">
          <div className="fade-up rounded-4xl px-8 py-10 relative overflow-hidden"
            style={{ background: "var(--white)", border: "1px solid var(--border)" }}>

            {/* Decorative blob */}
            <div className="absolute" style={{
              width: 280, height: 280, borderRadius: "50%",
              background: "radial-gradient(circle, #d49ee8 0%, transparent 70%)",
              top: -80, right: -60, opacity: 0.3, filter: "blur(50px)",
              pointerEvents: "none",
            }} />

            <span className="inline-flex rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest"
              style={{ background: "var(--orchid-pale)", color: "var(--orchid-dark)", border: "1px solid var(--border)" }}>
              Tentang Sistem
            </span>

            <h1 className="font-serif mt-5 text-4xl md:text-5xl leading-[1.15]" style={{ color: "var(--ink)" }}>
              Sistem Rekomendasi<br />
              <span className="italic" style={{ color: "var(--orchid)" }}>True Wireless Stereo</span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8" style={{ color: "var(--ink-soft)" }}>
              Website ini mengimplementasikan sistem rekomendasi produk TWS menggunakan metode
              <strong style={{ color: "var(--orchid-dark)", fontWeight: 600 }}> Content-Based Filtering (CBF)</strong> —
              pendekatan yang mencocokkan spesifikasi produk langsung dengan preferensi pengguna,
              tanpa membutuhkan data historis dari pengguna lain.
            </p>
          </div>
        </section>

        {/* ── TUJUAN + METODE ──────────────────────────────────────────── */}
        <section className="mx-auto max-w-5xl px-6 pb-8">
          <div className="grid gap-5 md:grid-cols-2">

            {/* Tujuan */}
            <div className="fade-up-d1 card-lift rounded-4xl p-7"
              style={{ background: "var(--white)", border: "1px solid var(--border)" }}>
              <h2 className="font-serif text-2xl" style={{ color: "var(--ink)" }}>Tujuan</h2>
              <ul className="mt-5 space-y-4">
                {[
                  "Membantu pengguna memilih produk TWS yang sesuai kebutuhan tanpa harus membaca banyak review secara manual.",
                  "Menyederhanakan proses pencarian dengan menyaring produk berdasarkan preferensi utama.",
                  "Menampilkan rekomendasi yang terukur — dilengkapi skor kecocokan dan alasan yang dapat dipahami.",
                ].map((t, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-1 shrink-0 h-5 w-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                      style={{ background: "var(--orchid)" }}>{i + 1}</span>
                    <p className="text-sm leading-7" style={{ color: "var(--ink-soft)" }}>{t}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Metode */}
            <div className="fade-up-d2 card-lift rounded-4xl p-7 relative overflow-hidden noise"
              style={{ background: "linear-gradient(145deg, var(--orchid-dark), #4a1f70)", color: "#fff" }}>
              <h2 className="font-serif text-2xl">Metode</h2>
              <p className="mt-4 text-sm leading-7" style={{ color: "rgba(255,255,255,0.75)" }}>
                <strong style={{ color: "#fff" }}>Content-Based Filtering</strong> bekerja dengan mencocokkan
                atribut produk terhadap preferensi yang dinyatakan pengguna secara eksplisit.
              </p>
              <p className="mt-4 text-sm leading-7" style={{ color: "rgba(255,255,255,0.75)" }}>
                Setiap kriteria diberi <strong style={{ color: "#fff" }}>bobot berbeda</strong> sesuai
                tingkat kepentingannya. Skor akhir dinormalisasi ke 0–100 dan dipersonalisasi —
                pengguna yang tidak butuh ANC atau gaming tidak akan dirugikan.
              </p>
              <div className="mt-6 rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.1)" }}>
                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--orchid-light)" }}>
                  Rumus skor
                </p>
                <p className="mt-2 font-serif text-xl italic">
                  Skor = (raw_score / max_score) × 100
                </p>
                <p className="mt-1 text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                  di-clamp ke rentang 0–100
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── KRITERIA + BOBOT ─────────────────────────────────────────── */}
        <section className="mx-auto max-w-5xl px-6 pb-8">
          <div className="rounded-4xl p-7" style={{ background: "var(--white)", border: "1px solid var(--border)" }}>
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--orchid)" }}>
              Kriteria Penilaian
            </p>
            <h2 className="font-serif mt-2 text-2xl md:text-3xl" style={{ color: "var(--ink)" }}>
              Faktor yang digunakan dalam scoring
            </h2>
            <p className="mt-3 text-sm leading-7 max-w-xl" style={{ color: "var(--ink-soft)" }}>
              Total bobot maksimum bergantung pada kebutuhan pengguna — jika tidak butuh ANC maupun gaming,
              max score = 60. Jika butuh keduanya, max score = 100.
            </p>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {criteria.map((c, i) => (
                <div key={i} className="card-lift rounded-2xl p-5"
                  style={{ background: "var(--orchid-bg)", border: "1px solid var(--border)" }}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl"
                        style={{ background: "var(--orchid-pale)" }}>
                        <c.icon size={18} style={{ color: "var(--orchid-dark)" }} strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: "var(--ink)" }}>{c.title}</p>
                        <span className="inline-block mt-0.5 rounded-full px-2 py-0.5 text-[10px] font-medium"
                          style={{ background: "var(--orchid-pale)", color: "var(--orchid-dark)" }}>
                          {c.pill}
                        </span>
                      </div>
                    </div>
                    {c.weight !== null && (
                      <span className="font-serif text-2xl shrink-0" style={{ color: "var(--orchid)" }}>
                        {c.weight}
                      </span>
                    )}
                  </div>

                  {/* Weight bar */}
                  {c.weight !== null && (
                    <div className="mt-4" style={{ height: 4, borderRadius: 999, background: "var(--border)" }}>
                      <div className="weight-bar-fill" style={{
                        width: `${c.weight}%`,
                        height: "100%",
                        borderRadius: 999,
                        background: "linear-gradient(90deg, var(--orchid-dark), var(--orchid-light))",
                      }} />
                    </div>
                  )}

                  <p className="mt-4 text-xs leading-6" style={{ color: "var(--ink-soft)" }}>{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ALUR SISTEM ──────────────────────────────────────────────── */}
        <section className="mx-auto max-w-5xl px-6 pb-20">
          <div className="rounded-4xl p-7" style={{ background: "var(--white)", border: "1px solid var(--border)" }}>
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--orchid)" }}>
              Alur Sistem
            </p>
            <h2 className="font-serif mt-2 text-2xl md:text-3xl" style={{ color: "var(--ink)" }}>
              Bagaimana sistem bekerja
            </h2>

            <div className="mt-8 grid gap-5 md:grid-cols-4">
              {steps.map((s, i) => (
                <div key={i} className="relative">
                  {/* Connector */}
                  {i < steps.length - 1 && (
                    <div className="absolute top-6 left-full hidden md:block z-10"
                      style={{ width: 20, borderTop: "1.5px dashed var(--orchid-light)" }} />
                  )}
                  <div className="card-lift rounded-2xl p-5 h-full"
                    style={{ background: "var(--orchid-bg)", border: "1px solid var(--border)" }}>
                    <p className="font-serif text-3xl" style={{ color: "var(--orchid-light)" }}>{s.num}</p>
                    <p className="mt-3 text-sm font-semibold" style={{ color: "var(--orchid-dark)" }}>{s.title}</p>
                    <p className="mt-2 text-xs leading-6" style={{ color: "var(--ink-soft)" }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-8 flex justify-center">
              <Link href="/recommend"
                className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold text-white transition-all hover:gap-3"
                style={{ background: "var(--orchid-dark)" }}>
                Coba Sekarang <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}