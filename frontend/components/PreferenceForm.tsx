"use client";

import { useState } from "react";
import {
  Music,
  Battery,
  Shield,
  Gamepad2,
  Wallet,
  Droplets,
  Bluetooth,
  ArrowUpRight,
  Loader2,
  Minus,
  Plus,
} from "lucide-react";

type PreferenceFormProps = {
  onSubmit: (data: {
    karakter_suara: "bass" | "treble" | "balance";
    min_battery_hours: number;
    anc: boolean;
    gaming: boolean;
    hires: boolean;
    budget: number;
    water_resistance: "none" | "basic" | "sport";
  }) => void;
  loading?: boolean;
};

const sectionClass = "rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm";

const SectionHeader = ({
  icon: Icon,
  iconBg,
  title,
  subtitle,
}: {
  icon: React.ElementType;
  iconBg: string;
  title: string;
  subtitle: string;
}) => (
  <div className="mb-3.5 flex items-center gap-3">
    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
      <Icon className="h-4 w-4 text-[var(--primary)]" strokeWidth={1.5} />
    </div>
    <div>
      <h3 className="text-sm font-semibold text-[var(--foreground)]">{title}</h3>
      <p className="text-[11px] text-[var(--muted)]">{subtitle}</p>
    </div>
  </div>
);

