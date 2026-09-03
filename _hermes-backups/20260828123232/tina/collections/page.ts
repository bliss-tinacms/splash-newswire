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
import { aboutMockup17BlockSchema } from '../../src/components/blocks/about-mockup17.template';
import { contactMockup17BlockSchema } from '../../src/components/blocks/contact-mockup17.template';
import { ourTeamMockup17BlockSchema } from '../../src/components/blocks/our-team-mockup17.template';
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
      slugify: (values) => slugifyFilename(values?.title || 'untitled'),
    },
    router: ({ document }) => {
      const slug = toPublicSlug(document?.permalink) || toPublicSlug(document?._sys?.filename);
      return slug ? "/" + slug : "/";
    },
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
      name: "permalink",
      label: "Filename / Permalink",
      type: "string",
      description: "Edit the public URL slug, similar to WordPress permalink. Example: my-custom-url. Leave blank to use the actual filename.",
    },
    seoFields,

    {
      type: 'object',
      name: 'homepage',
      label: 'Homepage Template Content',
      description: 'Editable content for the custom homepage template. This controls the live homepage design in src/templates/FrontPage.astro.',
      // HERMES_HOMEPAGE_ONLY_FIELD_CONDITION
      ui: {
        condition: (values) =>
          values?._sys?.filename === 'home' ||
          values?.title === 'Home' ||
          values?.permalink === 'home',
      },
      fields: [
        {
          type: 'object',
          name: 'hero',
          label: 'Hero Section',
          fields: [
            { name: 'eyebrow', label: 'Eyebrow', type: 'string' },
            { name: 'title', label: 'Headline', type: 'string' },
            { name: 'description', label: 'Description', type: 'string', ui: { component: 'textarea' } },
            { name: 'buttonText', label: 'Button Text', type: 'string' },
            { name: 'buttonLink', label: 'Button Link', type: 'string' },
            { name: 'image', label: 'Hero Image', type: 'image' },
            { name: 'imageAlt', label: 'Hero Image Alt Text', type: 'string' },
          ],
        },
        {
          type: 'object',
          name: 'why',
          label: 'Why / Editorial Standards Section',
          fields: [
            { name: 'eyebrow', label: 'Eyebrow', type: 'string' },
            { name: 'title', label: 'Heading', type: 'string' },
            { name: 'paragraphOne', label: 'Paragraph 1', type: 'string', ui: { component: 'textarea' } },
            { name: 'paragraphTwo', label: 'Paragraph 2', type: 'string', ui: { component: 'textarea' } },
            {
              type: 'object',
              list: true,
              name: 'standards',
              label: 'Standards Cards',
              fields: [
                { name: 'label', label: 'Small Label', type: 'string' },
                { name: 'title', label: 'Card Title', type: 'string' },
                { name: 'text', label: 'Card Text', type: 'string', ui: { component: 'textarea' } },
              ],
            },
          ],
        },
        {
          type: 'object',
          name: 'newsroom',
          label: 'Latest Newsroom / Submit Panel',
          fields: [
            { name: 'heading', label: 'Latest News Heading', type: 'string' },
            { name: 'subheading', label: 'Latest News Subheading', type: 'string' },
            { name: 'submitHeading', label: 'Submit Panel Heading', type: 'string' },
            { name: 'submitButtonText', label: 'Submit Button Text', type: 'string' },
            { name: 'submitButtonLink', label: 'Submit Button Link', type: 'string' },
            {
              type: 'object',
              list: true,
              name: 'prompts',
              label: 'Submit Prompt Items',
              fields: [
                { name: 'title', label: 'Title', type: 'string' },
                { name: 'text', label: 'Text', type: 'string', ui: { component: 'textarea' } },
              ],
            },
          ],
        },
        {
          type: 'object',
          name: 'wireFeature',
          label: 'From the Wire Feature',
          fields: [
            { name: 'eyebrow', label: 'Eyebrow', type: 'string' },
            { name: 'quote', label: 'Quote', type: 'string', ui: { component: 'textarea' } },
            { name: 'author', label: 'Author Name', type: 'string' },
            { name: 'byline', label: 'Byline', type: 'string' },
            { name: 'image', label: 'Feature Image', type: 'image' },
            { name: 'imageAlt', label: 'Feature Image Alt Text', type: 'string' },
          ],
        },
        {
          type: 'object',
          name: 'coverage',
          label: 'What We Cover Section',
          fields: [
            { name: 'title', label: 'Heading', type: 'string' },
            { name: 'description', label: 'Description', type: 'string', ui: { component: 'textarea' } },
            {
              type: 'object',
              list: true,
              name: 'topics',
              label: 'Coverage Topic Cards',
              fields: [
                { name: 'number', label: 'Number', type: 'string' },
                { name: 'title', label: 'Topic Title', type: 'string' },
                { name: 'text', label: 'Topic Text', type: 'string', ui: { component: 'textarea' } },
              ],
            },
          ],
        },
        {
          type: 'object',
          name: 'contact',
          label: 'Get In Touch Section',
          fields: [
            { name: 'eyebrow', label: 'Eyebrow', type: 'string' },
            { name: 'title', label: 'Heading', type: 'string' },
            { name: 'description', label: 'Description', type: 'string', ui: { component: 'textarea' } },
            { name: 'note', label: 'Note', type: 'string', ui: { component: 'textarea' } },
            {
              type: 'object',
              list: true,
              name: 'cards',
              label: 'Contact Cards',
              fields: [
                { name: 'title', label: 'Card Title', type: 'string' },
                { name: 'email', label: 'Email', type: 'string' },
                { name: 'text', label: 'Card Text', type: 'string', ui: { component: 'textarea' } },
                { name: 'accent', label: 'Accent Card', type: 'boolean' },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'object',
      list: true,
      name: 'blocks',
      label: 'Page Sections',
      description:
        "The visible content of the page. When the page starts with a Hero block, its Headline is the main on-page heading â€” edit that to change what visitors see at the top.",
      ui: { visualSelector: true },
      templates: [
        aboutMockup17BlockSchema,
        ourTeamMockup17BlockSchema,
        contactMockup17BlockSchema,
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
