"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import AuthorHeader from "@/components/author/AuthorHeader";
import AuthorSidebar from "@/components/author/AuthorSidebar";
import SubmissionsTable from "@/components/author/SubmissionsTable";

function AuthorPageContent() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [filter, setFilter] = useState("active");
  const router = useRouter();

  useEffect(() => {
    const fetchMyArticles = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/my-articles`, {
             headers: {
                 Authorization: `Bearer ${token}`
             }
        });

        if (res.status === 401) {
            router.push('/login');
            return;
        }

        if (!res.ok) {
          throw new Error("Failed to fetch articles");
        }

        const data = await res.json();
        // Ensure data is array
        setArticles(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
        setArticles([]); // fallback
      } finally {
        setLoading(false);
      }
    };

    fetchMyArticles();
  }, [router]);

  // Calculate Stats - Ensure articles is array
  const safeArticles = Array.isArray(articles) ? articles : [];
  const stats = {
      active: safeArticles.filter(a => a.status !== 'published' && a.status !== 'rejected').length,
      published: safeArticles.filter(a => a.status === 'published').length,
      revisions: safeArticles.filter(a => a.status === 'revision_required').length
  };

  const filteredArticles = safeArticles.filter((article) => {
    switch (filter) {
        case 'active':
            return article.status !== 'published' && article.status !== 'rejected';
        case 'published':
            return article.status === 'published';
         case 'rejected':
            return article.status === 'rejected';
        case 'revision_required':
             return article.status === 'revision_required';
        default:
            return false;
    }
  });
  
  const getPageTitle = (f) => {
      switch(f) {
          case 'active': return 'Active submissions';
          case 'published': return 'Published';
          case 'rejected': return 'Declined';
          case 'revision_required': return 'Revisions requested';
          default: return 'Submissions';
      }
  }

  if (loading) return <div className="flex h-screen items-center justify-center text-slate-600">Loading dashboard...</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <AuthorHeader user={user} />
      
      <div className="mx-auto flex max-w-7xl flex-col md:flex-row">
        <AuthorSidebar 
            articles={articles} 
            currentFilter={filter} 
            onFilterChange={setFilter} 
        />
        
        <main className="flex-1 p-6 md:p-8">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">
                    {getPageTitle(filter)} ({filteredArticles.length})
                </h1>
            </div>

            {/* Author Stats */}
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="text-sm font-medium text-slate-500">Active Submissions</div>
                    <div className="mt-2 text-2xl font-bold text-blue-600">{stats.active}</div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="text-sm font-medium text-slate-500">Published Works</div>
                    <div className="mt-2 text-2xl font-bold text-green-600">{stats.published}</div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="text-sm font-medium text-slate-500">Revisions Needed</div>
                    <div className="mt-2 text-2xl font-bold text-orange-600">{stats.revisions}</div>
                </div>
            </div>
            
            <div className="mb-6">
                {/* Search Bar Placeholder */}
                <div className="relative">
                     <input 
                        type="text" 
                        placeholder="Search submissions, ID, authors..." 
                        className="w-full rounded-md border border-slate-300 py-2 pl-3 pr-10 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                     />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            <SubmissionsTable articles={filteredArticles} />
        </main>
      </div>
    </div>
  );
}

export default function AuthorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthorPageContent />
    </Suspense>
  );
}
