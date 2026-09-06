const fs = require('fs');
const path = require('path');
const root = process.cwd();
const p = (rel) => path.join(root, rel);
const exists = (rel) => fs.existsSync(p(rel));
const read = (rel) => fs.readFileSync(p(rel), 'utf8').replace(/^\uFEFF/, '');
const write = (rel, txt) => { fs.mkdirSync(path.dirname(p(rel)), { recursive: true }); fs.writeFileSync(p(rel), txt, 'utf8'); };

write('tina/fields/permalink.ts', `import React from 'react';
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
    .map((part) => part.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''))
    .filter(Boolean)
    .join('/');
}

function PermalinkUrlField(props: any) {
  const input = props?.input || {};
  const field = props?.field || {};
  const kind: PermalinkKind = field?.kind === 'page' ? 'page' : 'blog';
  const rawValue = String(input.value || '');
  const value = slugifyPermalink(rawValue);
  const pathValue = kind === 'blog'
    ? '/blog/' + (value || 'filename-slug') + '/'
    : '/' + (value || 'filename-slug') + '/';

  React.useEffect(() => {
    if (rawValue && rawValue !== value && typeof input.onChange === 'function') {
      input.onChange(value);
    }
  }, [rawValue, value]);

  const setValue = (next: string) => {
    const normalized = slugifyPermalink(next);
    if (typeof input.onChange === 'function') input.onChange(normalized);
  };

  return React.createElement(
    'div',
    {
      style: {
        border: '1px solid #bfdbfe',
        background: 'linear-gradient(180deg, #eff6ff 0%, #ffffff 100%)',
        borderRadius: '12px',
        padding: '14px',
        margin: '0 0 18px',
        boxShadow: '0 6px 14px rgba(37, 99, 235, 0.06)',
      },
    },
    React.createElement(
      'div',
      {
        style: {
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '.12em',
          fontWeight: 800,
          color: '#1d4ed8',
          marginBottom: '8px',
        },
      },
      'Permalink / URL Slug'
    ),
    React.createElement('input', {
      name: input.name,
      value,
      onChange: (event: any) => setValue(event?.target?.value || ''),
      onBlur: (event: any) => {
        setValue(event?.target?.value || '');
        if (typeof input.onBlur === 'function') input.onBlur(event);
      },
      placeholder: 'my-custom-url',
      autoCapitalize: 'none',
      autoCorrect: 'off',
      spellCheck: false,
      style: {
        width: '100%',
        background: '#fff',
        border: '1px solid #dbe3ef',
        borderRadius: '8px',
        padding: '10px 11px',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        fontSize: '12px',
        color: '#334155',
        boxSizing: 'border-box',
        outline: 'none',
      },
    }),
    React.createElement(
      'div',
      {
        style: {
          marginTop: '8px',
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '9px 11px',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          fontSize: '12px',
          color: '#14577a',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        },
        title: pathValue,
      },
      pathValue
    ),
    React.createElement(
      'p',
      { style: { margin: '10px 0 0', color: '#64748b', fontSize: '12px', lineHeight: 1.45 } },
      'Type the URL slug only. Spaces, uppercase letters, and punctuation are converted to lowercase dashes automatically. Leave blank to use the Tina filename.'
    )
  );
}

export function permalinkField(kind: PermalinkKind): TinaField {
  return {
    name: 'permalink',
    label: 'Permalink / URL Slug',
    type: 'string',
    ui: {
      component: PermalinkUrlField,
    },
    // Custom metadata read by the React field component.
    kind,
  } as TinaField & { kind: PermalinkKind };
}
`);
console.log('Wrote URL-style custom field: tina/fields/permalink.ts');

function ensureImport(text, importLine) {
  if (text.includes(importLine)) return text;
  const lines = text.split(/\r?\n/);
  let lastImport = -1;
  for (let i = 0; i < lines.length; i++) if (lines[i].startsWith('import ')) lastImport = i;
  if (lastImport >= 0) lines.splice(lastImport + 1, 0, importLine);
  else lines.unshift(importLine);
  return lines.join('\n');
}

function replacePermalinkField(text, kind) {
  text = text.replace(/\n\s*\{\s*\n\s*name:\s*["']permalink["'],[\s\S]*?\n\s*\},/g, '\n    permalinkField("' + kind + '"),');
  text = text.replace(/\n\s*permalinkField\(['"](?:blog|page)['"]\),/g, '\n    permalinkField("' + kind + '"),');
  if (!/permalinkField\(["']/.test(text)) {
    const title = text.indexOf('name: "title"') >= 0 ? text.indexOf('name: "title"') : text.indexOf("name: 'title'");
    if (title >= 0) {
      const start = text.lastIndexOf('{', title);
      let depth = 0, end = -1;
      for (let i = start; i < text.length; i++) {
        if (text[i] === '{') depth++;
        else if (text[i] === '}') {
          depth--;
          if (depth === 0) { end = i + 1; break; }
        }
      }
      if (end > 0) text = text.slice(0, end + 1) + '\n    permalinkField("' + kind + '"),' + text.slice(end + 1);
    }
  }
  return text;
}

for (const [rel, kind] of [['tina/collections/blog.ts', 'blog'], ['tina/collections/page.ts', 'page']]) {
  if (!exists(rel)) continue;
  let text = read(rel);
  text = ensureImport(text, 'import { permalinkField } from "../fields/permalink";');
  text = replacePermalinkField(text, kind);
  if (kind === 'blog') {
    text = text.replace(/router:\s*\(\{\s*document\s*\}\)\s*=>\s*[^,\n]+,/g, "router: ({ document }) => '/blog/' + (slugifyFilename(document?.permalink) || slugifyFilename(document?._sys?.filename || '')), ");
  } else {
    text = text.replace(/const slug = [^;]*;/, "const slug = slugifyFilename(document?.permalink) || slugifyFilename(document?._sys?.filename || '');");
  }
  write(rel, text);
  console.log('Patched collection:', rel);
}

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

console.log('\nDone. Rebuild and upload the fresh admin/dist.');