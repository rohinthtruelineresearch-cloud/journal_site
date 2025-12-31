export default async function sitemap() {
  const baseUrl = 'https://jaeid.com';
  const apiUrl = 'https://journal-site-server-1.onrender.com';

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
    const response = await fetch(`${apiUrl}/api/issues`, { next: { revalidate: 3600 } });
    
    if (!response.ok) {
        console.error('Failed to fetch issues for sitemap');
        return staticRoutes;
    }

    const issues = await response.json();

    const issueRoutes = Array.isArray(issues) ? issues.map((issue) => ({
      url: `${baseUrl}/current-issue?volume=${issue.volume}&amp;issue=${issue.issue}`,
      lastModified: new Date(issue.publicationDate || new Date()),
      changeFrequency: 'weekly',
      priority: 0.7,
    })) : [];

    return [...staticRoutes, ...issueRoutes];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return staticRoutes;
  }
}
