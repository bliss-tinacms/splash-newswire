function trimSlashes(value: string): string {
  let output = value;
  while (output.startsWith("/")) output = output.slice(1);
  while (output.endsWith("/")) output = output.slice(0, -1);
  return output;
}

export function slugifyPermalinkSegment(value?: string | null): string | null {
  if (!value || typeof value !== "string") return null;

  let input = value.trim();
  if (!input) return null;

  // Accept full URLs, /blog/custom-slug, blog/custom-slug, or plain title text.
  input = input.replace(new RegExp("^https?://[^/]+", "i"), "");
  input = input.split("?")[0].split("#")[0];
  input = input.split("\\").join("/");
  input = trimSlashes(input);
  input = input.replace(new RegExp("^blog/", "i"), "");
  input = trimSlashes(input);

  let slug = input.toLowerCase();
  slug = slug.split("&").join(" and ");
  slug = slug.replace(new RegExp("[^a-z0-9]+", "g"), "-");
  slug = slug.replace(new RegExp("-+", "g"), "-");
  while (slug.startsWith("-")) slug = slug.slice(1);
  while (slug.endsWith("-")) slug = slug.slice(0, -1);

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