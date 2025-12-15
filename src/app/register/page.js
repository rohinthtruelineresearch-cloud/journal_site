"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "author", // Default role
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validatePassword = (password, name) => {
    if (password.length < 8) return "Password must be at least 8 characters long";
    if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter";
    if (!/[0-9]/.test(password)) return "Password must contain at least one number";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return "Password must contain at least one symbol";
    if (name && password.toLowerCase() === name.toLowerCase()) return "Password cannot be the same as your name";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    const passwordError = validatePassword(formData.password, formData.name);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        // Save user to local storage (for display purposes, token is in cookie)
        localStorage.setItem("user", JSON.stringify(data));
        window.dispatchEvent(new Event("auth-change"));
        router.push("/"); // Redirect to home
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-slate-200 bg-white p-10 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.15)]">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Create an account
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Join the community to submit and review papers
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-700"
              >
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm"
                  placeholder="John Doe"
                />
              </div>
            </div>

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
                  value={formData.email}
                  onChange={handleChange}
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
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
              
              {/* Password Strength Meter */}
              {formData.password && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1 h-1.5">
                    {[1, 2, 3, 4].map((level) => {
                      let active = false;
                      let color = "bg-slate-200";
                      
                      const strength = [
                        formData.password.length >= 8,
                        /[A-Z]/.test(formData.password),
                        /[a-z]/.test(formData.password),
                        /[0-9]/.test(formData.password),
                        /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
                      ].filter(Boolean).length;

                      // Logic for bars
                      if (level === 1) active = strength >= 1;
                      if (level === 2) active = strength >= 3;
                      if (level === 3) active = strength >= 4;
                      if (level === 4) active = strength >= 5;

                      if (active) {
                         if (strength <= 2) color = "bg-red-500";
                         else if (strength <= 4) color = "bg-amber-400";
                         else color = "bg-emerald-500";
                      }

                      return (
                        <div key={level} className={`h-full flex-1 rounded-full transition-colors duration-300 ${active ? color : 'bg-slate-200'}`} />
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                     <span>
                        {formData.password.length < 8 && "Min 8 chars"}
                     </span>
                     <span>
                        {[
                            formData.password.length >= 8,
                            /[A-Z]/.test(formData.password),
                            /[a-z]/.test(formData.password),
                            /[0-9]/.test(formData.password),
                            /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
                        ].filter(Boolean).length < 3 ? "Weak" : 
                        [
                            formData.password.length >= 8,
                            /[A-Z]/.test(formData.password),
                            /[a-z]/.test(formData.password),
                            /[0-9]/.test(formData.password),
                            /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
                        ].filter(Boolean).length < 5 ? "Medium" : "Strong"}
                     </span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-slate-700"
              >
                I am a...
              </label>
              <div className="mt-1">
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm"
                >
                  <option value="author">Author</option>
                  <option value="reviewer">Reviewer</option>

                </select>
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-70"
            >
              {loading ? "Creating account..." : "Sign up"}
            </button>
          </div>
        </form>

        <div className="text-center text-sm">
          <p className="text-slate-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-sky-600 hover:text-sky-500"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
