import Link from "next/link";
import { contactInfo, journalInfo } from "@/data/journal";

const quickLinks = [
  { label: "Author guidelines", href: "/guidelines" },
  { label: "Submit paper", href: "/submit" },
  { label: "Current issue", href: "/current-issue" },
  { label: "Archive", href: "/archive" },
  { label: "Publication ethics", href: "/about#policies" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white/90">
      <div className="px-6 py-12 md:px-10 lg:px-16">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
          <div className="space-y-3">
            <div className="text-lg font-semibold text-slate-900">
              {journalInfo.title}
            </div>
            <p className="text-sm text-slate-600">{journalInfo.tagline}</p>
            <div className="flex flex-wrap gap-2 text-xs text-slate-500">
              <span className="rounded-full bg-slate-100 px-3 py-1">
                ISSN {journalInfo.issn}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1">
                DOI {journalInfo.doiPrefix}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1">
                {journalInfo.frequency}
              </span>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-slate-900">Navigate</div>
            <div className="mt-3 flex flex-col gap-2 text-sm text-slate-600">
              {quickLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="transition hover:text-slate-900"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-2 text-sm text-slate-600">
            <div className="text-sm font-semibold text-slate-900">Contact</div>
            <div>Email: {contactInfo.email}</div>
            <div>WhatsApp: {contactInfo.whatsapp}</div>
            <div>Phone: {contactInfo.support}</div>
            <div>Office: {contactInfo.address}</div>
            <div className="text-xs text-slate-500">
              Office hours: {contactInfo.officeHours}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-slate-100 pt-6 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} {journalInfo.shortTitle}. All rights reserved.</span>
          <span>Designed for IEEE/Elsevier-grade clarity, speed, and compliance.</span>
        </div>
      </div>
    </footer>
  );
}

