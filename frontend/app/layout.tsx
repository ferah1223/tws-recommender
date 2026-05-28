import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter-tight",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TWS Recommender — Temukan TWS Sesuai Preferensi Anda",
  description:
    "Sistem rekomendasi TWS berbasis Content-Based Filtering. Dapatkan rekomendasi produk True Wireless Stereo yang paling cocok dengan preferensi audio Anda.",
  keywords: ["TWS", "rekomendasi", "earphone", "Content-Based Filtering", "audio"],
  openGraph: {
    title: "TWS Recommender",
    description:
      "Sistem rekomendasi TWS berbasis preferensi audio pengguna menggunakan Content-Based Filtering.",
    url: "https://frontend-sigma-weld-19.vercel.app",
    siteName: "TWS Recommender",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TWS Recommender",
    description:
      "Temukan TWS yang sesuai dengan preferensi audio Anda.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${interTight.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var t = localStorage.getItem('theme');
                  if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.setAttribute('data-theme', 'dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased">
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
