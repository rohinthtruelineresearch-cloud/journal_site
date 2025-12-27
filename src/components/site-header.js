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
      console.log("[Header] Optimistic User:", userStr); 
      if (userStr) {
        setUser(JSON.parse(userStr));
      }

      // Verify with backend (Token check)
      try {
        let token = localStorage.getItem("token");
        
        // Fallback: If token missing but user exists with token, recover it
        if (!token && userStr) {
            try {
                const parsedUser = JSON.parse(userStr);
                if (parsedUser.token) {
                    token = parsedUser.token;
                    localStorage.setItem("token", token); // Heal storage
                    console.log("[Header] Recovered token from user object");
                }
            } catch (e) {}
        }

        console.log("[Header] Token:", token);
        
        // If no token, we are definitely logged out
        if (!token) {
             console.log("[Header] No token found, clearing user.");
             setUser(null);
             return;
        }

        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/users/profile?t=${Date.now()}`;
        console.log("[Header] Fetching profile from:", apiUrl);

        const res = await fetch(apiUrl, {
           headers: {
             'Authorization': `Bearer ${token}`,
             'Cache-Control': 'no-store',
             'Pragma': 'no-cache'
           }
        });
        
        console.log("[Header] Profile Response Status:", res.status);

        if (res.ok) {
           const userData = await res.json();
           console.log("[Header] Profile Success:", userData);
           setUser(userData);
           localStorage.setItem("user", JSON.stringify(userData));
        } else {
           // Token invalid or expired
           console.log("[Header] Profile Failed (Invalid/Expired Token)", res.status);
           setUser(null);
           localStorage.removeItem("user");
           localStorage.removeItem("token");
        }
      } catch (error) {
         // Network error - keep optimistic state if possible
         console.error("[Header] Auth check network failed", error);
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
    
    localStorage.removeItem("token"); 
    localStorage.removeItem("user");
    setUser(null);
    setIsDropdownOpen(false);
    window.dispatchEvent(new Event("auth-change")); // Notify other components
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4 px-6 py-4 md:px-10 lg:px-16">
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-11 min-w-[44px] px-3 items-center justify-center rounded-xl border border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-900/20">
            <span className="text-sm font-bold tracking-wide">JAEID</span>
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
           <Link
                href="https://chat.whatsapp.com/BZoRJL7rCDgFMPvixsS3Dp"
                className="hidden xl:flex items-center gap-2 rounded-full bg-green-500 px-3 py-1.5 text-xs font-semibold text-white shadow-lg shadow-green-500/20 transition hover:-translate-y-0.5 hover:bg-green-600 animate-pulse"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                  className="h-4 w-4"
                >
                  <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
                </svg>
                Join community
          </Link>
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

          {/* <Link
            href="https://www.manuscriptlink.com/journals/aura"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center text-center rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm whitespace-nowrap transition hover:-translate-y-0.5 hover:bg-sky-200"
          >
            Submit paper
          </Link> */}
        </div>
      </div>

      <div className="lg:hidden">
        <div className="flex flex-wrap items-center gap-2 px-6 pb-4 md:px-10 lg:px-16">
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

