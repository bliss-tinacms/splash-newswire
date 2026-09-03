export function slugifyPermalinkSegment(value?: string | null): string | null {
  if (!value || typeof value !== "string") return null;
  let input = value.trim();
  if (!input) return null;
  input = input.replace(/^https?://[^/]+/i, "");
  input = input.replace(/[?#].*$/, "");
  input = input.replace(/\\/g, "/");
  input = input.replace(/^/+|/+$/g, "");
  input = input.replace(/^blog//i, "");
  const slug = input
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || null;
}

function fallbackSlug(item: any): string {
  const raw = item?.slug || item?._sys?.filename || item?._sys?.basename || item?._slug || "";
  return slugifyPermalinkSegment(String(raw)) || "";
}

export function getBlogRouteSlug(item: any): string {
  return slugifyPermalinkSegment(item?.permalink) || fallbackSlug(item);
}

export function getBlogPermalink(item: any): string {
  const slug = getBlogRouteSlug(item);
  return slug ? "/blog/" + slug : "/blog";
}

export function getPageRouteSlug(item: any): string {
  return slugifyPermalinkSegment(item?.permalink) || fallbackSlug(item);
}

export function getPagePermalink(item: any): string {
  const slug = getPageRouteSlug(item);
  return slug ? "/" + slug : "/";
}
