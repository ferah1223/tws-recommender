"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Headphones, ArrowUpRight, Menu, X, Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/recommend", label: "Rekomendasi" },
  { href: "/product", label: "Katalog" },
  { href: "/faq", label: "FAQ" },
];

function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    setDark(isDark);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
    localStorage.setItem("theme", next ? "dark" : "light");
    document.documentElement.classList.add("theme-transition");
    setTimeout(() => document.documentElement.classList.remove("theme-transition"), 400);
  };

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] transition-all hover:border-[var(--primary)] hover:text-[var(--primary)] hover:shadow-sm"
    >
      <Sun className={`h-4 w-4 transition-all duration-300 ${dark ? "rotate-90 scale-0" : "rotate-0 scale-100"}`} strokeWidth={1.75} />
      <Moon className={`absolute h-4 w-4 transition-all duration-300 ${dark ? "rotate-0 scale-100" : "-rotate-90 scale-0"}`} strokeWidth={1.75} />
    </button>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setOpen(false);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-[var(--border)] bg-[color-mix(in srgb, var(--background) 90%, transparent)] backdrop-blur-xl shadow-sm"
          : "border-b border-transparent bg-[color-mix(in srgb, var(--background) 80%, transparent)]"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--foreground)] text-[var(--background)] shadow-sm transition-all group-hover:bg-[var(--primary)] group-hover:shadow-md">
            <Headphones className="h-4 w-4" strokeWidth={1.75} />
          </div>
          <p className="text-[15px] font-semibold tracking-tight text-[var(--foreground)]">
            TWS Recommender
          </p>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative rounded-full px-4 py-2 text-sm transition-colors ${
                  isActive
                    ? "font-semibold text-[var(--primary)]"
                    : "font-medium text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                <span className="relative z-10">{item.label}</span>
                {isActive && (
                  <motion.span
                    layoutId="nav-active-pill"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="absolute inset-0 -z-0 rounded-full bg-[color-mix(in srgb, var(--primary) 10%, transparent)]"
                  />
                )}
                {isActive && (
                  <motion.span
                    layoutId="nav-active-underline"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="absolute inset-x-4 -bottom-1 h-0.5 rounded-full bg-[var(--primary)]"
                  />
                )}
              </Link>
            );
          })}

          <div className="ml-2 flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/recommend"
              className="group inline-flex items-center gap-1.5 rounded-full bg-[var(--foreground)] px-4 py-2 text-[13px] font-medium text-[var(--background)] shadow-sm transition-all hover:gap-2.5 hover:shadow-md"
            >
              Mulai
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </nav>

        {/* Mobile actions */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Link
            href="/recommend"
            className="inline-flex items-center gap-1.5 rounded-full bg-[var(--foreground)] px-4 py-2 text-sm font-medium text-[var(--background)] transition hover:opacity-90"
          >
            Mulai
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
          <button
            type="button"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      <div
        className={`md:hidden overflow-hidden border-t border-[var(--border)] bg-[color-mix(in srgb, var(--background) 95%, transparent)] backdrop-blur-xl transition-[max-height,opacity] duration-300 ease-out ${
          open ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm transition ${
                  isActive
                    ? "bg-[color-mix(in srgb, var(--primary) 10%, transparent)] font-semibold text-[var(--primary)]"
                    : "font-medium text-[var(--muted)] hover:bg-[var(--muted-bg)] hover:text-[var(--foreground)]"
                }`}
              >
                {item.label}
                {isActive && <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
