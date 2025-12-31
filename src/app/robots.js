export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/account/',
        '/author/',
        '/reviewer/',
        '/reset-password/',
      ],
    },
    sitemap: 'https://jaeid.com/sitemap.xml',
  }
}
