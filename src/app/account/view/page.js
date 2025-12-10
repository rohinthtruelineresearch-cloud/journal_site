"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ViewProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setProfileData(data);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!profileData) {
      return <div className="flex h-screen items-center justify-center">Failed to load profile data.</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 text-sm font-bold uppercase text-slate-500">Account</h3>
              <nav className="flex flex-col space-y-1">
                <a href="#" className="rounded-md px-3 py-2 text-sm font-medium text-sky-600 hover:bg-sky-50">Dashboard</a>
                 <Link href="/account" className="rounded-md px-3 py-2 text-sm font-medium text-sky-600 hover:bg-sky-50">Profile</Link>
                 <a href="#" className="rounded-md bg-teal-700 px-3 py-2 text-sm font-medium text-white">View Profile Data</a>
              </nav>
            </div>
             <div>
              <h3 className="mb-2 text-sm font-bold uppercase text-slate-500">Submissions</h3>
              <nav className="flex flex-col space-y-1">
                 <a href="/submit" className="rounded-md px-3 py-2 text-sm font-medium text-sky-600 hover:bg-sky-50">Submit</a>
                 <a href="/author?filter=active" className="rounded-md px-3 py-2 text-sm font-medium text-sky-600 hover:bg-sky-50">Submitted Manuscripts</a>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
             <div className="mb-6 bg-white shadow-sm ring-1 ring-slate-900/5 sm:rounded-xl">
                 <div className="border-b border-slate-200 px-4 py-4 sm:px-6">
                    <h2 className="text-lg font-medium leading-6 text-slate-900">Profile Data</h2>
                 </div>
                 
                 <div className="px-4 py-6 sm:px-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <dt className="text-sm font-medium text-slate-500">Metadata</dt>
                            <dd className="mt-1 text-sm text-slate-900 border-b border-slate-100 pb-2">User Information</dd>
                        </div>

                        <div>
                            <dt className="text-sm font-medium text-slate-500">ORCID</dt>
                            <dd className="mt-1 text-sm text-slate-900">{profileData.orcid || "-"}</dd>
                        </div>
                         <div>
                            <dt className="text-sm font-medium text-slate-500">Workplace</dt>
                            <dd className="mt-1 text-sm text-slate-900">{profileData.workplace || "-"}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-slate-500">Job Type</dt>
                            <dd className="mt-1 text-sm text-slate-900">{profileData.jobType || "-"}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-slate-500">Title</dt>
                            <dd className="mt-1 text-sm text-slate-900">{profileData.title || "-"}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-slate-500">Full Name</dt>
                            <dd className="mt-1 text-sm text-slate-900">{profileData.firstName} {profileData.middleName} {profileData.lastName}</dd>
                        </div>
                         <div>
                            <dt className="text-sm font-medium text-slate-500">Email</dt>
                            <dd className="mt-1 text-sm text-slate-900">{profileData.email}</dd>
                        </div>
                         <div>
                            <dt className="text-sm font-medium text-slate-500">Affiliation</dt>
                            <dd className="mt-1 text-sm text-slate-900">{profileData.affiliation || "-"}</dd>
                        </div>
                         <div>
                            <dt className="text-sm font-medium text-slate-500">Country</dt>
                            <dd className="mt-1 text-sm text-slate-900">{profileData.country || "-"}</dd>
                        </div>
                        
                         <div className="sm:col-span-2">
                            <dt className="text-sm font-medium text-slate-500">Address</dt>
                            <dd className="mt-1 text-sm text-slate-900">
                                {profileData.address1}<br/>
                                {profileData.address2 && <>{profileData.address2}<br/></>}
                                {profileData.city}, {profileData.zipCode}
                            </dd>
                        </div>

                         <div className="sm:col-span-2">
                            <dt className="text-sm font-medium text-slate-500">Biography</dt>
                             <dd className="mt-1 text-sm text-slate-900 whitespace-pre-wrap">{profileData.biography || "No biography provided."}</dd>
                        </div>

                         <div className="sm:col-span-2 border-t border-slate-100 pt-4 mt-2">
                             <dt className="text-sm font-medium text-slate-500">Socials</dt>
                             <dd className="mt-2 flex gap-4 text-sm text-slate-900">
                                {profileData.facebook && (
                                     <div className="flex flex-col">
                                         <span className="text-xs text-slate-400">Facebook</span>
                                         <span>{profileData.facebook}</span>
                                     </div>
                                )}
                                {profileData.twitter && (
                                     <div className="flex flex-col">
                                         <span className="text-xs text-slate-400">Twitter</span>
                                          <span>{profileData.twitter}</span>
                                     </div>
                                )}
                                {!profileData.facebook && !profileData.twitter && <span className="text-slate-400 italic">No social links provided</span>}
                             </dd>
                        </div>

                    </dl>
                 </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
