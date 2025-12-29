"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams();
  const { token } = params;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/resetpassword/${token}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ password })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => {
           router.push("/login");
        }, 3000);
      } else {
        setError(data.error || "Failed to reset password");
      }
    } catch (err) {
      setError("Something went wrong");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-slate-200 bg-white p-10 shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Reset Password
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Enter your new password below
          </p>
        </div>

        {!submitted ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                New Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
                <div className="text-red-500 text-sm text-center font-medium">
                    {error}
                </div>
            )}

            <button
              type="submit"
              className="flex w-full justify-center rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              Reset Password
            </button>
            
            <div className="text-center">
              <Link href="/login" className="text-sm font-medium text-sky-600 hover:text-sky-500">
                Back to Login
              </Link>
            </div>
          </form>
        ) : (
          <div className="mt-8 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
               <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
               </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-900">Password Reset Successful</h3>
            <p className="text-sm text-slate-600">
              You can now login with your new password. Redirecting to login...
            </p>
             <Link href="/login" className="block text-sm font-bold text-slate-900 hover:underline mt-6">
                Login Now
              </Link>
          </div>
        )}
      </div>
    </div>
  );
}
