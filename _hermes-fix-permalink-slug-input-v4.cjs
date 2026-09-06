const fs = require('fs');
const path = require('path');
const root = process.cwd();

function file(rel) { return path.join(root, rel); }
function exists(rel) { return fs.existsSync(file(rel)); }
function read(rel) { return fs.readFileSync(file(rel), 'utf8').replace(/^\uFEFF/, ''); }
function write(rel, text) { fs.mkdirSync(path.dirname(file(rel)), { recursive: true }); fs.writeFileSync(file(rel), text, 'utf8'); }

const permalinkFieldSource = `import React from 'react';
import type { TinaField } from 'tinacms';

type PermalinkKind = 'blog' | 'page';

export function slugifyPermalink(value?: string | null): string {
  if (!value || typeof value !== 'string') return '';
  let input = value.trim().toLowerCase();
  if (!input) return '';

  if (input.startsWith('http://') || input.startsWith('https://')) {
    input = input.split('/').slice(3).join('/');
  }

  input = input.split('?')[0].split('#')[0].replace(/\\\\/g, '/');
  input = input.replace(/^\\/+|\\/+$/g, '');
  if (input.startsWith('blog/')) input = input.slice(5);

  return input
    .split('/')
    .map((part) =>
      part
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    )
    .filter(Boolean)
    .join('/');
}

function PermalinkInput(props: any) {
  const input = props?.input || {};
  const currentValue = String(input.value || '');
  const normalizedValue = slugifyPermalink(currentValue);

  React.useEffect(() => {
    if (currentValue && currentValue !== normalizedValue && typeof input.onChange === 'function') {
      input.onChange(normalizedValue);
    }
  }, [currentValue, normalizedValue]);

  const handleChange = (event: any) => {
    const nextValue = slugifyPermalink(event?.target?.value || '');
    if (typeof input.onChange === 'function') input.onChange(nextValue);
  };

  const handleBlur = (event: any) => {
    const nextValue = slugifyPermalink(event?.target?.value || currentValue);
    if (typeof input.onChange === 'function') input.onChange(nextValue);
    if (typeof input.onBlur === 'function') input.onBlur(event);
  };

  return React.createElement('input', {
    name: input.name,
    value: normalizedValue,
    onChange: handleChange,
    onBlur: handleBlur,
    placeholder: props?.field?.placeholder || 'my-custom-url',
    autoCapitalize: 'none',
    autoCorrect: 'off',
    spellCheck: false,
    style: {
      width: '100%',
      border: '1px solid #cbd5e1',
      borderRadius: '6px',
      padding: '12px 14px',
      fontSize: '15px',
      lineHeight: 1.4,
      color: '#334155',
      background: '#fff',
      outline: 'none',
      boxSizing: 'border-box',
    },
  });
}

export function permalinkField(kind: PermalinkKind): TinaField {
  return {
    name: 'permalink',
    label: 'Permalink / URL Slug',
    type: 'string',
    description:
      kind === 'blog'
        ? 'Public frontend URL slug. Spaces and uppercase letters are converted automatically. Example: my-custom-url or /blog/my-custom-url. Leave blank to use the actual filename.'
        : 'Public frontend URL slug. Spaces and uppercase letters are converted automatically. Example: my-custom-url. Leave blank to use the actual filename.',
    ui: {
      component: PermalinkInput,
    },
  } as TinaField;
}
`;

write('tina/fields/permalink.ts', permalinkFieldSource);
console.log('Wrote tina/fields/permalink.ts');

function replacePermalinkObject(text, kind) {
  const replacement = `    permalinkField('${kind}'),`;
  if (/permalinkField\(['"]/.test(text)) return text;
  if (/name:\s*["']permalink["']/.test(text)) {
    return text.replace(/\n\s*\{\s*\n\s*name:\s*["']permalink["'],[\s\S]*?\n\s*\},/, '\n' + replacement);
  }
  const titleIdx = text.indexOf('name: "title"');
  if (titleIdx < 0) return text;
  const start = text.lastIndexOf('{', titleIdx);
  let depth = 0, end = -1;
  for (let i = start; i < text.length; i++) {
    if (text[i] === '{') depth++;
    else if (text[i] === '}') {
      depth--;
      if (depth === 0) { end = i + 1; break; }
    }
  }
  if (end < 0) return text;
  return text.slice(0, end + 1) + '\n' + replacement + text.slice(end + 1);
}

function patchCollection(rel, kind) {
  if (!exists(rel)) return;
  let text = read(rel);
  if (!text.includes("../fields/permalink")) {
    const importLine = kind === 'blog'
      ? 'import { permalinkField } from "../fields/permalink";'
      : "import { permalinkField } from '../fields/permalink';";
    const anchor = /import \{ viewFrontendField \} from ["']\.\.\/fields\/view-frontend["'];/;
    if (anchor.test(text)) text = text.replace(anchor, (m) => m + '\n' + importLine);
    else text = importLine + '\n' + text;
  }
  text = replacePermalinkObject(text, kind);

  if (kind === 'blog') {
    text = text.replace(
      /router:\s*\(\{\s*document\s*\}\)\s*=>\s*[^,\n]+,/,
      "router: ({ document }) => '/blog/' + (slugifyFilename(document?.permalink) || slugifyFilename(document?._sys?.filename || '')),");
  } else {
    text = text.replace(
      /const slug = [^;]*;/,
      "const slug = slugifyFilename(document?.permalink) || slugifyFilename(document?._sys?.filename || '');");
  }

  write(rel, text);
  console.log('Patched', rel);
}

patchCollection('tina/collections/blog.ts', 'blog');
patchCollection('tina/collections/page.ts', 'page');

// Keep URL helpers aligned with the custom permalink field behavior.
write('src/lib/permalinks.ts', `function cleanSlug(value?: string | null): string {
  if (!value || typeof value !== "string") return "";
  let input = value.trim().toLowerCase();
  if (!input) return "";
  if (input.startsWith("http://") || input.startsWith("https://")) input = input.split("/").slice(3).join("/");
  input = input.split("?")[0].split("#")[0].split("\\\\").join("/");
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
`);
console.log('Updated src/lib/permalinks.ts');

if (exists('tina/fields/view-frontend.ts')) {
  let text = read('tina/fields/view-frontend.ts');
  text = text.replace(/const raw =\s*[\s\S]*?'';/, `const raw =
    values?.permalink ||
    values?._sys?.filename ||
    values?.filename ||
    filenameFromBrowser(kind) ||
    values?.title ||
    values?.seoTitle ||
    '';`);
  write('tina/fields/view-frontend.ts', text);
  console.log('Updated tina/fields/view-frontend.ts');
}

console.log('\nDone. Now run: pnpm exec tinacms build --skip-cloud-checks -c "astro build"');