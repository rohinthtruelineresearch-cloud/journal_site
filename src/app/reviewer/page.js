"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ReviewerHeader from "@/components/reviewer/ReviewerHeader";
import ReviewerSidebar from "@/components/reviewer/ReviewerSidebar";
import Loader from "@/components/Loader";
import PosterNotification from "@/components/PosterNotification";

export default function ReviewerPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchAssignedArticles = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/assigned`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          setArticles(Array.isArray(data) ? data : []);
        } else {
            console.error("Failed to fetch articles:", res.status);
            setArticles([]);
        }
      } catch (err) {
        console.error("Failed to fetch assigned articles", err);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedArticles();
  }, [router]);

  // Load user data from localStorage
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
  }, []);

  const filteredArticles = articles.filter(article => {
      if (filter === 'all') return true;
      
      const myReview = article.reviewers?.find(r => r.user?._id === user?._id || r.user === user?._id);
      const displayStatus = myReview?.status || 'invited';

      if (filter === 'invitations') return displayStatus === 'invited';
      if (filter === 'review_requested') return displayStatus === 'accepted';
      if (filter === 'completed') return displayStatus === 'completed';
      
      return true;
  });

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [reviewComments, setReviewComments] = useState("");
  const [reviewDecision, setReviewDecision] = useState("revision_required");
  const [submittingReview, setSubmittingReview] = useState(false);

  const openReviewModal = (article) => {
      setSelectedArticle(article);
      // Find my specific review
      const myReview = article.reviewers?.find(r => r.user === user?._id);
      
      setReviewComments(myReview?.comments || "");
      // Default to current status if applicable, else revision_required
      setReviewDecision(myReview?.status || 'revision_required');
      setReviewModalOpen(true);
  };

  const closeReviewModal = () => {
      setReviewModalOpen(false);
      setSelectedArticle(null);
      setReviewComments("");
  };

  const handleSubmitReview = async () => {
      if (!selectedArticle) return;
      setSubmittingReview(true);

      try {
          const token = localStorage.getItem("token");
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/${selectedArticle._id}`, {
              method: "PUT",
              headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({
                  status: reviewDecision,
                  reviewerComments: reviewComments
              }),
          });

          if (res.ok) {
              const updatedArticle = await res.json();
              alert("Review submitted successfully!");
              // Refresh articles with the updated article from backend
              setArticles(prevArticles => 
                  prevArticles.map(a => a._id === selectedArticle._id ? updatedArticle : a)
              );
              closeReviewModal();
          } else {
              alert("Failed to submit review");
          }
      } catch (err) {
          console.error("Error submitting review:", err);
          alert("Error submitting review");
      } finally {
          setSubmittingReview(false);
      }
  };

  const handleRespondInvitation = async (articleId, response) => {
      setLoading(true);
      try {
          const token = localStorage.getItem("token");
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/${articleId}/respond-invitation`, {
              method: "PUT",
              headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({ response }),
              credentials: 'include',
          });

          if (res.ok) {
              alert(`Invitation ${response}!`);
              // Refresh assigned articles
              const updatedRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/assigned`, {
                  headers: { Authorization: `Bearer ${token}` }
              });
              if (updatedRes.ok) {
                  const data = await updatedRes.json();
                  setArticles(Array.isArray(data) ? data : []);
              }
          } else {
              const errorData = await res.json();
              alert(`Failed: ${errorData.message || "Failed to respond to invitation"}`);
          }
      } catch (err) {
          console.error("Error responding to invitation:", err);
          alert(`Network/Server Error: ${err.message}`);
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <PosterNotification />
      {loading ? (
        <Loader />
      ) : (
        <>
          {submittingReview && <Loader overlay={true} />}
          <ReviewerHeader user={user} />
          
          <div className="mx-auto flex max-w-7xl flex-col md:flex-row">
            <ReviewerSidebar 
                articles={articles}
                currentFilter={filter}
                onFilterChange={setFilter}
                user={user}
            />

            <main className="flex-1 p-6 md:p-8">
               {/* ... (rest of the content) ... */}
             <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">
                    {filter === 'all' ? 'All Assigned Manuscripts' : 
                     filter === 'invitations' ? 'Pending Invitations' :
                     filter === 'review_requested' ? 'Active Reviews' :
                     filter === 'completed' ? 'Completed Reviews' : 'Manuscripts'}
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    Manage your assignments and submit reviews clearly and efficiently.
                </p>
            </div>

            {/* Content Area */}
             <div className="space-y-4">
                 {filteredArticles.length === 0 ? (
                     <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center">
                         <p className="text-slate-500">No manuscripts found in this category.</p>
                     </div>
                 ) : (
                     filteredArticles.map((article) => {
                         // Find the specific reviewer entry for the logged-in user to show their status/comments
                         // Since we don't have the user ID easily accessible in this map scope without prop drilling or context, 
                         // and `articles/assigned` returns articles where WE are the reviewer.
                         // But we also need to know WHICH entry is ours.
                         // We can rely on the fact that the backend filters for us. 
                         // But for display, we want to show OUR status.
                         
                         const myReview = article.reviewers?.find(r => r.user === user?._id);
                         const displayStatus = myReview?.status || 'invited';

                         return (
                             <div key={article._id} className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-start sm:justify-between transition hover:shadow-md">
                                 <div className="space-y-2">
                                     <div className="flex items-center gap-2">
                                         <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                                            ${displayStatus === 'invited' ? 'bg-blue-100 text-blue-800 animate-pulse' : 
                                              displayStatus === 'accepted' ? 'bg-green-100 text-green-800' :
                                              displayStatus === 'declined' ? 'bg-red-100 text-red-800' :
                                              'bg-slate-100 text-slate-800'}`}>
                                             {displayStatus.replace('_', ' ')}
                                         </span>
                                         <span className="text-xs text-slate-500">
                                              <span className="mr-2 font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">{article.manuscriptId || 'NO ID'}</span>
                                              Assigned: {new Date(article.createdAt).toLocaleDateString()}
                                         </span>
                                     </div>
                                     <h3 className="text-lg font-semibold text-slate-900">{article.title}</h3>
                                     <p className="text-sm text-slate-600 line-clamp-2 max-w-2xl">{article.abstract}</p>
                                 </div>
                                 
                                  <div className="flex shrink-0 flex-col gap-2 sm:items-end">
                                     {displayStatus === 'invited' ? (
                                         <div className="flex flex-col gap-2">
                                             <button 
                                                 onClick={() => handleRespondInvitation(article._id, 'accepted')}
                                                 className="rounded-lg bg-teal-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-teal-500"
                                             >
                                                 Accept Invitation
                                             </button>
                                             <button 
                                                 onClick={() => handleRespondInvitation(article._id, 'declined')}
                                                 className="rounded-lg border border-red-300 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50"
                                             >
                                                 Decline
                                             </button>
                                         </div>
                                     ) : displayStatus === 'declined' ? (
                                         <span className="text-xs text-red-500 font-semibold italic">Invitation Declined</span>
                                     ) : (
                                         <>
                                            {article.coverLetterUrl && (
                                                <a 
                                                href={`${process.env.NEXT_PUBLIC_API_URL}/${article.coverLetterUrl}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                                                >
                                                    View CV/Cover Letter
                                                </a>
                                            )}
                                            {article.manuscriptUrl && (
                                                <a 
                                                href={`${process.env.NEXT_PUBLIC_API_URL}/${article.manuscriptUrl}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                                                >
                                                    View Manuscript
                                                </a>
                                            )}
                                            <button 
                                                onClick={() => openReviewModal(article)}
                                                className="w-full sm:w-auto rounded-lg bg-teal-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-teal-500"
                                            >
                                                {displayStatus === 'completed' ? 'Update Review' : 'Submit Review'}
                                            </button>
                                         </>
                                     )}
                                  </div>
                             </div>
                         );
                     })
                 )}
             </div>
        </main>
      </div>

      {/* Review Modal */}
      {reviewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
              <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
                  <h2 className="text-xl font-bold text-slate-900">Submit Review</h2>
                  <p className="mt-1 text-sm text-slate-500">
                      For: {selectedArticle?.title}
                  </p>

                  <div className="mt-6 space-y-4">
                      <div>
                          <label className="block text-sm font-medium text-slate-700">Comments to Author</label>
                          <textarea
                              rows={5}
                              className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 sm:text-sm"
                              placeholder="Enter your constructive feedback here..."
                              value={reviewComments}
                              onChange={(e) => setReviewComments(e.target.value)}
                          />
                      </div>

                      <div>
                          <label className="block text-sm font-medium text-slate-700">Recommendation</label>
                          <select
                              className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 sm:text-sm"
                              value={reviewDecision}
                              onChange={(e) => setReviewDecision(e.target.value)}
                          >
                              <option value="revision_required">Revision Required</option>
                              <option value="accepted">Accept Submission</option>
                              <option value="rejected">Reject Submission</option>
                          </select>
                      </div>
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                      <button
                          onClick={closeReviewModal}
                          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                      >
                          Cancel
                      </button>
                      <button
                          onClick={handleSubmitReview}
                          disabled={submittingReview}
                          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-teal-500 disabled:opacity-70"
                      >
                          {submittingReview ? "Submitting..." : "Submit Review"}
                      </button>
                  </div>
              </div>
          </div>
      )}
        </>
      )}
    </div>
  );
}
