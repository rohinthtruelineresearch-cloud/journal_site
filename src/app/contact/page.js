"use client";

import { contactInfo, journalInfo } from "@/data/journal";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    id: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleWhatsApp = () => {
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    const phone = contactInfo.whatsapp.replace(/[^0-9]/g, "");
    const text = encodeURIComponent(
      `*Inquiry from Journal Site*\n\n*Name:* ${formData.name}\n*Email:* ${formData.email}\n*Submission ID:* ${formData.id || "N/A"}\n\n*Message:*\n${formData.message}`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
  };

  return (
    <div className="space-y-12 mb-20">
      <section className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-8 md:p-16 shadow-[0_45px_100px_-50px_rgba(15,23,42,0.5)]">
        <div className="absolute top-0 right-0 h-64 w-64 bg-sky-500/5 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-sky-700">
              Editorial Office
            </div>
            <h1 className="font-serif text-4xl font-bold leading-tight text-slate-900 md:text-6xl">
              How can we help you?
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              We aim for rapid response. For manuscript inquiries, please include 
              your <strong>Submission ID</strong> (e.g., AJSE-2025-0412) to help us route your request faster.
            </p>
          </div>
          <div className="flex-shrink-0">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Office Hours</div>
              <div className="text-xl font-bold text-slate-900">{contactInfo.officeHours}</div>
              <p className="text-xs text-slate-500 mt-2">Personalized support across all time zones.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold font-serif text-slate-900">Direct Support Channels</h2>
          
          <div className="grid gap-6">
            <ContactChannel 
              title="Official Email" 
              value={contactInfo.email} 
              icon="✉️" 
              href={`mailto:${contactInfo.email}`}
              description="For general inquiries, editorial queries, and submission support."
            />
            <ContactChannel 
              title="WhatsApp Only" 
              value={contactInfo.whatsapp} 
              icon="💬" 
              badge={contactInfo.whatsappNote}
              description="Dedicated support for authors and reviewers. Text messages only."
            />
            <ContactChannel 
              title="Editorial Headquarters" 
              value={contactInfo.address} 
              icon="🏢" 
              description="Official correspondence address and management office."
            />
          </div>
        </div>

        <div className="sticky top-24 rounded-[2.5rem] border border-slate-200 bg-white p-8 md:p-10 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.3)]">
          <h3 className="text-xl font-semibold font-serif text-slate-900 mb-6 font-serif">Send an Inquiry</h3>
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Full Name" name="name" placeholder="John Doe" required value={formData.name} onChange={handleChange} />
              <Field label="Email Address" name="email" type="email" placeholder="john@example.com" required value={formData.email} onChange={handleChange} />
            </div>
            <Field label="Submission ID (Optional)" name="id" placeholder="AJSE-2025-XXXX" value={formData.id} onChange={handleChange} />
            <label className="block space-y-2">
              <span className="text-sm font-bold text-slate-900 uppercase tracking-wide">Detailed Message</span>
              <textarea
                name="message"
                rows={5}
                required
                value={formData.message}
                onChange={handleChange}
                placeholder="How can we assist you today?"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-sky-500/10 transition-all text-sm"
              />
            </label>
              <button
                type="button"
                onClick={handleWhatsApp}
                className="w-full rounded-xl bg-[#25D366] py-3 text-sm font-bold text-white shadow-lg transition hover:-translate-y-1 hover:bg-[#20bd5a] hover:shadow-xl active:translate-y-0"
              >
                Send via WhatsApp
              </button>
            <p className="text-center text-[10px] text-slate-400 uppercase tracking-widest font-semibold italic">
              Expected turnaround: within 24 business hours
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

function ContactChannel({ title, value, icon, description, badge, href }) {
  return (
    <div className="group flex gap-6 p-6 rounded-[2rem] border border-slate-100 bg-white shadow-sm hover:shadow-md transition-all hover:border-sky-200">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-2xl group-hover:bg-sky-100 transition-colors">
        {icon}
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">{title}</h4>
          {badge && <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 uppercase tracking-tighter">{badge}</span>}
        </div>
        {href ? (
          <a href={href} className="block text-xl font-bold text-sky-600 hover:text-sky-700 transition-colors underline decoration-sky-500/20 underline-offset-4">{value}</a>
        ) : (
          <div className="text-lg font-bold text-slate-900">{value}</div>
        )}
        <p className="text-xs text-slate-500 leading-relaxed pt-1">{description}</p>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  value,
  onChange
}) {
  return (
    <label className="block space-y-1 text-sm text-slate-700">
      <span className="font-semibold text-slate-900">{label}</span>
      <input
        type={type}
        name={name}
        required={required}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-[0_14px_32px_-28px_rgba(15,23,42,0.6)] focus:border-sky-500 focus:outline-none"
      />
    </label>
  );
}
