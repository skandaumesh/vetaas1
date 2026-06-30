import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.vetaas.in';

  // All publicly indexable routes. Primary nav destinations get the highest
  // priority so Google is more likely to surface them as sitelinks.
  const routes = [
    '',
    '/about',
    '/services',
    '/children',
    '/teachers',
    '/parents',
    '/events',
    '/find-us',
    '/contact',
    '/products',
    '/privacy',
    '/terms',
  ];

  // Top-level nav links — eligible for sitelinks.
  const primaryNav = ['/about', '/services', '/events', '/contact'];
  // Services dropdown + Find Us — secondary nav links.
  const secondaryNav = ['/children', '/teachers', '/parents', '/find-us'];

  return routes.map((route) => {
    let priority = 0.8;
    let changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] = 'monthly';

    if (route === '') {
      priority = 1.0;
      changeFrequency = 'weekly';
    } else if (route === '/events') {
      priority = 0.9;
      changeFrequency = 'weekly';
    } else if (primaryNav.includes(route)) {
      priority = 0.9;
    } else if (secondaryNav.includes(route)) {
      priority = 0.7;
    } else if (['/privacy', '/terms'].includes(route)) {
      priority = 0.3; // Low priority to discourage sitelinks
      changeFrequency = 'yearly';
    }

    return {
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
    };
  });
}
