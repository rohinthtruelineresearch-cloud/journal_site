import { contactInfo, journalInfo } from "@/data/journal";

export default function ContactPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_25px_70px_-38px_rgba(15,23,42,0.35)] md:p-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Contact
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900 md:text-4xl">
              Reach the editorial office
            </h1>
            <p className="mt-2 max-w-3xl text-base text-slate-600">
              We respond within one business day. Include your submission ID if
              you have one (e.g., AJSE-2025-0412) to speed up routing.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-700">
            Office hours: {contactInfo.officeHours}
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-[1fr_1fr]">
        <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_60px_-50px_rgba(15,23,42,0.5)] md:p-8">
          <div className="text-sm font-semibold text-slate-900">
            Direct channels
          </div>
          <div className="space-y-2 text-sm text-slate-700">
            <div>Email: {contactInfo.email}</div>
            <div>WhatsApp: {contactInfo.whatsapp}</div>
            <div>Support: {contactInfo.support}</div>
            <div>Office: {contactInfo.address}</div>
            <div>Journal: {journalInfo.title}</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-xs text-slate-600">
            For billing: include the payment receipt URL from Stripe/Razorpay. For
            withdrawals: include the manuscript ID and reason.
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_60px_-50px_rgba(15,23,42,0.5)] md:p-8">
          <div className="text-sm font-semibold text-slate-900">Contact form</div>
          <form className="mt-4 space-y-3">
            <Field label="Name" name="name" required />
            <Field label="Email" name="email" type="email" required />
            <Field label="Submission ID (if any)" name="submissionId" />
            <label className="block space-y-1 text-sm text-slate-700">
              <span className="font-semibold text-slate-900">Message</span>
              <textarea
                name="message"
                rows={4}
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-[0_14px_32px_-28px_rgba(15,23,42,0.6)] focus:border-sky-500 focus:outline-none"
              />
            </label>
            <div className="text-xs text-slate-500">
              This form is UI-only. Hook it to your email service or API endpoint.
            </div>
            <button
              type="submit"
              className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              Send message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}) {
  return (
    <label className="block space-y-1 text-sm text-slate-700">
      <span className="font-semibold text-slate-900">{label}</span>
      <input
        type={type}
        name={name}
        required={required}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-[0_14px_32px_-28px_rgba(15,23,42,0.6)] focus:border-sky-500 focus:outline-none"
      />
    </label>
  );
}
