import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.vetaas.in';

  // Define all the active routes on your new Vercel website
  const routes = [
    '',
    '/about',
    '/services',
    '/events',
    '/parents',
    '/teachers',
    '/products',
    '/contact',
    '/privacy',
    '/terms',
  ];

  return routes.map((route) => {
    let priority = 0.8;
    if (route === '') priority = 1.0;
    else if (['/about', '/services', '/events', '/contact'].includes(route)) priority = 0.9;
    else if (['/privacy', '/terms'].includes(route)) priority = 0.3; // Low priority to discourage sitelinks

    return {
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority,
    };
  });
}
