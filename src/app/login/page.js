"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Handle Google Login Success
    // Handle Google Login Success
    const success = searchParams.get("success");
    const token = searchParams.get("token");

    if (success && token) {
      // Save token immediately
      localStorage.setItem("token", token);

      // Fetch user details using the new token
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(async (res) => {
            if (res.ok) return res.json();
            const text = await res.text();
            throw new Error(`Profile fetch failed: ${res.status} ${text}`);
        })
        .then((data) => {
          localStorage.setItem("user", JSON.stringify(data));
          window.dispatchEvent(new Event("auth-change")); // Notify header
          
          const fromQuery = searchParams.get("from");
          const fromSession = sessionStorage.getItem("redirectAfterLogin");
          const redirectTo = fromQuery || fromSession;
          
          if (fromSession) sessionStorage.removeItem("redirectAfterLogin");

          if (redirectTo) {
            router.push(redirectTo);
          } else if (data.role === "admin") {
            router.push("/admin");
          } else if (data.role === "reviewer") {
            router.push("/reviewer");
          } else {
            router.push("/author");
          }
        })
        .catch((err) => {
          console.error("Failed to fetch user profile", err);
          setError(`Google Login Failed: ${err.message}`);
        });
    } else if (success) {
       setError("Login successful but token missing from URL.");
    }
  }, [searchParams, router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include", // Important for setting the cookie
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token); // Store token for header auth
        localStorage.setItem("user", JSON.stringify(data));
        
        window.dispatchEvent(new Event("auth-change"));
        
        if (data.role === "admin") {
          router.push("/admin");
        } else if (data.role === "reviewer") {
          router.push("/reviewer");
        } else {
          // Check for redirect param or session storage
          const fromQuery = searchParams.get("from");
          const fromSession = sessionStorage.getItem("redirectAfterLogin");
          const redirectTo = fromQuery || fromSession;
          
          if (fromSession) sessionStorage.removeItem("redirectAfterLogin");

          if (redirectTo) {
              router.push(redirectTo);
          } else {
              router.push("/author");
          }
        }
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const from = searchParams.get("from");
    if (from) {
      sessionStorage.setItem("redirectAfterLogin", from);
    }
    
    // We want the backend to redirect back to login page with ?success=true
    const origin = window.location.origin;
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/users/auth/google?from=${encodeURIComponent(origin)}`;
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      {/* Top Header */}
      <header className="px-4 py-4 md:px-8 border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            Journal of AI Enabled Innovation and Discovery
          </h1>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-gradient-to-b from-slate-100 to-slate-200 border-b border-slate-300">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex space-x-1">
            <div className="bg-slate-900 text-white px-6 py-2 text-sm font-bold rounded-t-lg">
              Log In
            </div>
            <Link href="/forgot-password" className="text-slate-700 hover:text-slate-900 px-6 py-2 text-sm font-bold border-r border-slate-300">
              Reset Password
            </Link>
            <Link href="/register" className="text-slate-700 hover:text-slate-900 px-6 py-2 text-sm font-bold border-r border-slate-300">
              Create An Account
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 md:px-8 py-6">
        {/* Warning Banner */}
        <div className="mb-8 border border-amber-200 bg-amber-50 p-4 rounded-sm flex items-start gap-3">
          <div className="text-amber-600 mt-1">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 className="text-amber-800 font-bold text-lg">Please add this site to your pop-up blocker exception list</h3>
            <p className="text-amber-700 text-sm mt-1">Blocking pop-ups on this site may prevent peer-review related e-mails from being sent.</p>
            <a href="#" className="text-sky-600 text-sm hover:underline mt-1 block">More information on disabling pop-up blockers</a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column: Login Box */}
          <div>
            <div className="border border-slate-300 rounded-lg p-6 shadow-sm bg-white">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Journal Cover Image */}
                <div className="w-full md:w-1/3 flex-shrink-0">
                  <div className="aspect-[3/4] relative overflow-hidden rounded bg-slate-100 shadow-inner">
                    <img 
                      src="/journal-cover.jpg" 
                      alt="Journal Cover" 
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>

                {/* Login Form */}
                <div className="flex-1">
                  <div className="flex justify-between items-baseline mb-4">
                    <h2 className="text-3xl font-light text-slate-600">Log In</h2>
                    <Link href="/register" className="text-xs text-sky-600 hover:underline font-bold">Create an Account</Link>
                  </div>

                  {error && (
                    <div className="mb-4 rounded bg-red-50 p-2 text-xs text-red-600 border border-red-200">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <div className="flex justify-between">
                        <label htmlFor="email" className="block text-sm font-bold text-slate-500 mb-1">User ID / Email</label>
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="block w-full rounded border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm"
                      />
                    </div>

                    <div>
                       <div className="flex justify-between items-center mb-1">
                        <label htmlFor="password" className="block text-sm font-bold text-slate-500">Password</label>
                        <Link href="/forgot-password" className="text-xs text-sky-600 hover:underline font-bold">Reset Password</Link>
                      </div>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="block w-full rounded border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="rounded bg-slate-900 px-6 py-2 text-sm font-bold text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-70 shadow-sm"
                      >
                        {loading ? "Logging in..." : "Log In"}
                      </button>
                    </div>
                  </form>
                  
                  <div className="mt-6 border-t border-slate-200 pt-4">
                    <button
                        onClick={handleGoogleLogin}
                        type="button"
                        className="w-full flex items-center justify-center gap-2 rounded bg-white border border-slate-300 px-4 py-3 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
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
                        Log in using Google
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Info */}
          <div className="text-slate-600 space-y-4">
            <p className="text-lg font-medium">Welcome to the submission site for</p>
            <h2 className="text-3xl font-light text-slate-800">
               Journal of AI Enabled Innovation and Discovery
            </h2>
            
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                To begin, <Link href="/register" className="text-sky-600 font-bold hover:underline">create an account</Link>. It only takes a few minutes.
              </p>
              <p>
                If you are unsure about whether or not you have an account, or have forgotten your password, go to the <Link href="/forgot-password" className="text-sky-600 font-bold hover:underline">Reset Password</Link> screen.
              </p>
            </div>

            <div className="my-6 border-t border-slate-200"></div>

             <div className="space-y-3 text-sm">
                <p>
                  <span className="font-bold text-sky-600">Journal of AI Enabled Innovation and Discovery</span> is a peer-reviewed, open access journal. All articles published within it are made open access under a Creative Commons licence.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
