"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  ArrowUpDown,
  Headphones,
  ShieldCheck,
  Gamepad2,
  Bluetooth,
  ArrowUpRight,
  Loader2,
  X,
} from "lucide-react";

import { API_BASE_URL } from "../../lib/api";
import type { Product } from "../../lib/types";

type SortKey = "price-asc" | "price-desc" | "name-asc";
type PriceTierKey = "all" | "budget" | "mid" | "premium" | "high" | "flagship";

const HIRES_REGEX = /(LDAC|LHDC|aptX|LC3|SSC|L2HC|Hi-?Res)/i;

const PRICE_TIERS: {
  key: PriceTierKey;
  label: string;
  min: number;
  max: number;
}[] = [
  { key: "all", label: "Semua", min: 0, max: Infinity },
  { key: "budget", label: "Budget", min: 0, max: 500_000 },
  { key: "mid", label: "Menengah", min: 500_000, max: 1_500_000 },
  { key: "premium", label: "Premium", min: 1_500_000, max: 3_000_000 },
  { key: "high", label: "High-end", min: 3_000_000, max: 5_000_000 },
  { key: "flagship", label: "Flagship", min: 5_000_000, max: Infinity },
];

function getProductImage(p: Product): string {
  if (!p.image_url) return "/images/no-image.svg";
  return /^(https?:\/\/|\/)/.test(p.image_url) ? p.image_url : `/${p.image_url}`;
}

