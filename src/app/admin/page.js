"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  acceptanceEmailTemplate,
  doiInfo,
  paymentInfo,
} from "@/data/journal";
import Loader from "@/components/Loader";
import PosterNotification from "@/components/PosterNotification";

export default function AdminPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false); // Global overlay loader
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ total: 0, pending: 0, published: 0, rejected: 0 });
  const [reviewers, setReviewers] = useState([]);
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authorModalOpen, setAuthorModalOpen] = useState(false);
  const [authorDetails, setAuthorDetails] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(false);
  const [showInquiries, setShowInquiries] = useState(false);

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

  // Notification State
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('info');
  const [notificationTargets, setNotificationTargets] = useState(['all']);
  const [sendingNotification, setSendingNotification] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPoster, setCurrentPoster] = useState(null);
  const [posterFile, setPosterFile] = useState(null);
  const [uploadingPoster, setUploadingPoster] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;

      if (user && user.role === "admin") {
        setIsAuthenticated(true);
        fetchArticles();
        fetchCurrentPoster();
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
        if (!token) return; // Prevent fetch if no token
        
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
        if (!token) return;

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
      if (!token) return;

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

  const fetchCurrentPoster = async () => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posters/active`);
        if (res.ok) {
            const data = await res.json();
            setCurrentPoster(data);
        }
    } catch (err) {
        console.error("Error fetching poster:", err);
    }
  };

  const fetchInquiries = async () => {
    setInquiriesLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/inquiries`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setInquiries(data);
      }
    } catch (err) {
      console.error("Error fetching inquiries:", err);
    } finally {
      setInquiriesLoading(false);
    }
  };

  const updateInquiryStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/inquiries/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchInquiries();
      }
    } catch (err) {
      console.error("Error updating inquiry status:", err);
    }
  };

  const handlePosterUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('poster', file);

    setUploadingPoster(true);
    setActionLoading(true);

    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posters`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
            credentials: 'include'
        });

        if (res.ok) {
            const data = await res.json();
            setCurrentPoster(data);
            setToast({ message: "Poster uploaded successfully! It will expire in 7 days.", type: "success" });
        } else {
            setToast({ message: "Failed to upload poster", type: "error" });
        }
    } catch (err) {
        console.error(err);
        setToast({ message: "Error uploading poster", type: "error" });
    } finally {
        setUploadingPoster(false);
        setActionLoading(false);
    }
  };

  const handleRemovePoster = async () => {
    if (!window.confirm("Are you sure you want to remove the current poster?")) return;

    setActionLoading(true);
    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posters/active`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
            credentials: 'include'
        });

        if (res.ok) {
            setCurrentPoster(null);
            setToast({ message: "Poster removed", type: "success" });
        } else {
            setToast({ message: "Failed to remove poster", type: "error" });
        }
    } catch (err) {
        console.error(err);
        setToast({ message: "Error removing poster", type: "error" });
    } finally {
        setActionLoading(false);
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
        fetchCurrentPoster();
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
    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/${id}/doi`, {
        method: "PUT",
        headers: {
             Authorization: `Bearer ${token}`
        },
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
    } finally {
        setActionLoading(false);
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

    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/upload`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`
        },
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
                Authorization: `Bearer ${token}`
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
    } finally {
        setActionLoading(false);
    }
  };

  const handlePublishIssue = async (id) => {
      const issue = prompt("Enter Issue Number (e.g., Vol 1, Issue 1):");
      if (!issue) return;
      
      setActionLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/${id}/issue`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
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
      } finally {
          setActionLoading(false);
      }
  }

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState("");
  const [reviewerComments, setReviewerComments] = useState("");
  
  // Assign Reviewer State
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assignSearchQuery, setAssignSearchQuery] = useState("");
  
  // Analytics State
  const [analyticsModalOpen, setAnalyticsModalOpen] = useState(false);
  const [selectedReviewerForAnalytics, setSelectedReviewerForAnalytics] = useState(null);

  // Edit Article State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
      title: "",
      abstract: "",
      authors: [],
      articleNumber: "",
      issue: ""
  });

  const handleDeleteArticle = async (id) => {
      if (!confirm("Are you sure you want to delete this article? This action cannot be undone.")) return;
      
      setActionLoading(true);
      try {
          const token = localStorage.getItem("token");
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/${id}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
              credentials: 'include',
          });

          if (res.ok) {
              setToast({ message: "Article deleted successfully", type: "success" });
              fetchArticles();
          } else {
              setToast({ message: "Failed to delete article", type: "error" });
          }
      } catch (err) {
          console.error(err);
          setToast({ message: "Error deleting article", type: "error" });
      } finally {
          setActionLoading(false);
      }
  };

  const openEditModal = (article) => {
      setCurrentArticle(article);
      setEditFormData({
          title: article.title || "",
          abstract: article.abstract || "",
          authors: article.authors || [], // Assuming it's already an array of objects
          articleNumber: article.articleNumber || "",
          issue: article.issue || ""
      });
      setEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
      e.preventDefault();
      setActionLoading(true);
      try {
          const token = localStorage.getItem("token");
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/${currentArticle._id}`, {
              method: "PUT",
              headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`
              },
              body: JSON.stringify(editFormData),
              credentials: 'include',
          });

          if (res.ok) {
              setToast({ message: "Article updated successfully", type: "success" });
              setEditModalOpen(false);
              fetchArticles();
          } else {
              setToast({ message: "Failed to update article", type: "error" });
          }
      } catch (err) {
          console.error(err);
          setToast({ message: "Error updating article", type: "error" });
      } finally {
          setActionLoading(false);
      }
  };

  const [sendBackModalOpen, setSendBackModalOpen] = useState(false);
  const [sendBackMessage, setSendBackMessage] = useState("");

  const openSendBackModal = (article) => {
      setCurrentArticle(article);
      setSendBackMessage(article.reviewerComments || "");
      setSendBackModalOpen(true);
  }

  const handleSendBackToAuthor = async () => {
    setActionLoading(true);
    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/${currentArticle._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
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
    } finally {
        setActionLoading(false);
    }
  }

  const openReviewModal = (article) => {
    setCurrentArticle(article);
    setStatusUpdate(article.status);
    setReviewerComments(article.reviewerComments || "");
    setReviewModalOpen(true);
  };

  const handleStatusUpdate = async () => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/${currentArticle._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
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
    } finally {
        setActionLoading(false);
    }
  };

  const handleAssignReviewer = async (articleId, reviewerId) => {
      try {
          const token = localStorage.getItem("token");
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/${articleId}/assign`, {
              method: "PUT",
              headers: {
                  "Content-Type": "application/json",
                   Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({ reviewerId }),
              credentials: 'include',
          });

          if (res.ok) {
              setToast({ message: "Reviewer assigned successfully", type: "success" });
              setAssignModalOpen(false); // Close modal on success
              fetchArticles();
          } else {
              setToast({ message: "Failed to assign reviewer", type: "error" });
          }
      } catch (err) {
           console.error(err);
           setToast({ message: "Error assigning reviewer", type: "error" });
      }
  }

  const openAssignModal = (article) => {
    setCurrentArticle(article);
    setAssignSearchQuery("");
    setAssignModalOpen(true);
  };

  // Issue Publishing Logic
  useEffect(() => {
    if (publishModalOpen) {
         fetchNextArticleNumber(publishVolume, publishIssue, publishType);
    }
  }, [publishModalOpen, publishVolume, publishIssue, publishType]);

  const fetchNextArticleNumber = async (vol, issue, type) => {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/api/articles/next-number?volume=${vol}&issue=${issue}`;

      try {
          const token = localStorage.getItem("token");
          const res = await fetch(url, {
              headers: { Authorization: `Bearer ${token}` },
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
      setActionLoading(true);
      try {
          const token = localStorage.getItem("token");
          // 1. Ensure Issue Exists (Idempotent creation)
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/issues/publish`, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                   Authorization: `Bearer ${token}`
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
                      Authorization: `Bearer ${token}`
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
          setActionLoading(false);
      }
  };

  // Send Notification Function
  const handleSendNotification = async () => {
    if (!notificationTitle.trim() || !notificationMessage.trim()) {
      setToast({ message: "Please fill in title and message", type: "error" });
      return;
    }

    setSendingNotification(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: notificationTitle,
          message: notificationMessage,
          type: notificationType,
          targetRoles: notificationTargets,
        }),
      });

      if (res.ok) {
        setToast({ message: "Notification sent successfully!", type: "success" });
        setNotificationModalOpen(false);
        setNotificationTitle('');
        setNotificationMessage('');
        setNotificationType('info');
        setNotificationTargets(['all']);
      } else {
        const data = await res.json();
        setToast({ message: data.message || "Failed to send notification", type: "error" });
      }
    } catch (err) {
      console.error(err);
      setToast({ message: "Error sending notification", type: "error" });
    } finally {
      setSendingNotification(false);
    }
  };

  // Filter State
  const [filterStatus, setFilterStatus] = useState("active");

  const filteredArticles = articles.filter(article => {
    // Basic status filter
    let statusMatch = true;
    if (filterStatus === "active") {
        statusMatch = !['published', 'rejected'].includes(article.status);
    } else {
        statusMatch = article.status === filterStatus;
    }

    if (!statusMatch) return false;

    // Search query filter
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    const titleMatch = article.title?.toLowerCase().includes(query);
    const idMatch = article.manuscriptId?.toLowerCase().includes(query);
    const mongoIdMatch = article._id?.toString().toLowerCase().includes(query);
    
    // Also search authors
    const authorMatch = article.authors?.some(author => {
        const name = typeof author === 'string' ? author : `${author.firstName} ${author.lastName}`;
        return name.toLowerCase().includes(query);
    });

    return titleMatch || idMatch || mongoIdMatch || authorMatch;
  });
  
  if (loading) return <Loader />;
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
                    className="block w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 sm:text-sm"
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
                    className="block w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 sm:text-sm"
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

  const handleRemoveReviewerFromArticle = async (articleId, reviewerId) => {
      if(!confirm("Are you sure you want to remove this reviewer from the article?")) return;
      
      setActionLoading(true);
      try {
          const token = localStorage.getItem("token");
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/${articleId}/reviewers/${reviewerId}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
              credentials: 'include',
          });

          if (res.ok) {
              setToast({ message: "Reviewer removed from article", type: "success" });
              fetchArticles();
          } else {
              setToast({ message: "Failed to remove reviewer", type: "error" });
          }
      } catch (err) {
           console.error(err);
           setToast({ message: "Error removing reviewer", type: "error" });
      } finally {
          setActionLoading(false);
      }
  }

  const handleRemoveReviewerRole = async (userId) => {
      if(!confirm("Are you sure you want to remove this user from the Reviewers list? They will become an Author.")) return;

      setActionLoading(true);
      try {
          const token = localStorage.getItem("token");
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}/role`, {
              method: "PUT",
              headers: { 
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}` 
              },
              body: JSON.stringify({ role: 'author' }),
              credentials: 'include',
          });

          if (res.ok) {
              setToast({ message: "Reviewer removed from list (Role changed to Author)", type: "success" });
              fetchReviewers(); // Refresh global list
          } else {
              setToast({ message: "Failed to remove reviewer role", type: "error" });
          }
      } catch (err) {
           console.error(err);
           setToast({ message: "Error updating user role", type: "error" });
      } finally {
          setActionLoading(false);
      }
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
      <PosterNotification />
      {actionLoading && <Loader overlay={true} />}
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
          <div className="flex gap-3">
            <button
              onClick={() => {
                const newState = !showInquiries;
                setShowInquiries(newState);
                if (newState) fetchInquiries();
              }}
              className={`rounded-full px-4 py-3 text-sm font-semibold transition hover:-translate-y-0.5 flex items-center gap-2 ${
                showInquiries 
                ? 'bg-slate-900 text-white' 
                : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              {showInquiries ? 'View Submissions' : 'View Inquiries'}
            </button>
            <button
              onClick={() => setNotificationModalOpen(true)}
              className="rounded-full bg-gradient-to-r from-purple-600 to-purple-700 px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:from-purple-700 hover:to-purple-800 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              Send Notification
            </button>
            <Link
              href="/submit"
              className="rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300"
            >
              Back to submissions
            </Link>
          </div>
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

      {/* Poster Management Section */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex-1">
                <h2 className="text-xl font-bold text-slate-900">Holiday & Event Poster</h2>
                <p className="mt-1 text-sm text-slate-500">
                    Upload a poster (Deepavali, Christmas, etc.) to show to users after login. Only one poster can be active. 
                    Posters automatically expire after 7 days.
                </p>
                
                <div className="mt-4 flex flex-wrap gap-3">
                    <label className="relative cursor-pointer rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:ring-offset-2">
                        <span>{currentPoster ? 'Change Poster' : 'Upload New Poster'}</span>
                        <input 
                            type="file" 
                            className="sr-only" 
                            accept="image/*"
                            onChange={handlePosterUpload}
                            disabled={uploadingPoster}
                        />
                    </label>

                    {currentPoster && (
                        <button 
                            onClick={handleRemovePoster}
                            className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-100"
                        >
                            Remove Current Poster
                        </button>
                    )}
                </div>
            </div>

            {currentPoster && (
                <div className="relative group shrink-0">
                    <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-sky-400 to-indigo-400 opacity-25 blur transition group-hover:opacity-50"></div>
                    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                        <img 
                            src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${currentPoster.imageUrl}`} 
                            alt="Active Poster" 
                            className="h-32 w-48 object-cover"
                        />
                        <div className="absolute bottom-0 w-full bg-slate-900/60 p-1.5 text-center backdrop-blur-sm">
                            <span className="text-[10px] font-bold text-white uppercase tracking-tighter">Active Now</span>
                        </div>
                    </div>
                    <div className="mt-2 text-center">
                        <span className="text-[10px] text-slate-400">Expires: {new Date(currentPoster.expiresAt).toLocaleDateString()}</span>
                    </div>
                </div>
            )}
            
            {!currentPoster && (
                <div className="flex h-32 w-48 shrink-0 flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-slate-400">
                    <svg className="h-8 w-8 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-[10px] font-medium">No Active Poster</span>
                </div>
            )}
        </div>
      </section>

      {!showInquiries ? (
        <>
          {/* Submissions & Reviewers Grid */}
          <section className="grid gap-6 md:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_60px_-50px_rgba(15,23,42,0.5)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <div className="text-xl font-bold text-slate-900">
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

              {/* Search Box */}
              <div className="relative mt-2">
                <input 
                    type="text"
                    placeholder="Search by Title, ID, or Author..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-10 py-2.5 text-sm focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all shadow-sm"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                {searchQuery && (
                    <button 
                        onClick={() => setSearchQuery("")}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
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
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold
                        ${submission.status === 'under_review' ? 'bg-amber-100 text-amber-700' : 
                          submission.status === 'published' ? 'bg-green-100 text-green-700' :
                          submission.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          submission.status === 'revision_required' ? 'bg-orange-100 text-orange-700' :
                          'bg-white text-slate-700'}`}>
                        {submission.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 flex items-center gap-2">
                      <span className="text-slate-900 bg-slate-200 px-1.5 py-0.5 rounded">{submission.manuscriptId || 'NO ID'}</span>
                      <span>{submission._id}</span>
                      <span>·</span>
                      <span>{new Date(submission.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="mt-2 text-sm text-slate-600">
                      Authors: {submission.authors?.map(author => 
                        typeof author === 'string' 
                          ? author 
                          : `${author.firstName || ''} ${author.lastName || ''}`.trim()
                      ).filter(Boolean).join(", ") || 'Unknown'}
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
                                       if (rev.status === 'declined' || rev.status === 'rejected') statusColor = 'text-red-500';
                                       if (rev.status === 'invited') statusColor = 'text-emerald-600';
                                       if (rev.status === 'under_review') statusColor = 'text-amber-600';
                                       if (rev.status === 'revision_required') statusColor = 'text-orange-500';
                                       if (rev.status === 'completed') statusColor = 'text-indigo-600';
                                       
                                       const displayLabel = rev.decision ? 
                                           `${rev.status.toUpperCase()} [${rev.decision.toUpperCase().replace('_', ' ')}]` : 
                                           rev.status.toUpperCase().replace('_', ' ');
                                       
                                       return (
                                           <div key={idx} className="mb-2 border-b border-slate-100 last:border-0 pb-1 last:pb-0">
                                                <div className="flex justify-between items-center">
                                                    <span>{reviewerName}</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`${statusColor} font-bold text-[10px] uppercase tracking-wider`}>
                                                            {displayLabel}
                                                        </span>
                                                        <button 
                                                            onClick={() => handleRemoveReviewerFromArticle(submission._id, rev.user)}
                                                            className="text-slate-400 hover:text-red-500"
                                                            title="Runassign Reviewer"
                                                        >
                                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </div>
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
                           
                           {/* Suggested Reviewers Display */}
                           {submission.suggestedReviewers && submission.suggestedReviewers.length > 0 && (
                             <div className="mt-2 text-xs bg-emerald-50 border border-emerald-100 p-2 rounded-md">
                               <div className="font-semibold text-emerald-800 mb-1">Author Suggested Reviewers:</div>
                               {submission.suggestedReviewers.map((s, si) => (
                                 <div key={si} className="mb-2 last:mb-0 border-b border-emerald-100 last:border-0 pb-1">
                                   <div className="font-medium text-emerald-900">{s.name}</div>
                                   <div className="text-emerald-700 text-xs">
                                       {s.email}{s.phone && ` • ${s.phone}`}
                                   </div>
                                    
                                   {(s.designation || s.department) && (
                                       <div className="text-emerald-600 text-xs mt-0.5">
                                         {[s.designation, s.department].filter(Boolean).join(', ')}
                                       </div>
                                   )}
                                   
                                   {(s.college || s.university || s.country || s.institution) && (
                                       <div className="text-emerald-600 text-xs mt-0.5">
                                         {[s.college, s.university, s.institution, s.country].filter(Boolean).join(' • ')}
                                       </div>
                                   )}

                                   {s.expertise ? (
                                       <div className="text-emerald-700 text-xs font-medium mt-1">
                                         <span className="font-bold">Expertise:</span> {s.expertise}
                                       </div>
                                   ) : (
                                       <div className="text-slate-400 text-[10px] mt-0.5 italic">Expertise not provided</div>
                                   )}
                                 </div>
                               ))}
                             </div>
                           )}

                           {/* Assignment Button */}
                           <button 
                               onClick={() => openAssignModal(submission)}
                               disabled={submission.reviewers?.length >= 5}
                               className="w-full mt-2 flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 py-2 text-xs font-semibold text-slate-600 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition"
                           >
                               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                               </svg>
                               Assign Reviewer {submission.reviewers?.length >= 5 ? '(Max Reached)' : ''}
                           </button>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-2">
                          <ActionButton label="View Authors" onClick={() => {
                              setAuthorDetails(submission.authors || []);
                              setAuthorModalOpen(true);
                          }} />
                          <ActionButton label="Review & Update" onClick={() => openReviewModal(submission)} />
                          <ActionButton label="Send back to author" onClick={() => openSendBackModal(submission)} variant="outline" />
                          <ActionButton label="Generate DOI" onClick={() => handleGenerateDOI(submission._id)} />
                          <ActionButton label="Upload final PDF" onClick={() => handleUploadClick(submission._id)} />
                          <ActionButton label="Edit Details" onClick={() => openEditModal(submission)} />
                          <ActionButton label="Delete" onClick={() => handleDeleteArticle(submission._id)} dark={true} />
                          
                          {submission.status !== 'published' && submission.status !== 'rejected' && (
                          <ActionButton label="Publish issue" onClick={() => {
                              // Validation Check
                              const missingSteps = [];
                              
                              // 1. Check Reviewer Constraints (3/5 accepted)
                              const acceptedCount = submission.reviewers?.filter(r => r.decision === 'accepted').length || 0;
                              
                              // We check if acceptedCount < 3.
                              // Note: If admins want to override, they can use 'Review & Update' to force status, but this button enforces the rule.
                              if (acceptedCount < 2) missingSteps.push(`Need at least 2 accepted reviews (Current: ${acceptedCount})`);

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
               <div className="flex justify-between items-center mb-3">
                   <div className="text-sm font-semibold text-slate-900">
                     Reviewer assignments
                   </div>
                   <button 
                     onClick={() => setAnalyticsModalOpen(true)}
                     className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-1 rounded hover:bg-indigo-100 transition"
                   >
                     View Analytics
                   </button>
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
                      <button 
                          onClick={() => handleRemoveReviewerRole(reviewer._id)}
                          className="ml-2 text-xs text-red-500 hover:text-red-700 font-bold"
                      >
                          Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Aggregated Suggested Reviewers List */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_60px_-50px_rgba(15,23,42,0.5)]">
                <div className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <span>Suggested Reviewers (Overall)</span>
                   <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                     {articles.reduce((acc, a) => acc + (a.suggestedReviewers?.length || 0), 0)}
                   </span>
                </div>
                
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                   {articles.length === 0 && <div className="text-slate-500 italic text-xs">No articles loaded.</div>}
                   {articles.flatMap(a => (a.suggestedReviewers || []).map(r => ({...r, sourceTitle: a.title, manuscriptId: a.manuscriptId}))).length === 0 && (
                       <div className="text-slate-500 italic text-xs">No suggested reviewers found in submissions.</div>
                   )}
                   
                   {articles.flatMap(article => 
                      (article.suggestedReviewers || []).map((reviewer, rIdx) => (
                        <div key={`${article._id}-${rIdx}`} className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm hover:shadow-md transition-all group">
                           <div className="flex justify-between items-start mb-3 border-b border-slate-100 pb-2">
                               <div>
                                 <div className="font-bold text-base text-slate-900">{reviewer.name}</div>
                                 <div className="text-[10px] text-slate-400 mt-0.5">Recommended in: {article.manuscriptId || 'ID Pending'}</div>
                               </div>
                               <button 
                                 onClick={() => openAssignModal(article)}
                                 className="text-xs font-semibold bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition"
                               >
                                 Assign
                               </button>
                           </div>
                           
                           <div className="text-xs text-slate-700 grid grid-cols-1 gap-y-2">
                               <div className="grid grid-cols-[80px_1fr] gap-2 items-baseline">
                                 <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Contact</span>
                                 <div className="font-medium text-slate-900">
                                   <div>{reviewer.email}</div>
                                   {reviewer.phone && <div className="text-slate-500 mt-0.5">{reviewer.phone}</div>}
                                 </div>
                               </div>

                               {(reviewer.designation || reviewer.department) && (
                                <div className="grid grid-cols-[80px_1fr] gap-2 items-baseline">
                                  <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Position</span>
                                  <div>
                                    {reviewer.designation && <span className="font-medium block">{reviewer.designation}</span>}
                                    {reviewer.department && <span className="text-slate-600 block">{reviewer.department}</span>}
                                  </div>
                                </div>
                               )}

                               {(reviewer.college || reviewer.institution || reviewer.university) && (
                                <div className="grid grid-cols-[80px_1fr] gap-2 items-baseline">
                                  <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Affiliation</span>
                                  <div>
                                    {[reviewer.college, reviewer.university, reviewer.institution].filter(Boolean).map((item, i) => (
                                      <div key={i} className="block">{item}</div>
                                    ))}
                                    {reviewer.country && <div className="text-slate-500 mt-0.5">{reviewer.country}</div>}
                                  </div>
                                </div>
                               )}

                                <div className="grid grid-cols-[80px_1fr] gap-2 items-baseline pt-2 mt-1 border-t border-slate-50">
                                  <span className="text-emerald-600 text-[10px] uppercase font-bold tracking-wider">Expertise</span>
                                  <div className="font-medium text-slate-800 leading-relaxed">
                                    {reviewer.expertise ? reviewer.expertise : <span className="text-slate-400 italic font-normal">Not provided</span>}
                                  </div>
                                </div>
                           </div>
                        </div>
                      ))
                   )}
                </div>              </div>
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

          {/* Payment & Email Templates Grid */}
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
        </>
      ) : (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900">User Inquiries</h2>
            <button 
              onClick={fetchInquiries}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-600"
              title="Refresh Inquiries"
            >
              <svg className={`w-5 h-5 ${inquiriesLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

          {inquiriesLoading && inquiries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader />
              <p className="mt-4 text-slate-500 italic">Loading inquiries...</p>
            </div>
          ) : inquiries.length === 0 ? (
            <div className="text-center py-20 rounded-2xl border-2 border-dashed border-slate-100 bg-slate-50">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">No inquiries found</h3>
              <p className="text-slate-500 max-w-xs mx-auto mt-1">When users submit the "Send an Inquiry" form, those messages will appear here.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {inquiries.map((inquiry) => (
                <div key={inquiry._id} className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-all hover:border-emerald-100">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-4 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          inquiry.status === 'new' ? 'bg-emerald-100 text-emerald-700' :
                          inquiry.status === 'replied' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {inquiry.status}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          {new Date(inquiry.createdAt).toLocaleString()}
                        </span>
                      </div>
                      
                      <div>
                        <h4 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors uppercase">{inquiry.name}</h4>
                        <a href={`mailto:${inquiry.email}`} className="text-sm font-semibold text-slate-500 hover:text-emerald-500 transition-colors">{inquiry.email}</a>
                      </div>

                      {inquiry.submissionId && (
                        <div className="inline-flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-1.5 border border-amber-100">
                          <span className="text-[10px] font-bold text-amber-600 uppercase">Related Submission</span>
                          <span className="text-sm font-mono font-bold text-amber-800">{inquiry.submissionId}</span>
                        </div>
                      )}

                      <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 relative">
                        <svg className="absolute -top-3 left-6 w-6 h-6 text-slate-100" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0l-2 4h4l-2-4z" />
                        </svg>
                        <p className="text-slate-700 text-sm italic leading-relaxed whitespace-pre-wrap">"{inquiry.message}"</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 shrink-0 md:w-48">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Actions</p>
                      <button 
                        onClick={() => updateInquiryStatus(inquiry._id, 'replied')}
                        className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700 shadow-sm"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                        Mark as Replied
                      </button>
                      <button 
                         onClick={() => updateInquiryStatus(inquiry._id, 'read')}
                         className="flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-200"
                      >
                        Mark as Read
                      </button>
                      <button 
                         onClick={() => updateInquiryStatus(inquiry._id, 'closed')}
                         className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-500 transition hover:bg-slate-50"
                      >
                        Close Inquiry
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Toast Notification */}
      {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      {/* Send Notification Modal */}
      {notificationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Send Notification</h2>
                <p className="text-sm text-slate-500">Broadcast a message to authors and reviewers</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={notificationTitle}
                  onChange={(e) => setNotificationTitle(e.target.value)}
                  placeholder="e.g., System Maintenance Notice"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Message *</label>
                <textarea
                  rows={4}
                  value={notificationMessage}
                  onChange={(e) => setNotificationMessage(e.target.value)}
                  placeholder="Write your notification message here..."
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                  <select
                    value={notificationType}
                    onChange={(e) => setNotificationType(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  >
                    <option value="info">ℹ️ Info</option>
                    <option value="update">🔄 Update</option>
                    <option value="warning">⚠️ Warning</option>
                    <option value="important">❗ Important</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Send To</label>
                  <select
                    value={notificationTargets[0]}
                    onChange={(e) => setNotificationTargets([e.target.value])}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  >
                    <option value="all">All Users</option>
                    <option value="author">Authors Only</option>
                    <option value="reviewer">Reviewers Only</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button 
                  onClick={() => {
                    setNotificationModalOpen(false);
                    setNotificationTitle('');
                    setNotificationMessage('');
                  }}
                  className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSendNotification}
                  disabled={sendingNotification}
                  className="rounded-full bg-purple-600 px-6 py-2 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {sendingNotification ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Send Notification
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
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
                      className="block w-full rounded-lg border border-slate-300 p-3 text-sm focus:border-sky-500 focus:ring-emerald-500"
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
                      href={currentArticle.manuscriptUrl.startsWith('http') ? currentArticle.manuscriptUrl : `${process.env.NEXT_PUBLIC_API_URL}/${currentArticle.manuscriptUrl}`} 
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
                      href={currentArticle.coverLetterUrl.startsWith('http') ? currentArticle.coverLetterUrl : `${process.env.NEXT_PUBLIC_API_URL}/${currentArticle.coverLetterUrl}`} 
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
                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-emerald-500 sm:text-sm"
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
                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-emerald-500 sm:text-sm"
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

      {/* Edit Article Modal */}
      {editModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
              <div className="w-full max-w-2xl rounded-2xl bg-white p-6 max-h-[90vh] overflow-y-auto">
                  <h2 className="mb-4 text-xl font-bold text-slate-900">Edit Article Details</h2>
                  <form onSubmit={handleEditSubmit} className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium text-slate-700">Title</label>
                          <input 
                              type="text" 
                              value={editFormData.title}
                              onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2"
                              required
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-slate-700">Abstract</label>
                          <textarea 
                              rows={5}
                              value={editFormData.abstract}
                              onChange={(e) => setEditFormData({...editFormData, abstract: e.target.value})}
                              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2"
                              required
                          />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-sm font-medium text-slate-700">Issue</label>
                              <input 
                                  type="text" 
                                  value={editFormData.issue}
                                  onChange={(e) => setEditFormData({...editFormData, issue: e.target.value})}
                                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2"
                                  placeholder="e.g. Vol 1, Issue 1"
                              />
                          </div>
                          <div>
                              <label className="block text-sm font-medium text-slate-700">Article Number</label>
                              <input 
                                  type="number" 
                                  value={editFormData.articleNumber}
                                  onChange={(e) => setEditFormData({...editFormData, articleNumber: e.target.value})}
                                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2"
                              />
                          </div>
                      </div>

                       {/* Simplified Author Editing - mostly just to fix typos in names if stored as objects */}
                       <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Authors (JSON RAW EDIT)</label>
                          <p className="text-xs text-slate-500 mb-2">Advanced: Edit the raw JSON for authors.</p>
                          <textarea
                             rows={4}
                             value={JSON.stringify(editFormData.authors, null, 2)}
                             onChange={(e) => {
                                 try {
                                     setEditFormData({...editFormData, authors: JSON.parse(e.target.value)})
                                 } catch (err) {
                                     // allow typing invalid json temporarily
                                 }
                             }}
                             className="block w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-xs bg-slate-50"
                          />
                       </div>

                      <div className="flex justify-end gap-2 pt-4">
                          <button 
                              type="button"
                              onClick={() => setEditModalOpen(false)}
                              className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                          >
                              Cancel
                          </button>
                          <button 
                              type="submit"
                              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                          >
                              Save Changes
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      {/* Author Details Modal */}
      {authorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 md:p-8">
            <button
              onClick={() => setAuthorModalOpen(false)}
              className="absolute right-4 top-4 rounded-full bg-slate-100 p-2 text-slate-900 hover:bg-slate-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Submitted Author Details
            </h2>
            <div className="space-y-4">
              {authorDetails.length === 0 ? (
                <p className="text-slate-500 italic text-center py-8">No author details found.</p>
              ) : (
                authorDetails.map((author, index) => (
                  <div key={index} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                        Author {author.order || index + 1} {author.isCorresponding && " (Corresponding)"}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">First Name</span>
                        <span className="text-slate-900 font-medium">{author.firstName || "N/A"}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Last Name</span>
                        <span className="text-slate-900 font-medium">{author.lastName || "N/A"}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Email</span>
                        <span className="text-emerald-600 font-medium">{author.email || "N/A"}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Institution</span>
                        <span className="text-slate-900 font-medium">{author.institution || "N/A"}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">City</span>
                        <span className="text-slate-900">{author.city || "N/A"}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Country</span>
                        <span className="text-slate-900">{author.country || "N/A"}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">ORCID</span>
                        <span className="text-slate-600 font-mono text-xs">{author.orcid || "Not provided"}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setAuthorModalOpen(false)}
                className="rounded-full bg-slate-900 px-8 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition shadow-lg hover:shadow-xl"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Reviewer Modal */}
      {assignModalOpen && currentArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-4 shrink-0">
              <h2 className="text-xl font-bold text-slate-900">Assign Reviewer</h2>
              <button onClick={() => setAssignModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="mb-4 shrink-0">
              <input 
                type="text" 
                placeholder="Search reviewers by name, email, or expertise..." 
                value={assignSearchQuery}
                onChange={(e) => setAssignSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {reviewers
                .filter(r => {
                   const q = assignSearchQuery.toLowerCase();
                   return (
                     r.name.toLowerCase().includes(q) || 
                     r.email.toLowerCase().includes(q) ||
                     (r.expertise && r.expertise.toLowerCase().includes(q)) ||
                     (r.affiliation && r.affiliation.toLowerCase().includes(q))
                   );
                })
                .map(reviewer => {
                  const isAssigned = currentArticle.reviewers?.some(prev => prev.user === reviewer._id);
                  return (
                    <div key={reviewer._id} className={`p-4 rounded-xl border ${isAssigned ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 hover:border-emerald-300 transition'}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-slate-900">{reviewer.name}</h4>
                          <p className="text-sm text-slate-500">{reviewer.email}</p>
                          <p className="text-xs text-slate-600 mt-1">{reviewer.affiliation || reviewer.workplace || "No Affiliation"}</p>
                          {reviewer.expertise && (
                             <p className="text-xs font-semibold text-emerald-700 mt-1">Expertise: {reviewer.expertise}</p>
                          )}
                        </div>
                        {isAssigned ? (
                          <span className="text-xs font-bold text-emerald-600 px-3 py-1 bg-emerald-100 rounded-full">Assigned</span>
                        ) : (
                          <button 
                            onClick={() => handleAssignReviewer(currentArticle._id, reviewer._id)}
                            className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-emerald-600 transition"
                          >
                            Assign
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
                {reviewers.length === 0 && <p className="text-center text-slate-500 py-8">No reviewers found.</p>}
            </div>
          </div>
        </div>
      )}
      {/* Reviewer Analytics Modal */}
      {analyticsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 transition-all">
          <div className="w-full max-w-5xl rounded-3xl bg-slate-50 p-6 md:p-8 h-[90vh] flex flex-col shadow-2xl">
            <div className="flex justify-between items-center mb-6 shrink-0">
              <div>
                 <h2 className="text-2xl font-bold text-slate-900">Reviewer Analytics</h2>
                 <p className="text-sm text-slate-500 mt-1">Track reviewer performance, workload, and history.</p>
              </div>
              <button onClick={() => setAnalyticsModalOpen(false)} className="rounded-full p-2 bg-white text-slate-400 hover:text-red-500 shadow-sm transition">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
               <div className="grid grid-cols-1 gap-6">
                 {reviewers.map(reviewer => {
                   // Calculate Stats
                   const history = articles.flatMap(a => (a.reviewers || []).filter(r => r.user === reviewer._id).map(r => ({...r, articleTitle: a.title, manuscriptId: a.manuscriptId, articleId: a._id})));
                   
                   const completed = history.filter(h => h.status === 'completed');
                   const working = history.filter(h => ['accepted', 'under_review', 'revision_required'].includes(h.status));
                   const toWork = history.filter(h => h.status === 'invited');
                   const declined = history.filter(h => ['declined', 'rejected'].includes(h.status));

                   const hasActivity = history.length > 0;

                   return (
                     <div key={reviewer._id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                       <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                          {/* Profile Side */}
                          <div className="w-full md:w-1/4 shrink-0">
                             <div className="flex items-center gap-3 mb-2">
                               <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-lg">
                                 {reviewer.name.charAt(0)}
                               </div>
                               <div>
                                 <h3 className="font-bold text-slate-900 leading-tight">{reviewer.name}</h3>
                                 <p className="text-xs text-slate-500">{reviewer.email}</p>
                                 <p className="text-[10px] text-slate-400 mt-1">{reviewer.affiliation || reviewer.workplace || "No Affiliation"}</p>
                               </div>
                             </div>
                             {reviewer.expertise && (
                               <div className="mt-3 text-[11px] leading-relaxed text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                                 <span className="font-bold text-slate-800">Expertise:</span> {reviewer.expertise}
                               </div>
                             )}
                          </div>

                          {/* Analytics Grid */}
                          <div className="w-full md:w-3/4 grid grid-cols-1 md:grid-cols-3 gap-4">
                             {/* WORKED (Completed) */}
                             <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-4">
                               <div className="flex items-center justify-between mb-3">
                                 <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Worked (Completed)</span>
                                 <span className="text-xl font-black text-emerald-600">{completed.length}</span>
                               </div>
                               <div className="space-y-2">
                                 {completed.length === 0 && <div className="text-[10px] italic text-slate-400">No completed reviews yet.</div>}
                                 {completed.map((item, i) => (
                                   <div key={i} className="bg-white p-2 rounded border border-emerald-100/50 shadow-sm">
                                      <div className="flex justify-between items-start">
                                        <div className="text-[11px] font-semibold text-slate-800 line-clamp-1" title={item.articleTitle}>{item.articleTitle}</div>
                                        <div className="text-[9px] font-mono text-slate-400 shrink-0 ml-2">{item.manuscriptId}</div>
                                      </div>
                                      <div className="mt-1 flex justify-between items-center">
                                         <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                                            {item.decision ? item.decision.replace('_', ' ').toUpperCase() : 'DONE'}
                                         </span>
                                         <span className="text-[9px] text-slate-400">{new Date(item.date).toLocaleDateString()}</span>
                                      </div>
                                   </div>
                                 ))}
                               </div>
                             </div>

                             {/* WORKING (Ongoing) */}
                             <div className="rounded-xl border border-blue-100 bg-blue-50/30 p-4">
                               <div className="flex items-center justify-between mb-3">
                                 <span className="text-xs font-bold uppercase tracking-wider text-blue-800">Working (Active)</span>
                                 <span className="text-xl font-black text-blue-600">{working.length}</span>
                               </div>
                               <div className="space-y-2">
                                 {working.length === 0 && <div className="text-[10px] italic text-slate-400">No active reviews.</div>}
                                 {working.map((item, i) => (
                                   <div key={i} className="bg-white p-2 rounded border border-blue-100/50 shadow-sm">
                                      <div className="flex justify-between items-start">
                                        <div className="text-[11px] font-semibold text-slate-800 line-clamp-1" title={item.articleTitle}>{item.articleTitle}</div>
                                      </div>
                                      <div className="mt-1 flex justify-between items-center">
                                         <span className="text-[10px] text-blue-600 font-medium lowercase first-letter:uppercase">
                                            {item.status.replace('_', ' ')}
                                         </span>
                                         <span className="text-[9px] text-slate-400">{new Date(item.date).toLocaleDateString()}</span>
                                      </div>
                                   </div>
                                 ))}
                               </div>
                             </div>

                             {/* NEED TO WORK (Pending) */}
                             <div className="rounded-xl border border-amber-100 bg-amber-50/30 p-4">
                               <div className="flex items-center justify-between mb-3">
                                 <span className="text-xs font-bold uppercase tracking-wider text-amber-800">Need to Work (Invited)</span>
                                 <span className="text-xl font-black text-amber-600">{toWork.length}</span>
                               </div>
                               <div className="space-y-2">
                                 {toWork.length === 0 && <div className="text-[10px] italic text-slate-400">No pending invitations.</div>}
                                 {toWork.map((item, i) => (
                                   <div key={i} className="bg-white p-2 rounded border border-amber-100/50 shadow-sm">
                                      <div className="flex justify-between items-start">
                                        <div className="text-[11px] font-semibold text-slate-800 line-clamp-1" title={item.articleTitle}>{item.articleTitle}</div>
                                      </div>
                                      <div className="mt-1 text-[10px] text-amber-600 font-medium">
                                         Awaiting Acceptance
                                      </div>
                                   </div>
                                 ))}
                               </div>
                             </div>
                          </div>
                       </div>
                     </div>
                   );
                 })}
                 {reviewers.length === 0 && <div className="text-center text-slate-500 py-10">No reviewers found to analyze.</div>}
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

