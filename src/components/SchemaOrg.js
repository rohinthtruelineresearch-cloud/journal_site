/**
 * OrganizationSchema Component
 * Adds Schema.org structured data for the journal organization
 */
export function OrganizationSchema() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Journal of AI Enabled Innovation and Discovery",
    "alternateName": "JAEID",
    "url": process.env.NEXT_PUBLIC_SITE_URL || "https://www.jaeid.com",
    "logo": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.jaeid.com'}/logo.png`,
    "description": "Open access peer-reviewed journal publishing cutting-edge research in artificial intelligence, machine learning, and AI-driven innovation.",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Editorial Office",
      "email": "info.truelineresearch@gmail.com",
      "availableLanguage": "English"
    },
    "sameAs": [
      // Add your social media profiles here
      // "https://twitter.com/JAEID_Journal",
      // "https://linkedin.com/company/jaeid",
      // "https://www.researchgate.net/journal/JAEID"
    ],
    "publishingPrinciples": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.jaeid.com'}/about#policies`
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}

/**
 * WebsiteSchema Component
 * Adds Schema.org structured data for the website
 */
export function WebsiteSchema() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Journal of AI Enabled Innovation and Discovery",
    "alternateName": "JAEID",
    "url": process.env.NEXT_PUBLIC_SITE_URL || "https://www.jaeid.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.jaeid.com'}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}

/**
 * PeriodicalSchema Component
 * Adds Schema.org structured data for the journal as a periodical
 */
export function PeriodicalSchema() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Periodical",
    "name": "Journal of AI Enabled Innovation and Discovery",
    "alternateName": "JAEID",
    "issn": "Under process",
    "url": process.env.NEXT_PUBLIC_SITE_URL || "https://www.jaeid.com",
    "publisher": {
      "@type": "Organization",
      "name": "JAEID Publishing",
      "logo": {
        "@type": "ImageObject",
        "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.jaeid.com'}/logo.png`
      }
    },
    "description": "Open access peer-reviewed journal publishing cutting-edge research in artificial intelligence, machine learning, and AI-driven innovation. Monthly publication.",
    "inLanguage": "en",
    "publicationPrinciples": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.jaeid.com'}/about#policies`
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}

/**
 * BreadcrumbSchema Component
 * Adds breadcrumb structured data
 */
export function BreadcrumbSchema({ items }) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.jaeid.com'}${item.url}`
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}

/**
 * FAQSchema Component
 * Adds FAQ structured data for rich snippets
 */
export function FAQSchema({ faqs }) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
