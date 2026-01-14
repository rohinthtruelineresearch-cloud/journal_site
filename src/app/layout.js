import { Manrope, Newsreader } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import DisableDevTools from "@/components/disable-devtools";
import { Toaster } from "react-hot-toast";
import { OrganizationSchema, WebsiteSchema, PeriodicalSchema } from "@/components/SchemaOrg";

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.jaeid.com'),
  title: {
    default: 'Journal of AI Enabled Innovation and Discovery | JAEID',
    template: '%s | JAEID'
  },
  description: 'Open access peer-reviewed journal publishing cutting-edge research in artificial intelligence, machine learning, deep learning, and AI-driven innovation. Fast peer review, DOI assignment, monthly publication.',
  keywords: [
    'AI journal',
    'artificial intelligence research',
    'machine learning journal',
    'deep learning research',
    'open access journal',
    'peer reviewed journal',
    'AI innovation',
    'research publication',
    'academic journal',
    'computer science journal',
    'submit AI research paper',
    'AI enabled discovery',
    'machine learning publication'
  ],
  authors: [{ name: 'JAEID Editorial Board' }],
  creator: 'Journal of AI Enabled Innovation and Discovery',
  publisher: 'JAEID Publishing',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  
  // Open Graph (Facebook, LinkedIn)
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.jaeid.com',
    title: 'Journal of AI Enabled Innovation and Discovery',
    description: 'Open access peer-reviewed journal in artificial intelligence, machine learning, and AI-driven innovation. Monthly publication with fast peer review.',
    siteName: 'JAEID',
    images: [{
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Journal of AI Enabled Innovation and Discovery'
    }]
  },
  
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Journal of AI Enabled Innovation and Discovery',
    description: 'Open access peer-reviewed AI & ML research journal. Submit your research today.',
    images: ['/twitter-image.jpg'],
    creator: '@JAEID_Journal'
  },
  
  // Additional metadata
  category: 'Academic Journal',
  classification: 'Research & Education',
  
  // Verification (add your verification codes when ready)
  verification: {
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
  
  // Robots
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${sans.variable} ${serif.variable} bg-slate-50 text-slate-900 antialiased`}
      >
        {/* Schema.org Structured Data */}
        <OrganizationSchema />
        <WebsiteSchema />
        <PeriodicalSchema />
        
        <DisableDevTools />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 text-slate-900">
          <div className="pointer-events-none fixed inset-x-10 top-24 z-0 h-72 rounded-full bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.16),_transparent_55%)] blur-3xl" />
          <SiteHeader />
          <main className="relative z-10 px-6 pb-20 pt-8 md:px-10 lg:px-16">
            {children}
          </main>
          <SiteFooter />
          <Toaster position="top-center" />
        </div>
      </body>
    </html>
  );
}
