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
import { viewFrontendField } from '../fields/view-frontend';

function slugifyFilename(value?: string | null): string {
  if (!value || typeof value !== "string") return "untitled";
  let input = value.trim().toLowerCase();
  if (!input) return "untitled";

  if (input.startsWith("http://") || input.startsWith("https://")) {
    const parts = input.split("/");
    input = parts.slice(3).join("/");
  }

  input = input.split("?")[0].split("#")[0];
  input = input.split("\\").join("/");
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
    filename: {
      readonly: false,
      parse: (filename) => slugifyFilename(filename),
      slugify: (values) => slugifyFilename(values?.title || values?.seoTitle || 'untitled'),
    },
    router: ({ document }) => "/" + document._sys.filename,
  },
  fields: [
    viewFrontendField('page'),
    {
      name: 'title',
      label: 'Title',
      type: 'string',
      isTitle: true,
      required: true,
      description: 'Main visible page title shown at the top of the frontend page.',
    },
    {
      name: 'seoTitle',
      label: 'Meta Title (SEO)',
      type: 'string',
description:
        "Shown in the browser tab and search results â€” not on the page itself. To change the heading visitors see at the top of the page, edit the Headline of the page's Hero block (if it has one) in Page Sections below.",
    },
    {
      name: "permalink",
      label: "Filename / Permalink",
      type: "string",
      description: "Edit the public URL slug, similar to WordPress permalink. Example: my-custom-url or /blog/my-custom-url. Leave blank to use the actual filename.",
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
