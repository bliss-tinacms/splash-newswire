export function normalizePermalink(value?: string | null): string | null {
  if (!value || typeof value !== 'string') return null;
  let path = value.trim();
  if (!path) return null;
  path = path.replace(/^https?://[^/]+/i, '');
  path = path.split('?')[0].split('#')[0];
  path = path.replace(/\\/g, '/').replace(//+/g, '/');
  if (!path.startsWith('/')) path = '/' + path;
  if (path.length > 1) path = path.replace(//+$/, '');
  return path || null;
}

export function slugFromPermalink(value?: string | null): string | undefined {
  const normalized = normalizePermalink(value);
  if (!normalized || normalized === '/') return undefined;
  return normalized.replace(/^//, '');
}

function fallbackSlug(item: any): string {
  return String(item?.slug || item?._sys?.filename || item?._sys?.basename || item?._slug || '').replace(/^/+|/+$/g, '');
}

export function getBlogPermalink(item: any): string {
  const custom = normalizePermalink(item?.permalink);
  if (custom) return custom;
  const slug = fallbackSlug(item);
  return slug ? "/blog/" + slug : "/blog";
}

export function getPagePermalink(item: any): string {
  const custom = normalizePermalink(item?.permalink);
  if (custom) return custom;
  const slug = fallbackSlug(item);
  return slug ? "/" + slug : "/";
}
