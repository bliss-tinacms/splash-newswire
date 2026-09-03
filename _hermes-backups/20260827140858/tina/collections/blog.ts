import type { Collection } from "tinacms";
import { youTubeEmbedTemplate } from "../../src/components/mdx/YouTubeEmbed.template";
import { seoFields } from "../fields/seo";
import { viewFrontendField } from "../fields/view-frontend";

function slugifyFilename(value?: string | null): string {
  if (!value || typeof value !== "string") return "untitled";
  let input = value.trim().toLowerCase();
  if (!input) return "untitled";

  if (input.startsWith("http://") || input.startsWith("https://")) {
    const parts = input.split("/");
    input = parts.slice(3).join("/");
  }

  input = input.split("?")[0].split("#")[0];
  input = input.split("\").join("/");
  while (input.startsWith("/")) input = input.slice(1);
  while (input.endsWith("/")) input = input.slice(0, -1);
  if (input.startsWith("blog/")) input = input.slice(5);

  let output = "";
  let lastWasDash = false;
  for (const ch of input) {
    const isLetter = ch >= "a" && ch <= "z";
    const isNumber = ch >= "0" && ch <= "9";
    const isSlash = ch === "/";
    const isAllowed = isLetter || isNumber || isSlash || ch === "-" || ch === "_" || ch === ".";
    if (isAllowed) {
      output += ch;
      lastWasDash = false;
    } else if (!lastWasDash) {
      output += "-";
      lastWasDash = true;
    }
  }

  while (output.startsWith("-")) output = output.slice(1);
  while (output.endsWith("-")) output = output.slice(0, -1);
  while (output.includes("//")) output = output.split("//").join("/");
  return output || "untitled";
}

export const BlogCollection: Collection = {
  name: "blog",
  label: "Blogs",
  path: "src/content/blog",
  format: "mdx",
  ui: {
    filename: {
      readonly: false,
      parse: (filename) => slugifyFilename(filename),
      slugify: (values) => slugifyFilename(values?.title || "untitled"),
    },
    router: ({ document }) => "/blog/" + document._sys.filename,
  },
  fields: [
    viewFrontendField("blog"),
    {
      type: "string",
      name: "title",
      label: "Title",
      isTitle: true,
      required: true,
    },
    {
      name: "permalink",
      label: "Filename / Permalink",
      type: "string",
      description: "Edit the public URL slug, similar to WordPress permalink. Example: my-custom-url or /blog/my-custom-url. Leave blank to use the actual filename.",
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
