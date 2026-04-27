import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Battery,
  Shield,
  Gamepad2,
  Bluetooth,
  Droplets,
  Mic,
  Plug,
  CircleDot,
  ArrowUpRight,
} from "lucide-react";

async function getProduct(id: string) {
  const res = await fetch(`http://localhost:8000/tws/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Gagal mengambil detail produk");
  return res.json();
}

function getBadges(product: any) {
  const badges: string[] = [];
  if (product.karakter_suara) badges.push(product.karakter_suara);
  if (product.anc) badges.push("ANC");
  if (product.gaming) badges.push("Gaming");
  if (product.battery_hours >= 8) badges.push("Baterai Awet");
  return badges;
}

function getTargetUsers(product: any) {
  const result: string[] = [];
  if (product.karakter_suara === "bass")
    result.push("Pengguna yang menyukai suara bass kuat dan dalam");
  if (product.karakter_suara === "treble")
    result.push("Pengguna yang menyukai suara lebih terang dan detail");
  if (product.karakter_suara === "balance")
    result.push("Pengguna yang menginginkan karakter suara seimbang");
  if (product.anc)
    result.push(
      "Pengguna yang membutuhkan peredam suara saat belajar, bekerja, atau bepergian",
    );
  if (product.gaming)
    result.push("Pengguna yang memakai TWS untuk gaming atau hiburan");
  if (product.battery_hours >= 8)
    result.push(
      "Pengguna yang membutuhkan daya tahan baterai untuk penggunaan lebih lama",
    );
  return result;
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);
  const badges = getBadges(product);
  const targetUsers = getTargetUsers(product);

  const specs = [
    {
      label: "Bluetooth",
      value: product.bluetooth_version || "–",
      icon: Bluetooth,
      iconColor: "text-violet-500",
    },
    {
      label: "Codec",
      value: product.codec || "–",
      icon: CircleDot,
      iconColor: "text-slate-400",
    },
    {
      label: "Water Resistance",
      value: product.water_resistance || "–",
      icon: Droplets,
      iconColor: "text-blue-400",
    },
    {
      label: "Driver Size",
      value: product.driver_size || "–",
      icon: CircleDot,
      iconColor: "text-slate-400",
    },
    {
      label: "Mic Count",
      value: product.mic_count ?? "–",
      icon: Mic,
      iconColor: "text-emerald-500",
    },
    {
      label: "Charging Port",
      value: product.charging_port || "–",
      icon: Plug,
      iconColor: "text-amber-500",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HERO SECTION */}
      <section className="border-b border-slate-100 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <Link
            href="/recommend"
            className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-violet-200 hover:text-violet-700"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            Kembali ke Rekomendasi
          </Link>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            {/* LEFT — Info */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-500">
                {product.brand}
              </p>

              <h1 className="font-display mt-2 text-3xl leading-tight text-slate-950 md:text-4xl">
                {product.nama}
              </h1>

              <div className="mt-4 flex flex-wrap gap-2">
                {badges.map((badge) => (
                  <span
                    key={badge}
                    className="rounded-full border border-violet-100 bg-violet-50 px-3 py-1 text-xs font-semibold capitalize text-violet-700"
                  >
                    {badge}
                  </span>
                ))}
              </div>

              {/* Mini spec grid */}
              <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
                {[
                  {
                    label: "Karakter Suara",
                    value: product.karakter_suara,
                    icon: null,
                    capitalize: true,
                  },
                  {
                    label: "Baterai",
                    value: `${product.battery_hours} jam`,
                    icon: (
                      <Battery
                        className="h-3.5 w-3.5 text-emerald-500"
                        strokeWidth={1.5}
                      />
                    ),
                  },
                  {
                    label: "ANC",
                    value: product.anc ? "Ya" : "Tidak",
                    icon: (
                      <Shield
                        className="h-3.5 w-3.5 text-blue-500"
                        strokeWidth={1.5}
                      />
                    ),
                  },
                  {
                    label: "Gaming",
                    value: product.gaming ? "Ya" : "Tidak",
                    icon: (
                      <Gamepad2
                        className="h-3.5 w-3.5 text-amber-500"
                        strokeWidth={1.5}
                      />
                    ),
                  },
                ].map((spec) => (
                  <div
                    key={spec.label}
                    className="rounded-2xl bg-slate-50 px-4 py-3"
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      {spec.icon}
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        {spec.label}
                      </p>
                    </div>
                    <p
                      className={`text-sm font-semibold text-slate-900 ${spec.capitalize ? "capitalize" : ""}`}
                    >
                      {spec.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div className="mt-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Deskripsi
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {product.deskripsi || "Belum ada deskripsi untuk produk ini."}
                </p>
              </div>
            </div>

            {/* RIGHT — Image & Price */}
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex w-full justify-center">
                <div className="flex relative aspect-square w-[65%]  overflow-hidden rounded-2xl bg-slate-50">
                  <Image
                    src={product.image_url || "/images/no-image.png"}
                    alt={product.nama}
                    fill
                    className="object-contain p-1"
                  />
                </div>
              </div>

              <div className="mt-5 border-t border-slate-100 pt-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Harga
                </p>
                <p className="font-display mt-1 text-2xl text-slate-950">
                  Rp {product.harga.toLocaleString("id-ID")}
                </p>
              </div>

              <Link
                href="/recommend"
                className="group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 hover:gap-3"
              >
                Cari TWS Lainnya
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* DETAIL SECTION */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Cocok untuk */}
          <div className="card-hover rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Cocok Untuk
            </p>
            <h2 className="font-display mt-2 text-xl text-slate-950">
              Siapa yang cocok pakai ini?
            </h2>

            {targetUsers.length > 0 ? (
              <ul className="mt-5 space-y-3">
                {targetUsers.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                    <span className="text-sm leading-6 text-slate-600">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-slate-400">
                Belum ada informasi tambahan mengenai target pengguna.
              </p>
            )}
          </div>

          {/* Detail Spesifikasi */}
          <div className="card-hover rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Spesifikasi
            </p>
            <h2 className="font-display mt-2 text-xl text-slate-950">
              Detail teknis
            </h2>

            <div className="mt-5 divide-y divide-slate-50">
              {specs.map((spec) => (
                <div
                  key={spec.label}
                  className="flex items-center justify-between gap-4 py-3"
                >
                  <div className="flex items-center gap-2">
                    <spec.icon
                      className={`h-3.5 w-3.5 ${spec.iconColor}`}
                      strokeWidth={1.5}
                    />
                    <span className="text-sm text-slate-500">{spec.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
