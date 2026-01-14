"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [formData, setFormData] = useState({
    orcid: "",
    workplace: "Academic",
    jobType: "",
    title: "",
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    facebook: "",
    twitter: "",
    affiliation: "",
    address1: "",
    address2: "",
    zipCode: "",
    city: "",
    country: "India", // Default based on screenshot
    biography: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          setFormData({
            orcid: data.orcid || "",
            workplace: data.workplace || "Academic",
            jobType: data.jobType || "",
            title: data.title || "",
            firstName: data.firstName || data.name?.split(" ")[0] || "",
            middleName: data.middleName || "",
            lastName: data.lastName || data.name?.split(" ").slice(1).join(" ") || "",
            email: data.email || "",
            facebook: data.facebook || "",
            twitter: data.twitter || "",
            affiliation: data.affiliation || "",
            address1: data.address1 || "",
            address2: data.address2 || "",
            zipCode: data.zipCode || "",
            city: data.city || "",
            country: data.country || "India",
            biography: data.biography || "",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        // Update local storage user data if needed for header consistency
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        // Update basic info that might be used in header
        currentUser.name = `${data.firstName} ${data.lastName}`.trim() || currentUser.name;
        localStorage.setItem("user", JSON.stringify(currentUser));
         // Dispatch auth change to update header
        window.dispatchEvent(new Event("auth-change"));

        setMessage({ type: "success", text: "Profile updated successfully." });
      } else {
        setMessage({ type: "error", text: "Failed to update profile." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
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
                <a href="#" className="rounded-md px-3 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50">Dashboard</a>
                 <a href="#" className="rounded-md bg-teal-700 px-3 py-2 text-sm font-medium text-white">Profile</a>
                 <Link href="/account/view" className="rounded-md px-3 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50">View Profile Data</Link>
              </nav>
            </div>
             <div>
              <h3 className="mb-2 text-sm font-bold uppercase text-slate-500">Submissions</h3>
              <nav className="flex flex-col space-y-1">
                 <a href="/submit" className="rounded-md px-3 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50">Submit</a>
                 <a href="/author?filter=active" className="rounded-md px-3 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50">Submitted Manuscripts</a>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
             <div className="mb-6 bg-white shadow-sm ring-1 ring-slate-900/5 sm:rounded-xl">
                 <div className="border-b border-slate-200 px-4 py-4 sm:px-6">
                    <h2 className="text-lg font-medium leading-6 text-slate-900">Edit Profile Data</h2>
                 </div>
                 <div className="px-4 py-4 sm:px-6 bg-slate-800 text-white">
                    <h3 className="text-sm font-bold">Edit Profile</h3>
                 </div>
                 
                 <div className="px-4 py-6 sm:px-6">
                     {message.text && (
                        <div className={`mb-4 p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {message.text}
                        </div>
                     )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* ORCID */}
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 items-center">
                            <label htmlFor="orcid" className="block text-sm font-medium leading-6 text-slate-900 sm:text-right sm:col-span-2">
                                ORCID
                            </label>
                            <div className="sm:col-span-4 flex items-center gap-2">
                                <span className="text-teal-600 font-bold">iD</span>
                                <input
                                    type="text"
                                    name="orcid"
                                    id="orcid"
                                    value={formData.orcid}
                                    onChange={handleChange}
                                    placeholder="Create or connect your ORCID iD"
                                    className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                         {/* Workplace */}
                         <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 items-center">
                            <label htmlFor="workplace" className="block text-sm font-medium leading-6 text-slate-900 sm:text-right sm:col-span-2">
                                <span className="text-red-500">*</span> Workplace
                            </label>
                            <div className="sm:col-span-4">
                                <select
                                    id="workplace"
                                    name="workplace"
                                    value={formData.workplace}
                                    onChange={handleChange}
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                                >
                                    <option value="Academic">Academic</option>
                                    <option value="Corporate">Corporate</option>
                                    <option value="Government">Government</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        {/* Job Type */}
                         <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 items-center">
                            <label htmlFor="jobType" className="block text-sm font-medium leading-6 text-slate-900 sm:text-right sm:col-span-2">
                                <span className="text-red-500">*</span> Job Type
                            </label>
                            <div className="sm:col-span-4">
                                <input
                                    type="text"
                                    name="jobType"
                                    id="jobType"
                                    required
                                    value={formData.jobType}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        {/* Title */}
                         <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 items-center">
                            <label htmlFor="title" className="block text-sm font-medium leading-6 text-slate-900 sm:text-right sm:col-span-2">
                                <span className="text-red-500">*</span> Title
                            </label>
                            <div className="sm:col-span-4">
                                 <select
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                                >
                                    <option value="">Select...</option>
                                    <option value="Mr.">Mr.</option>
                                    <option value="Mrs.">Mrs.</option>
                                    <option value="Ms.">Ms.</option>
                                    <option value="Dr.">Dr.</option>
                                    <option value="Prof.">Prof.</option>
                                </select>
                            </div>
                        </div>

                        {/* First Name */}
                         <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 items-center">
                            <label htmlFor="firstName" className="block text-sm font-medium leading-6 text-slate-900 sm:text-right sm:col-span-2">
                                <span className="text-red-500">*</span> First name
                            </label>
                            <div className="sm:col-span-4">
                                <input
                                    type="text"
                                    name="firstName"
                                    id="firstName"
                                    required
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                         {/* Middle Name */}
                         <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 items-center">
                            <label htmlFor="middleName" className="block text-sm font-medium leading-6 text-slate-900 sm:text-right sm:col-span-2">
                                Middle name
                            </label>
                            <div className="sm:col-span-4">
                                <input
                                    type="text"
                                    name="middleName"
                                    id="middleName"
                                    value={formData.middleName}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        {/* Last Name */}
                         <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 items-center">
                            <label htmlFor="lastName" className="block text-sm font-medium leading-6 text-slate-900 sm:text-right sm:col-span-2">
                                <span className="text-red-500">*</span> Last name
                            </label>
                            <div className="sm:col-span-4">
                                <input
                                    type="text"
                                    name="lastName"
                                    id="lastName"
                                    required
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        {/* Facebook */}
                         <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 items-center">
                            <label htmlFor="facebook" className="block text-sm font-medium leading-6 text-slate-900 sm:text-right sm:col-span-2">
                                Facebook
                            </label>
                            <div className="sm:col-span-4">
                                <input
                                    type="text"
                                    name="facebook"
                                    id="facebook"
                                    value={formData.facebook}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                         {/* Twitter */}
                         <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 items-center">
                            <label htmlFor="twitter" className="block text-sm font-medium leading-6 text-slate-900 sm:text-right sm:col-span-2">
                                Twitter
                            </label>
                            <div className="sm:col-span-4">
                                <input
                                    type="text"
                                    name="twitter"
                                    id="twitter"
                                    value={formData.twitter}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        {/* Affiliation */}
                         <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 items-center">
                            <label htmlFor="affiliation" className="block text-sm font-medium leading-6 text-slate-900 sm:text-right sm:col-span-2">
                                <span className="text-red-500">*</span> Affiliation
                            </label>
                            <div className="sm:col-span-4">
                                <input
                                    type="text"
                                    name="affiliation"
                                    id="affiliation"
                                    required
                                    value={formData.affiliation}
                                    onChange={handleChange}
                                     placeholder="e.g. University of Technology"
                                    className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                         {/* Address 1 */}
                         <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 items-center">
                            <label htmlFor="address1" className="block text-sm font-medium leading-6 text-slate-900 sm:text-right sm:col-span-2">
                                <span className="text-red-500">*</span> Address 1
                            </label>
                            <div className="sm:col-span-4">
                                <input
                                    type="text"
                                    name="address1"
                                    id="address1"
                                    required
                                    value={formData.address1}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        {/* Address 2 */}
                         <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 items-center">
                            <label htmlFor="address2" className="block text-sm font-medium leading-6 text-slate-900 sm:text-right sm:col-span-2">
                                Address 2
                            </label>
                            <div className="sm:col-span-4">
                                <input
                                    type="text"
                                    name="address2"
                                    id="address2"
                                    value={formData.address2}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                         {/* Zip Code */}
                         <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 items-center">
                            <label htmlFor="zipCode" className="block text-sm font-medium leading-6 text-slate-900 sm:text-right sm:col-span-2">
                                <span className="text-red-500">*</span> Zip Code
                            </label>
                            <div className="sm:col-span-4">
                                <input
                                    type="text"
                                    name="zipCode"
                                    id="zipCode"
                                    required
                                    value={formData.zipCode}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                         {/* City */}
                         <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 items-center">
                            <label htmlFor="city" className="block text-sm font-medium leading-6 text-slate-900 sm:text-right sm:col-span-2">
                                <span className="text-red-500">*</span> City
                            </label>
                            <div className="sm:col-span-4">
                                <input
                                    type="text"
                                    name="city"
                                    id="city"
                                    required
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                         {/* Country */}
                         <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 items-center">
                            <label htmlFor="country" className="block text-sm font-medium leading-6 text-slate-900 sm:text-right sm:col-span-2">
                                <span className="text-red-500">*</span> Country/Region
                            </label>
                            <div className="sm:col-span-4">
                                 <select
                                    id="country"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                                >
                                    <option value="India">India</option>
                                    <option value="USA">USA</option>
                                    <option value="UK">UK</option>
                                    <option value="Canada">Canada</option>
                                    <option value="Australia">Australia</option>
                                    {/* Add more countries as needed */}
                                </select>
                            </div>
                        </div>

                         {/* Biography */}
                         <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 items-start">
                            <label htmlFor="biography" className="block text-sm font-medium leading-6 text-slate-900 sm:text-right sm:col-span-2 sm:pt-2">
                                Biography
                            </label>
                            <div className="sm:col-span-4">
                                <textarea
                                    id="biography"
                                    name="biography"
                                    rows={4}
                                    value={formData.biography}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-5">
                            <button
                                type="submit"
                                disabled={saving}
                                className="rounded-md bg-slate-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600 disabled:opacity-50"
                            >
                                {saving ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </form>
                 </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
