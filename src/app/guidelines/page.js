import Link from "next/link";
import {
  doiInfo,
  paymentInfo,
  submissionGuidelines,
} from "@/data/journal";

export default function GuidelinesPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_25px_70px_-38px_rgba(15,23,42,0.35)] md:p-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Author guidelines
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900 md:text-4xl">
              Submit with confidence
            </h1>
            <p className="mt-2 max-w-3xl text-base text-slate-600">
              Follow this checklist to accelerate desk screening and peer review.
              We mirror IEEE/Elsevier structure while keeping the experience fast
              and transparent.
            </p>
          </div>
          <Link
            href="/submit"
            className="rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold !text-white shadow-[0_20px_45px_-28px_rgba(3,105,161,0.9)] transition hover:-translate-y-0.5 hover:bg-sky-700"
          >
            Start submission
          </Link>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <GuidelineCard title="Submission format">
          <ul className="space-y-2 text-sm text-slate-700">
            {submissionGuidelines.formatting.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
          <div className="mt-4 text-xs text-slate-500">
            Accepted file types: {submissionGuidelines.submissionFormat.join(", ")}
          </div>
        </GuidelineCard>

        <GuidelineCard title="Files to upload">
          <ul className="space-y-2 text-sm text-slate-700">
            {submissionGuidelines.files.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </GuidelineCard>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <GuidelineCard title="Referencing &amp; templates">
          <ul className="space-y-2 text-sm text-slate-700">
            {submissionGuidelines.referencing.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="https://www.ieee.org/conferences/publishing/templates.html"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              IEEE DOCX template
            </a>
            <a
              href="https://www.overleaf.com/latex/templates/ieee-journal-template/zhqxxrbmhjhx"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              LaTeX/Overleaf template
            </a>
          </div>
        </GuidelineCard>

        <GuidelineCard title="Publication fee">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <div className="text-3xl font-semibold text-slate-900">
              {paymentInfo.currency} {paymentInfo.amount}
            </div>
            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
              charged only after acceptance
            </div>
            <ul className="mt-3 space-y-1 text-sm text-slate-700">
              {submissionGuidelines.fee.includes.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
            <div className="mt-3 text-xs text-slate-500">
              {submissionGuidelines.fee.waiver}
            </div>
          </div>
        </GuidelineCard>
      </section>

      <section className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_60px_-50px_rgba(15,23,42,0.5)] md:grid-cols-2 md:p-10">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-slate-900">
            Ethics &amp; plagiarism
          </h3>
          <p className="text-sm text-slate-600">
            COPE-aligned policies with similarity thresholds enforced at
            submission and before publication.
          </p>
          <div className="text-xs text-slate-500">
            We run both plagiarism and AI-writing detection before review.
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {submissionGuidelines.plagiarism.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-sm text-slate-700"
            >
              {item}
            </div>
          ))}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-sm text-slate-700">
            Data/code statements encouraged. Sensitive data allowed with
            governance plan.
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <GuidelineCard title="DOI &amp; metadata">
          <div className="text-sm text-slate-700">
            DOI prefix {doiInfo.prefix}. {doiInfo.policy}
          </div>
          <div className="mt-3 text-xs text-slate-500">
            Registrar: {doiInfo.registrar}. Metadata pushed with ORCID, funding,
            keywords, and references where provided.
          </div>
        </GuidelineCard>
        <GuidelineCard title="Payments">
          <div className="text-sm text-slate-700">
            Gateways: {paymentInfo.gateways.join(" · ")} ({paymentInfo.currency}{" "}
            {paymentInfo.amount}).
          </div>
          <ul className="mt-2 space-y-1 text-sm text-slate-700">
            {paymentInfo.verification.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
          <div className="mt-3 text-xs text-slate-500">{paymentInfo.note}</div>
        </GuidelineCard>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_60px_-50px_rgba(15,23,42,0.5)] md:p-10">
        <h3 className="text-lg font-semibold text-slate-900">
          Quick pre-flight checklist
        </h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <ChecklistItem label="Title page lists all authors, affiliations, ORCID, and corresponding email." />
          <ChecklistItem label="Line numbers enabled; figures/tables referenced in order." />
          <ChecklistItem label="Similarity report expected to be below 15% overall." />
          <ChecklistItem label="Ethics statement provided (human/animal data where relevant)." />
          <ChecklistItem label="Data/code availability statement included, even if not shareable." />
          <ChecklistItem label="All citations include DOI where available and consistent IEEE numbering." />
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/submit"
            className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold !text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            Proceed to submission
          </Link>
          <a
            href="mailto:editorial.office@ajse.org"
            className="rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300"
          >
            Ask the editorial office
          </a>
        </div>
      </section>
    </div>
  );
}

function GuidelineCard({
  title,
  children,
}) {
  return (
    <div className="h-full rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_60px_-50px_rgba(15,23,42,0.5)]">
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function ChecklistItem({ label }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-700">
      <div className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500" />
      <span>{label}</span>
    </div>
  );
}
