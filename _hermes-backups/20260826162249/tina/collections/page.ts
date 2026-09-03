import type { Collection } from 'tinacms';
import { heroBlockSchema } from '../../src/components/blocks/hero.template';
import { featuresBlockSchema } from '../../src/components/blocks/features.template';
import { statsBlockSchema } from '../../src/components/blocks/stats.template';
import { ctaBlockSchema } from '../../src/components/blocks/cta.template';
import { testimonialBlockSchema } from '../../src/components/blocks/testimonial.template';
import { calloutBlockSchema } from '../../src/components/blocks/callout.template';
import { contentBlockSchema } from '../../src/components/blocks/content.template';
import { videoBlockSchema } from '../../src/components/blocks/video.template';
import { splitBlockSchema } from '../../src/components/blocks/split.template';
import { seoFields } from '../fields/seo';

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

export const PageCollection: Collection = {
  name: 'page',
  label: 'Pages',
  path: 'src/content/page',
  format: 'mdx',
  ui: {
    router: ({ document }) => {
      const slug = toPublicSlug(document?.permalink) || toPublicSlug(document?._sys?.filename);
      return slug ? '/' + slug : '/';
    },
  },
  fields: [
    {
      name: "permalink",
      label: "Permalink / URL",
      type: "string",
      description: "WordPress-style public URL slug. Example: about-us. Leave blank to use the file name.",
    },
    {
      name: 'seoTitle',
      label: 'Meta Title (SEO)',
      type: 'string',
      isTitle: true,
      required: true,
      description:
        "Shown in the browser tab and search results â€” not on the page itself. To change the heading visitors see at the top of the page, edit the Headline of the page's Hero block (if it has one) in Page Sections below.",
    },
    seoFields,
    {
      type: 'object',
      list: true,
      name: 'blocks',
      label: 'Page Sections',
      description:
        "The visible content of the page. When the page starts with a Hero block, its Headline is the main on-page heading â€” edit that to change what visitors see at the top.",
      ui: { visualSelector: true },
      templates: [
        heroBlockSchema,
        calloutBlockSchema,
        featuresBlockSchema,
        statsBlockSchema,
        ctaBlockSchema,
        contentBlockSchema,
        testimonialBlockSchema,
        videoBlockSchema,
        splitBlockSchema,
      ],
    },
  ],
};
