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

      {/* About the Journal Section */}
      <section className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 md:p-8 lg:p-10 shadow-[0_18px_60px_-50px_rgba(15,23,42,0.5)]">
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
          About the Journal
        </h2>
        <div className="mt-4 space-y-4">
          {journalInfo.aboutFull.map((paragraph, index) => (
            <p key={index} className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          {/* Aims */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6">
            <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-3 mb-4">Aim</h3>
            <ul className="space-y-3">
              {journalInfo.aims.map((aim, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                  <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-sky-600" />
                  {aim}
                </li>
              ))}
            </ul>
          </div>
          {/* Objectives */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6">
            <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-3 mb-4">Objectives</h3>
            <ul className="space-y-3">
              {journalInfo.objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                  <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-600" />
                  {obj}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-6">
            Scope of the Journal
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {journalInfo.detailedScope.map((section) => (
              <div
                key={section.category}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h3 className="text-base font-semibold text-slate-900 mb-4 text-sky-700">
                  {section.category}
                </h3>
                <ul className="space-y-2">
                  {section.topics.map((topic) => (
                    <li key={topic} className="text-sm text-slate-600 flex items-center gap-2">
                      <span className="text-slate-300">•</span>
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 rounded-xl bg-sky-50 border border-sky-100 text-sm italic text-sky-800">
            {journalInfo.scopeNote}
          </div>
        </div>
      </section>

      {/* Editorial Board */}
      <section id="board" className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 md:p-8 lg:p-10 shadow-[0_18px_60px_-50px_rgba(15,23,42,0.5)]">
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 font-serif">
            Editorial Leadership
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {editorialBoard.filter(m => m.role === "Editor-in-Chief").map((m) => (
              <div key={m.name} className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-lg font-bold text-slate-900">{m.name}</div>
                <div className="text-sky-600 font-semibold text-xs uppercase tracking-widest mt-1">{m.role}</div>
                <div className="text-sm text-slate-500 mt-2 font-medium">{m.affiliation}</div>
                {m.bio && <p className="mt-4 text-sm text-slate-600 leading-relaxed italic border-l-2 border-sky-500 pl-4">{m.bio}</p>}
                <div className="mt-4 inline-block text-xs font-semibold text-slate-400">Email: {m.email}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Associate Editors</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {editorialBoard.filter(m => m.role !== "Editor-in-Chief").map((member) => (
              <div
                key={member.name}
                className="rounded-xl border border-slate-200 bg-white p-4"
              >
                <div className="text-sm font-bold text-slate-900">
                  {member.name}
                </div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.16em] text-sky-600 font-semibold">
                  {member.role}
                </div>
                <div className="mt-2 text-xs text-slate-600">
                  {member.affiliation}
                </div>
                <div className="mt-1.5 text-[10px] text-slate-500">
                  Focus: {member.focus}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="rounded-3xl border border-slate-900 bg-slate-900 p-8 md:p-12 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="relative z-10 space-y-6">
          <h2 className="text-2xl font-semibold font-serif">Call for Editors & Reviewers</h2>
          <p className="text-slate-300 max-w-3xl">
            We invite qualified academicians, researchers, and industry professionals to join our board. 
            Editors and reviewers play a vital role in maintaining our academic quality and integrity.
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="text-emerald-400 font-bold text-sm uppercase">Benefits</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex gap-2"><span>•</span> Free publication for Editors</li>
                <li className="flex gap-2"><span>•</span> Free publication for Reviewers (after 5 successful reviews)</li>
                <li className="flex gap-2"><span>•</span> Official recognition and certificates</li>
              </ul>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-slate-400">Apply by submitting your CV and area of expertise to our editorial office.</p>
              <a 
                href={`mailto:${contactInfo.email}?subject=Application for Editorial Board / Reviewer - [Your Name]&body=Dear Editorial Team,%0D%0A%0D%0AI am writing to express my interest in joining the Editorial Board / Reviewer Pool for the Journal of AI-Enabled Innovation and Discovery.%0D%0A%0D%0AMy Details:%0D%0AName: [Your Name]%0D%0AAffiliation: [Your Institution]%0D%0AExpertise: [Your Area of Expertise]%0D%0AProfile/ORCID: [Link if any]%0D%0A%0D%0AI have attached my academic CV for your reference.%0D%0A%0D%0ABest regards,%0D%0A[Your Name]`} 
                className="inline-block bg-white text-slate-900 px-6 py-2.5 rounded-full font-bold text-sm transition hover:bg-emerald-50"
              >
                Apply via Email: {contactInfo.email}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Policies & Ethics */}
      <section id="policies" className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 md:p-8 lg:p-10 shadow-[0_18px_60px_-50px_rgba(15,23,42,0.5)]">
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 font-serif mb-6">
          Academic Integrity & Policies
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4 p-6 rounded-2xl bg-slate-50 border border-slate-200">
            <h3 className="text-sm font-bold uppercase tracking-widest text-sky-700">Peer Review Policy</h3>
            <p className="text-sm text-slate-600">{journalInfo.policies.peerReview.description}</p>
            <div className="space-y-2 border-t border-slate-200 pt-4 mt-4">
              {journalInfo.policies.peerReview.timeline.map(t => (
                <div key={t.stage} className="flex justify-between text-xs">
                  <span className="text-slate-500 font-medium">{t.stage}:</span>
                  <span className="font-bold text-slate-900">{t.period}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 p-6 rounded-2xl bg-slate-50 border border-slate-200">
            <h3 className="text-sm font-bold uppercase tracking-widest text-sky-700">Ethics & Responsibilities</h3>
            <ul className="space-y-2">
              {journalInfo.policies.ethics.map(e => (
                <li key={e} className="text-xs text-slate-600 flex gap-2">
                  <span className="text-sky-500">•</span> {e}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mt-6">
          <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
            <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Plagiarism</h4>
            <div className="text-sm text-slate-700">Similarity index must be <strong>below 15%</strong>. Screening is mandatory.</div>
          </div>
          <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
            <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">AI Usage</h4>
            <div className="text-sm text-slate-700">{journalInfo.policies.aiUsage}</div>
          </div>
          <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
            <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Copyright</h4>
            <div className="text-sm text-slate-700">{journalInfo.policies.copyright}</div>
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

      {/* Contact Information - Light Theme Refresh */}
      <section className="rounded-2xl sm:rounded-3xl border border-sky-100 bg-sky-50 p-5 sm:p-6 md:p-8 lg:p-10 shadow-xl relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-sky-200/20 rounded-full blur-3xl -mb-48 -mr-48" />
        <div className="relative z-10">
          <h2 className="text-2xl font-semibold font-serif text-slate-900">Get in Touch</h2>
          <p className="mt-2 text-slate-600">For inquiries regarding submissions, editorial roles, or general support.</p>

          <div className="mt-8 grid gap-8 md:grid-cols-3">
            <div className="space-y-1">
              <div className="text-[10px] uppercase tracking-widest text-sky-600 font-bold">Email</div>
              <a href={`mailto:${contactInfo.email}`} className="text-lg font-bold text-slate-900 hover:text-sky-600 transition-colors underline decoration-sky-200 underline-offset-4">{contactInfo.email}</a>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] uppercase tracking-widest text-sky-600 font-bold">WhatsApp Support</div>
              <div className="text-lg font-bold text-slate-900">{contactInfo.whatsapp}</div>
              <div className="text-[10px] text-emerald-600 font-bold italic">{contactInfo.whatsappNote}</div>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] uppercase tracking-widest text-sky-600 font-bold">Office Hours</div>
              <div className="text-lg font-bold text-slate-900">{contactInfo.officeHours}</div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-sky-100">
            <div className="text-[10px] uppercase tracking-widest text-sky-600 font-bold mb-2">Main Office Address</div>
            <p className="text-slate-700 max-w-xl font-medium leading-relaxed">{contactInfo.address}</p>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/submit"
              className="rounded-full bg-slate-900 px-8 py-3 text-sm font-bold !text-white shadow-xl shadow-slate-900/20 transition hover:bg-slate-800 hover:-translate-y-0.5"
            >
              Submit a paper
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-slate-200 bg-white px-8 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-300"
            >
              Contact Office
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