const OptionButton = ({
  isActive,
  onClick,
  label,
  desc,
}: {
  isActive: boolean;
  onClick: () => void;
  label: string;
  desc?: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-xl border px-3 py-2.5 text-left text-sm transition-all active:scale-[0.97] ${
      isActive
        ? "border-[var(--primary)] bg-[color-mix(in srgb, var(--primary) 10%, transparent)] text-[var(--primary)] font-medium shadow-sm"
        : "border-[var(--border)] text-[var(--muted)] hover:border-[color-mix(in srgb, var(--primary) 30%, transparent)] hover:bg-[var(--muted-bg)]"
    }`}
  >
    <div className="text-center font-medium">{label}</div>
    {desc && <div className="mt-0.5 text-center text-[11px] opacity-70">{desc}</div>}
  </button>
);

export default function PreferenceForm({ onSubmit, loading = false }: PreferenceFormProps) {
  const [karakterSuara, setKarakterSuara] = useState<"bass" | "treble" | "balance">("balance");
  const [minBatteryHours, setMinBatteryHours] = useState(20);
  const [anc, setAnc] = useState(false);
  const [gaming, setGaming] = useState(false);
  const [hires, setHires] = useState(false);
  const [budget, setBudget] = useState(1000000);
  const [waterResistance, setWaterResistance] = useState<"none" | "basic" | "sport">("none");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      karakter_suara: karakterSuara,
      min_battery_hours: Number(minBatteryHours),
      anc,
      gaming,
      hires,
      budget: Number(budget),
      water_resistance: waterResistance,
    });
  };

  const BUDGET_MIN = 100000;
  const BUDGET_MAX = 7000000;
  const BUDGET_STEP = 100000;
  const budgetPercent = ((budget - BUDGET_MIN) / (BUDGET_MAX - BUDGET_MIN)) * 100;

  const getBudgetCategory = (value: number) => {
    if (value <= 500000) return { label: "Budget", color: "text-emerald-600 dark:text-emerald-400" };
    if (value <= 1500000) return { label: "Menengah", color: "text-blue-600 dark:text-blue-400" };
    if (value <= 3000000) return { label: "Premium", color: "text-violet-600 dark:text-violet-400" };
    if (value <= 5000000) return { label: "High-end", color: "text-fuchsia-600 dark:text-fuchsia-400" };
    return { label: "Flagship", color: "text-amber-600 dark:text-amber-400" };
  };
  const budgetCategory = getBudgetCategory(budget);

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Karakter Suara */}
      <div className={sectionClass}>
        <SectionHeader
          icon={Music}
          iconBg="bg-[color-mix(in srgb, var(--primary) 10%, transparent)]"
          title="Karakter Suara"
          subtitle="Pilih preferensi suara Anda"
        />
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: "bass", label: "Bass", desc: "Nada rendah dominan" },
            { value: "balance", label: "Balance", desc: "Seimbang" },
            { value: "treble", label: "Treble", desc: "Detail nada tinggi" },
          ].map((item) => (
            <OptionButton
              key={item.value}
              isActive={karakterSuara === item.value}
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
          iconBg="bg-[color-mix(in srgb, #10b981 10%, transparent)]"
          title="Daya Tahan Baterai"
          subtitle="Minimal durasi pemakaian"
        />
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: 20, label: "20+ Jam", desc: "Harian" },
            { value: 30, label: "30+ Jam", desc: "Intensif" },
            { value: 40, label: "40+ Jam", desc: "Perjalanan jauh" },
          ].map((item) => (
            <OptionButton
              key={item.label}
              isActive={minBatteryHours === item.value}
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
            iconBg="bg-[color-mix(in srgb, #3b82f6 10%, transparent)]"
            title="Active Noise Cancellation"
            subtitle="Peredam suara bising sekitar"
          />
          <div className="grid grid-cols-2 gap-2">
            {[{ value: true, label: "Ya" }, { value: false, label: "Tidak" }].map((item) => (
              <OptionButton
                key={String(item.value)}
                isActive={anc === item.value}
                onClick={() => setAnc(item.value)}
                label={item.label}
              />
            ))}
          </div>
        </div>

        <div className={sectionClass}>
          <SectionHeader
            icon={Gamepad2}
            iconBg="bg-[color-mix(in srgb, #f59e0b 10%, transparent)]"
            title="Mode Gaming"
            subtitle="Latensi rendah untuk game & video"
          />
          <div className="grid grid-cols-2 gap-2">
            {[{ value: true, label: "Ya" }, { value: false, label: "Tidak" }].map((item) => (
              <OptionButton
                key={String(item.value)}
                isActive={gaming === item.value}
                onClick={() => setGaming(item.value)}
                label={item.label}
              />
            ))}
          </div>
        </div>
      </div>

      <div className={sectionClass}>
        <SectionHeader
          icon={Bluetooth}
          iconBg="bg-[color-mix(in srgb, #d946ef 10%, transparent)]"
          title="Hi-Res Audio"
          subtitle="Codec berkualitas tinggi (LDAC, aptX, dll.)"
        />
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: true, label: "Ya", desc: "Codec premium" },
            { value: false, label: "Tidak", desc: "Codec standar" },
          ].map((item) => (
            <OptionButton
              key={String(item.value)}
              isActive={hires === item.value}
              onClick={() => setHires(item.value)}
              label={item.label}
              desc={item.desc}
            />
          ))}
        </div>
      </div>

      {/* Water Resistance */}
      <div className={sectionClass}>
        <SectionHeader
          icon={Droplets}
          iconBg="bg-[color-mix(in srgb, #06b6d4 10%, transparent)]"
          title="Ketahanan Air"
          subtitle="Tingkat proteksi air & debu"
        />
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: "none", label: "Tidak Perlu", desc: "Pemakaian indoor" },
            { value: "basic", label: "Basic", desc: "Tahan keringat" },
            { value: "sport", label: "Sport", desc: "Olahraga & outdoor" },
          ].map((item) => (
            <OptionButton
              key={item.value}
              isActive={waterResistance === item.value}
              onClick={() => setWaterResistance(item.value as "none" | "basic" | "sport")}
              label={item.label}
              desc={item.desc}
            />
          ))}
        </div>
      </div>

      {/* Budget — improved slider with +/- buttons */}
      <div className={sectionClass}>
        <SectionHeader
          icon={Wallet}
          iconBg="bg-[var(--muted-bg)]"
          title="Anggaran"
          subtitle="Batas harga maksimal"
        />

        <div className="mb-3 flex items-baseline justify-between">
          <span className={`text-xs font-medium ${budgetCategory.color}`}>
            {budgetCategory.label}
          </span>
          <span className="font-display text-lg font-normal text-[var(--foreground)]">
            Rp {budget.toLocaleString("id-ID")}
          </span>
        </div>

        {/* Slider + buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setBudget(Math.max(BUDGET_MIN, budget - BUDGET_STEP))}
            disabled={budget <= BUDGET_MIN}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] transition hover:border-[var(--primary)] hover:text-[var(--primary)] disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
          >
            <Minus className="h-3.5 w-3.5" strokeWidth={2} />
          </button>

          <div className="relative flex-1 h-6 flex items-center">
            <div className="absolute inset-x-0 h-1.5 rounded-full bg-[var(--muted-bg)]">
              <div
                className="absolute left-0 top-0 h-full rounded-full bg-[var(--primary)] transition-all"
                style={{ width: `${budgetPercent}%` }}
              />
            </div>
            <input
              type="range"
              min={BUDGET_MIN}
              max={BUDGET_MAX}
              step={BUDGET_STEP}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
          </div>

          <button
            type="button"
            onClick={() => setBudget(Math.min(BUDGET_MAX, budget + BUDGET_STEP))}
            disabled={budget >= BUDGET_MAX}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] transition hover:border-[var(--primary)] hover:text-[var(--primary)] disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
        </div>

        <div className="mt-2 flex justify-between text-[11px] text-[var(--muted)]">
          <span>Rp 100.000</span>
          <span>Rp 7.000.000</span>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--primary)] px-4 py-3.5 text-sm font-semibold text-white transition-all hover:opacity-90 hover:gap-3 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Memproses...
          </>
        ) : (
          <>
            Dapatkan Rekomendasi
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </>
        )}
      </button>
    </form>
  );
}
