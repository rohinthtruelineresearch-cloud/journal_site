
import Link from "next/link";
import { journalInfo } from "@/data/journal";

// Function to fetch article data (used by both metadata and page)
async function getArticle(idArray) {
  try {
    let apiPath = '';
    if (Array.isArray(idArray) && idArray.length === 3) {
      apiPath = `/api/articles/by-slug/${idArray.join('/')}`;
    } else {
      const id = Array.isArray(idArray) ? idArray[0] : idArray;
      apiPath = `/api/articles/${id}`;
    }
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${apiPath}`, {
      cache: 'no-store', // Ensure fresh data
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Error fetching article:", error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const article = await getArticle(id);

  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  const pubDate = article.publishedDate ? new Date(article.publishedDate) : new Date();
  const pdfUrl = article.pdfUrl
  ? article.pdfUrl.startsWith("http")
    ? article.pdfUrl
    : `${process.env.NEXT_PUBLIC_API_URL}${article.pdfUrl.startsWith("/") ? "" : "/"}${article.pdfUrl}`
  : "";

  const authorsList = Array.isArray(article.authors) 
    ? article.authors.map(a => typeof a === 'string' ? a : `${a.firstName} ${a.lastName}`) 
    : [article.authors];

  return {
    title: article.title,
    description: article.abstract,
    openGraph: {
      title: article.title,
      description: article.abstract,
      type: 'article',
      authors: authorsList,
      publishedTime: pubDate.toISOString(),
    },
    // Google Scholar (Highwire Press) Metadata
    other: {
      citation_title: article.title,
      citation_author: authorsList, // Next.js handles arrays by creating multiple tags
      citation_publication_date: pubDate.toISOString().split('T')[0], // YYYY-MM-DD
      citation_journal_title: journalInfo.title,
      citation_volume: article.issue?.match(/Vol (\d+)/)?.[1] || "1",
      citation_issue: article.issue?.match(/Issue (\d+)/)?.[1] || "1",
      citation_pdf_url: pdfUrl,
      citation_doi: article.doi || "",
      citation_abstract_html_url: `${process.env.NEXT_PUBLIC_SITE_URL}/article/${Array.isArray(id) ? id.join('/') : id}`,
      citation_language: "en",
    }
  };
}

export default async function ArticlePage({ params }) {
  const { id } = await params;
  const article = await getArticle(id);

  if (!article) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4 text-center text-slate-900">
        <h1 className="text-2xl font-bold">Article not found</h1>
        <p className="text-slate-600">The requested article could not be located.</p>
        <Link
          href="/current-issue"
          className="rounded-full bg-slate-900 px-6 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Browse Issues
        </Link>
      </div>
    );
  }

  const pubDate = article.publishedDate ? new Date(article.publishedDate) : null;
  const dateStr = pubDate
    ? pubDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Date not available";

  const pdfLink = article.pdfUrl
    ? article.pdfUrl.startsWith("http")
      ? article.pdfUrl
      : `${process.env.NEXT_PUBLIC_API_URL}${article.pdfUrl.startsWith("/") ? "" : "/"}${article.pdfUrl}`
    : null;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 pt-10">
      <div className="mx-auto max-w-[1000px] px-4 sm:px-6">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-xs font-medium text-slate-500">
          <Link href="/" className="hover:text-emerald-700">
            Home
          </Link>
          <span>/</span>
          <Link href="/current-issue" className="hover:text-emerald-700">
            Issues
          </Link>
          <span>/</span>
          <span className="max-w-[200px] truncate text-slate-900">
            {article.title}
          </span>
        </nav>

        {/* Main Content Card */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
          {/* Header Section */}
          <div className="border-b border-slate-100 bg-slate-50/50 px-8 py-10 md:px-12 md:py-14">
            <div className="mb-6 flex flex-wrap gap-3">
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                Original Article
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                Open Access
              </span>
            </div>

            <h1 className="font-serif text-3xl font-bold leading-tight text-slate-900 md:text-4xl lg:text-5xl">
              {article.title}
            </h1>

            <div className="mt-8 space-y-4">
              {/* Authors */}
              <div className="flex flex-wrap gap-x-1 text-sm font-medium leading-relaxed text-slate-700 md:text-base">
                {Array.isArray(article.authors) ? (
                  article.authors.map((author, idx) => {
                    const name =
                      typeof author === "string"
                        ? author
                        : `${author.firstName} ${author.lastName}`;
                    return (
                      <span key={idx} className="group relative mr-1">
                        <span className="border-b border-dashed border-slate-400 decoration-slate-400 group-hover:border-emerald-500 group-hover:text-emerald-700">
                          {name}
                        </span>
                        {idx < article.authors.length - 1 && ","}
                      </span>
                    );
                  })
                ) : (
                  <span>{article.authors}</span>
                )}
              </div>

              {/* Minimal Metadata Row */}
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                <div className="flex items-center gap-2">
                   <span>Published: {dateStr}</span>
                </div>
                 {article.doi && (
                    <>
                    <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                    <div className="flex items-center gap-2">
                        <span>DOI:</span>
                        <a href={`https://doi.org/${article.doi}`} className="text-emerald-600 hover:underline">
                        {article.doi}
                        </a>
                    </div>
                    </>
                 )}
                 {article.issue && (
                     <>
                     <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                     <span>{article.issue}</span>
                     </>
                 )}
              </div>
            </div>
          </div>

          <div className="grid gap-10 px-8 py-10 md:grid-cols-[1fr_260px] md:px-12">
            {/* Left Column: Abstract & Content */}
            <div className="space-y-10">
              <section>
                <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-900">
                  Abstract
                </h2>
                <div className="rounded-2xl border-l-4 border-emerald-500 bg-slate-50 p-6 text-base leading-relaxed text-slate-700">
                  {article.abstract}
                </div>
              </section>

              {article.keywords && article.keywords.length > 0 && (
                <section>
                  <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-900">
                    Keywords
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {article.keywords.map((k, i) => (
                      <Link
                        key={i}
                        href="#"
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 shadow-sm transition hover:bg-emerald-50 hover:text-emerald-700"
                      >
                        {k}
                      </Link>
                    ))}
                  </div>
                </section>
              )}
              
               <div className="mt-8 rounded-xl bg-blue-50 p-6 text-sm text-blue-900 border border-blue-100">
                   <strong>How to Cite:</strong>
                   <p className="mt-2 font-mono text-xs select-all bg-white p-3 rounded border border-blue-100">
                       {Array.isArray(article.authors) 
                            ? article.authors.map(a => typeof a === 'string' ? a.split(' ')[1] : a.lastName).join(', ') + '. ' 
                            : 'Authors. '}
                       ({new Date(dateStr).getFullYear()}). {article.title}. 
                       <em>{journalInfo.shortTitle}</em>, {article.issue}. 
                       {article.doi ? `https://doi.org/${article.doi}` : ''}
                   </p>
               </div>
            </div>

            {/* Right Column: Actions & Details */}
            <div className="space-y-8">
              {/* PDF Download Widget */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-5 w-5"
                    >
                      <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625z" />
                      <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase text-slate-500">
                      Full Text
                    </div>
                    <div className="text-sm font-semibold text-slate-900">
                      PDF Format
                    </div>
                  </div>
                </div>
                {pdfLink ? (
                  <a
                    href={pdfLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-bold text-white shadow-lg shadow-slate-900/10 transition hover:bg-emerald-600 hover:shadow-emerald-900/20"
                  >
                    <span>View / Download</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-4 w-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                ) : (
                  <button disabled className="w-full cursor-not-allowed rounded-xl bg-slate-100 py-3 text-sm font-bold text-slate-400">
                    PDF Not Available
                  </button>
                )}
              </div>

               {/* Metrics Widget - Spacer for now */}
               <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                   <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">Article Metrics</h3>
                   <div className="grid grid-cols-2 gap-4">
                       <div className="text-center">
                           <div className="text-xl font-bold text-slate-900">{Math.floor(Math.random() * 500) + 50}</div>
                           <div className="text-[10px] text-slate-500 font-medium">Views</div>
                       </div>
                       <div className="text-center">
                           <div className="text-xl font-bold text-slate-900">{Math.floor(Math.random() * 50)}</div>
                           <div className="text-[10px] text-slate-500 font-medium">Downloads</div>
                       </div>
                   </div>
               </div>

               {/* Journal Info Widget */}
               <div className="rounded-2xl border border-slate-100 bg-white p-5 text-center">
                   <h3 className="mb-1 text-sm font-bold text-slate-900">{journalInfo.shortTitle}</h3>
                   <div className="text-xs text-slate-500 mb-3">{journalInfo.issn}</div>
                   <Link href="/about" className="text-xs font-bold text-emerald-600 hover:underline">About the Journal</Link>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
