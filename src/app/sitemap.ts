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

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));
}
