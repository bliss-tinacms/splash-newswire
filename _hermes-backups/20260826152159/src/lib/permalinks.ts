export function slugifyPermalinkSegment(value?: string | null): string | null {
  if (!value || typeof value !== "string") return null;

  let input = value.trim();
  if (!input) return null;

  // Accept full URLs, /blog/custom-slug, blog/custom-slug, or plain title text.
  input = input.replace(/^https?:\/\/[^/]+/i, "");
  input = input.replace(/[?#].*$/, "");
  input = input.replace(/\\/g, "/");
  input = input.replace(/^\/+|\/+$/g, "");
  input = input.replace(/^blog\//i, "");

  const slug = input
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || null;
}

export function normalizePermalink(value?: string | null): string | null {
  const slug = slugifyPermalinkSegment(value);
  return slug ? `/${slug}` : null;
}

function fallbackSlug(item: any): string {
  const raw = item?.slug || item?._sys?.filename || item?._sys?.basename || item?._slug || "";
  return slugifyPermalinkSegment(String(raw)) || "";
}

export function getBlogPermalink(item: any): string {
  const customSlug = slugifyPermalinkSegment(item?.permalink);
  if (customSlug) return `/blog/${customSlug}`;

  const slug = fallbackSlug(item);
  return slug ? `/blog/${slug}` : "/blog";
}

export function getBlogRouteSlug(item: any): string {
  const customSlug = slugifyPermalinkSegment(item?.permalink);
  if (customSlug) return customSlug;
  return fallbackSlug(item);
}

export function getPagePermalink(item: any): string {
  const customSlug = slugifyPermalinkSegment(item?.permalink);
  if (customSlug) return `/${customSlug}`;

  const slug = fallbackSlug(item);
  return slug ? `/${slug}` : "/";
}

export function getPageRouteSlug(item: any): string {
  const customSlug = slugifyPermalinkSegment(item?.permalink);
  if (customSlug) return customSlug;
  return fallbackSlug(item);
}