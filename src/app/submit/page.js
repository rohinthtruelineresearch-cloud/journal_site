"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Loader from "@/components/Loader";

const PAPER_TYPES = [
  { id: "regular", label: "Regular Full Paper Submission", description: "" },
  { id: "research_note", label: "Research Note/Short Paper", description: "" },
  { id: "tutorial", label: "Tutorial Survey", description: "" },
  { id: "software", label: "Software/Algorithms", description: "" },
  { id: "addendum", label: "Addendum/Corrections", description: "" },
  { id: "editorial", label: "Editorial", description: "Exclusively for EIC's editorial" },
  { id: "introduction", label: "Introduction", description: "Exclusively for special issue introduction" },
  { id: "conference", label: "Conference Extension Paper", description: "Exclusively for extension papers" },
];

const FILE_DESIGNATIONS = [
  "Main Document (PDF)",
  "Main Document (Word)",
  "Supplementary File",
  "Cover Letter",
  "Author Response Letter",
  "Figures",
  "Tables",
  "Data Files",
];

const STEPS = [
  { id: 1, label: "Type, Title, & Abstract" },
  { id: 2, label: "File Upload" },
  { id: 3, label: "Attributes" },
  { id: 4, label: "Authors & Institutions" },
  { id: 5, label: "Reviewers & Editors" },
  { id: 6, label: "Details & Comments" },
  { id: 7, label: "Review & Submit" },
];

