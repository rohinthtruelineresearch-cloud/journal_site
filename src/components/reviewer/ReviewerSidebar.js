export default function ReviewerSidebar({ articles = [], currentFilter, onFilterChange, user }) {
    
  // Get counts based on specific reviewer status
  const counts = {
    invitations: articles.filter(a => {
        const rev = a.reviewers?.find(r => r.user?._id === user?._id || r.user === user?._id);
        return rev?.status === 'invited';
    }).length,
    active: articles.filter(a => {
        const rev = a.reviewers?.find(r => r.user?._id === user?._id || r.user === user?._id);
        return rev?.status === 'accepted';
    }).length,
    completed: articles.filter(a => {
        const rev = a.reviewers?.find(r => r.user?._id === user?._id || r.user === user?._id);
        return rev?.status === 'completed';
    }).length,
    all: articles.length
  };

  const navItems = [
    { id: 'all', label: 'All Manuscripts', count: counts.all },
    { id: 'invitations', label: 'Pending Invitations', count: counts.invitations },
    { id: 'review_requested', label: 'Active Reviews', count: counts.active },
    { id: 'completed', label: 'Completed Reviews', count: counts.completed },
  ];

  return (
    <aside className="w-full shrink-0 border-r border-slate-200 bg-white md:w-64 min-h-[calc(100vh-64px)]">
      <div className="p-4">
        <h3 className="flex items-center gap-2 px-2 text-sm font-bold text-slate-700">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-teal-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
            </svg>
          Reviewer Workspace
        </h3>
      </div>
      <nav className="space-y-1 px-2 pb-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onFilterChange(item.id)}
            className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              currentFilter === item.id
                ? 'bg-teal-50 text-teal-700 font-bold'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
               <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ring-1 ${
                   currentFilter === item.id
                   ? 'bg-teal-600 text-white ring-transparent'
                   : 'bg-transparent ring-slate-300'
               }`}>
                   {item.count}
               </span>
              {item.label}
            </div>
          </button>
        ))}
      </nav>
      
      <div className="absolute bottom-0 w-full p-4 md:w-64 border-t border-slate-100">
          <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
              <p>Review Guidelines:</p>
              <ul className="mt-1 list-disc pl-3 space-y-1">
                  <li>Check methodology</li>
                  <li>Verify references</li>
                  <li>Be constructive</li>
              </ul>
          </div>
      </div>
    </aside>
  );
}
