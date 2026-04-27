"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Headphones, ArrowUpRight } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/recommend", label: "Rekomendasi" },
    { href: "/about", label: "Tentang" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100/80 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-md transition-all group-hover:bg-violet-700 group-hover:shadow-violet-200/60">
            <Headphones className="h-5 w-5" strokeWidth={1.5} />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-slate-900">TWS Recommender</p>
            <p className="text-[11px] text-slate-400">Smart Recommendation System</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-violet-50 text-violet-700"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          <Link
            href="/recommend"
            className="group ml-2 inline-flex items-center gap-1.5 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-violet-700 hover:gap-2.5"
          >
            Mulai
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </nav>

        {/* Mobile CTA */}
        <Link
          href="/recommend"
          className="inline-flex items-center gap-1.5 rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-700 md:hidden"
        >
          Mulai
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </header>
  );
}
