import Link from "next/link";
import { journalInfo, editorialBoard, reviewerPool, contactInfo } from "@/data/journal";

export default function AboutPage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 md:p-8 lg:p-12 shadow-[0_25px_70px_-38px_rgba(15,23,42,0.35)]">
        <div className="space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.12em] text-sky-700">
            About the Journal
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-slate-900 leading-tight">
            {journalInfo.title}
          </h1>
          <p className="max-w-3xl text-base sm:text-lg text-slate-600">
            {journalInfo.description}
          </p>
          <p className="max-w-3xl text-sm sm:text-base text-slate-600">
            {journalInfo.tagline}
          </p>
        </div>

        <div className="mt-6 sm:mt-8 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          <div className="rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50/80 p-4 sm:p-5">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
              ISSN
            </div>
            <div className="mt-2 text-sm font-semibold text-slate-900">
              {journalInfo.issn}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
              DOI Prefix
            </div>
            <div className="mt-2 text-sm font-semibold text-slate-900">
              {journalInfo.doiPrefix}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Frequency
            </div>
            <div className="mt-2 text-sm font-semibold text-slate-900">
              {journalInfo.frequency}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Scope */}
      <section className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 md:p-8 lg:p-10 shadow-[0_18px_60px_-50px_rgba(15,23,42,0.5)]">
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
          Mission & Scope
        </h2>
        <p className="mt-2 sm:mt-3 text-sm sm:text-base text-slate-600">
          The Aurora Journal of Systems Engineering publishes high-quality, peer-reviewed research 
          in intelligent systems, resilient infrastructure, and trustworthy AI. We focus on applied 
          research that bridges theory and practice, with an emphasis on reproducibility and real-world impact.
        </p>

        <div className="mt-5 sm:mt-6">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900">Focus Areas</h3>
          <div className="mt-3 sm:mt-4 grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
            {journalInfo.focusAreas.map((area) => (
              <div
                key={area}
                className="rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50/80 p-3 sm:p-4"
              >
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="mt-1 h-2 w-2 sm:h-2.5 sm:w-2.5 flex-shrink-0 rounded-full bg-sky-600" />
                  <div className="text-xs sm:text-sm font-semibold text-slate-900">{area}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial Board */}
      <section id="board" className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 md:p-8 lg:p-10 shadow-[0_18px_60px_-50px_rgba(15,23,42,0.5)]">
        <div className="space-y-1.5 sm:space-y-2">
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
            Editorial Board
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Our editorial board brings together diverse expertise across autonomy, infrastructure, 
            and responsible AI from leading institutions worldwide.
          </p>
        </div>

        <div className="mt-5 sm:mt-6 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {editorialBoard.map((member) => (
            <div
              key={member.name}
              className="rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50/80 p-4 sm:p-5"
            >
              <div className="text-sm sm:text-base font-semibold text-slate-900">
                {member.name}
              </div>
              <div className="mt-1 text-[10px] sm:text-xs uppercase tracking-[0.16em] text-sky-600">
                {member.role}
              </div>
              <div className="mt-2 sm:mt-3 text-xs sm:text-sm text-slate-600">
                {member.affiliation}
              </div>
              <div className="mt-1.5 sm:mt-2 text-[10px] sm:text-xs text-slate-500">
                Focus: {member.focus}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 sm:mt-8 rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50/60 p-4 sm:p-5">
          <h3 className="text-xs sm:text-sm font-semibold text-slate-900">Reviewer Pool</h3>
          <div className="mt-2 sm:mt-3 grid gap-1.5 sm:gap-2 grid-cols-1 md:grid-cols-2">
            {reviewerPool.map((reviewer) => (
              <div key={reviewer} className="text-xs sm:text-sm text-slate-600">
                • {reviewer}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Policies & Ethics */}
      <section id="policies" className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 md:p-8 lg:p-10 shadow-[0_18px_60px_-50px_rgba(15,23,42,0.5)]">
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
          Publication Ethics & Policies
        </h2>
        <p className="mt-1.5 sm:mt-2 text-sm sm:text-base text-slate-600">
          We adhere to COPE-aligned practices with clear policies on plagiarism, data availability, 
          and conflicts of interest.
        </p>

        <div className="mt-5 sm:mt-6 grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 md:grid-cols-3">
          {/* Ethics */}
          <div className="space-y-2 sm:space-y-3">
            <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
              Ethics
            </h3>
            <div className="space-y-2">
              {journalInfo.policies.ethics.map((item) => (
                <div
                  key={item}
                  className="rounded-lg sm:rounded-xl border border-slate-200 bg-slate-50/80 p-2.5 sm:p-3 text-xs sm:text-sm text-slate-700"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Plagiarism */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
              Plagiarism
            </h3>
            <div className="space-y-2">
              {journalInfo.policies.plagiarism.map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-slate-200 bg-slate-50/80 p-3 text-sm text-slate-700"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Open Access */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
              Open Access
            </h3>
            <div className="rounded-lg sm:rounded-xl border border-slate-200 bg-slate-50/80 p-2.5 sm:p-3 text-xs sm:text-sm text-slate-700">
              {journalInfo.policies.openAccess}
            </div>
          </div>
        </div>
      </section>

      {/* Indexing & Recognition */}
      <section className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 md:p-8 lg:p-10 shadow-[0_18px_60px_-50px_rgba(15,23,42,0.5)]">
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
          Indexing & Recognition
        </h2>
        <p className="mt-1.5 sm:mt-2 text-sm sm:text-base text-slate-600">
          Our journal is indexed and recognized by leading academic databases and services.
        </p>

        <div className="mt-4 sm:mt-5 md:mt-6 flex flex-wrap gap-2 sm:gap-3">
          {journalInfo.indexingBadges.map((badge) => (
            <span
              key={badge}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-slate-700"
            >
              {badge}
            </span>
          ))}
        </div>
      </section>

      {/* Contact Information */}
      <section className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 p-5 sm:p-6 md:p-8 lg:p-10 text-white shadow-[0_25px_70px_-38px_rgba(15,23,42,0.5)]">
        <h2 className="text-xl sm:text-2xl font-semibold">Contact Us</h2>
        <p className="mt-1.5 sm:mt-2 text-sm sm:text-base text-slate-200">
          Get in touch with our editorial office for inquiries, submissions, or support.
        </p>

        <div className="mt-5 sm:mt-6 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
          <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
            <div className="text-[10px] sm:text-xs uppercase tracking-[0.18em] text-slate-300">
              Email
            </div>
            <div className="mt-1.5 sm:mt-2 text-sm sm:text-base font-semibold break-all">
              <a
                href={`mailto:${contactInfo.email}`}
                className="transition hover:text-sky-300"
              >
                {contactInfo.email}
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-300">
              Phone / WhatsApp
            </div>
            <div className="mt-2 text-base font-semibold">
              {contactInfo.support}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-300">
              Office Hours
            </div>
            <div className="mt-2 text-base font-semibold">
              {contactInfo.officeHours}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-300">
              Address
            </div>
            <div className="mt-2 text-base font-semibold">
              {contactInfo.address}
            </div>
          </div>
        </div>

        <div className="mt-5 sm:mt-6 flex flex-wrap gap-2 sm:gap-3">
          <Link
            href="/submit"
            className="rounded-full bg-sky-600 px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold !text-white transition hover:-translate-y-0.5 hover:bg-sky-700"
          >
            Submit a paper
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-white/20 bg-white/10 px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/20"
          >
            General inquiry
          </Link>
        </div>
      </section>
    </div>
  );
}
