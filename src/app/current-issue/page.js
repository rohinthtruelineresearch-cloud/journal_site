"use client";

import Link from "next/link";
import { currentIssue, journalInfo } from "@/data/journal";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function CurrentIssueContent() {
  const searchParams = useSearchParams();
  const volumeParam = searchParams.get('volume');
  const issueParam = searchParams.get('issue');
  const isDetailView = volumeParam && issueParam;

  // State for List View
  const [issues, setIssues] = useState([]);
  const [expandedVolume, setExpandedVolume] = useState(null);

  // State for Detail View
  const [publishedArticles, setPublishedArticles] = useState([]);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (isDetailView) {
            // Fetch Articles for Detail View
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles`);
            if (!res.ok) throw new Error("Failed to fetch articles");
            const data = await res.json();
            const safeData = Array.isArray(data) ? data : [];
            
            // Construct issue string, e.g., "Vol 1, Issue 2"
            // Note: Ensure this matches backend format exactly.
            // Backend saves as `Vol ${volume}, Issue ${issue}`
            const targetIssueStr = `Vol ${volumeParam}, Issue ${issueParam}`;
            
            const filtered = safeData.filter(article => 
                article.status === 'published' && 
                article.issue === targetIssueStr
            );
            setPublishedArticles(filtered);
        } else {
            // Fetch Issues for Archive View
            // We fetch all issues now since special issues are removed/hidden
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/issues`);
            if (!res.ok) throw new Error("Failed to fetch issues");
            const data = await res.json();
            setIssues(Array.isArray(data) ? data : []);
             // Default expand the first volume if available
            if (data.length > 0) {
                setExpandedVolume(data[0].volume);
            }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isDetailView, volumeParam, issueParam]);

  // Archive View Helpers
  const volumeGroups = issues.reduce((acc, issue) => {
    const vol = issue.volume;
    if (!acc[vol]) {
      acc[vol] = [];
    }
    acc[vol].push(issue);
    return acc;
  }, {});
  const sortedVolumes = Object.keys(volumeGroups).map(Number).sort((a, b) => b - a);
  const toggleVolume = (vol) => {
    setExpandedVolume(expandedVolume === vol ? null : vol);
  };


  // RENDER: DETAIL VIEW (Articles)
  if (isDetailView) {
      return (
        <div className="space-y-8">
            {/* Back Button */}
            <div>
                 <Link href="/current-issue" className="text-sm font-semibold text-slate-500 hover:text-slate-900">
                    &larr; Back to all issues
                 </Link>
            </div>

          <section className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 md:p-8 lg:p-12 shadow-[0_25px_70px_-38px_rgba(15,23,42,0.35)]">
            <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[10px] sm:text-xs uppercase tracking-[0.18em] text-slate-500">
                  Issue Details
                </p>
                <h1 className="mt-1.5 sm:mt-2 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-slate-900 leading-tight">
                  Volume {volumeParam}, Issue {issueParam}
                </h1>
                <p className="mt-1.5 sm:mt-2 max-w-3xl text-sm sm:text-base text-slate-600">
                   {/* We could fetch theme here if needed, for now generic text */}
                  Browse published research articles in this issue.
                </p>
              </div>
            </div>
          </section>
    
          <section className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1"> {/* Expanded to full width since sidebar was static */}
             {/* ... Citation box could go here ... */}
          </section>
    
          <section id="papers" className="space-y-3 sm:space-y-4">
            <div className="flex flex-col gap-1.5 sm:gap-2 md:flex-row md:items-center md:justify-between">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
                Papers in this issue
              </h2>
            </div>
            
            {loading ? (
              <div className="text-center py-10 text-slate-500">Loading published papers...</div>
            ) : publishedArticles.length === 0 ? (
              <div className="text-center py-10 text-slate-500">No papers published in this issue yet.</div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {publishedArticles.map((paper, idx) => (
                  <article
                    key={paper._id}
                    className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 md:p-6 shadow-[0_18px_60px_-50px_rgba(15,23,42,0.5)]"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                        <span className="rounded-full bg-slate-900 px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-semibold text-white">
                          Paper {paper.articleNumber || idx + 1}
                        </span>
                        <span className="text-[10px] sm:text-xs uppercase tracking-[0.16em] text-slate-500">
                          {paper.issue} · DOI {paper.doi || "Pending"}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {paper.pdfUrl && (
                          <a
                            href={`${process.env.NEXT_PUBLIC_API_URL}${paper.pdfUrl.startsWith('/') ? '' : '/'}${paper.pdfUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-full border border-slate-200 bg-white px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-semibold text-slate-700 transition hover:border-slate-300"
                          >
                            View Articles
                          </a>
                        )}
                      </div>
                    </div>
                    <h3 className="mt-2.5 sm:mt-3 text-base sm:text-lg font-semibold text-slate-900">
                      {paper.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600">
                      {Array.isArray(paper.authors) 
                        ? paper.authors.map(author => 
                            typeof author === 'string' 
                              ? author 
                              : `${author.firstName || ''} ${author.lastName || ''}`.trim()
                          ).filter(Boolean).join(", ") 
                        : paper.authors}
                    </p>
                    <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-slate-700">{paper.abstract}</p>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      );
  }

  // RENDER: LIST VIEW (Accordion)
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 md:text-4xl font-serif">
          List of issues from Aurora Journal of Systems Engineering
        </h1>
        <p className="mt-2 text-slate-600">
          Browse the list of issues and latest articles.
        </p>
      </div>



      {/* Accordion List */}
      <div className="rounded-sm border border-slate-200">
        {/* Latest Articles Link (Static) */}
        <div className="border-b border-slate-100 bg-slate-50/50 p-4">
             {/* This could point to the latest issue dynamically, for now just a placeholder link */}
             <a href="#" className="text-sm font-bold text-blue-900 hover:underline">
                 Latest articles
             </a>
        </div>

        {loading ? (
             <div className="p-8 text-center text-slate-500">Loading archive...</div>
        ) : (
            sortedVolumes.map((vol) => {
                const volIssues = volumeGroups[vol];
                const year = new Date(volIssues[0].publicationDate).getFullYear();
                const isExpanded = expandedVolume === vol;

                return (
                    <div key={vol} className="border-b border-slate-200 last:border-0">
                        {/* Volume Header */}
                        <button 
                            onClick={() => toggleVolume(vol)}
                            className={`flex w-full items-center justify-between px-4 py-4 text-left transition hover:bg-slate-50 ${isExpanded ? 'bg-blue-50/30' : ''}`}
                        >
                            <span className="text-sm font-bold text-blue-900">
                                Volume {vol} {year}
                            </span>
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-white">
                                {isExpanded ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                                        <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                                        <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                                    </svg>
                                )}
                            </span>
                        </button>

                        {/* Issues List (Expanded) */}
                        {isExpanded && (
                            <div className="bg-white">
                                {volIssues.map((issue) => (
                                    <div key={issue._id} className="border-t border-slate-100 px-4 py-3 pl-8">
                                        {/* Link to Detail View with Query Params */}
                                        <Link href={`/current-issue?volume=${issue.volume}&issue=${issue.issue}`} className="group block">
                                            <div className="text-sm font-bold text-blue-900 group-hover:underline">
                                                Issue {issue.issue}
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                {new Date(issue.publicationDate).getFullYear()}
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })
        )}
      </div>
    </div>
  );
}

export default function CurrentIssuePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CurrentIssueContent />
        </Suspense>
    );
}

