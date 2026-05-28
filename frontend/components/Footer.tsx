import Link from "next/link";
import { Github, Mail, Heart } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/recommend", label: "Rekomendasi" },
  { href: "/product", label: "Katalog" },
  { href: "/faq", label: "FAQ" },
];

const socials = [
  { href: "https://github.com", label: "GitHub", icon: Github },
  { href: "mailto:hello@tws-recommender.app", label: "Email", icon: Mail },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-slate-950 text-slate-300">
      {/* Decorative violet glow */}
      <div className="pointer-events-none absolute -top-24 left-1/3 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-violet-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 right-0 h-72 w-72 rounded-full bg-violet-700/10 blur-3xl" />
      {/* Subtle grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* ── Main row: brand · nav · socials ───────────────────────── */}
      <div className="relative mx-auto max-w-6xl px-6 pt-7 pb-5">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          {/* Tagline block */}
          <div>
            <p className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-400">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
              Audio Match Engine
            </p>
            <p className="mt-1.5 max-w-sm text-xs leading-5 text-slate-400">
              Membantu Anda memilih TWS yang paling sesuai dengan preferensi audio.
            </p>
          </div>

          {/* Nav inline */}
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs font-medium text-slate-400 transition-colors duration-300 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Socials */}
          <div className="flex items-center gap-2">
            {socials.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noreferrer" : undefined}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-400/40 hover:bg-violet-500/10 hover:text-white"
              >
                <Icon className="h-[14px] w-[14px]" strokeWidth={1.75} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Divider ─────────────────────────────────────────────── */}
      <div className="relative mx-auto max-w-6xl px-6">
        <span className="block h-px w-full bg-linear-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* ── Bottom bar ─────────────────────────────────────────── */}
      <div className="relative mx-auto max-w-6xl px-6 py-3.5">
        <div className="flex flex-col items-center justify-between gap-2 md:flex-row">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
            © {year} TWS Recommender
            <span className="mx-2 text-slate-700">·</span>
            <span className="text-slate-400">All rights reserved</span>
          </p>

          <p className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
            Built with
            <Heart className="h-2.5 w-2.5 fill-violet-400 text-violet-400" />
            in Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
