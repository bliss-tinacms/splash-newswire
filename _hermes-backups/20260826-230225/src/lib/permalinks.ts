export function slugifyPermalinkSegment(value?: string | null): string | null {
  if (!value || typeof value !== 'string') return null;
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/^https?://[^/]+/i, '')
    .replace(/[?#].*$/, '')
    .replace(/^/+|/+$/g, '')
    .replace(/^blog//, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || null;
}

export function normalizePermalink(value?: string | null): string | null {
  const slug = slugifyPermalinkSegment(value);
  return slug ? '/' + slug : null;
}

export function getBlogPermalink(item: any): string {
  const customSlug = slugifyPermalinkSegment(item?.permalink);
  if (customSlug) return '/blog/' + customSlug;
  const fallback = slugifyPermalinkSegment(item?.slug || item?._sys?.filename || item?._sys?.basename || item?._slug);
  return fallback ? '/blog/' + fallback : '/blog';
}

export function getBlogRouteSlug(item: any): string {
  const customSlug = slugifyPermalinkSegment(item?.permalink);
  if (customSlug) return customSlug;
  return slugifyPermalinkSegment(item?.slug || item?._sys?.filename || item?._sys?.basename || item?._slug) || '';
}

export function getPagePermalink(item: any): string {
  const customSlug = slugifyPermalinkSegment(item?.permalink);
  if (customSlug) return '/' + customSlug;
  const fallback = slugifyPermalinkSegment(item?.slug || item?._sys?.filename || item?._sys?.basename || item?._slug);
  return fallback ? '/' + fallback : '/';
}
