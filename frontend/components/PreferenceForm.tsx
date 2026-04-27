"use client";

import { useState } from "react";
import {
  Music,
  Battery,
  Shield,
  Gamepad2,
  Wallet,
  ArrowUpRight,
  Loader2,
} from "lucide-react";

type PreferenceFormProps = {
  onSubmit: (data: {
    karakter_suara: "bass" | "treble" | "balance";
    min_battery_hours: number;
    anc: boolean;
    gaming: boolean;
    budget: number;
  }) => void;
  loading?: boolean;
};

export default function PreferenceForm({ onSubmit, loading = false }: PreferenceFormProps) {
  const [karakterSuara, setKarakterSuara] = useState<"bass" | "treble" | "balance">("balance");
  const [minBatteryHours, setMinBatteryHours] = useState(8);
  const [anc, setAnc] = useState(false);
  const [gaming, setGaming] = useState(false);
  const [budget, setBudget] = useState(1000000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      karakter_suara: karakterSuara,
      min_battery_hours: Number(minBatteryHours),
      anc,
      gaming,
      budget: Number(budget),
    });
  };

  const sectionClass = "rounded-2xl border border-slate-100 bg-white p-4 shadow-sm";

  const SectionHeader = ({
    icon: Icon,
    iconBg,
    iconColor,
    title,
    subtitle,
  }: {
    icon: React.ElementType;
    iconBg: string;
    iconColor: string;
    title: string;
    subtitle: string;
  }) => (
    <div className="mb-3.5 flex items-center gap-3">
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
        <Icon className={`h-4 w-4 ${iconColor}`} strokeWidth={1.5} />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        <p className="text-[11px] text-slate-400">{subtitle}</p>
      </div>
    </div>
  );

  const OptionButton = ({
    isActive,
    activeClass,
    onClick,
    label,
    desc,
  }: {
    isActive: boolean;
    activeClass: string;
    onClick: () => void;
    label: string;
    desc?: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-3 py-2.5 text-left text-sm transition-all ${
        isActive
          ? activeClass
          : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      <div className="text-center font-medium">{label}</div>
      {desc && <div className="mt-0.5 text-center text-[11px] opacity-70">{desc}</div>}
    </button>
  );

  const budgetPercent = ((budget - 100000) / (4000000 - 100000)) * 100;

  return (
    <form onSubmit={handleSubmit} className="space-y-3">

      {/* Karakter Suara */}
      <div className={sectionClass}>
        <SectionHeader
          icon={Music}
          iconBg="bg-violet-100"
          iconColor="text-violet-600"
          title="Karakter Suara"
          subtitle="Pilih karakter suara favoritmu"
        />
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: "bass", label: "Bass", desc: "Kuat & dalam" },
            { value: "balance", label: "Balance", desc: "Seimbang" },
            { value: "treble", label: "Treble", desc: "Jernih & detail" },
          ].map((item) => (
            <OptionButton
              key={item.value}
              isActive={karakterSuara === item.value}
              activeClass="border-violet-400 bg-violet-50 text-violet-700"
              onClick={() => setKarakterSuara(item.value as "bass" | "treble" | "balance")}
              label={item.label}
              desc={item.desc}
            />
          ))}
        </div>
      </div>

      {/* Baterai */}
      <div className={sectionClass}>
        <SectionHeader
          icon={Battery}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
          title="Daya Tahan Baterai"
          subtitle="Minimal durasi yang dibutuhkan"
        />
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: 6, label: "4–6 Jam", desc: "Singkat" },
            { value: 8, label: "7–8 Jam", desc: "Sedang" },
            { value: 9, label: "> 9 Jam", desc: "Lama" },
          ].map((item) => (
            <OptionButton
              key={item.label}
              isActive={minBatteryHours === item.value}
              activeClass="border-emerald-400 bg-emerald-50 text-emerald-700"
              onClick={() => setMinBatteryHours(item.value)}
              label={item.label}
              desc={item.desc}
            />
          ))}
        </div>
      </div>

      {/* ANC & Gaming */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className={sectionClass}>
          <SectionHeader
            icon={Shield}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
            title="Fitur ANC"
            subtitle="Peredam kebisingan aktif"
          />
          <div className="grid grid-cols-2 gap-2">
            {[{ value: true, label: "Ya" }, { value: false, label: "Tidak" }].map((item) => (
              <OptionButton
                key={String(item.value)}
                isActive={anc === item.value}
                activeClass="border-blue-400 bg-blue-50 text-blue-700"
                onClick={() => setAnc(item.value)}
                label={item.label}
              />
            ))}
          </div>
        </div>

        <div className={sectionClass}>
          <SectionHeader
            icon={Gamepad2}
            iconBg="bg-amber-100"
            iconColor="text-amber-600"
            title="Gaming"
            subtitle="Mode latensi rendah"
          />
          <div className="grid grid-cols-2 gap-2">
            {[{ value: true, label: "Ya" }, { value: false, label: "Tidak" }].map((item) => (
              <OptionButton
                key={String(item.value)}
                isActive={gaming === item.value}
                activeClass="border-amber-400 bg-amber-50 text-amber-700"
                onClick={() => setGaming(item.value)}
                label={item.label}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Budget */}
      <div className={sectionClass}>
        <SectionHeader
          icon={Wallet}
          iconBg="bg-slate-100"
          iconColor="text-slate-600"
          title="Budget"
          subtitle="Geser untuk atur maksimal harga"
        />

        {/* Budget display */}
        <div className="mb-3 flex items-baseline justify-between">
          <span className="text-xs text-slate-400">Maks.</span>
          <span className="font-display text-lg font-normal text-slate-900">
            Rp {budget.toLocaleString("id-ID")}
          </span>
        </div>

        {/* Custom slider track */}
        <div className="relative h-1.5 w-full rounded-full bg-slate-100">
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-slate-950 transition-all"
            style={{ width: `${budgetPercent}%` }}
          />
          <input
            type="range"
            min={100000}
            max={4000000}
            step={50000}
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </div>

        <div className="mt-2 flex justify-between text-[11px] text-slate-400">
          <span>Rp 100rb</span>
          <span>Rp 4jt</span>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3.5 text-sm font-semibold text-white transition-all hover:bg-violet-700 hover:gap-3 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Memproses...
          </>
        ) : (
          <>
            Cari Rekomendasi
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </>
        )}
      </button>
    </form>
  );
}
