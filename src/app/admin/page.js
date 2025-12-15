"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  acceptanceEmailTemplate,
  doiInfo,
  paymentInfo,
} from "@/data/journal";

export default function AdminPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ total: 0, pending: 0, published: 0, rejected: 0 });
  const [reviewers, setReviewers] = useState([]);
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Login State
  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");

  const [loginLoading, setLoginLoading] = useState(false);

  // Publish Issue State
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [publishVolume, setPublishVolume] = useState(1);
  const [publishIssue, setPublishIssue] = useState(1);
  const [publishType, setPublishType] = useState('regular');
  const [publishTitle, setPublishTitle] = useState('');
  const [nextArticleNumber, setNextArticleNumber] = useState(1);
  const [publishing, setPublishing] = useState(false);
  const [toast, setToast] = useState(null); // { message, type }

  useEffect(() => {
    const checkAuth = () => {
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;

      if (user && user.role === "admin") {
        setIsAuthenticated(true);
        fetchArticles();
      } else {
        setIsAuthenticated(false);
        setLoading(false); // Stop loading if not auth, show login
      }
    };

    checkAuth();
  }, []);

  const fetchStats = async () => {
    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/stats`, {
             headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
            const data = await res.json();
            setStats(data);
        } else {
            console.error("Failed to fetch stats:", res.status);
            if (res.status === 401) {
                // Token expired or invalid
                handleLogout();
            }
        }
    } catch (err) {
        console.error("Error fetching stats:", err);
    }
  };

  const fetchReviewers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users?role=reviewer`, {
            headers: { Authorization: `Bearer ${token}` }
       });
       if (res.ok) {
           const data = await res.json();
           setReviewers(data);
       }
      } catch (err) {
          console.error("Error fetching reviewers:", err);
      }
  }

  const fetchArticles = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles`, {
          headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch articles");
      const data = await res.json();
      setArticles(Array.isArray(data) ? data : []);

      await fetchStats();
      await fetchReviewers();

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsAuthenticated(false);
      window.dispatchEvent(new Event("auth-change"));
      setLoading(false);
  };

  const handleLoginChange = (e) => {
    setLoginFormData({ ...loginFormData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginFormData),
        credentials: 'include',
      });

      const data = await res.json();

      if (res.ok) {
        // localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data));
        setIsAuthenticated(true);
        window.dispatchEvent(new Event("auth-change"));
        fetchArticles();
      } else {
        setLoginError(data.message || "Login failed");
      }
    } catch (err) {
      setLoginError("Something went wrong. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/users/auth/google`;
  };

  const handleGenerateDOI = async (id) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/${id}/doi`, {
        method: "PUT",
        credentials: 'include',
      });
      if (res.ok) {
        alert("DOI Generated!");
        // Refresh articles
        const updatedArticles = articles.map((article) => {
            if (article._id === id) {
                return { ...article, doi: `10.1000/${article._id}` };
            }
            return article;
        });
        setArticles(updatedArticles);
      } else {
        alert("Failed to generate DOI");
      }
    } catch (err) {
      console.error(err);
      alert("Error generating DOI");
    }
  };

  const handleUploadClick = (id) => {
    setSelectedArticleId(id);
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedArticleId) return;

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/upload`, {
        method: "POST",
        body: formData,
        credentials: 'include',
      });

      if (res.ok) {
        const filePath = await res.text();
        // Update article with PDF URL
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/${selectedArticleId}/pdf`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ pdfUrl: filePath }),
            credentials: 'include',
        });

        alert("PDF Uploaded!");
        // Refresh articles
         const updatedArticles = articles.map((article) => {
            if (article._id === selectedArticleId) {
                return { ...article, pdfUrl: filePath };
            }
            return article;
        });
        setArticles(updatedArticles);
      } else {
        alert("Failed to upload PDF");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading PDF");
    }
  };

  const handlePublishIssue = async (id) => {
      const issue = prompt("Enter Issue Number (e.g., Vol 1, Issue 1):");
      if (!issue) return;

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/${id}/issue`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ issue }),
            credentials: 'include',
        });

        if (res.ok) {
            alert("Issue Assigned!");
             const updatedArticles = articles.map((article) => {
                if (article._id === id) {
                    return { ...article, issue, status: 'published' };
                }
                return article;
            });
            setArticles(updatedArticles);
        } else {
            alert("Failed to assign issue");
        }
      } catch (err) {
          console.error(err);
          alert("Error assigning issue");
      }
  }

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState("");
  const [reviewerComments, setReviewerComments] = useState("");

  const [sendBackModalOpen, setSendBackModalOpen] = useState(false);
  const [sendBackMessage, setSendBackMessage] = useState("");

  const openSendBackModal = (article) => {
      setCurrentArticle(article);
      setSendBackMessage(article.reviewerComments || "");
      setSendBackModalOpen(true);
  }

  const handleSendBackToAuthor = async () => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/${currentArticle._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                status: 'revision_required',
                reviewerComments: sendBackMessage
            }),
            credentials: 'include',
        });

        if (res.ok) {
            setToast({ message: "Article sent back to author", type: "success" });
            setSendBackModalOpen(false);
            fetchArticles();
        } else {
            setToast({ message: "Failed to send back article", type: "error" });
        }
    } catch(err) {
        console.error(err);
        setToast({ message: "Error sending back article", type: "error" });
    }
  }

  const openReviewModal = (article) => {
    setCurrentArticle(article);
    setStatusUpdate(article.status);
    setReviewerComments(article.reviewerComments || "");
    setReviewModalOpen(true);
  };

  const handleStatusUpdate = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/${currentArticle._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: statusUpdate,
          reviewerComments: reviewerComments,
        }),
        credentials: 'include',
      });

      if (res.ok) {
        alert("Status Updated!");
        setReviewModalOpen(false);
        fetchArticles(); // Refresh list
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating status");
    }
  };

  const handleAssignReviewer = async (articleId, reviewerId) => {
      try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/${articleId}/assign`, {
              method: "PUT",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({ reviewerId }),
              credentials: 'include',
          });

          if (res.ok) {
              setToast({ message: "Reviewer assigned successfully", type: "success" });
              fetchArticles();
          } else {
              setToast({ message: "Failed to assign reviewer", type: "error" });
          }
      } catch (err) {
           console.error(err);
           setToast({ message: "Error assigning reviewer", type: "error" });
      }
  }

  // Issue Publishing Logic
  useEffect(() => {
    if (publishModalOpen) {
         fetchNextArticleNumber(publishVolume, publishIssue, publishType);
    }
  }, [publishModalOpen, publishVolume, publishIssue, publishType]);

  const fetchNextArticleNumber = async (vol, issue, type) => {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/api/articles/next-number?volume=${vol}&issue=${issue}`;

      try {
          const res = await fetch(url, {
              credentials: 'include',
          });
          
          if (!res.ok) {
              console.error("Fetch failed:", res.status);
              return;
          }

          const data = await res.json();
          setNextArticleNumber(data.nextArticleNumber);
      } catch (err) {
          console.error("Failed to fetch next article number", err);
      }
  }

  const handlePublishNewIssue = async () => {
      setPublishing(true);
      try {
          // 1. Ensure Issue Exists (Idempotent creation)
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/issues/publish`, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({
                  volume: publishVolume,
                  issue: publishIssue, // We now pass the manually selected issue
                  title: `Volume ${publishVolume}, Issue ${publishIssue}`,
                  type: publishType
              }),
              credentials: 'include',
          });

          // Even if issue exists (400), we proceed. Ideally backend should return 200 or 201.
          
          const issueString = `Vol ${publishVolume}, Issue ${publishIssue}`;

          // 2. Assign Article to this Issue and Publish
          if (selectedArticleId) {
              const updateRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/${selectedArticleId}/issue`, {
                  method: "PUT",
                  headers: {
                      "Content-Type": "application/json",
                  },
                  credentials: 'include',
                  body: JSON.stringify({ 
                      issue: issueString, 
                      status: 'published',
                      articleNumber: nextArticleNumber
                  }),
              });

              if (updateRes.ok) {
                  setToast({ message: `Published! Article ${nextArticleNumber} assigned to ${issueString}.`, type: "success" });
                  
                  const updatedArticles = articles.map((article) => {
                      if (article._id === selectedArticleId) {
                          return { ...article, issue: issueString, status: 'published', articleNumber: nextArticleNumber };
                      }
                      return article;
                  });
                  setArticles(updatedArticles);
                  setPublishModalOpen(false);
                  fetchStats(); // Update stats in real-time
              } else {
                  setToast({ message: "Failed to update article details.", type: "error" });
              }
          }
      } catch (err) {
          console.error(err);
          setToast({ message: "Error publishing issue", type: "error" });
      } finally {
          setPublishing(false);
      }
  };

  // Filter State
  const [filterStatus, setFilterStatus] = useState("active");

  const filteredArticles = articles.filter(article => {
    if (filterStatus === "active") {
        return !['published', 'rejected'].includes(article.status);
    }
    return article.status === filterStatus;
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  if (!isAuthenticated) {
    // ... Login UI ...
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      {/* ... (Login form preserved) ... */}
        <div className="w-full max-w-md space-y-8 rounded-3xl border border-slate-200 bg-white p-10 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.15)]">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Admin Login
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Sign in to access the admin panel
            </p>
          </div>
          
          <div className="mt-8">
             <button
              onClick={handleGoogleLogin}
              type="button"
              className="flex w-full items-center justify-center gap-3 rounded-full border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign in with Google
            </button>
            
            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-slate-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-slate-500">Or continue with</span>
              </div>
            </div>
          </div>

          <form className="mt-6 space-y-6" onSubmit={handleLoginSubmit}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700"
                >
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={loginFormData.email}
                    onChange={handleLoginChange}
                    className="block w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700"
                >
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={loginFormData.password}
                    onChange={handleLoginChange}
                    className="block w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            {loginError && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {loginError}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loginLoading}
                className="group relative flex w-full justify-center rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-70"
              >
                {loginLoading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const statuses = [
      { id: 'active', label: 'Active' },
      { id: 'submitted', label: 'Submitted' },
      { id: 'under_review', label: 'Under Review' },
      { id: 'revision_required', label: 'Revision Required' },
      { id: 'accepted', label: 'Accepted' },
      { id: 'published', label: 'Published' },
      { id: 'rejected', label: 'Rejected' },
  ];

  return (
    <div className="space-y-8">
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
        accept="application/pdf"
      />
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_25px_70px_-38px_rgba(15,23,42,0.35)] md:p-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Admin panel
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900 md:text-4xl">
              Editorial workflows at a glance
            </h1>
            <p className="mt-2 max-w-3xl text-base text-slate-600">
              Manage submissions, assign reviewers, verify payments, and mint DOIs.
            </p>
          </div>
          <Link
            href="/submit"
            className="rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300"
          >
            Back to submissions
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
             <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                 <div className="text-sm font-medium text-slate-500">Total Submissions</div>
                 <div className="mt-2 text-3xl font-bold text-slate-900">{stats.total}</div>
             </div>
             <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                 <div className="text-sm font-medium text-slate-500">Pending Review</div>
                 <div className="mt-2 text-3xl font-bold text-orange-600">{stats.pending}</div>
             </div>
             <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                 <div className="text-sm font-medium text-slate-500">Published</div>
                 <div className="mt-2 text-3xl font-bold text-green-600">{stats.published}</div>
             </div>
             <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                 <div className="text-sm font-medium text-slate-500">Rejected</div>
                 <div className="mt-2 text-3xl font-bold text-red-600">{stats.rejected}</div>
             </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_60px_-50px_rgba(15,23,42,0.5)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
                <div className="text-sm font-semibold text-slate-900">
                Manage submissions
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600">
                {filteredArticles.length} active
                </span>
            </div>
            
            {/* Filter Tabs */}
             <div className="flex overflow-x-auto pb-2 sm:pb-0 gap-2 no-scrollbar">
                {statuses.map(status => (
                    <button
                        key={status.id}
                        onClick={() => setFilterStatus(status.id)}
                        className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                            filterStatus === status.id 
                            ? 'bg-slate-900 text-white' 
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                        {status.label}
                    </button>
                ))}
             </div>
          </div>
          <div className="space-y-3">
            {filteredArticles.map((submission) => (
              <div
                key={submission._id}
                className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-semibold text-slate-900">
                    {submission.title}
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                    {submission.status}
                  </span>
                </div>
                <div className="text-xs uppercase tracking-[0.16em] text-slate-500">
                  {submission._id} · {new Date(submission.createdAt).toLocaleDateString()}
                </div>
                <div className="mt-2 text-sm text-slate-600">
                  Authors: {submission.authors.join(", ")}
                </div>
                {submission.doi && (
                    <div className="mt-1 text-xs text-blue-600">DOI: {submission.doi}</div>
                )}
                 {submission.issue && (
                    <div className="mt-1 text-xs text-green-600">Issue: {submission.issue}</div>
                )}
                 {submission.pdfUrl && (
                    <div className="mt-1 text-xs text-purple-600">PDF Uploaded</div>
                )}
                <div className="mt-2 flex flex-wrap gap-2">
                  <div className="w-full mt-2 space-y-2">
                        {/* List Assigned Reviewers */}
                       {submission.reviewers && submission.reviewers.length > 0 && (
                           <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded-md">
                               <div className="font-semibold mb-1">Reviewers ({submission.reviewers.length}/5):</div>
                               {submission.reviewers.map((rev, idx) => {
                                   const reviewerName = reviewers.find(r => r._id === rev.user)?.name || 'Unknown';
                                   let statusColor = 'text-slate-500';
                                   if (rev.status === 'accepted') statusColor = 'text-green-600';
                                   if (rev.status === 'rejected') statusColor = 'text-red-600';
                                   
                                   return (
                                       <div key={idx} className="mb-2 border-b border-slate-100 last:border-0 pb-1 last:pb-0">
                                            <div className="flex justify-between items-center">
                                                <span>{reviewerName}</span>
                                                <span className={`${statusColor} font-bold`}>{rev.status}</span>
                                            </div>
                                            {rev.comments && (
                                                <div className="mt-1 text-[10px] text-slate-600 bg-white p-1.5 rounded border border-slate-100 italic">
                                                    "{rev.comments}"
                                                </div>
                                            )}
                                       </div>
                                   )
                               })}
                           </div>
                       )}
                       
                       {/* Assignment Dropdown */}
                       <select 
                           className="text-xs w-full rounded-md border-slate-300 py-1 pl-2 pr-8 disabled:opacity-50"
                           value=""
                           onChange={(e) => {
                               if (e.target.value) handleAssignReviewer(submission._id, e.target.value);
                           }}
                           disabled={submission.reviewers?.length >= 5}
                       >
                           <option value="">+ Assign Reviewer {submission.reviewers?.length >= 5 ? '(Max Reached)' : ''}</option>
                           {reviewers
                            .filter(r => !submission.reviewers?.some(existing => existing.user === r._id)) // Exclude already assigned
                            .map(r => (
                               <option key={r._id} value={r._id}>{r.name}</option>
                           ))}
                       </select>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-2">
                      <ActionButton label="Review & Update" onClick={() => openReviewModal(submission)} />
                      <ActionButton label="Send back to author" onClick={() => openSendBackModal(submission)} variant="outline" />
                      <ActionButton label="Generate DOI" onClick={() => handleGenerateDOI(submission._id)} />
                      <ActionButton label="Upload final PDF" onClick={() => handleUploadClick(submission._id)} />
                      
                      {submission.status !== 'published' && submission.status !== 'rejected' && (
                      <ActionButton label="Publish issue" onClick={() => {
                          // Validation Check
                          const missingSteps = [];
                          
                          // 1. Check Reviewer Constraints (3/5 accepted)
                          const acceptedCount = submission.reviewers?.filter(r => r.status === 'accepted').length || 0;
                          
                          // We check if acceptedCount < 3.
                          // Note: If admins want to override, they can use 'Review & Update' to force status, but this button enforces the rule.
                          if (acceptedCount < 3) missingSteps.push(`Need at least 3 accepted reviews (Current: ${acceptedCount})`);

                          if (!submission.doi) missingSteps.push("DOI must be generated");
                          if (!submission.pdfUrl) missingSteps.push("Final PDF must be uploaded");
    
                          if (missingSteps.length > 0) {
                               setToast({ message: `Cannot publish: ${missingSteps[0]}`, type: "error" });
                          } else {
                              setSelectedArticleId(submission._id);
                              setPublishModalOpen(true);
                          }
                      }} />
                      )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_60px_-50px_rgba(15,23,42,0.5)]">
            <div className="text-sm font-semibold text-slate-900">
              Reviewer assignments
            </div>
            <div className="mt-3 grid gap-2 text-sm text-slate-700">
              {reviewers.length === 0 && <div className="text-slate-500 italic">No reviewers found.</div>}
              {reviewers.map((reviewer) => (
                <div
                  key={reviewer._id}
                  className="rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 flex justify-between items-center"
                >
                  <span>{reviewer.name} ({reviewer.email})</span>
                  <span className="text-xs bg-slate-200 px-2 py-1 rounded">Reviewer</span>
                </div>
              ))}
            </div>
          </div>
          
           {/* Add Reviewer Assignment to List Item UI in next chunk if needed, or modify existing */}


          <div className="rounded-3xl border border-slate-200 bg-slate-900 p-6 text-white shadow-[0_20px_55px_-40px_rgba(15,23,42,0.65)]">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-200">
              DOI &amp; publication
            </div>
            <div className="mt-2 text-lg font-semibold">
              Prefix {doiInfo.prefix}
            </div>
            <ul className="mt-3 space-y-2 text-sm text-slate-100/90">
              <li>• Generate DOI after acceptance and final PDF upload</li>
              <li>• Push metadata to Crossref within 48 hours</li>
              <li>• Publish online-first and add to archive index</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_60px_-50px_rgba(15,23,42,0.5)]">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-900">
              Payment verification
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600">
              {paymentInfo.gateways.join(" · ")}
            </span>
          </div>
          <div className="mt-3 grid gap-2 text-sm text-slate-700">
            <div>Amount: {paymentInfo.currency} {paymentInfo.amount}</div>
            {paymentInfo.verification.map((item) => (
              <div
                key={item}
                className="rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3"
              >
                {item}
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <ActionButton label="Mark as paid" />
            <ActionButton label="Request receipt" />
            <ActionButton label="Flag for finance" />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_60px_-50px_rgba(15,23,42,0.5)]">
          <div className="text-sm font-semibold text-slate-900">
            Acceptance email template
          </div>
          <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
            <div className="text-xs uppercase tracking-[0.16em] text-slate-500">
              Subject
            </div>
            <div className="text-sm font-semibold text-slate-900">
              {acceptanceEmailTemplate.subject}
            </div>
            <div className="mt-3 space-y-2 text-sm text-slate-700">
              {acceptanceEmailTemplate.body.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <ActionButton label="Send acceptance" />
            <ActionButton label="Send revisions" />
            <ActionButton label="Send rejection" />
          </div>
        </div>
      </section>

      {/* Toast Notification */}
      {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      {/* Publish Issue Modal */}
      {publishModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
              <div className="w-full max-w-md rounded-2xl bg-white p-6">
                  <h2 className="mb-4 text-xl font-bold text-slate-900">Publish Issue</h2>
                  
                  <div className="space-y-4">

                      
                      <div>
                          <label className="block text-sm font-medium text-slate-700">Select Volume</label>
                          <select
                              value={publishVolume}
                              onChange={(e) => setPublishVolume(Number(e.target.value))}
                              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2"
                          >
                              {Array.from({ length: 20 }, (_, i) => i + 1).map((vol) => (
                                  <option key={vol} value={vol}>Volume {vol}</option>
                              ))}
                          </select>
                      </div>


                      <div>
                          <label className="block text-sm font-medium text-slate-700">Select Issue</label>
                          <select
                              value={publishIssue}
                              onChange={(e) => setPublishIssue(Number(e.target.value))}
                              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2"
                          >
                              {Array.from({ length: 12 }, (_, i) => i + 1).map((iss) => (
                                  <option key={iss} value={iss}>Issue {iss}</option>
                              ))}
                          </select>
                      </div>

                      <div>
                          <label className="block text-sm font-medium text-slate-700">Article Number (Auto-assigned)</label>
                          <input 
                              type="text" 
                              value={nextArticleNumber} 
                              disabled 
                              className="mt-1 block w-full rounded-lg border border-slate-300 bg-slate-100 px-3 py-2 text-slate-500"
                          />
                      </div>
                      
                      <div className="flex justify-end gap-2 pt-4">
                          <button 
                              onClick={() => setPublishModalOpen(false)}
                              className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                          >
                              Cancel
                          </button>
                          <button 
                              onClick={handlePublishNewIssue}
                              disabled={publishing}
                              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                          >
                              {publishing ? 'Publishing...' : 'Confirm Publish'}
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}
      
      {/* Send Back To Author Modal */}
      {sendBackModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
              <div className="w-full max-w-lg rounded-2xl bg-white p-6">
                  <h2 className="mb-4 text-xl font-bold text-slate-900">Send Back to Author</h2>
                  <p className="mb-4 text-sm text-slate-600">
                      This will mark the article as <strong>Revision Required</strong>. Please provide instructions for the author.
                  </p>
                  
                  <textarea
                      rows={6}
                      value={sendBackMessage}
                      onChange={(e) => setSendBackMessage(e.target.value)}
                      className="block w-full rounded-lg border border-slate-300 p-3 text-sm focus:border-sky-500 focus:ring-sky-500"
                      placeholder="Enter revision instructions here..."
                  />
                  
                  <div className="flex justify-end gap-2 pt-4">
                      <button 
                          onClick={() => setSendBackModalOpen(false)}
                          className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                      >
                          Cancel
                      </button>
                      <button 
                          onClick={handleSendBackToAuthor}
                          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                      >
                          Send Back
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Review Modal */}
      {reviewModalOpen && currentArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 overflow-y-auto">
          <div className="relative w-full max-w-4xl rounded-2xl bg-white p-6 md:p-8">
            <button
              onClick={() => setReviewModalOpen(false)}
              className="absolute right-4 top-4 rounded-full bg-slate-100 p-2 text-slate-900 hover:bg-slate-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Review Submission</h2>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Documents</h3>
                <div className="flex flex-col gap-2">
                  {currentArticle.manuscriptUrl ? (
                    <a 
                      href={`${process.env.NEXT_PUBLIC_API_URL}/${currentArticle.manuscriptUrl}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-lg border border-slate-200 p-3 hover:bg-slate-50"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-red-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                      View Manuscript
                    </a>
                  ) : (
                    <p className="text-sm text-slate-500">No manuscript uploaded</p>
                  )}
                  
                  {currentArticle.coverLetterUrl ? (
                    <a 
                      href={`${process.env.NEXT_PUBLIC_API_URL}/${currentArticle.coverLetterUrl}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-lg border border-slate-200 p-3 hover:bg-slate-50"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                      View Cover Letter
                    </a>
                  ) : (
                    <p className="text-sm text-slate-500">No cover letter uploaded</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Update Status</h3>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Status</label>
                  <select
                    value={statusUpdate}
                    onChange={(e) => setStatusUpdate(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                  >
                    <option value="submitted">Submitted</option>
                    <option value="under_review">Under Review</option>
                    <option value="revision_required">Revision Required</option>
                    <option value="accepted">Accepted</option>
                    <option value="published">Published</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700">Reviewer Comments</label>
                  <textarea
                    rows={6}
                    value={reviewerComments}
                    onChange={(e) => setReviewerComments(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                    placeholder="Enter comments for the author..."
                  />
                </div>

                <button
                  onClick={handleStatusUpdate}
                  className="w-full rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


function ActionButton({ label, dark, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
        dark
          ? "border border-white/30 bg-white/10 text-white hover:bg-white/20"
          : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300"
      }`}
    >
      {label}
    </button>
  );
}

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-lg px-4 py-3 text-white shadow-lg ${
      type === 'error' ? 'bg-red-500' : 'bg-green-600'
    }`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 font-bold hover:text-white/80">×</button>
    </div>
  );
}

