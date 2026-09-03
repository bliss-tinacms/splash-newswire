function toPublicSlug(value?: string | null): string {
  if (!value || typeof value !== "string") return "";
  let input = value.trim().toLowerCase();
  if (!input) return "";

  if (input.startsWith("http://") || input.startsWith("https://")) {
    const parts = input.split("/");
    input = parts.slice(3).join("/");
  }
  input = input.split("?")[0].split("#")[0];
  input = input.split("\\").join("/");
  while (input.startsWith("/")) input = input.slice(1);
  while (input.endsWith("/")) input = input.slice(0, -1);
  if (input.startsWith("blog/")) input = input.slice(5);

  let out = "";
  let dash = false;
  for (const ch of input) {
    const ok = (ch >= "a" && ch <= "z") || (ch >= "0" && ch <= "9");
    if (ok) { out += ch; dash = false; }
    else if (!dash) { out += "-"; dash = true; }
  }
  while (out.startsWith("-")) out = out.slice(1);
  while (out.endsWith("-")) out = out.slice(0, -1);
  return out;
}

function fallbackSlug(item: any): string {
  return toPublicSlug(item?.slug || item?._sys?.filename || item?._sys?.basename || item?._slug || "");
}

export function getBlogRouteSlug(item: any): string {
  return toPublicSlug(item?.permalink) || fallbackSlug(item);
}

export function getBlogPermalink(item: any): string {
  const slug = getBlogRouteSlug(item);
  return slug ? "/blog/" + slug : "/blog";
}

export function getPageRouteSlug(item: any): string {
  return toPublicSlug(item?.permalink) || fallbackSlug(item);
}

export function getPagePermalink(item: any): string {
  const slug = getPageRouteSlug(item);
  return slug ? "/" + slug : "/";
}
