"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function ArchivePage() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedVolume, setExpandedVolume] = useState(null);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/issues`);
        if (!res.ok) throw new Error("Failed to fetch issues");
        const data = await res.json();
        setIssues(data);
        
        // Default expand the first volume if available
        if (data.length > 0) {
            setExpandedVolume(data[0].volume);
        }
      } catch (error) {
        console.error("Error fetching issues:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  // Group issues by Volume
  const volumeGroups = issues.reduce((acc, issue) => {
    const vol = issue.volume;
    if (!acc[vol]) {
      acc[vol] = [];
    }
    acc[vol].push(issue);
    return acc;
  }, {});

  // Get sorted volume numbers (descending)
  const sortedVolumes = Object.keys(volumeGroups).map(Number).sort((a, b) => b - a);

  const toggleVolume = (vol) => {
    setExpandedVolume(expandedVolume === vol ? null : vol);
  };

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

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50">
        <button className="relative border-t-4 border-blue-900 bg-blue-900 px-8 py-4 text-sm font-bold text-white">
          All issues
          <div className="absolute bottom-[-8px] left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 bg-blue-900"></div>
        </button>
        <button className="px-8 py-4 text-sm font-bold text-slate-600 hover:text-slate-900">
          Special issues &gt;
        </button>
      </div>

      {/* Accordion List */}
      <div className="rounded-sm border border-slate-200">
        {/* Latest Articles Link (Static) */}
        <div className="border-b border-slate-100 bg-slate-50/50 p-4">
             <Link href="/current-issue" className="text-sm font-bold text-blue-900 hover:underline">
                 Latest articles
             </Link>
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

