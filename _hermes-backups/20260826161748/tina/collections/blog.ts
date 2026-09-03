import type { Collection } from "tinacms";
import { youTubeEmbedTemplate } from "../../src/components/mdx/YouTubeEmbed.template";
import { seoFields } from "../fields/seo";

export const BlogCollection: Collection = {

  name: "blog",
  label: "Blogs",
  path: "src/content/blog",
  format: "mdx",
  ui: {
    router: ({ document }) => {
      const raw = document?.permalink || document?._sys?.filename || "";
      let slug = String(raw).trim().toLowerCase();
      slug = slug.replace(new RegExp("^https?://[^/]+", "i"), "");
      slug = slug.split("?")[0].split("#")[0];
      slug = slug.split("\\").join("/");
      while (slug.startsWith("/")) slug = slug.slice(1);
      while (slug.endsWith("/")) slug = slug.slice(0, -1);
      if (slug.startsWith("blog/")) slug = slug.slice(5);
      slug = slug.split("&").join(" and ");
      slug = slug.replace(new RegExp("[^a-z0-9]+", "g"), "-");
      slug = slug.replace(new RegExp("-+", "g"), "-");
      while (slug.startsWith("-")) slug = slug.slice(1);
      while (slug.endsWith("-")) slug = slug.slice(0, -1);
      return slug ? "/blog/" + slug : "/blog/" + document._sys.filename;
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
      description: "WordPress-style editable URL slug. Use a slug like my-post-url or a path like /blog/my-post-url. Leave blank to use the filename.",
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
