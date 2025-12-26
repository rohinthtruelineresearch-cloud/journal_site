import Link from "next/link";
import { currentIssue, editorialBoard, journalInfo } from "@/data/journal";

function StatCard({ title, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
      <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
        {title}
      </div>
      <div className="mt-2 text-sm font-semibold text-slate-900">{value}</div>
    </div>
  );
}

function PolicyCard({ label, text }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
      <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
        {label}
      </div>
      <div className="mt-2 text-sm text-slate-700">{text}</div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_25px_70px_-38px_rgba(15,23,42,0.35)]">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
          <div className="space-y-7 p-8 md:p-12">
            <div className="inline-flex items-center gap-3 rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
              Open access / Double-blind review / DOI-ready
            </div>
            <div className="space-y-3">
              <h1 className="font-serif text-4xl font-semibold leading-tight text-slate-900 md:text-5xl">
                {journalInfo.title}
              </h1>
              <p className="max-w-3xl text-lg text-slate-600">
                {journalInfo.description}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/submit"
                className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold !text-white shadow-xl shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-slate-800"
              >   
                Submit your paper
              </Link>
              <Link
                href="/guidelines"
                className="rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-900"
              >
                Author guidelines
              </Link>
              <span className="text-xs font-medium text-emerald-600">
                Decisions in 10-14 days - Online-first with DOI
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <StatCard title="Frequency" value={journalInfo.frequency} />
              <StatCard title="ISSN" value={journalInfo.issn} />
              <StatCard title="DOI Prefix" value={journalInfo.doiPrefix} />
              <StatCard title="Scope" value="Systems / AI / Infrastructure" />
            </div>
            <div className="flex flex-wrap gap-2">
              {journalInfo.indexingBadges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden bg-slate-900 text-white">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-sky-900" />
            <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-sky-500/30 blur-3xl" />
            <div className="relative space-y-4 p-8 md:p-10">
              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-slate-200">
                <span className="h-px flex-1 bg-slate-700" />
                Latest Issue
                <span className="h-px flex-1 bg-slate-700" />
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-200">
                <span className="rounded-full bg-white/10 px-3 py-1">
                  Volume {currentIssue.volume}, Issue {currentIssue.issue}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1">
                  {currentIssue.month} {currentIssue.year}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1">
                  {currentIssue.theme}
                </span>
              </div>
              <p className="text-sm text-slate-200">{currentIssue.published}</p>
              <div className="space-y-3">
                {currentIssue.papers.slice(0, 3).map((paper, index) => (
                  <div
                    key={paper.doi}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.12em] text-slate-200/80">
                      <span>Paper {index + 1}</span>
                      <span>{paper.doi}</span>
                    </div>
                    <div className="mt-2 text-sm font-semibold leading-snug text-white">
                      {paper.title}
                    </div>
                    <div className="text-xs text-slate-200/80">
                      {paper.authors}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3 pt-2">
                <Link
                  href="/current-issue"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:text-sky-200"
                >
                  View current issue
                  <span aria-hidden>-&gt;</span>
                </Link>
                <Link
                  href="/archive"
                  className="text-xs text-slate-300 transition hover:text-sky-200"
                >
                  Browse archive
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call for Papers Banner - Light Theme Refresh */}
      <section className="relative overflow-hidden rounded-[2rem] bg-sky-50 px-6 py-10 md:px-14 md:py-12 border border-sky-100 shadow-xl">
        {/* Subtle decorative background elements */}
        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-sky-200/30 blur-[80px] pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 h-64 w-64 rounded-full bg-indigo-100/40 blur-[80px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-sky-600 border border-sky-200 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
              </span>
              Call for Papers - Inaugural Issue
            </div>
            <h2 className="text-3xl font-semibold md:text-4xl font-serif text-slate-900 tracking-tight leading-tight">
              "AI-Driven Innovation across Science and Technology"
            </h2>
            <p className="text-slate-600 text-base md:text-lg leading-relaxed">
              Submit your original research by <span className="text-slate-950 font-semibold">01.06.2026</span> and benefit from a <span className="text-sky-600 font-bold underline decoration-sky-200 decoration-4 underline-offset-4">full publication fee waiver</span>. 
              Accepted papers published with permanent DOI and global indexing.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <Link
              href="/submit"
              className="rounded-full bg-slate-900 px-8 py-4 text-sm font-bold !text-white shadow-xl shadow-slate-900/10 transition-all hover:bg-slate-800 hover:-translate-y-0.5"
            >
              Submit Manuscript
            </Link>
            <Link
              href="/guidelines"
              className="rounded-full border border-slate-200 bg-white px-8 py-4 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300"
            >
              View Guidelines
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Aim &amp; scope
            </h2>
            <p className="text-sm text-slate-600">
              Advancing AI research across Science, Engineering, Technology, and Society.
            </p>
          </div>
          <Link
            href="/about"
            className="text-sm font-semibold text-sky-700 transition hover:text-sky-900"
          >
            Detailed aims & objectives -&gt;
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {journalInfo.detailedScope.map((section) => (
            <div
              key={section.category}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.5)] hover:border-sky-200 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="mt-1.5 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-sky-600 shadow-[0_0_10px_rgba(2,132,199,0.5)]" />
                <div>
                  <div className="font-semibold text-slate-900">{section.category}</div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {section.topics.slice(0, 3).map((topic, i) => (
                      <span key={i} className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                        {topic}
                      </span>
                    ))}
                    <span className="text-[11px] text-slate-400 self-center">...</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_60px_-50px_rgba(15,23,42,0.5)] md:grid-cols-[1.1fr_1fr] md:p-10">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-slate-900">
            Publication timeline
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {journalInfo.publicationTimeline.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3"
              >
                <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  {item.title}
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  {item.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-gradient-to-br from-sky-600 to-sky-700 p-5 text-white shadow-[0_18px_50px_-35px_rgba(14,165,233,0.7)]">
          <div className="text-xs uppercase tracking-[0.2em] text-sky-100">
            Submission experience
          </div>
          <div className="text-lg font-semibold">
            Early, clear, and transparent decisions.
          </div>
          <ul className="space-y-2 text-sm text-sky-50/90">
            <li>- Desk check within 48 hours with format feedback</li>
            <li>- Reviewer assignments tracked and time-boxed</li>
            <li>- Acceptance letters and invoice templates included</li>
            <li>- DOI minted on acceptance; camera-ready within 72h</li>
          </ul>
          <div className="pt-1 text-xs text-sky-100">
            Payments captured only after acceptance; waivers available.
          </div>
        </div>
      </section>

      <section className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_60px_-50px_rgba(15,23,42,0.5)] md:grid-cols-[1fr_1.2fr] md:p-10">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-slate-900">
            Editorial board
          </h3>
          <p className="text-sm text-slate-600">
            Diverse expertise across autonomy, infrastructure, and responsible AI.
          </p>
          <Link
            href="/about#board"
            className="text-sm font-semibold text-sky-700 transition hover:text-sky-900"
          >
            Full board -&gt;
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {editorialBoard.slice(0, 3).map((member) => (
            <div
              key={member.name}
              className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4"
            >
              <div className="text-sm font-semibold text-slate-900">
                {member.name}
              </div>
              <div className="text-xs uppercase tracking-[0.16em] text-slate-500">
                {member.role}
              </div>
              <div className="mt-2 text-sm text-slate-600">
                {member.affiliation}
              </div>
              <div className="mt-1 text-xs text-slate-500">
                Focus: {member.focus}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_60px_-50px_rgba(15,23,42,0.5)] md:grid-cols-3 md:p-10">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-slate-900">
            Publication ethics
          </h3>
          <p className="text-sm text-slate-600">
            COPE-aligned practices with clear plagiarism and data policies.
          </p>
          <Link
            href="/about#policies"
            className="text-sm font-semibold text-sky-700 transition hover:text-sky-900"
          >
            Read policies -&gt;
          </Link>
        </div>
        <div className="md:col-span-2">
          <div className="grid gap-3 md:grid-cols-2">
            {journalInfo.policies.ethics.map((item) => (
              <PolicyCard key={item} label="Ethics" text={item} />
            ))}
            {journalInfo.policies.plagiarism.map((item) => (
              <PolicyCard key={item} label="Plagiarism" text={item} />
            ))}
            <PolicyCard
              label="Open access"
              text={journalInfo.policies.openAccess}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

