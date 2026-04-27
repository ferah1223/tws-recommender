import Image from "next/image";
import Link from "next/link";
import {
  Star,
  Battery,
  Shield,
  Gamepad2,
  Bluetooth,
  ArrowUpRight,
  Headphones,
} from "lucide-react";

type Recommendation = {
  id: string;
  nama: string;
  brand: string;
  harga: number;
  image_url?: string;
  skor: number;
  alasan: string[];
  spesifikasi: {
    karakter_suara: string;
    battery_hours: number;
    anc: boolean;
    gaming: boolean;
    bluetooth_version?: string;
    codec?: string;
  };
};

type RecommendationListProps = {
  recommendations: Recommendation[];
};

export default function RecommendationList({ recommendations }: RecommendationListProps) {
  if (recommendations.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
          <Headphones className="h-6 w-6 text-slate-400" strokeWidth={1.5} />
        </div>
        <h3 className="font-display text-xl text-slate-900">Belum Ada Rekomendasi</h3>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Isi preferensi terlebih dahulu untuk melihat hasil rekomendasi TWS terbaik untukmu.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {recommendations.map((item, index) => {
        const isTop = index === 0;
        const scorePercent = Math.min(Math.round(item.skor), 100);

        return (
          <div
            key={item.id}
            className={`card-hover rounded-3xl border bg-white p-5 transition-all ${
              isTop
                ? "border-violet-200 shadow-[0_8px_32px_-8px_rgba(124,58,237,0.15)]"
                : "border-slate-100 shadow-sm"
            }`}
          >
            {/* Top badge */}
            {isTop && (
              <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-violet-600 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-white">
                <Star className="h-3 w-3 fill-current" />
                Best Match
              </div>
            )}

            {/* Header row */}
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="flex gap-4">
                {/* Image */}
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
                  <Image
                    src={item.image_url || "/images/no-image.png"}
                    alt={item.nama}
                    fill
                    sizes="80px"
                    className="object-contain p-2"
                  />
                </div>

                {/* Info */}
                <div className="min-w-0">
                  <div className="mb-1.5 flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      isTop
                        ? "bg-violet-100 text-violet-700"
                        : "bg-slate-100 text-slate-600"
                    }`}>
                      #{index + 1} Rekomendasi
                    </span>
                  </div>

                  <h3 className="font-display text-xl leading-tight text-slate-950">
                    {item.nama}
                  </h3>
                  <p className="mt-0.5 text-sm text-slate-400">{item.brand}</p>
                  <p className="mt-2 text-base font-semibold text-slate-900">
                    Rp {item.harga.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>

              {/* Score */}
              <div className="shrink-0 rounded-2xl bg-slate-950 px-5 py-4 text-center text-white md:min-w-[110px]">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-white/50">
                  Skor
                </p>
                <p className="font-display mt-1 text-3xl">{item.skor}</p>
                {/* Mini bar */}
                <div className="mt-2 h-1 w-full rounded-full bg-white/20">
                  <div
                    className="h-full rounded-full bg-violet-400 transition-all"
                    style={{ width: `${scorePercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Alasan */}
            <div className="mt-5">
              <p className="mb-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                Alasan Cocok
              </p>
              <div className="flex flex-wrap gap-2">
                {item.alasan.map((alasan, idx) => (
                  <span
                    key={idx}
                    className="rounded-full border border-violet-100 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700"
                  >
                    {alasan}
                  </span>
                ))}
              </div>
            </div>

            {/* Specs */}
            <div className="mt-5 grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
              {[
                {
                  label: "Suara",
                  value: item.spesifikasi.karakter_suara,
                  icon: null,
                  capitalize: true,
                },
                {
                  label: "Baterai",
                  value: `${item.spesifikasi.battery_hours} Jam`,
                  icon: <Battery className="h-3.5 w-3.5 text-emerald-500" strokeWidth={1.5} />,
                },
                {
                  label: "ANC",
                  value: item.spesifikasi.anc ? "Ya" : "Tidak",
                  icon: <Shield className="h-3.5 w-3.5 text-blue-500" strokeWidth={1.5} />,
                },
                {
                  label: "Gaming",
                  value: item.spesifikasi.gaming ? "Ya" : "Tidak",
                  icon: <Gamepad2 className="h-3.5 w-3.5 text-amber-500" strokeWidth={1.5} />,
                },
                {
                  label: "Bluetooth",
                  value: item.spesifikasi.bluetooth_version || "–",
                  icon: <Bluetooth className="h-3.5 w-3.5 text-violet-500" strokeWidth={1.5} />,
                },
                {
                  label: "Codec",
                  value: item.spesifikasi.codec || "–",
                  icon: null,
                },
              ].map((spec) => (
                <div key={spec.label} className="rounded-xl bg-slate-50 px-3 py-2.5">
                  <div className="flex items-center gap-1 mb-1">
                    {spec.icon}
                    <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                      {spec.label}
                    </p>
                  </div>
                  <p className={`text-sm font-semibold text-slate-900 ${spec.capitalize ? "capitalize" : ""}`}>
                    {spec.value}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
              <p className="text-xs text-slate-400">
                Cocok berdasarkan {item.alasan.length} kriteria
              </p>
              <Link
                href={`/product/${item.id}`}
                className="group inline-flex items-center gap-1.5 rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-violet-700 hover:gap-2.5"
              >
                Lihat Detail
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