export default function SubmitPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  
  // Step 1: Type, Title, Abstract
  const [paperType, setPaperType] = useState("regular");
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  
  // Step 2: Files
  const [files, setFiles] = useState([]);
  
  // Step 3: Keywords
  const [keywords, setKeywords] = useState([]);
  const [keywordInput, setKeywordInput] = useState("");
  
  // Step 4: Authors
  const [authors, setAuthors] = useState([{
    order: 1,
    firstName: "",
    lastName: "",
    email: "",
    orcid: "",
    institution: "",
    city: "",
    country: "",
    isCorresponding: true,
  }]);
  
  // Step 5: Reviewers
  const [suggestedReviewers, setSuggestedReviewers] = useState([]);
  const [opposedReviewers, setOpposedReviewers] = useState([]);
  
  // Step 6: Details & Comments
  const [coverLetterText, setCoverLetterText] = useState("");
  const [coverLetterFile, setCoverLetterFile] = useState(null);
  const [hasFunding, setHasFunding] = useState(false);
  const [funders, setFunders] = useState([]);
  const [wasConferenceAccepted, setWasConferenceAccepted] = useState(false);
  const [conferenceName, setConferenceName] = useState("");
  const [hasSupplementaryMaterials, setHasSupplementaryMaterials] = useState(false);
  const [confirmPlagiarismPolicy, setConfirmPlagiarismPolicy] = useState(false);
  const [confirmPaperAccuracy, setConfirmPaperAccuracy] = useState(false);
  const [wantsReviewerRole, setWantsReviewerRole] = useState(false);
  
  // Step 7: Preview state
  const [previewLoading, setPreviewLoading] = useState(false);
  const [hasViewedProof, setHasViewedProof] = useState(false);

  // Reset hasViewedProof when entering Step 7 (ensures user must view proof each time)
  useEffect(() => {
    if (currentStep === 7) {
      setHasViewedProof(false);
    }
  }, [currentStep]);

  const wordCount = (text) => text.trim().split(/\s+/).filter(Boolean).length;

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!title.trim()) { toast.error("Please enter a title"); return false; }
        if (!abstract.trim()) { toast.error("Please enter an abstract"); return false; }
        if (wordCount(title) > 25) { toast.error("Title should not exceed 25 words"); return false; }
        return true;
      case 2:
        const mainDoc = files.find(f => f.designation === "Main Document (PDF)" || f.designation === "Main Document (Word)");
        if (!mainDoc) { toast.error("Please upload the main document (PDF or Word)"); return false; }
        return true;
      case 3:
        if (keywords.length < 2) { toast.error("Please add at least 2 keywords"); return false; }
        return true;
      case 4:
        if (authors.length === 0) { toast.error("Please add at least one author"); return false; }
        const invalidAuthor = authors.find(a => !a.firstName || !a.lastName || !a.email || !a.institution);
        if (invalidAuthor) { toast.error("Please complete all required author fields"); return false; }
        return true;
      case 5:
        return true; // Optional step
      case 6:
        if (!confirmPlagiarismPolicy) { toast.error("Please confirm the plagiarism policy"); return false; }
        if (!confirmPaperAccuracy) { toast.error("Please confirm the accuracy of paper information"); return false; }
        return true;
      case 7:
        if (!hasViewedProof) { toast.error("Please view the PDF proof before submitting"); return false; }
        return true;
      default:
        return true;
    }
  };

  const goToStep = (step) => {
    if (step < currentStep) {
      setCurrentStep(step);
    } else if (step === currentStep + 1) {
      if (validateStep(currentStep)) {
        if (!completedSteps.includes(currentStep)) {
          setCompletedSteps([...completedSteps, currentStep]);
        }
        setCurrentStep(step);
      }
    }
  };

  const handleSaveAndContinue = () => {
    if (validateStep(currentStep)) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      if (currentStep < 7) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleSave = () => {
    toast.success("Progress saved!");
  };

  const handleFileUpload = (e) => {
    const newFiles = Array.from(e.target.files).map((file, idx) => ({
      id: Date.now() + idx,
      file,
      name: file.name,
      size: (file.size / 1024).toFixed(1) + " KB",
      designation: "",
      uploadDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    }));
    setFiles([...files, ...newFiles]);
  };

  const updateFileDesignation = (id, designation) => {
    setFiles(files.map(f => f.id === id ? { ...f, designation } : f));
  };

  const removeFile = (id) => {
    setFiles(files.filter(f => f.id !== id));
  };

  const addKeyword = () => {
    if (keywordInput.trim() && keywords.length < 6) {
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput("");
    } else if (keywords.length >= 6) {
      toast.error("Maximum 6 keywords allowed");
    }
  };

  const removeKeyword = (idx) => {
    setKeywords(keywords.filter((_, i) => i !== idx));
  };

  const addAuthor = () => {
    setAuthors([...authors, {
      order: authors.length + 1,
      firstName: "",
      lastName: "",
      email: "",
      orcid: "",
      institution: "",
      city: "",
      country: "",
      isCorresponding: false,
    }]);
  };

  const updateAuthor = (idx, field, value) => {
    const updated = [...authors];
    updated[idx][field] = value;
    setAuthors(updated);
  };

  const removeAuthor = (idx) => {
    if (authors.length > 1) {
      const updated = authors.filter((_, i) => i !== idx).map((a, i) => ({ ...a, order: i + 1 }));
      setAuthors(updated);
    }
  };

  const moveAuthor = (idx, direction) => {
    if ((direction === -1 && idx === 0) || (direction === 1 && idx === authors.length - 1)) return;
    const updated = [...authors];
    const temp = updated[idx];
    updated[idx] = updated[idx + direction];
    updated[idx + direction] = temp;
    updated.forEach((a, i) => a.order = i + 1);
    setAuthors(updated);
  };

  const handleSubmit = async () => {
    if (!validateStep(7)) return;
    
    setLoading(true);
    const formData = new FormData();
    
    formData.append("paperType", paperType);
    formData.append("title", title);
    formData.append("abstract", abstract);
    formData.append("keywords", JSON.stringify(keywords));
    formData.append("authors", JSON.stringify(authors));
    formData.append("suggestedReviewers", JSON.stringify(suggestedReviewers));
    formData.append("opposedReviewers", JSON.stringify(opposedReviewers));
    formData.append("hasFunding", hasFunding);
    formData.append("funders", JSON.stringify(funders));
    formData.append("wasConferenceAccepted", wasConferenceAccepted);
    formData.append("conferenceName", conferenceName);
    formData.append("wantsReviewerRole", wantsReviewerRole);
    
    // Find the main manuscript file (Main Document PDF or Word)
    const manuscriptFile = files.find(f => f.designation === "Main Document (PDF)" || f.designation === "Main Document (Word)") || files[0];
    if (manuscriptFile && manuscriptFile.file) {
      formData.append("manuscript", manuscriptFile.file);
    }
    
    // Handle cover letter - use uploaded file if exists, otherwise create from text
    if (coverLetterFile) {
      formData.append("coverLetter", coverLetterFile);
    } else if (coverLetterText) {
      const coverLetterBlob = new Blob([coverLetterText], { type: 'text/plain' });
      formData.append("coverLetter", coverLetterBlob, "cover-letter.txt");
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
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
      setTimeout(() => router.push("/author"), 2000);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50/30">
      {loading && <Loader overlay={true} type={currentStep === 7 ? "submission" : "default"} />}
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <Sidebar steps={STEPS} currentStep={currentStep} completedSteps={completedSteps} goToStep={goToStep} />
          
          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
              {/* Step Header */}
              <div className="bg-gradient-to-r from-sky-600 to-sky-700 px-8 py-5">
                <h1 className="text-2xl font-bold text-white">
                  Step {currentStep}: {STEPS[currentStep - 1].label}
                </h1>
              </div>
              
              {/* Step Content */}
              <div className="p-8">
                {currentStep === 1 && (
                  <Step1
                    paperType={paperType} setPaperType={setPaperType}
                    title={title} setTitle={setTitle}
                    abstract={abstract} setAbstract={setAbstract}
                    wordCount={wordCount}
                  />
                )}
                {currentStep === 2 && (
                  <Step2
                    files={files} handleFileUpload={handleFileUpload}
                    updateFileDesignation={updateFileDesignation}
                    removeFile={removeFile}
                  />
                )}
                {currentStep === 3 && (
                  <Step3
                    keywords={keywords} keywordInput={keywordInput}
                    setKeywordInput={setKeywordInput}
                    addKeyword={addKeyword} removeKeyword={removeKeyword}
                  />
                )}
                {currentStep === 4 && (
                  <Step4
                    authors={authors} addAuthor={addAuthor}
                    updateAuthor={updateAuthor} removeAuthor={removeAuthor}
                    moveAuthor={moveAuthor}
                  />
                )}
                {currentStep === 5 && (
                  <Step5
                    suggestedReviewers={suggestedReviewers}
                    setSuggestedReviewers={setSuggestedReviewers}
                    opposedReviewers={opposedReviewers}
                    setOpposedReviewers={setOpposedReviewers}
                  />
                )}
                {currentStep === 6 && (
                  <Step6
                    coverLetterText={coverLetterText} setCoverLetterText={setCoverLetterText}
                    coverLetterFile={coverLetterFile} setCoverLetterFile={setCoverLetterFile}
                    hasFunding={hasFunding} setHasFunding={setHasFunding}
                    funders={funders} setFunders={setFunders}
                    wasConferenceAccepted={wasConferenceAccepted} setWasConferenceAccepted={setWasConferenceAccepted}
                    conferenceName={conferenceName} setConferenceName={setConferenceName}
                    hasSupplementaryMaterials={hasSupplementaryMaterials} setHasSupplementaryMaterials={setHasSupplementaryMaterials}
                    confirmPlagiarismPolicy={confirmPlagiarismPolicy} setConfirmPlagiarismPolicy={setConfirmPlagiarismPolicy}
                    confirmPaperAccuracy={confirmPaperAccuracy} setConfirmPaperAccuracy={setConfirmPaperAccuracy}
                  />
                )}
                {currentStep === 7 && (
                  <Step7
                    paperType={paperType} title={title} abstract={abstract}
                    keywords={keywords} authors={authors} files={files}
                    coverLetterText={coverLetterText} coverLetterFile={coverLetterFile}
                    hasFunding={hasFunding} funders={funders}
                    wasConferenceAccepted={wasConferenceAccepted} conferenceName={conferenceName}
                    hasSupplementaryMaterials={hasSupplementaryMaterials}
                    confirmPlagiarismPolicy={confirmPlagiarismPolicy}
                    confirmPaperAccuracy={confirmPaperAccuracy}
                    goToStep={goToStep}
                    hasViewedProof={hasViewedProof} setHasViewedProof={setHasViewedProof}
                    previewLoading={previewLoading} setPreviewLoading={setPreviewLoading}
                    wantsReviewerRole={wantsReviewerRole} setWantsReviewerRole={setWantsReviewerRole}
                  />
                )}
              </div>
              
              {/* Navigation Buttons */}
              <div className="px-8 py-5 bg-slate-50 border-t border-slate-200 flex justify-between">
                <button
                  onClick={() => currentStep > 1 && setCurrentStep(currentStep - 1)}
                  disabled={currentStep === 1}
                  className="px-5 py-2.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  ‹ Previous Step
                </button>
                <div className="flex gap-3">
                  <button onClick={handleSave} className="px-5 py-2.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition">
                    Save
                  </button>
                  {currentStep < 7 ? (
                    <button onClick={handleSaveAndContinue} className="px-6 py-2.5 bg-sky-600 text-white rounded-lg text-sm font-semibold hover:bg-sky-700 transition">
                      Save & Continue ›
                    </button>
                  ) : (
                    <button onClick={handleSubmit} disabled={loading} className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50 transition">
                      {loading ? "Submitting..." : "Submit Manuscript"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sidebar Component
function Sidebar({ steps, currentStep, completedSteps, goToStep }) {
  return (
    <div className="w-72 flex-shrink-0">
      <div className="bg-gradient-to-b from-sky-800 to-sky-900 rounded-2xl shadow-xl overflow-hidden sticky top-8">
        <div className="px-5 py-4 bg-sky-900/50">
          <h2 className="text-white font-bold text-lg">Submission</h2>
        </div>
        <nav className="p-2">
          {steps.map((step) => {
            const isCompleted = completedSteps.includes(step.id);
            const isCurrent = currentStep === step.id;
            const isAccessible = step.id <= currentStep || completedSteps.includes(step.id - 1);
            
            return (
              <button
                key={step.id}
                onClick={() => isAccessible && goToStep(step.id)}
                disabled={!isAccessible}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                  isCurrent
                    ? "bg-white/20 text-white"
                    : isCompleted
                    ? "text-sky-100 hover:bg-white/10"
                    : isAccessible
                    ? "text-sky-200/70 hover:bg-white/5"
                    : "text-sky-300/40 cursor-not-allowed"
                }`}
              >
                <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                  isCompleted ? "bg-emerald-500 text-white" : isCurrent ? "bg-white text-sky-800" : "bg-sky-700/50 text-sky-300"
                }`}>
                  {isCompleted ? "✓" : step.id}
                </span>
                <span className="text-sm font-medium">{step.label}</span>
                {isCurrent && <span className="ml-auto text-white">›</span>}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

// Step 1: Type, Title, Abstract
function Step1({ paperType, setPaperType, title, setTitle, abstract, setAbstract, wordCount }) {
  return (
    <div className="space-y-8">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-sm text-amber-800">
          <strong>NOTE:</strong> To ensure anonymous review, when you submit a revision do NOT place any author identifying information in the 'Response to Decision Letter' box.
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-3">
          <span className="text-red-500">*</span> Type
        </label>
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Choice</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {PAPER_TYPES.map((type) => (
                <tr key={type.id} className={`hover:bg-slate-50 transition cursor-pointer ${paperType === type.id ? "bg-sky-50" : ""}`} onClick={() => setPaperType(type.id)}>
                  <td className="px-4 py-3">
                    <input type="radio" name="paperType" checked={paperType === type.id} onChange={() => setPaperType(type.id)} className="w-4 h-4 text-sky-600" />
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-800">{type.label}</td>
                  <td className="px-4 py-3 text-sm text-slate-500 italic">{type.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-semibold text-slate-900"><span className="text-red-500">*</span> Title</label>
          <span className="text-xs text-slate-500">{wordCount(title)} OUT OF 25 WORDS</span>
        </div>
        <textarea
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          rows={2}
          className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
          placeholder="Enter your manuscript title..."
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-semibold text-slate-900"><span className="text-red-500">*</span> Abstract</label>
          <span className="text-xs text-slate-500">{wordCount(abstract)} OUT OF 300 WORDS</span>
        </div>
        <textarea
          value={abstract}
          onChange={(e) => setAbstract(e.target.value)}
          rows={8}
          className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
          placeholder="Write or paste your abstract here..."
        />
      </div>
    </div>
  );
}

// Step 2: File Upload
function Step2({ files, handleFileUpload, updateFileDesignation, removeFile }) {
  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-sm text-amber-800 font-semibold mb-2">UPLOAD INSTRUCTIONS:</p>
        <ol className="text-sm text-amber-800 list-decimal list-inside space-y-1">
          <li>Upload your manuscript as "Main Document (PDF)" or "Main Document (Word)" as the first file.</li>
          <li>Upload additional files selecting the appropriate designation.</li>
          <li>Maximum file size: 100MB per file.</li>
        </ol>
      </div>

      {files.length > 0 && (
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Order</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">File</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase"><span className="text-red-500">*</span> File Designation</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Upload Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {files.map((file, idx) => (
                <tr key={file.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm text-slate-600">{idx + 1}</td>
                  <td className="px-4 py-3 text-sm text-slate-800">{file.name} <span className="text-slate-500">({file.size})</span></td>
                  <td className="px-4 py-3">
                    <select
                      value={file.designation}
                      onChange={(e) => updateFileDesignation(file.id, e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500"
                    >
                      <option value="">Choose File Designation...</option>
                      {FILE_DESIGNATIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{file.uploadDate}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => removeFile(file.id)} className="text-red-600 hover:text-red-800 text-sm font-medium">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-sky-400 transition">
        <input type="file" id="fileUpload" multiple onChange={handleFileUpload} className="hidden" accept=".pdf,.doc,.docx,.zip" />
        <label htmlFor="fileUpload" className="cursor-pointer">
          <div className="text-slate-400 mb-3">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <p className="text-sm text-slate-600 font-medium">Click to upload files</p>
          <p className="text-xs text-slate-500 mt-1">PDF, DOC, DOCX, ZIP up to 100MB</p>
        </label>
      </div>
    </div>
  );
}

// Step 3: Attributes/Keywords
function Step3({ keywords, keywordInput, setKeywordInput, addKeyword, removeKeyword }) {
  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-600">Select your manuscript attributes/keywords. After you add your keywords, click "Save and Continue" below.</p>
      
      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2"><span className="text-red-500">*</span> Keywords</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
            placeholder="Enter a keyword..."
            className="flex-1 px-4 py-3 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-sky-500"
          />
          <button onClick={addKeyword} className="px-5 py-3 bg-slate-800 text-white rounded-xl text-sm font-medium hover:bg-slate-700 transition">+ Add</button>
        </div>
      </div>

      {keywords.length >= 6 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-sm text-amber-800">⚠ The maximum number of 6 keywords has been reached. To add more, remove a current selection.</p>
        </div>
      )}

      <div className="flex justify-end">
        <span className="text-xs bg-slate-100 px-3 py-1 rounded-full text-slate-600">REQUIRED 2, MAX 6</span>
      </div>

      {keywords.length > 0 && (
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
            <span className="text-xs font-semibold text-slate-600 uppercase">Keywords</span>
          </div>
          <div className="divide-y divide-slate-100">
            {keywords.map((kw, idx) => (
              <div key={idx} className="flex justify-between items-center px-4 py-3 hover:bg-slate-50">
                <span className="text-sm text-slate-800">{kw}</span>
                <button onClick={() => removeKeyword(idx)} className="text-red-600 hover:text-red-800 text-sm font-medium">× Remove</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Step 4: Authors & Institutions
function Step4({ authors, addAuthor, updateAuthor, removeAuthor, moveAuthor }) {
  const [verifyingIdx, setVerifyingIdx] = useState(null);
  const [verifiedEmails, setVerifiedEmails] = useState({});

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleVerifyEmail = async (idx, email) => {
    if (!email) {
      toast.error("Please enter an email address first");
      return;
    }
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email format");
      return;
    }

    setVerifyingIdx(idx);
    
    // Simulate SMTP / Domain check for "Working Email"
    // In a real app, this would call a backend service that pings the mail server
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Basic check: common fake domains
      const fakeDomains = ['test.com', 'example.com', 'none.com', 'asdf.com'];
      const domain = email.split('@')[1];
      
      if (fakeDomains.includes(domain)) {
        toast.error("This email domain seems inactive or invalid.");
        setVerifiedEmails(prev => ({ ...prev, [idx]: 'invalid' }));
      } else {
        toast.success("Email verified successfully!");
        setVerifiedEmails(prev => ({ ...prev, [idx]: 'valid' }));
      }
    } catch (error) {
      toast.error("Verification failed. Please try again.");
    } finally {
      setVerifyingIdx(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-sm text-amber-800">
          <strong>IMPORTANT!</strong> Please do not use ALL CAPS when typing your name, institution, or any other information. Every user must have a working email.
        </p>
      </div>

      <div className="space-y-4">
        {authors.map((author, idx) => (
          <div key={idx} className="border border-slate-200 rounded-xl p-5 bg-slate-50/50">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-1">
                  <button onClick={() => moveAuthor(idx, -1)} disabled={idx === 0} className="text-slate-400 hover:text-slate-600 disabled:opacity-30">▲</button>
                  <button onClick={() => moveAuthor(idx, 1)} disabled={idx === authors.length - 1} className="text-slate-400 hover:text-slate-600 disabled:opacity-30">▼</button>
                </div>
                <span className="text-sm font-semibold text-slate-700">Author {author.order}</span>
                {author.isCorresponding && <span className="text-xs bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full">Corresponding</span>}
              </div>
              {authors.length > 1 && (
                <button onClick={() => removeAuthor(idx)} className="text-red-600 hover:text-red-800 text-sm font-medium">Remove</button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="First Name *" value={author.firstName} onChange={(e) => updateAuthor(idx, 'firstName', e.target.value)} className="px-4 py-2.5 border border-slate-300 rounded-lg text-sm" />
              <input type="text" placeholder="Last Name *" value={author.lastName} onChange={(e) => updateAuthor(idx, 'lastName', e.target.value)} className="px-4 py-2.5 border border-slate-300 rounded-lg text-sm" />
              
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="Email *" 
                  value={author.email} 
                  onChange={(e) => {
                    updateAuthor(idx, 'email', e.target.value);
                    if (verifiedEmails[idx]) {
                      const newVerified = { ...verifiedEmails };
                      delete newVerified[idx];
                      setVerifiedEmails(newVerified);
                    }
                  }} 
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm pr-20 ${
                    verifiedEmails[idx] === 'valid' ? 'border-emerald-500 bg-emerald-50' : 
                    verifiedEmails[idx] === 'invalid' ? 'border-red-500 bg-red-50' : 'border-slate-300'
                  }`} 
                />
                <div className="absolute right-2 top-1.5 flex items-center gap-1">
                  {verifyingIdx === idx ? (
                    <div className="w-4 h-4 border-2 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
                  ) : verifiedEmails[idx] === 'valid' ? (
                    <span className="text-emerald-600 text-xs font-bold">✓ Verified</span>
                  ) : (
                    <button 
                      onClick={() => handleVerifyEmail(idx, author.email)}
                      className="text-[10px] bg-sky-600 text-white px-2 py-1 rounded hover:bg-sky-700 transition font-bold"
                    >
                      VERIFY
                    </button>
                  )}
                </div>
              </div>

              <input type="text" placeholder="ORCID (0000-0000-0000-0000)" value={author.orcid} onChange={(e) => updateAuthor(idx, 'orcid', e.target.value)} className="px-4 py-2.5 border border-slate-300 rounded-lg text-sm" />
              <input type="text" placeholder="Institution *" value={author.institution} onChange={(e) => updateAuthor(idx, 'institution', e.target.value)} className="col-span-2 px-4 py-2.5 border border-slate-300 rounded-lg text-sm" />
              <input type="text" placeholder="City" value={author.city} onChange={(e) => updateAuthor(idx, 'city', e.target.value)} className="px-4 py-2.5 border border-slate-300 rounded-lg text-sm" />
              <input type="text" placeholder="Country" value={author.country} onChange={(e) => updateAuthor(idx, 'country', e.target.value)} className="px-4 py-2.5 border border-slate-300 rounded-lg text-sm" />
            </div>
          </div>
        ))}
      </div>

      <button onClick={addAuthor} className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-600 font-medium hover:border-sky-400 hover:text-sky-600 transition">
        + Add Another Author
      </button>
    </div>
  );
}

// Step 5: Reviewers & Editors
function Step5({ suggestedReviewers, setSuggestedReviewers, opposedReviewers, setOpposedReviewers }) {
  const addReviewer = (type) => {
    const list = type === 'suggested' ? suggestedReviewers : opposedReviewers;
    const setList = type === 'suggested' ? setSuggestedReviewers : setOpposedReviewers;
    setList([...list, { name: '', email: '', institution: '' }]);
  };

  const updateReviewer = (type, idx, field, value) => {
    const list = type === 'suggested' ? [...suggestedReviewers] : [...opposedReviewers];
    const setList = type === 'suggested' ? setSuggestedReviewers : setOpposedReviewers;
    list[idx][field] = value;
    setList(list);
  };

  const removeReviewer = (type, idx) => {
    const list = type === 'suggested' ? suggestedReviewers : opposedReviewers;
    const setList = type === 'suggested' ? setSuggestedReviewers : setOpposedReviewers;
    setList(list.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-8">
      <p className="text-sm text-slate-600">You may suggest or oppose reviewers. This is optional but helps the editorial team.</p>

      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Suggested Reviewers (Optional)</h3>
        {suggestedReviewers.map((r, idx) => (
          <div key={idx} className="grid grid-cols-3 gap-3 mb-3">
            <input type="text" placeholder="Name" value={r.name} onChange={(e) => updateReviewer('suggested', idx, 'name', e.target.value)} className="px-4 py-2.5 border border-slate-300 rounded-lg text-sm" />
            <input type="email" placeholder="Email" value={r.email} onChange={(e) => updateReviewer('suggested', idx, 'email', e.target.value)} className="px-4 py-2.5 border border-slate-300 rounded-lg text-sm" />
            <div className="flex gap-2">
              <input type="text" placeholder="Institution" value={r.institution} onChange={(e) => updateReviewer('suggested', idx, 'institution', e.target.value)} className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg text-sm" />
              <button onClick={() => removeReviewer('suggested', idx)} className="text-red-600 px-2">×</button>
            </div>
          </div>
        ))}
        <button onClick={() => addReviewer('suggested')} className="text-sky-600 text-sm font-medium hover:text-sky-800">+ Add Suggested Reviewer</button>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Opposed Reviewers (Optional)</h3>
        {opposedReviewers.map((r, idx) => (
          <div key={idx} className="grid grid-cols-3 gap-3 mb-3">
            <input type="text" placeholder="Name" value={r.name} onChange={(e) => updateReviewer('opposed', idx, 'name', e.target.value)} className="px-4 py-2.5 border border-slate-300 rounded-lg text-sm" />
            <input type="email" placeholder="Email" value={r.email} onChange={(e) => updateReviewer('opposed', idx, 'email', e.target.value)} className="px-4 py-2.5 border border-slate-300 rounded-lg text-sm" />
            <div className="flex gap-2">
              <input type="text" placeholder="Institution" value={r.institution} onChange={(e) => updateReviewer('opposed', idx, 'institution', e.target.value)} className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg text-sm" />
              <button onClick={() => removeReviewer('opposed', idx)} className="text-red-600 px-2">×</button>
            </div>
          </div>
        ))}
        <button onClick={() => addReviewer('opposed')} className="text-sky-600 text-sm font-medium hover:text-sky-800">+ Add Opposed Reviewer</button>
      </div>
    </div>
  );
}

// Step 6: Details & Comments (Enhanced)
function Step6({ 
  coverLetterText, setCoverLetterText, coverLetterFile, setCoverLetterFile,
  hasFunding, setHasFunding, funders, setFunders,
  wasConferenceAccepted, setWasConferenceAccepted, conferenceName, setConferenceName,
  hasSupplementaryMaterials, setHasSupplementaryMaterials,
  confirmPlagiarismPolicy, setConfirmPlagiarismPolicy,
  confirmPaperAccuracy, setConfirmPaperAccuracy
}) {
  const addFunder = () => {
    setFunders([...funders, { name: '', grantNumber: '' }]);
  };

  const updateFunder = (idx, field, value) => {
    const updated = [...funders];
    updated[idx][field] = value;
    setFunders(updated);
  };

  const removeFunder = (idx) => {
    setFunders(funders.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-8">
      <p className="text-sm text-slate-600">
        Enter or paste your cover letter text into the "Cover Letter" box below. If you would like to attach a file containing your cover letter, click the "Select File" button. Answer any remaining questions appropriately.
      </p>
      <p className="text-xs text-red-500">* = Required Fields</p>

      {/* Cover Letter Section */}
      <div className="border-t border-slate-200 pt-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Cover Letter</h3>
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">Write Cover Letter</label>
          <div className="flex gap-2 mb-2">
            <button type="button" className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs text-slate-700 hover:bg-slate-50">Preview</button>
            <button type="button" className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs text-slate-700 hover:bg-slate-50">Ω Special Characters</button>
          </div>
          <div className="relative">
            <textarea
              value={coverLetterText}
              onChange={(e) => setCoverLetterText(e.target.value)}
              rows={6}
              maxLength={32768}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-sky-500"
              placeholder="Enter your cover letter here..."
            />
            <span className="absolute bottom-2 right-3 text-xs text-slate-400">{coverLetterText.length} OUT OF 32768 CHARACTERS</span>
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-semibold text-slate-900 mb-2">Upload Cover Letter</label>
          <div className="flex gap-3">
            <label className="cursor-pointer">
              <span className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-50">
                📄 1. Select File
              </span>
              <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={(e) => setCoverLetterFile(e.target.files[0])} />
            </label>
            {coverLetterFile && (
              <span className="flex items-center gap-2 text-sm text-emerald-600">
                ✓ {coverLetterFile.name}
                <button onClick={() => setCoverLetterFile(null)} className="text-red-500 hover:text-red-700">×</button>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Funding Section */}
      <div className="border-t border-slate-200 pt-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Funding</h3>
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-3">
            <span className="text-red-500">*</span> Is there funding to report for this submission?
          </label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="hasFunding" checked={hasFunding === true} onChange={() => setHasFunding(true)} className="w-4 h-4 text-sky-600" />
              <span className="text-sm text-slate-700">Yes</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="hasFunding" checked={hasFunding === false} onChange={() => setHasFunding(false)} className="w-4 h-4 text-sky-600" />
              <span className="text-sm text-slate-700">No</span>
            </label>
          </div>
        </div>
        {hasFunding && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-3">Funders</h4>
            {funders.length > 0 ? (
              <div className="border border-slate-200 rounded-xl overflow-hidden mb-3">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600 uppercase">Actions</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600 uppercase">Funder</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600 uppercase">Grant / Award Number</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {funders.map((f, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-2">
                          <button onClick={() => removeFunder(idx)} className="text-red-600 hover:text-red-800 text-sm">Remove</button>
                        </td>
                        <td className="px-4 py-2">
                          <input type="text" value={f.name} onChange={(e) => updateFunder(idx, 'name', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" placeholder="Funder name" />
                        </td>
                        <td className="px-4 py-2">
                          <input type="text" value={f.grantNumber} onChange={(e) => updateFunder(idx, 'grantNumber', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" placeholder="Grant number" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic mb-3">No Funders Entered</p>
            )}
            <button onClick={addFunder} className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-50">Add Funder</button>
          </div>
        )}
      </div>

      {/* Conference Acceptance */}
      <div className="border-t border-slate-200 pt-6">
        <label className="block text-sm font-semibold text-slate-900 mb-3">
          <span className="text-red-500">*</span> Has this manuscript been accepted to a conference previously?
        </label>
        <div className="flex gap-6 mb-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="conferenceAccepted" checked={wasConferenceAccepted === true} onChange={() => setWasConferenceAccepted(true)} className="w-4 h-4 text-sky-600" />
            <span className="text-sm text-slate-700">Yes</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="conferenceAccepted" checked={wasConferenceAccepted === false} onChange={() => setWasConferenceAccepted(false)} className="w-4 h-4 text-sky-600" />
            <span className="text-sm text-slate-700">No</span>
          </label>
        </div>
        {wasConferenceAccepted && (
          <div>
            <label className="block text-sm text-amber-700 mb-2">If yes, what conference?</label>
            <input
              type="text"
              value={conferenceName}
              onChange={(e) => setConferenceName(e.target.value)}
              className="w-full max-w-md px-4 py-3 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-sky-500"
              placeholder="Conference name"
            />
            <p className="mt-2 text-xs text-amber-600 bg-amber-50 p-3 rounded-lg">
              Please upload conference paper with brief statement detailing difference between the first submission and this extended version. Upload file to supplementary files not for review.
            </p>
          </div>
        )}
      </div>

      {/* Supplementary Materials */}
      <div className="border-t border-slate-200 pt-6">
        <label className="block text-sm font-semibold text-slate-900 mb-3">Do you have electronic supplementary materials?</label>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="supplementary" checked={hasSupplementaryMaterials === true} onChange={() => setHasSupplementaryMaterials(true)} className="w-4 h-4 text-sky-600" />
            <span className="text-sm text-slate-700">Yes</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="supplementary" checked={hasSupplementaryMaterials === false} onChange={() => setHasSupplementaryMaterials(false)} className="w-4 h-4 text-sky-600" />
            <span className="text-sm text-slate-700">No</span>
          </label>
        </div>
      </div>

      {/* Plagiarism Policy */}
      <div className="border-t border-slate-200 pt-6">
        <label className="block text-sm font-semibold text-slate-900 mb-3">
          <span className="text-red-500">*</span> Plagiarism Policy
        </label>
        <label className="flex items-start gap-3 p-4 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer">
          <input type="checkbox" checked={confirmPlagiarismPolicy} onChange={(e) => setConfirmPlagiarismPolicy(e.target.checked)} className="mt-1 w-4 h-4 text-sky-600" />
          <span className="text-sm text-slate-700">
            <span className="text-red-500">*</span> The journal uses automated plagiarism checking services. Any submission is subject to such a check. Confirm that you are familiar with the journal's Plagiarism Policy.
          </span>
        </label>
      </div>

      {/* Confirm Accuracy */}
      <div className="border-t border-slate-200 pt-6">
        <h4 className="text-sm font-semibold text-slate-900 mb-3">CONFIRM ACCURACY OF PAPER INFORMATION:</h4>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
          <p className="text-sm text-amber-800">
            If your submitted manuscript is accepted for publication, the author list, author order, contact author, and all departments and affiliations as they have been entered by you in Steps 1-4 of the online author submission form, and as they are listed on the final confirmation page, are <strong>exactly how they will appear in your published article</strong>.
          </p>
        </div>
        <label className="flex items-start gap-3 p-4 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer">
          <input type="checkbox" checked={confirmPaperAccuracy} onChange={(e) => setConfirmPaperAccuracy(e.target.checked)} className="mt-1 w-4 h-4 text-sky-600" />
          <span className="text-sm text-slate-700">
            <span className="text-red-500">*</span> To confirm that you have reviewed all title, author, and affiliation information in the submission form and the manuscript for accuracy, and approve its exact use in the final, published article, please check the box to the right.
          </span>
        </label>
      </div>
    </div>
  );
}

// Step 7: Review & Submit (Enhanced with Verification)
function Step7({ 
  paperType, title, abstract, keywords, authors, files,
  coverLetterText, coverLetterFile, hasFunding, funders,
  wasConferenceAccepted, conferenceName, hasSupplementaryMaterials,
  confirmPlagiarismPolicy, confirmPaperAccuracy,
  goToStep, hasViewedProof, setHasViewedProof, previewLoading, setPreviewLoading,
  wantsReviewerRole, setWantsReviewerRole
}) {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [showPdfModal, setShowPdfModal] = useState(false);

  const handlePreviewPDF = async () => {
    setPreviewLoading(true);
    try {
      // Get manuscript file (first file with "Main Document" designation, or first PDF)
      const manuscriptFile = files.find(f => f.designation?.includes('Main Document')) || files.find(f => f.name?.endsWith('.pdf')) || files[0];
      
      if (!manuscriptFile || !manuscriptFile.file) {
        alert('Please upload a manuscript file in Step 2 to generate a preview.');
        setPreviewLoading(false);
        return;
      }

      // Create FormData for the API call
      const formData = new FormData();
      formData.append('manuscript', manuscriptFile.file);
      
      // Add cover letter if exists
      if (coverLetterFile) {
        formData.append('coverLetter', coverLetterFile);
      } else if (coverLetterText) {
        const coverLetterBlob = new Blob([coverLetterText], { type: 'text/plain' });
        formData.append('coverLetter', coverLetterBlob, 'cover-letter.txt');
      } else {
        const emptyBlob = new Blob(['Cover Letter: Not Provided'], { type: 'text/plain' });
        formData.append('coverLetter', emptyBlob, 'cover-letter.txt');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/merge-preview`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const pdfBlob = new Blob([blob], { type: 'application/pdf' });
        const url = URL.createObjectURL(pdfBlob);
        setPdfUrl(url);
        setShowPdfModal(true);
        setHasViewedProof(true);
      } else {
        const errorText = await response.text();
        console.error('PDF generation error:', errorText);
        alert('Failed to generate PDF preview. Please ensure your files are valid PDF or Word documents.');
      }
    } catch (error) {
      console.error('Preview error:', error);
      alert('Error generating preview: ' + error.message);
    }
    setPreviewLoading(false);
  };

  const closePdfModal = () => {
    setShowPdfModal(false);
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
  };

  const StepSummary = ({ stepNum, stepTitle, children }) => (
    <div className="border border-slate-200 rounded-xl overflow-hidden mb-4">
      <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex justify-between items-center">
        <span className="font-semibold text-slate-800 flex items-center gap-2">
          <span className="text-emerald-600">✓</span> Step {stepNum}: {stepTitle}
        </span>
        <button onClick={() => goToStep(stepNum)} className="px-3 py-1 border border-slate-300 rounded-lg text-xs text-slate-600 hover:bg-white">✎ Edit</button>
      </div>
      <div className="p-5">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase pb-2 w-1/3">Field</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase pb-2">Response</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {children}
          </tbody>
        </table>
      </div>
    </div>
  );

  const Row = ({ label, value }) => (
    <tr>
      <td className="py-3 text-sm font-medium text-slate-600 align-top">{label}</td>
      <td className="py-3 text-sm text-slate-800">{value || <span className="text-slate-400 italic">Not provided</span>}</td>
    </tr>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-sky-700"><span className="text-red-500">*</span> Verify Step Information</h2>

      {/* Step 1 Summary */}
      <StepSummary stepNum={1} stepTitle="Type, Title, & Abstract">
        <Row label="Manuscript Type" value={PAPER_TYPES.find(p => p.id === paperType)?.label} />
        <Row label="Title" value={title} />
        <Row label="Abstract" value={
          abstract.length > 200 
            ? <><span>{abstract.slice(0, 200)}...</span> <button className="text-sky-600 text-xs">More...</button></>
            : abstract
        } />
      </StepSummary>

      {/* Step 2 Summary */}
      <StepSummary stepNum={2} stepTitle="File Upload">
        {files.map((f, i) => (
          <Row key={i} label={`File ${i + 1}`} value={<a href="#" className="text-sky-600 hover:underline">{f.name}</a>} />
        ))}
        {files.length === 0 && <Row label="Files" value="No files uploaded" />}
      </StepSummary>

      {/* Step 3 Summary */}
      <StepSummary stepNum={3} stepTitle="Attributes">
        <Row label="Keywords" value={
          keywords.length > 0 ? (
            <ul className="list-disc list-inside">
              {keywords.map((k, i) => <li key={i}>{k}</li>)}
            </ul>
          ) : "No keywords added"
        } />
      </StepSummary>

      {/* Step 4 Summary */}
      <StepSummary stepNum={4} stepTitle="Authors & Institutions">
        {authors.map((a, i) => (
          <Row key={i} label={`Author ${i + 1}`} value={
            <div>
              <div className="font-medium">{a.firstName} {a.lastName}</div>
              <div className="text-sky-600">{a.email}</div>
              {a.orcid && <div className="text-slate-500 flex items-center gap-1"><span className="text-emerald-600">ℹ</span> {a.orcid} ✓</div>}
              <div className="text-slate-600 mt-1">{a.institution}{a.city && `, ${a.city}`}{a.country && `, ${a.country}`}</div>
            </div>
          } />
        ))}
      </StepSummary>

      {/* Step 5 Summary */}
      <StepSummary stepNum={5} stepTitle="Reviewers & Editors">
        <Row label="Reviewers" value="See step for details" />
      </StepSummary>

      {/* Step 6 Summary */}
      <StepSummary stepNum={6} stepTitle="Details & Comments">
        <Row label="Cover Letter" value={coverLetterText || coverLetterFile?.name || "Not provided"} />
        <Row label="Funding" value={hasFunding ? `${funders.length} funder(s) reported` : "There are no funders to report for this submission"} />
      </StepSummary>

      {/* Conference & Supplementary Questions */}
      <div className="border-t border-slate-200 pt-6">
        <div className="mb-4">
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            <span className="text-red-500">*</span> Has this manuscript been accepted to a conference previously?
          </label>
          <p className="text-sm text-slate-800 ml-4">{wasConferenceAccepted ? "Yes" : "No"}</p>
          {wasConferenceAccepted && conferenceName && (
            <>
              <label className="block text-sm text-amber-700 mt-2 mb-1">If yes, what conference?</label>
              <p className="text-sm text-slate-800 ml-4">{conferenceName}</p>
            </>
          )}
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
          <p className="text-xs text-amber-700">
            Please upload conference paper with brief statement detailing difference between the first submission and this extended version. Upload file to supplementary files not for review.
          </p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-slate-900 mb-2">Do you have electronic supplementary materials?</label>
          <p className="text-sm text-slate-800 ml-4 flex items-center gap-2">
            {hasSupplementaryMaterials ? "Yes" : <><span className="text-emerald-600">✓</span> No</>}
          </p>
        </div>
      </div>

      {/* Plagiarism Policy Confirmation */}
      <div className="border-t border-slate-200 pt-6">
        <label className="block text-sm font-semibold text-slate-900 mb-3">
          <span className="text-red-500">*</span> Plagiarism Policy
        </label>
        <p className="text-sm text-slate-700 flex items-start gap-2">
          {confirmPlagiarismPolicy ? (
            <span className="text-emerald-600 mt-0.5">✓</span>
          ) : (
            <span className="text-amber-500 mt-0.5">○</span>
          )}
          <span>The journal uses automated plagiarism checking services. Any submission is subject to such a check. Confirm that you are familiar with the journal's Plagiarism Policy.</span>
        </p>
      </div>

      {/* Confirm Accuracy */}
      <div className="border-t border-slate-200 pt-6">
        <h4 className="text-sm font-semibold text-slate-900 mb-3">CONFIRM ACCURACY OF PAPER INFORMATION:</h4>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
          <p className="text-sm text-amber-800">
            If your submitted manuscript is accepted for publication, the author list, author order, contact author, and all departments and affiliations as they have been entered by you in Steps 1-4 of the online author submission form, and as they are listed on the final confirmation page, are <strong>exactly how they will appear in your published article</strong>.
          </p>
        </div>
        <p className="text-sm text-slate-700 flex items-start gap-2">
          {confirmPaperAccuracy ? (
            <span className="text-emerald-600 mt-0.5">✓</span>
          ) : (
            <span className="text-amber-500 mt-0.5">○</span>
          )}
          <span>To confirm that you have reviewed all title, author, and affiliation information in the submission form and the manuscript for accuracy, and approve its exact use in the final, published article.</span>
        </p>
      </div>

      {/* Become a Reviewer Section */}
      <div className="border-t border-slate-200 pt-6">
        <h4 className="text-sm font-semibold text-slate-900 mb-3">CONTRIBUTION OPPORTUNITY:</h4>
        <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 mb-4">
          <p className="text-sm text-sky-800 italic">
            "Your expertise is valuable to our community. By becoming a reviewer, you help maintain the high standards of our journal and stay at the forefront of research in your field."
          </p>
        </div>
        <label className="flex items-start gap-3 p-4 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group">
          <input 
            type="checkbox" 
            checked={wantsReviewerRole} 
            onChange={(e) => setWantsReviewerRole(e.target.checked)} 
            className="mt-1 w-4 h-4 text-sky-600 rounded focus:ring-sky-500" 
          />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-900 group-hover:text-sky-700 transition-colors">
              I wish to become a reviewer for this journal.
            </span>
            <span className="text-xs text-slate-500 mt-1">
              By checking this box, your account will be upgraded to the Reviewer role upon successful submission.
            </span>
          </div>
        </label>
      </div>

      {/* View Proof Section */}
      <div className="border-t border-slate-200 pt-6">
        <h3 className="text-xl font-bold text-sky-700 mb-4"><span className="text-red-500">*</span> View Proof</h3>
        <p className="text-sm text-slate-700 mb-4">You must view the PDF proof before you can submit</p>
        <div className="flex gap-3">
          <button
            onClick={handlePreviewPDF}
            disabled={previewLoading}
            className={`px-6 py-3 rounded-lg text-sm font-semibold transition flex items-center gap-2 ${
              hasViewedProof 
                ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                : 'bg-sky-600 text-white hover:bg-sky-700'
            }`}
          >
            {previewLoading ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating PDF...
              </>
            ) : (
              <>
                {hasViewedProof && <span>✓</span>}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Preview PDF
              </>
            )}
          </button>
        </div>
        {hasViewedProof && <p className="text-sm text-emerald-600 mt-3 flex items-center gap-1"><span>✓</span> PDF proof viewed successfully</p>}
      </div>

      {/* PDF Preview Modal - ScholarOne Style Redesign */}
      {showPdfModal && pdfUrl && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-8">
          <div className="bg-white w-full h-full max-w-6xl rounded-lg shadow-2xl flex flex-col overflow-hidden border border-slate-300">
            {/* Window Header */}
            <div className="bg-[#f0f0f0] border-b border-slate-300 px-4 py-2 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                </div>
                <span className="ml-4 text-xs font-medium text-slate-500 truncate max-w-md">
                  mc.manuscriptcentral.com/methods?DOWNLOAD=TRUE&PARAMS=...
                </span>
              </div>
              <button 
                onClick={closePdfModal}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Left Sidebar */}
              <div className="w-64 bg-[#f8f9fa] border-r border-slate-200 flex flex-col p-4 overflow-y-auto">
                <p className="text-[10px] leading-relaxed text-slate-600 mb-6">
                  Below is a list of the files that were uploaded as well as a summary / cover page. Click on a file name to view the proof of that file. Files are listed in the order specified by the author.
                </p>

                <div className="mb-6">
                  <h3 className="text-xs font-bold text-slate-900 border-b border-slate-300 pb-1 mb-3 uppercase tracking-wider">
                    Files Uploaded
                  </h3>
                  <div className="space-y-2">
                    {files.map((f, i) => (
                      <div key={i} className="flex items-start gap-2 group cursor-pointer">
                        <span className="text-sky-600 mt-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                          </svg>
                        </span>
                        <span className="text-[11px] text-slate-700 group-hover:text-sky-700 group-hover:underline break-all">
                          {f.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-xs font-bold text-slate-900 border-b border-slate-300 pb-1 mb-3 uppercase tracking-wider">
                    Other
                  </h3>
                  <div className="flex items-start gap-2 group cursor-pointer">
                    <span className="text-sky-600 mt-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                      </svg>
                    </span>
                    <span className="text-[11px] text-slate-700 group-hover:text-sky-700 group-hover:underline">
                      Cover & Metadata
                    </span>
                  </div>
                </div>

                <div className="mt-auto pt-6">
                  <button 
                    onClick={closePdfModal}
                    className="w-full flex items-center justify-center gap-2 px-3 py-1.5 border border-slate-300 bg-white rounded text-[11px] font-medium text-slate-700 hover:bg-slate-50 transition shadow-sm"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Close Window
                  </button>
                </div>
              </div>

              {/* Main PDF Content Area */}
              <div className="flex-1 bg-slate-100 flex flex-col">
                {/* PDF Toolbar Mimic */}
                <div className="bg-[#525659] px-4 py-2 flex justify-between items-center text-white">
                  <span className="text-[11px] font-medium opacity-90">{files.find(f => f.designation?.includes('Main'))?.name || 'Manuscript.pdf'}</span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-[11px]">
                      <button className="hover:bg-white/10 p-1 rounded">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 relative">
                  <iframe
                    src={`${pdfUrl}#toolbar=0&navpanes=0`}
                    className="w-full h-full border-none"
                    title="PDF Proof Preview"
                  />
                  
                  {/* Watermark overlay (Optional, but looks professional) */}
                  <div className="absolute top-4 right-4 pointer-events-none opacity-20 rotate-12">
                     <span className="text-4xl font-black text-slate-400 select-none">PROOF</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
