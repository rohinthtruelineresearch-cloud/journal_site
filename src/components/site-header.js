"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { journalInfo } from "@/data/journal";
import { useState, useEffect, useRef } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/guidelines", label: "Guidelines" },
  { href: "/current-issue", label: "Issue" },
  { href: "/contact", label: "Contact" },
  // { href: "/admin", label: "Admin" }, // Removed Admin from main nav, moved to dropdown
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Check for user session via API
    // Check for user session via API
    const checkUser = async () => {
      // Optimistic check from localStorage
      const userStr = localStorage.getItem("user");
      if (userStr) {
        setUser(JSON.parse(userStr));
      }

      // Verify with backend (Cookie check)
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile?t=${Date.now()}`, { // Cache bust param
           credentials: "include",
           headers: {
             'Cache-Control': 'no-store',
             'Pragma': 'no-cache'
           }
        });
        if (res.ok) {
           const userData = await res.json();
           setUser(userData);
           localStorage.setItem("user", JSON.stringify(userData));
        } else {
           // Cookie invalid or expired
           setUser(null);
           localStorage.removeItem("user");
        }
      } catch (error) {
         // Network error or other
      }
    };

    checkUser();

    // Listen for custom auth-change event 
    window.addEventListener("auth-change", checkUser);
    
    // Close dropdown when clicking outside
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("auth-change", checkUser);
    };
  }, []);

  const handleLogout = async () => {
    try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/logout`, {
            method: 'POST',
            credentials: "include",
        });
    } catch (err) {
        console.error('Logout failed', err);
    }
    
    // localStorage.removeItem("token"); // Token no longer stored
    localStorage.removeItem("user");
    setUser(null);
    setIsDropdownOpen(false);
    window.dispatchEvent(new Event("auth-change")); // Notify other components
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4 md:px-10">
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-yellow-500 text-white shadow-[0_10px_30px_-18px_rgba(15,23,42,0.7)]">
            <span className="text-lg font-semibold">AJ</span>
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-slate-900">
              {journalInfo.title}
            </div>
            <div className="text-[12px] text-slate-500">
              ISSN {journalInfo.issn} | DOI {journalInfo.doiPrefix}
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-slate-200 bg-white/80 px-2 py-1 shadow-[0_10px_35px_-25px_rgba(15,23,42,0.4)] lg:flex">
          {links.map((link) => {
            const active =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                style={active ? { color: "#ffffff" } : {}}
                className={`rounded-full px-3 py-2 text-sm transition ${
                  active
                    ? "bg-slate-900 !text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 rounded-md border border-sky-600 px-3 py-1.5 text-sm font-semibold text-sky-600 transition hover:bg-sky-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
                {user.name}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className={`h-4 w-4 transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 origin-top-right overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="border-b border-slate-100 px-4 py-4 bg-slate-50/50">
                    <p className="text-sm font-bold text-slate-900">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                  
                  <div className="py-2">
                    {user.role === 'admin' && (
                         <Link
                         href="/admin"
                         className="block px-4 py-2 text-sm text-sky-600 hover:bg-slate-50 hover:text-slate-900"
                         onClick={() => setIsDropdownOpen(false)}
                       >
                         Editorial tasks
                       </Link>
                    )}
                  </div>

                  <div className="border-t border-slate-100 py-2">
                     <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Account
                     </div>
                    <Link
                      href="/author?filter=active"
                      className="block px-4 py-2 text-sm text-sky-600 hover:bg-slate-50 hover:text-slate-900"
                    >
                      Track your research
                    </Link>
                     <Link
                      href="/subscriptions"
                      className="block px-4 py-2 text-sm text-sky-600 hover:bg-slate-50 hover:text-slate-900"
                    >
                      Subscriptions and purchases
                    </Link>
                    <Link
                      href="/account"
                      className="block px-4 py-2 text-sm text-sky-600 hover:bg-slate-50 hover:text-slate-900"
                    >
                      Manage your account
                    </Link>
                  </div>

                  <div className="border-t border-slate-100 py-2">
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-left text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    >
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden text-sm font-medium text-slate-600 transition hover:text-slate-900 md:inline-flex"
            >
              Log in
            </Link>
          )}

          <Link
            href="https://www.manuscriptlink.com/journals/aura"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center text-center rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm whitespace-nowrap transition hover:-translate-y-0.5 hover:bg-sky-200"
          >
            Submit paper
          </Link>
        </div>
      </div>

      <div className="lg:hidden">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-4 pb-4">
          {links.map((link) => {
            const active =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                style={active ? { color: "#ffffff" } : {}}
                className={`rounded-full border border-slate-200 px-3 py-1 text-xs font-medium transition ${
                  active
                    ? "bg-slate-900 !text-white"
                    : "bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}

