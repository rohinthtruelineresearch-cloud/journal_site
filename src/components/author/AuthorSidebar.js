export default function AuthorSidebar({ articles = [], currentFilter, onFilterChange }) {
    
  const counts = {
    active: articles.filter(a => a.status !== 'published' && a.status !== 'rejected').length,
    revisionsRequested: articles.filter(a => a.status === 'revision_required').length,
    revisionsSubmitted: 0, // Not explicitly tracked in simple status enum yet
    incomplete: 0, // Not tracked
    scheduled: 0, // Not tracked
    published: articles.filter(a => a.status === 'published').length,
    declined: articles.filter(a => a.status === 'rejected').length,
  };

  const navItems = [
    { id: 'active', label: 'Active submissions', count: counts.active },
    { id: 'revision_required', label: 'Revisions requested', count: counts.revisionsRequested },
    { id: 'revisions_submitted', label: 'Revisions submitted', count: counts.revisionsSubmitted },
    { id: 'incomplete', label: 'Incomplete submissions', count: counts.incomplete },
    { id: 'scheduled', label: 'Scheduled for publication', count: counts.scheduled },
    { id: 'published', label: 'Published', count: counts.published },
    { id: 'rejected', label: 'Declined', count: counts.declined },
  ];

  return (
    <aside className="w-full shrink-0 border-r border-slate-200 bg-white md:w-64">
      <div className="p-4">
        <h3 className="flex items-center gap-2 px-2 text-sm font-bold text-slate-700">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
          My Submissions as Author
        </h3>
      </div>
      <nav className="space-y-1 px-2 pb-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onFilterChange(item.id)}
            className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              currentFilter === item.id
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
               <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ring-1 ${
                   currentFilter === item.id
                   ? 'bg-white text-slate-900 ring-transparent'
                   : 'bg-transparent ring-slate-300'
               }`}>
                   {item.count}
               </span>
              {item.label}
            </div>
          </button>
        ))}
        
        <div className="mt-4 border-t border-slate-200 pt-4">
            <a href="/submit" className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium text-sky-600 hover:bg-sky-50 hover:text-sky-700 rounded-md">
                Start A New Submission
            </a>
        </div>
      </nav>
    </aside>
  );
}
