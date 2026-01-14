import Link from "next/link";
import {
  doiInfo,
  paymentInfo,
  submissionGuidelines,
} from "@/data/journal";

export default function GuidelinesPage() {
  return (
    <div className="space-y-10">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_25px_70px_-38px_rgba(15,23,42,0.35)] md:p-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700">
              Author guidelines
            </div>
            <h1 className="text-3xl font-semibold text-slate-900 md:text-5xl font-serif">
              Submission Standards
            </h1>
            <p className="max-w-2xl text-lg text-black leading-relaxed">
              Fast, fair, and transparent publication. We support authors at every stage, 
              from initial free-format submission to final DOI-ready publication.
            </p>
          </div>
          <Link
            href="/submit"
            className="rounded-full bg-emerald-600 px-8 py-4 text-base font-semibold !text-white shadow-[0_20px_45px_-28px_rgba(3,105,161,0.9)] transition hover:-translate-y-0.5 hover:bg-emerald-700"
          >
            Submit Paper
          </Link>
        </div>
      </section>

      {/* Launch Offer Banner */}
      <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="h-12 w-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white flex-shrink-0">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-emerald-900">Inaugural Issue Launch Offer!</h3>
            <p className="text-emerald-700">
              Waiver for all papers submitted before <strong>01.06.2026</strong>. 
              Accepted papers will be published completely <strong>FREE of cost</strong>.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <GuidelineCard title="1. Submission Format" icon="📄">
          <ul className="space-y-4 text-sm text-black">
            <li className="flex gap-3">
              <span className="font-bold text-emerald-600">FREE FORMAT:</span>
              Initial submission is accepted in any professional layout. No IEEE formatting required at the start.
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-emerald-600">Language:</span>
              Manuscripts must be in clear, academic English.
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-emerald-600">Length:</span>
              Maximum 12 pages including references.
            </li>
            <li className="bg-slate-50 p-3 rounded-xl border border-slate-100 italic">
              After acceptance, final submission must strictly follow IEEE double-column format.
            </li>
          </ul>
        </GuidelineCard>

        <GuidelineCard title="2. File Requirements" icon="📎">
          <ul className="space-y-4 text-sm text-black">
            <li className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              Only Microsoft Word (.DOC/.DOCX) accepted
            </li>
            <li className="flex items-center gap-2 text-rose-600">
              <div className="h-2 w-2 rounded-full bg-rose-500" />
              PDF/Latex NOT accepted at initial stage
            </li>
            <li className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-100 text-xs text-amber-800">
              <strong>Plagiarism Policy:</strong> Similarity index must be &lt; 15%. 
              Exceeding this limit leads to rejection without review.
            </li>
          </ul>
        </GuidelineCard>

        <GuidelineCard title="3. Peer Review Process" icon="⚖️">
          <ul className="space-y-4 text-sm text-black">
            <li className="flex gap-2 font-semibold text-slate-900">Double-blind Policy</li>
            <li className="flex gap-3">
              <div className="font-bold text-emerald-600">•</div>
              Reviewed by at least 2 independent experts.
            </li>
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex justify-between text-xs">
                <span>Editorial Decision:</span>
                <span className="font-bold text-emerald-600">Same Day</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Review Decision:</span>
                <span className="font-bold text-emerald-600">Within 15 Days</span>
              </div>
            </div>
          </ul>
        </GuidelineCard>
      </div>

      <section className="grid gap-6 md:grid-cols-2">
        <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-3">
            <span className="text-2xl">🤖</span> AI Usage & Disclosure
          </h3>
          <p className="text-sm text-black leading-relaxed">
            As an AI-focused journal, we require transparency:
          </p>
          <ul className="space-y-3">
            {[
              "Authors MUST disclose use of AI tools in research or preparation.",
              "AI-generated content must be critically reviewed and validated.",
              "Authors maintain full responsibility for accuracy and integrity."
            ].map((item, i) => (
              <li key={i} className="flex gap-3 text-sm text-black">
                <div className="mt-1 h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center text-[10px] text-emerald-600 font-bold flex-shrink-0">
                  {i+1}
                </div>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-3">
            <span className="text-2xl">💰</span> Publication Choices
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-sky-100">
              <div className="font-bold text-emerald-900 text-sm">Open Access</div>
              <div className="text-2xl font-bold text-emerald-600 mt-1">$100</div>
              <div className="text-[10px] text-emerald-700 mt-1">Free access worldwide</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-900 text-sm">Subscription</div>
              <div className="text-2xl font-bold text-black mt-1">$0</div>
              <div className="text-[10px] text-slate-700 mt-1">Limited accessibility</div>
            </div>
          </div>
          <div className="text-xs text-slate-700 italic">
            Waivers available for students and low-income backgrounds. No submission fees.
          </div>
        </section>
      </section>

      <section className="rounded-3xl border border-slate-900 bg-slate-900 p-8 md:p-12 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="relative z-10 grid gap-8 md:grid-cols-2 md:items-center">
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold font-serif">Ready to publish?</h3>
            <p className="text-slate-300">
              Join our inaugural issue: <strong>"AI-Driven Innovation across Science and Technology"</strong>. 
              Be part of the movement bridging the gap between theory and application.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/submit"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-emerald-50"
              >
                Submit Now
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                Inquire via WhatsApp
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-xs text-slate-400 uppercase tracking-wider">Frequency</div>
              <div className="text-lg font-semibold mt-1">12 Issues / Year</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-xs text-slate-400 uppercase tracking-wider">DOI</div>
              <div className="text-lg font-semibold mt-1">Per Published Paper</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-xs text-slate-400 uppercase tracking-wider">Archiving</div>
              <div className="text-lg font-semibold mt-1">Permanent</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-xs text-slate-400 uppercase tracking-wider">Copyright</div>
              <div className="text-lg font-semibold mt-1">Authors Retain</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function GuidelineCard({ title, icon, children }) {
  return (
    <div className="h-full rounded-3xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">{icon}</span>
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      </div>
      <div>{children}</div>
    </div>
  );
}
