import Link from 'next/link';

export default function SubmissionsTable({ articles }) {
  if (!articles || articles.length === 0) {
      return (
          <div className="p-8 text-center bg-white rounded-lg border border-slate-200 text-slate-500">
              No submissions found for this category.
          </div>
      )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-sky-600 uppercase tracking-wider w-16">
                ID <span className="text-slate-400">⇅</span>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-sky-600 uppercase tracking-wider">
                Submissions
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-sky-600 uppercase tracking-wider w-40">
                Stage
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-sky-600 uppercase tracking-wider w-40">
                Editorial Activity
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-sky-600 uppercase tracking-wider w-24">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {articles.map((article) => (
              <tr key={article._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono">
                  {article._id.slice(-4)} {/* Mocking a short ID */}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-9000">
                          {article.authors?.[0] || 'Unknown Author'} et al. —
                      </span>
                      <span className="text-sm font-semibold text-slate-800">
                          {article.title}
                      </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                   <div className="flex items-center gap-2">
                       <span className={`h-2.5 w-2.5 rounded-full ${
                           article.status === 'published' ? 'bg-green-500' :
                           article.status === 'rejected' ? 'bg-red-500' :
                           article.status === 'revision_required' ? 'bg-amber-500' :
                           'bg-purple-500'
                       }`}></span>
                        <span className="text-sm text-slate-700 capitalize">
                            {article.status.replace('_', ' ')}
                        </span>
                   </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {/* Placeholder for activity */}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link href={`/author/submission/${article._id}`} className="text-sky-600 hover:text-sky-800 hover:underline">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-slate-200 bg-slate-50 px-6 py-3 text-sm text-slate-500">
          Showing 1 to {articles.length} of {articles.length}
      </div>
    </div>
  );
}
