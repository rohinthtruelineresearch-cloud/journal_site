"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to send reset email (Future Implementation)
    setSubmitted(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-slate-200 bg-white p-10 shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Forgot password?
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Enter your email to receive reset instructions
          </p>
        </div>

        {!submitted ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <button
              type="submit"
              className="flex w-full justify-center rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              Send Reset Link
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
            <h3 className="text-lg font-medium text-slate-900">Check your email</h3>
            <p className="text-sm text-slate-600">
              We have sent a password reset link to <strong>{email}</strong>.
            </p>
             <Link href="/login" className="block text-sm font-bold text-slate-900 hover:underline mt-6">
                Back to Login
              </Link>
          </div>
        )}
      </div>
    </div>
  );
}
