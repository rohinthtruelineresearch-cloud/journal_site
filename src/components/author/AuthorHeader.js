import Link from 'next/link';

export default function AuthorHeader({ user }) {
  return (
    <header className="bg-slate-900 text-white shadow-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xl font-bold tracking-tight text-white hover:text-slate-200">
            Journal Site
          </Link>
          <span className="hidden text-slate-400 sm:inline">|</span>
          <span className="hidden text-sm font-medium text-slate-300 sm:inline">Author Portal</span>
          
           {user?.role === 'reviewer' && (
              <Link href="/reviewer" className="ml-4 rounded-full bg-teal-600 px-3 py-1 text-xs font-semibold text-white hover:bg-teal-500">
                  Switch to Reviewer Portal
              </Link>
           )}
        </div>
        
        <div className="flex items-center gap-4">
            <button className="text-slate-300 hover:text-white">
                <span className="sr-only">Notifications</span>
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                </svg>
            </button>
            
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 overflow-hidden rounded-full bg-slate-700 ring-2 ring-white/20">
               {/* Placeholder for user avatar if available, else initials */}
              <div className="flex h-full w-full items-center justify-center text-xs font-bold">
                 {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
            </div>
             <span className="hidden text-sm font-medium text-white sm:block">
                {user?.name || 'Author'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
