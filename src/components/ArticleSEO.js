import Head from 'next/head';

/**
 * ArticleSEO Component
 * Adds Google Scholar meta tags and Schema.org structured data for academic articles
 */
export function ArticleSEO({ article }) {
  if (!article) return null;

  const authors = Array.isArray(article.authors) 
    ? article.authors.map(a => typeof a === 'string' ? a : `${a.firstName} ${a.lastName}`)
    : [];

  const publishDate = article.publishedDate 
    ? new Date(article.publishedDate).toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0];

  // Extract volume and issue from article.issue string (e.g., "Vol 1, Issue 2")
  const volumeMatch = article.issue?.match(/Vol (\d+)/);
  const issueMatch = article.issue?.match(/Issue (\d+)/);
  const volume = volumeMatch ? volumeMatch[1] : '1';
  const issue = issueMatch ? issueMatch[1] : '1';

  // Schema.org structured data
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    "headline": article.title,
    "abstract": article.abstract,
    "author": authors.map((authorName) => ({
      "@type": "Person",
      "name": authorName
    })),
    "datePublished": publishDate,
    "publisher": {
      "@type": "Organization",
      "name": "Journal of AI Enabled Innovation and Discovery",
      "logo": {
        "@type": "ImageObject",
        "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.jaeid.com'}/logo.png`
      }
    },
    "isPartOf": {
      "@type": "PublicationIssue",
      "issueNumber": issue,
      "volumeNumber": volume,
      "isPartOf": {
        "@type": "Periodical",
        "name": "Journal of AI Enabled Innovation and Discovery",
        "issn": "Under process"
      }
    },
    "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.jaeid.com'}/current-issue?volume=${volume}&issue=${issue}`,
    ...(article.doi && { "identifier": article.doi }),
    ...(article.keywords && { "keywords": article.keywords.join(", ") }),
    ...(article.pdfUrl && { "encoding": {
      "@type": "MediaObject",
      "encodingFormat": "application/pdf",
      "contentUrl": article.pdfUrl
    }})
  };

  return (
    <>
      <Head>
        {/* Google Scholar Meta Tags */}
        <meta name="citation_title" content={article.title} />
        {authors.map((author, idx) => (
          <meta key={idx} name="citation_author" content={author} />
        ))}
        <meta name="citation_publication_date" content={publishDate} />
        <meta name="citation_journal_title" content="Journal of AI Enabled Innovation and Discovery" />
        <meta name="citation_volume" content={volume} />
        <meta name="citation_issue" content={issue} />
        {article.doi && <meta name="citation_doi" content={article.doi} />}
        {article.pdfUrl && <meta name="citation_pdf_url" content={article.pdfUrl} />}
        <meta name="citation_issn" content="Under process" />
        {article.abstract && <meta name="citation_abstract" content={article.abstract} />}
        {article.keywords && article.keywords.map((keyword, idx) => (
          <meta key={idx} name="citation_keywords" content={keyword} />
        ))}
        
        {/* Dublin Core Meta Tags (additional academic metadata) */}
        <meta name="DC.title" content={article.title} />
        {authors.map((author, idx) => (
          <meta key={idx} name="DC.creator" content={author} />
        ))}
        <meta name="DC.date" content={publishDate} />
        <meta name="DC.type" content="Text.Article" />
        <meta name="DC.format" content="text/html" />
        <meta name="DC.language" content="en" />
        <meta name="DC.publisher" content="Journal of AI Enabled Innovation and Discovery" />
      </Head>
      
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
    </>
  );
}
