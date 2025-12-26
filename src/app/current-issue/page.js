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
  const [expandedAbstracts, setExpandedAbstracts] = useState({});
  
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
            const targetIssueStr = `Vol ${volumeParam}, Issue ${issueParam}`;
            
            const filtered = safeData.filter(article => 
                article.status === 'published' && 
                article.issue === targetIssueStr
            );
            setPublishedArticles(filtered);
        } else {
            // Fetch Issues for Archive View
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

  const toggleAbstract = (id) => {
    setExpandedAbstracts(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // RENDER: DETAIL VIEW (Articles)
  if (isDetailView) {
    return (
      <div className="min-h-screen bg-white text-slate-900 pb-20">
        {/* Top Navigation / Breadcrumbs */}
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-medium text-slate-600">
          <div className="mx-auto flex max-w-[1200px] items-center gap-2">
            <Link href="/archive" className="hover:underline hover:text-blue-700">Journals & Books</Link>
            <span>/</span>
            <Link href="/" className="hover:underline hover:text-blue-700">{journalInfo.shortTitle}</Link>
            <span>/</span>
            <span className="text-slate-400">Volume {volumeParam}, Issue {issueParam}</span>
          </div>
        </div>

        <div className="mx-auto max-w-[1200px] px-4 py-8">
          {/* Back Link */}
          <div className="mb-4">
             <Link href="/archive" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#007398] transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Back to all issues
             </Link>
          </div>

          {/* Header Section */}
          <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-slate-200 pb-6">
            <div className="space-y-4">
               {/* Cover Image Placeholder */}
               <div className="flex gap-6">
                   <div className="hidden h-32 w-24 shrink-0 overflow-hidden rounded-sm shadow-md md:block border border-slate-100">
                      <img src="/journal-cover.jpg" alt="Journal Cover" className="h-full w-full object-cover" />
                   </div> 
                   <div className="space-y-2">
                        <h1 className="font-serif text-3xl font-bold text-slate-900 md:text-4xl">
                            Volume {volumeParam}, Issue {issueParam}
                        </h1>
                        <p className="text-sm text-slate-500">
                             In progress (Latest)
                        </p>
                        <p className="text-sm text-slate-600 max-w-2xl">
                             This issue contains articles that are final and fully citable.
                        </p>
                   </div>
               </div>
            </div>

            {/* Prev/Next Navigation */}
            <div className="flex items-center gap-1 self-start md:self-end bg-slate-100 p-1 rounded">
               <button disabled className="group flex items-center gap-1 rounded px-3 py-1.5 text-xs font-medium text-slate-400 disabled:cursor-not-allowed">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Previous vol/issue
               </button>
               <div className="h-4 w-px bg-slate-300"></div>
               <button disabled className="group flex items-center gap-1 rounded px-3 py-1.5 text-xs font-medium text-slate-400 disabled:cursor-not-allowed">
                  Next vol/issue
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
               </button>
            </div>
          </div>

          <div className="">
             {/* Main Content: Article List */}
             <div className="space-y-6">
                {loading ? (
                  <div className="py-12 text-center text-slate-500">Loading articles...</div>
                ) : publishedArticles.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 bg-slate-50 rounded italic">
                      No articles found for this issue.
                  </div>
                ) : (
                  <div className="space-y-8">
                     {publishedArticles.map((paper, idx) => {
                         const paperId = paper._id || idx;
                         const isExpanded = expandedAbstracts[paperId];
                         
                         return (
                        <div key={paperId} className="group relative flex gap-4 border-b border-slate-100 pb-8 last:border-0 pl-4">
                            
                            <div className="space-y-1.5 flex-1">
                                <div className="flex items-center gap-2">
                                     <div className="h-1.5 w-1.5 rounded-full bg-slate-300"></div>
                                     <span className="text-xs font-medium uppercase text-slate-500 tracking-wide">Research article</span>
                                     <span className="text-xs text-slate-400">•</span>
                                     <span className="text-xs text-slate-500">Article {paper.articleNumber || idx + 1}</span>
                                </div>
                                
                                <h3 className="font-serif text-lg font-medium text-[#007398] sm:text-xl group-hover:underline cursor-pointer">
                                    {paper.title}
                                </h3>

                                <div className="text-sm text-slate-600">
                                    {Array.isArray(paper.authors) 
                                        ? paper.authors.map(a => typeof a === 'string' ? a : `${a.firstName} ${a.lastName}`).join(", ") 
                                        : paper.authors}
                                </div>
                                
                                <div className="flex flex-wrap items-center gap-4 pt-2">
                                    <button 
                                      onClick={() => toggleAbstract(paperId)}
                                      className={`flex items-center gap-1 text-xs font-medium transition ${isExpanded ? 'text-[#007398] font-bold' : 'text-slate-600 hover:text-[#007398]'}`}
                                    >
                                        Abstract
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>

                                    
                                    {paper.pdfUrl && (
                                       <a 
                                         href={`${process.env.NEXT_PUBLIC_API_URL}${paper.pdfUrl.startsWith('/') ? '' : '/'}${paper.pdfUrl}`}
                                         target="_blank"
                                         rel="noopener noreferrer"
                                         className="flex items-center gap-1 text-xs font-bold text-[#007398] hover:underline"
                                       >
                                           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                                                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                           </svg>
                                           Download PDF
                                       </a>
                                    )}
                                </div>

                                {isExpanded && (
                                    <div className="mt-4 p-4 bg-slate-50 border-l-4 border-[#007398] text-sm text-slate-700 leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
                                        <h4 className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Abstract</h4>
                                        {paper.abstract || "No abstract available for this article."}
                                    </div>
                                )}
                            </div>
                        </div>
                     );})}
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>
    );
  }

  // RENDER: LIST VIEW (Accordion)
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                List of issues from Journal of AI Enabled Innovation and Discovery
              </h2>
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

