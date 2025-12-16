"use client";

import Link from "next/link";
import { doiInfo, journalInfo, paymentInfo } from "@/data/journal";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Loader from "@/components/Loader";

export default function SubmitPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [manuscriptFile, setManuscriptFile] = useState(null);
  const [coverLetterFile, setCoverLetterFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [hasPreviewed, setHasPreviewed] = useState(false);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (type === "manuscript") setManuscriptFile(file);
    if (type === "coverLetter") setCoverLetterFile(file);
    // Reset preview if files change
    setHasPreviewed(false);
    setPreviewUrl(null);
  };

  const handlePreview = async () => {
    if (!manuscriptFile || !coverLetterFile) {
      toast.error("Please upload both Manuscript and Cover Letter to preview.");
      return;
    }

    setPreviewLoading(true);
    const formData = new FormData();
    formData.append("manuscript", manuscriptFile);
    formData.append("coverLetter", coverLetterFile);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/merge-preview`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to generate preview");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      setShowPreview(true);
      setHasPreviewed(true);
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate preview. Please try again.");
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!hasPreviewed) {
      toast.error("Please preview the combined PDF before submitting.");
      return;
    }

    setLoading(true);

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // Format authors array (simple split by comma for now)
    // const authors = [
    //   `${data.firstName} ${data.lastName}`,
    //   ...data.keywords.split(";").map((k) => k.trim()), // Just using keywords as placeholder for other authors if any
    // ];

    const submissionFormData = new FormData();
    submissionFormData.append("title", data.title);
    submissionFormData.append("abstract", data.abstract);
    submissionFormData.append("authors", JSON.stringify([`${data.firstName} ${data.lastName}`])); // Send authors as JSON string
    submissionFormData.append("content", "Placeholder content");
    submissionFormData.append("manuscript", manuscriptFile);
    submissionFormData.append("coverLetter", coverLetterFile);
    
    // Check if user wants to be a reviewer
    const wantsReviewerRole = formData.get("wantsReviewerRole") === "on";
    submissionFormData.append("wantsReviewerRole", wantsReviewerRole);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles`, {
        method: "POST",
        headers: {
             Authorization: `Bearer ${token}`
        },
        // Content-Type header is automatically set by browser for FormData
        body: submissionFormData,
      });

      if (res.status === 401) {
          toast.error("Please log in to submit a paper.");
          router.push("/login");
          return;
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Submission failed");
      }

      toast.success("Manuscript submitted successfully!");
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push("/author");
      }, 2000);

    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {(loading || previewLoading) && <Loader overlay={true} />}
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_25px_70px_-38px_rgba(15,23,42,0.35)] md:p-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Submit your manuscript
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900 md:text-4xl">
              Fast-track peer review
            </h1>
            <p className="mt-2 max-w-3xl text-base text-slate-600">
              Desk screening in 48 hours, double-blind review in 10–14 days, and
              DOI-minted online-first publishing.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-700">
            DOI prefix: {doiInfo.prefix} · Frequency: {journalInfo.frequency}
          </div>
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-[1.2fr_0.95fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_60px_-50px_rgba(15,23,42,0.5)] md:p-8">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="First name" name="firstName" required />
              <Field label="Last name" name="lastName" required />
              <Field
                label="Email"
                name="email"
                type="email"
                required
                helper="Corresponding author email."
              />
              <Field label="Affiliation" name="affiliation" required />
              <Field label="ORCID" name="orcid" placeholder="0000-0000-0000-0000" />
              <Field label="Country" name="country" />
            </div>

            <Field label="Paper title" name="title" required />
            <Textarea
              label="Abstract"
              name="abstract"
              rows={5}
              required
              helper="200–300 words. Paste plain text; LaTeX supported for math."
            />
            <Field
              label="Keywords"
              name="keywords"
              placeholder="edge computing; trustworthy AI; microgrids"
              helper="Use semicolons to separate keywords."
            />

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Funding (optional)" name="funding" />
              <Field label="Conflict of interest" name="conflict" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FileField 
                label="Manuscript file (PDF/Word)" 
                name="manuscript" 
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleFileChange(e, "manuscript")}
                required
              />
              <FileField
                label="Cover letter (PDF/Word)"
                name="coverLetter"
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleFileChange(e, "coverLetter")}
                required
              />
            </div>

            <div className="flex items-center gap-4 py-2">
               <button
                type="button"
                onClick={handlePreview}
                disabled={!manuscriptFile || !coverLetterFile || previewLoading}
                className="rounded-full border border-sky-600 bg-sky-50 px-5 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {previewLoading ? "Generating Preview..." : "Preview Combined PDF"}
              </button>
              {hasPreviewed && (
                <span className="text-sm text-green-600 font-medium">
                  ✓ Previewed
                </span>
              )}
            </div>

            <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-700">
              <input type="checkbox" className="mt-1" required />
              <span>
                I confirm the work is original, not under review elsewhere, and
                adheres to the plagiarism and ethics policy.
              </span>
            </label>

            <label className="flex items-start gap-3 rounded-2xl border border-teal-200 bg-teal-50/70 px-4 py-3 text-sm text-teal-800">
              <input 
                type="checkbox" 
                name="wantsReviewerRole" 
                className="mt-1 accent-teal-600" 
              />
              <span>
                <strong>Join our Reviewer Panel:</strong> I am interested in becoming a reviewer for this journal. If selected, I agree to be listed in the reviewer panel and receive review requests.
              </span>
            </label>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                disabled={loading || !hasPreviewed}
                className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting..." : "Send to editorial office"}
              </button>
              <Link
                href="/guidelines"
                className="rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300"
              >
                Review guidelines
              </Link>
            </div>
          </form>
        </section>

        <section className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-slate-900 p-6 text-white shadow-[0_20px_55px_-40px_rgba(15,23,42,0.65)]">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-200">
              Payment gateway
            </div>
            <div className="mt-2 text-xl font-semibold">
              {paymentInfo.currency} {paymentInfo.amount} via{" "}
              {paymentInfo.gateways.join(" / ")}
            </div>
            <div className="mt-2 text-sm text-slate-100/90">{paymentInfo.note}</div>
            <ul className="mt-4 space-y-2 text-sm text-slate-100/90">
              <li>• Pro-forma invoice auto-generated on acceptance</li>
              <li>• Stripe/Razorpay receipt URLs stored for verification</li>
              <li>• Wire transfers manually reconciled with submission ID</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_60px_-50px_rgba(15,23,42,0.5)]">
            <div className="text-sm font-semibold text-slate-900">
              Publication pipeline
            </div>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li>• Desk check: 48h</li>
              <li>• Double-blind review: 10–14 days</li>
              <li>• Revision window: 1–2 weeks</li>
              <li>• DOI minted at acceptance: {doiInfo.prefix}</li>
              <li>• Online-first: within 72h after payment verification</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_60px_-50px_rgba(15,23,42,0.5)]">
            <div className="text-sm font-semibold text-slate-900">
              Need help?
            </div>
            <p className="mt-2 text-sm text-slate-700">
              Email editorial.office@ajse.org with your abstract and planned file
              format. We will respond with a template and checklist.
            </p>
          </div>
        </section>
      </div>

      {/* PDF Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="relative h-[90vh] w-full max-w-5xl">
            <button
              onClick={() => setShowPreview(false)}
              className="absolute -top-12 right-0 z-50 flex items-center gap-2 text-white hover:text-slate-200 transition"
            >
              <span className="text-sm font-bold uppercase tracking-wider">Close Preview</span>
              <div className="rounded-full bg-white/20 p-2 backdrop-blur-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </button>
            <div className="h-full w-full rounded-xl bg-white p-2">
                <iframe
                src={previewUrl}
                className="h-full w-full rounded-lg"
                title="PDF Preview"
                />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  helper,
}) {
  return (
    <label className="block space-y-1 text-sm text-slate-700">
      <span className="font-semibold text-slate-900">{label}</span>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-[0_14px_32px_-28px_rgba(15,23,42,0.6)] focus:border-sky-500 focus:outline-none"
      />
      {helper && <span className="text-xs text-slate-500">{helper}</span>}
    </label>
  );
}

function Textarea({
  label,
  name,
  rows = 4,
  helper,
  required,
}) {
  return (
    <label className="block space-y-1 text-sm text-slate-700">
      <span className="font-semibold text-slate-900">{label}</span>
      <textarea
        name={name}
        rows={rows}
        required={required}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-[0_14px_32px_-28px_rgba(15,23,42,0.6)] focus:border-sky-500 focus:outline-none"
      />
      {helper && <span className="text-xs text-slate-500">{helper}</span>}
    </label>
  );
}

function FileField({ label, name, accept, onChange, required }) {
  return (
    <label className="block space-y-2 text-sm text-slate-700">
      <span className="font-semibold text-slate-900">{label}</span>
      <input
        type="file"
        name={name}
        accept={accept}
        onChange={onChange}
        required={required}
        className="w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-none file:bg-slate-900 file:px-3 file:py-2 file:text-white"
      />
    </label>
  );
}
