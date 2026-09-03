import type { Collection } from "tinacms";
import { youTubeEmbedTemplate } from "../../src/components/mdx/YouTubeEmbed.template";
import { seoFields } from "../fields/seo";

export const BlogCollection: Collection = {

  name: "blog",
  label: "Blogs",
  path: "src/content/blog",
  format: "mdx",
  ui: {
    filename: {
      parse: (filename) => filename
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9/_-]+/g, "")
        .replace(/-+/g, "-")
        .replace(/^\/+|\/+$/g, ""),
      slugify: (values) => String(values?.title || "untitled")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9/_-]+/g, "")
        .replace(/-+/g, "-")
        .replace(/^\/+|\/+$/g, ""),
    },
  },
  ui: {
    router({ document }) {
      return `/blog/${document._sys.filename}`;
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
    { name: "heroImageAlt", label: "Hero Image Alt Text", type: "string", description: "Alt text for the hero image image." },
    {
      type: "rich-text",
      name: "body",
      label: "Body",
      isBody: true,
      templates: [youTubeEmbedTemplate],
    },
  ],
}
