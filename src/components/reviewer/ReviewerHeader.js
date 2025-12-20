import Link from 'next/link';
import NotificationBell from '@/components/NotificationBell';

export default function ReviewerHeader({ user }) {
  return (
    <header className="bg-slate-900 text-white shadow-md border-b-4 border-teal-500">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xl font-bold tracking-tight text-white hover:text-slate-200">
            Journal Site
          </Link>
          <span className="hidden text-slate-400 sm:inline">|</span>
          <span className="hidden text-sm font-medium text-teal-400 sm:inline uppercase tracking-wider">Reviewer Portal</span>
           <Link href="/author" className="ml-4 rounded-full bg-slate-700 px-3 py-1 text-xs font-semibold text-white hover:bg-slate-600">
               Switch to Author Portal
           </Link>
        </div>
        
        <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <div className="text-white">
              <NotificationBell />
            </div>
            
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 overflow-hidden rounded-full bg-teal-600 ring-2 ring-white/20">
               {/* Placeholder for user avatar if available, else initials */}
              <div className="flex h-full w-full items-center justify-center text-xs font-bold">
                 {user?.name ? user.name.charAt(0).toUpperCase() : 'R'}
              </div>
            </div>
             <span className="hidden text-sm font-medium text-white sm:block">
                {user?.name || 'Reviewer'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

