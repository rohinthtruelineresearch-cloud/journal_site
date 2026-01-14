export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.jaeid.com';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://journal-site-server-1.onrender.com';

  // Static routes
  const staticRoutes = [
    '',
    '/about',
    '/archive',
    '/contact',
    '/current-issue',
    '/guidelines',
    '/submit',
    '/login',
    '/register',
    '/subscriptions',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: route === '' ? 1 : 0.8,
  }));

  try {
    // Fetch issues for dynamic sitemap generation
    const response = await fetch(`${apiUrl}/api/issues`, { 
      next: { revalidate: 3600 },
      cache: 'no-store' 
    });
    
    if (!response.ok) {
      console.error('Failed to fetch issues for sitemap');
      return staticRoutes;
    }

    const issues = await response.json();

    // Issue routes - Note: Next.js sitemap automatically escapes & to &amp; in XML output
    const issueRoutes = Array.isArray(issues) ? issues.map((issue) => ({
      url: `${baseUrl}/current-issue?volume=${issue.volume}&issue=${issue.issue}`,
      lastModified: new Date(issue.publicationDate || new Date()),
      changeFrequency: 'weekly',
      priority: 0.7,
    })) : [];

    // Fetch published articles for individual article URLs
    const articlesResponse = await fetch(`${apiUrl}/api/articles`, {
      next: { revalidate: 3600 },
      cache: 'no-store'
    });

    let articleRoutes = [];
    if (articlesResponse.ok) {
      const articles = await articlesResponse.json();
      
      // Get unique article URLs (avoid duplicates)
      const uniqueArticleUrls = new Set();
      
      articleRoutes = Array.isArray(articles) 
        ? articles
            .filter(article => article.status === 'published')
            .map((article) => {
              const volumeMatch = article.issue?.match(/Vol (\d+)/);
              const issueMatch = article.issue?.match(/Issue (\d+)/);
              const volume = volumeMatch ? volumeMatch[1] : '1';
              const issue = issueMatch ? issueMatch[1] : '1';
              
              const url = `${baseUrl}/current-issue?volume=${volume}&issue=${issue}`;
              
              // Only add if not already in the set
              if (!uniqueArticleUrls.has(url)) {
                uniqueArticleUrls.add(url);
                return {
                  url: url,
                  lastModified: new Date(article.publishedDate || article.updatedAt || new Date()),
                  changeFrequency: 'monthly',
                  priority: 0.6,
                };
              }
              return null;
            })
            .filter(Boolean) // Remove null entries
        : [];
    }

    return [...staticRoutes, ...issueRoutes, ...articleRoutes];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return staticRoutes;
  }
}
