import { Manrope, Newsreader } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Toaster } from "react-hot-toast";

const sans = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

const serif = Newsreader({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-serif",
});

export const metadata = {
  title: "Aurora Journal of Systems Engineering",
  description:
    "Professional, fast, and transparent journal site for submissions, issues, and editorial workflows.",
  openGraph: {
    title: "Aurora Journal of Systems Engineering",
    description:
      "Peer-reviewed, IEEE/Elsevier-style journal with fast review cycles and DOI-ready publishing.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${sans.variable} ${serif.variable} bg-slate-50 text-slate-900 antialiased`}
      >
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50 text-slate-900">
          <div className="pointer-events-none fixed inset-x-10 top-24 z-0 h-72 rounded-full bg-[radial-gradient(circle_at_center,_rgba(14,165,233,0.16),_transparent_55%)] blur-3xl" />
          <SiteHeader />
          <main className="relative z-10 mx-auto max-w-6xl px-6 pb-20 pt-8 md:px-10">
            {children}
          </main>
          <SiteFooter />
          <Toaster position="top-center" />
        </div>
      </body>
    </html>
  );
}
