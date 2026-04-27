import Link from "next/link";
import { Headphones, ArrowUpRight } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/recommend", label: "Rekomendasi" },
  { href: "/about", label: "Tentang Sistem" },
];

const techStack = ["Next.js", "FastAPI", "MongoDB", "Tailwind CSS"];

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-12 md:grid-cols-[1.4fr_0.8fr_1fr]">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white transition group-hover:bg-violet-700">
                <Headphones className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <span className="text-sm font-semibold text-slate-900">
                TWS Recommender
              </span>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-7 text-slate-400">
              Sistem rekomendasi berbasis preferensi pengguna untuk membantu
              memilih True Wireless Stereo sesuai kebutuhan.
            </p>

            {/* CTA mini */}
          </div>

          {/* Navigation */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Navigasi
            </p>
            <div className="mt-5 flex flex-col gap-3">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group inline-flex items-center gap-1 text-sm text-slate-500 transition hover:text-violet-700"
                >
                  <span className="inline-block transition-transform group-hover:translate-x-1">
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Teknologi
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
