function cleanSlug(value?: string | null): string {
  if (!value || typeof value !== "string") return "";
  let input = value.trim().toLowerCase();
  if (!input) return "";
  if (input.startsWith("http://") || input.startsWith("https://")) input = input.split("/").slice(3).join("/");
  input = input.split("?")[0].split("#")[0].split("\\").join("/");
  while (input.startsWith("/")) input = input.slice(1);
  while (input.endsWith("/")) input = input.slice(0, -1);
  if (input.startsWith("blog/")) input = input.slice(5);
  return input
    .split("/")
    .map((part) => part.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""))
    .filter(Boolean)
    .join("/");
}
function fileSlug(item: any): string {
  return cleanSlug(item?._sys?.filename || item?._sys?.basename || item?.filename || item?.slug || "");
}
export function getBlogRouteSlug(item: any): string {
  return cleanSlug(item?.permalink) || fileSlug(item);
}
export function getBlogPermalink(item: any): string {
  const slug = getBlogRouteSlug(item);
  return slug ? "/blog/" + slug : "/blog";
}
export function getPageRouteSlug(item: any): string {
  return cleanSlug(item?.permalink) || fileSlug(item);
}
export function getPagePermalink(item: any): string {
  const slug = getPageRouteSlug(item);
  if (!slug || slug === "home" || slug === "index") return "/";
  return "/" + slug;
}