function getProductId(p: Product): string {
  return p._id ?? p.id ?? "";
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function ProductCatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("price-asc");
  const [priceTier, setPriceTier] = useState<PriceTierKey>("all");
  const [brandFilter, setBrandFilter] = useState<Set<string>>(new Set());

  const toggleBrand = (brand: string) => {
    setBrandFilter((prev) => {
      const next = new Set(prev);
      if (next.has(brand)) next.delete(brand);
      else next.add(brand);
      return next;
    });
  };

  const clearAllFilters = () => {
    setQuery("");
    setPriceTier("all");
    setBrandFilter(new Set());
  };

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/tws`);
        if (!res.ok) throw new Error("Gagal memuat data produk");
        const json = await res.json();
        if (!cancelled) {
          setProducts(json.products ?? []);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const topBrands = useMemo(() => {
    const counts = new Map<string, number>();
    products.forEach((p) =>
      counts.set(p.brand, (counts.get(p.brand) ?? 0) + 1),
    );
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([name]) => name);
  }, [products]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products;
    if (q) {
      list = list.filter(
        (p) =>
          p.nama.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q),
      );
    }
    if (priceTier !== "all") {
      const tier = PRICE_TIERS.find((t) => t.key === priceTier)!;
      list = list.filter((p) => p.harga >= tier.min && p.harga < tier.max);
    }
    if (brandFilter.size > 0) {
      list = list.filter((p) => brandFilter.has(p.brand));
    }
    const sorted = [...list];
    switch (sortKey) {
      case "price-asc":
        sorted.sort((a, b) => a.harga - b.harga);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.harga - a.harga);
        break;
      case "name-asc":
        sorted.sort((a, b) => a.nama.localeCompare(b.nama));
        break;
    }
    return sorted;
  }, [products, query, sortKey, priceTier, brandFilter]);

  const hasActiveFilter =
    query.trim() !== "" || priceTier !== "all" || brandFilter.size > 0;

  return (
    <main className="font-body relative min-h-screen bg-white text-slate-900">
      {/* ── HEADER ── */}
      <section className="relative grid-pattern overflow-hidden border-b border-slate-100">
        <div className="absolute inset-0 bg-linear-to-br from-white via-white/95 to-violet-50/80 pointer-events-none" />
        <div className="absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-violet-200/30 blur-2xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-6 py-14 lg:px-10 lg:py-16">
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
              Katalog Produk
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="font-display mt-5 text-[2rem] leading-[1.1] text-slate-950 md:text-[2.5rem]"
            >
              Telusuri seluruh koleksi TWS dalam basis data.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-4 max-w-xl text-[15px] leading-7 text-slate-600"
            >
              Jelajahi katalog produk TWS yang tersedia, lengkap dengan ringkasan
              spesifikasi dan rentang harga.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-6 flex items-center gap-6 border-t border-slate-100 pt-5"
            >
              <div>
                <p className="font-display text-2xl text-slate-900">
                  {products.length}
                  <span className="text-violet-600">+</span>
                </p>
                <p className="mt-0.5 text-xs text-slate-500">Produk Tersedia</p>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <p className="font-display text-2xl text-slate-900">
                  {filtered.length}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">Hasil Tampil</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── FILTER BAR ── */}
      <section className="sticky top-0 z-20 border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          {/* Search */}
          <div className="relative flex-1 lg:max-w-md">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              strokeWidth={1.75}
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari berdasarkan nama atau brand…"
              className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-violet-300 focus:outline-none focus:ring-4 focus:ring-violet-100"
            />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <ArrowUpDown
              className="h-4 w-4 text-slate-400"
              strokeWidth={1.75}
            />
            <span className="text-xs font-medium text-slate-500">Urutkan:</span>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-violet-300 focus:border-violet-300 focus:outline-none focus:ring-4 focus:ring-violet-100"
            >
              <option value="price-asc">Harga termurah</option>
              <option value="price-desc">Harga termahal</option>
              <option value="name-asc">Nama (A–Z)</option>
            </select>
          </div>
        </div>
      </section>

      {/* ── FILTER CHIPS ── */}
      {!loading && !error && products.length > 0 && (
        <section className="border-b border-slate-100 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-5 lg:px-10">
            {/* Price tier chips */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Harga
              </span>
              {PRICE_TIERS.map((tier) => {
                const active = priceTier === tier.key;
                return (
                  <button
                    key={tier.key}
                    onClick={() => setPriceTier(tier.key)}
                    className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${
                      active
                        ? "border-violet-300 bg-violet-50 text-violet-700 shadow-[0_0_0_3px_rgba(139,92,246,0.08)]"
                        : "border-slate-200 bg-white text-slate-600 hover:border-violet-200 hover:text-violet-700"
                    }`}
                  >
                    {tier.label}
                  </button>
                );
              })}
            </div>

            {/* Brand chips */}
            {topBrands.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Brand
                </span>
                {topBrands.map((brand) => {
                  const active = brandFilter.has(brand);
                  return (
                    <button
                      key={brand}
                      onClick={() => toggleBrand(brand)}
                      className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${
                        active
                          ? "border-violet-300 bg-violet-50 text-violet-700 shadow-[0_0_0_3px_rgba(139,92,246,0.08)]"
                          : "border-slate-200 bg-white text-slate-600 hover:border-violet-200 hover:text-violet-700"
                      }`}
                    >
                      {brand}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Active filter indicator */}
            {hasActiveFilter && (
              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
                <span className="text-xs text-slate-500">
                  Filter aktif:
                </span>
                {query.trim() && (
                  <button
                    onClick={() => setQuery("")}
                    className="group inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-violet-700"
                  >
                    “{query.trim()}”
                    <X className="h-3 w-3" strokeWidth={2.5} />
                  </button>
                )}
                {priceTier !== "all" && (
                  <button
                    onClick={() => setPriceTier("all")}
                    className="group inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-violet-700"
                  >
                    {PRICE_TIERS.find((t) => t.key === priceTier)?.label}
                    <X className="h-3 w-3" strokeWidth={2.5} />
                  </button>
                )}
                {Array.from(brandFilter).map((brand) => (
                  <button
                    key={brand}
                    onClick={() => toggleBrand(brand)}
                    className="group inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-violet-700"
                  >
                    {brand}
                    <X className="h-3 w-3" strokeWidth={2.5} />
                  </button>
                ))}
                <button
                  onClick={clearAllFilters}
                  className="ml-1 text-xs font-medium text-violet-700 underline-offset-2 hover:underline"
                >
                  Hapus semua
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── GRID ── */}
      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-slate-400">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p className="text-sm">Memuat katalog produk…</p>
          </div>
        )}

        {error && !loading && (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
            <p className="text-sm font-medium text-red-700">{error}</p>
            <p className="mt-1 text-xs text-red-500">
              Pastikan server backend berjalan di {API_BASE_URL}.
            </p>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50">
              <Search className="h-5 w-5 text-slate-400" strokeWidth={1.5} />
            </div>
            <p className="text-sm font-medium text-slate-700">
              Tidak ada produk yang cocok
            </p>
            <p className="text-xs text-slate-500">
              Coba ubah kata kunci pencarian.
            </p>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p, idx) => {
              const id = getProductId(p);
              const isHires = p.codec ? HIRES_REGEX.test(p.codec) : false;
              return (
                <div key={id || p.nama}>
                  <Link
                    href={`/product/${id}`}
                    className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:-translate-y-1 hover:border-violet-300 hover:shadow-[0_12px_32px_-12px_rgba(124,58,237,0.3)]"
                  >
                    {/* Image */}
                    <div className="relative aspect-square w-full overflow-hidden bg-linear-to-br from-slate-50 to-violet-50/30">
                      <Image
                        src={getProductImage(p)}
                        alt={p.nama}
                        fill
                        loading={idx < 8 ? "eager" : "lazy"}
                        className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                      {/* Badge top-left: karakter suara */}
                      <span className="absolute left-3 top-3 rounded-full border border-violet-100 bg-white/90 px-2.5 py-1 text-[10px] font-semibold capitalize tracking-wide text-violet-700 backdrop-blur-sm">
                        {p.karakter_suara}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-violet-500">
                        {p.brand}
                      </p>
                      <h3 className="font-display mt-1.5 line-clamp-2 text-[15px] leading-snug text-slate-950">
                        {p.nama}
                      </h3>

                      {/* Feature icons */}
                      <div className="mt-3 flex items-center gap-1.5 text-slate-400">
                        {p.anc && (
                          <span
                            title="Active Noise Cancellation"
                            className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-500"
                          >
                            <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.75} />
                          </span>
                        )}
                        {p.gaming && (
                          <span
                            title="Mode Gaming"
                            className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600"
                          >
                            <Gamepad2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                          </span>
                        )}
                        {isHires && (
                          <span
                            title="Hi-Res Audio"
                            className="flex h-7 w-7 items-center justify-center rounded-lg bg-fuchsia-50 text-fuchsia-600"
                          >
                            <Bluetooth className="h-3.5 w-3.5" strokeWidth={1.75} />
                          </span>
                        )}
                        {!p.anc && !p.gaming && !isHires && (
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
                            <Headphones className="h-3.5 w-3.5" strokeWidth={1.75} />
                          </span>
                        )}
                      </div>

                      {/* Spacer */}
                      <div className="mt-4 flex-1" />

                      {/* Price + arrow */}
                      <div className="flex items-end justify-between border-t border-slate-100 pt-3">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                            Harga
                          </p>
                          <p className="font-display mt-0.5 text-base text-slate-950">
                            Rp {p.harga.toLocaleString("id-ID")}
                          </p>
                        </div>
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-all group-hover:bg-violet-600 group-hover:text-white">
                          <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── CTA ── */}
      {!loading && !error && (
        <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
            className="relative overflow-hidden rounded-2xl bg-slate-950 px-8 py-12 md:px-14 md:py-14"
          >
            <div className="absolute -top-32 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-violet-600/20 blur-2xl pointer-events-none" />
            <div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-xl">
                <h2 className="font-display text-[1.6rem] leading-tight text-white md:text-[2rem]">
                  Bingung memilih dari banyaknya pilihan?
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  Gunakan sistem rekomendasi untuk menemukan TWS yang paling
                  sesuai dengan preferensi Anda.
                </p>
              </div>
              <Link
                href="/recommend"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-slate-950 transition-all hover:gap-3"
              >
                Mulai Rekomendasi
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </motion.div>
        </section>
      )}
    </main>
  );
}
