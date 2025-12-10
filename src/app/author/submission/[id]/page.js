"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
import AuthorHeader from "@/components/author/AuthorHeader";

function SubmissionDetailsContent() {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const params = useParams(); // Use useParams to get distinct params
  const { id } = params;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
        router.push("/login");
        return;
    }

    if (!id) return;

    const fetchArticle = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Failed to fetch article details");
            const data = await res.json();
            setArticle(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    fetchArticle();
  }, [id, router]);

  if (loading) return <div className="flex h-screen items-center justify-center text-slate-500">Loading details...</div>;
  if (error) return <div className="p-8 text-center text-red-600">Error: {error}</div>;
  if (!article) return <div className="p-8 text-center text-slate-500">Article not found</div>;

  return (
    <div className="min-h-screen bg-slate-50">
        <AuthorHeader user={JSON.parse(localStorage.getItem("user"))} />
        <main className="mx-auto max-w-4xl p-6 md:p-8">
            <button onClick={() => router.back()} className="mb-4 text-sm text-slate-500 hover:text-slate-700">
                ← Back to Dashboard
            </button>
            
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                     <h1 className="text-2xl font-bold text-slate-900">{article.title}</h1>
                     <div className="mt-2 flex items-center gap-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            article.status === 'published' ? 'bg-green-100 text-green-800' :
                            article.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                        }`}>
                            {article.status.replace('_', ' ')}
                        </span>
                        <span className="text-sm text-slate-500">
                            Submitted on {new Date(article.createdAt).toLocaleDateString()}
                        </span>
                     </div>
                </div>
                
                {article.status === 'revision_required' && article.reviewerComments && (
                    <div className="bg-orange-50 px-6 py-4 border-b border-orange-100">
                        <h3 className="text-sm font-bold text-orange-800 uppercase tracking-wide mb-2">Revision Instructions</h3>
                        <p className="text-sm text-orange-900 bg-white p-3 rounded-md border border-orange-200 shadow-sm">
                            {article.reviewerComments}
                        </p>
                    </div>
                )}
                
                <div className="p-6 space-y-6">
                    <div>
                        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">Abstract</h3>
                        <p className="mt-2 text-slate-700 leading-relaxed text-sm">
                            {article.abstract}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {/* Manuscript View */}
                         <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                             <h4 className="font-semibold text-slate-800 text-sm mb-2">Manuscript</h4>
                             {article.manuscriptUrl ? (
                                <a 
                                  href={`${process.env.NEXT_PUBLIC_API_URL}/${article.manuscriptUrl}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 text-sm text-sky-600 hover:text-sky-800 font-medium"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                    </svg>
                                    View PDF
                                </a>
                             ) : (
                                 <span className="text-sm text-slate-400 italic">No file uploaded</span>
                             )}
                         </div>

                         {/* Cover Letter View */}
                         <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                             <h4 className="font-semibold text-slate-800 text-sm mb-2">Cover Letter / CV</h4>
                             {article.coverLetterUrl ? (
                                <a 
                                  href={`${process.env.NEXT_PUBLIC_API_URL}/${article.coverLetterUrl}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 text-sm text-sky-600 hover:text-sky-800 font-medium"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                                    </svg>
                                    View Document
                                </a>
                             ) : (
                                 <span className="text-sm text-slate-400 italic">No file uploaded</span>
                             )}
                         </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
  );
}

export default function SubmissionDetailsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SubmissionDetailsContent />
        </Suspense>
    )
}
