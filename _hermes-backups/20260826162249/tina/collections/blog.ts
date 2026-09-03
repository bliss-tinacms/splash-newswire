import type { Collection } from "tinacms";
import { youTubeEmbedTemplate } from "../../src/components/mdx/YouTubeEmbed.template";
import { seoFields } from "../fields/seo";

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

export const BlogCollection: Collection = {
  name: "blog",
  label: "Blogs",
  path: "src/content/blog",
  format: "mdx",
  ui: {
    router: ({ document }) => {
      const slug = toPublicSlug(document?.permalink) || toPublicSlug(document?._sys?.filename);
      return slug ? "/blog/" + slug : "/blog";
    },
  },
  fields: [
    {
      type: "string",
      name: "title",
      label: "Title",
      isTitle: true,
      required: true,
    },
    {
      name: "permalink",
      label: "Permalink / URL",
      type: "string",
      description: "WordPress-style public URL slug. Example: my-custom-url or /blog/my-custom-url. Leave blank to use the file name.",
    },
    {
      name: "description",
      label: "Description",
      type: "string",
    },
    seoFields,
    {
      name: "pubDate",
      label: "Publication Date",
      type: "datetime",
    },
    {
      name: "updatedDate",
      label: "Updated Date",
      type: "datetime",
    },
    {
      name: "category",
      label: "Category",
      type: "reference",
      collections: ["category"],
      description: "Assign this post to a category, similar to WordPress post categories.",
    },
    {
      name: "author",
      label: "Author / User",
      type: "reference",
      collections: ["user"],
      description: "Assign this post to a user profile, similar to a WordPress post author.",
    },
    {
      name: "heroImage",
      label: "Hero Image",
      type: "image",
    },
    { name: "authorAlt", label: "Author Alt Text", type: "string", description: "Alt text for the author image." },
    { name: "heroImageAlt", label: "Hero Image Alt Text", type: "string", description: "Alt text for the hero image." },
    {
      type: "rich-text",
      name: "body",
      label: "Body",
      isBody: true,
      templates: [youTubeEmbedTemplate],
    },
  ],
};
