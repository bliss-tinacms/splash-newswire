const fs = require('fs');
const path = require('path');
const root = process.cwd();

function file(rel) { return path.join(root, rel); }
function exists(rel) { return fs.existsSync(file(rel)); }
function read(rel) { return fs.readFileSync(file(rel), 'utf8').replace(/^\uFEFF/, ''); }
function write(rel, text) { fs.mkdirSync(path.dirname(file(rel)), { recursive: true }); fs.writeFileSync(file(rel), text, 'utf8'); }

function removeFunctionBlock(text, functionName) {
  const needle = 'export async function ' + functionName + '(';
  const start = text.indexOf(needle);
  if (start < 0) return text;
  const brace = text.indexOf('{', start);
  if (brace < 0) return text;
  let depth = 0, end = -1;
  for (let i = brace; i < text.length; i++) {
    if (text[i] === '{') depth++;
    else if (text[i] === '}') {
      depth--;
      if (depth === 0) { end = i + 1; break; }
    }
  }
  if (end < 0) return text;
  while (end < text.length && /[\r\n]/.test(text[end])) end++;
  return text.slice(0, start) + text.slice(end);
}

function addPrerenderFalse(text) {
  if (/export\s+const\s+prerender\s*=/.test(text)) {
    return text.replace(/export\s+const\s+prerender\s*=\s*true\s*;/g, 'export const prerender = false;');
  }
  const imports = [...text.matchAll(/^import .+;$/gm)];
  if (!imports.length) return 'export const prerender = false;\n' + text;
  const last = imports[imports.length - 1];
  const at = last.index + last[0].length;
  return text.slice(0, at) + '\n\nexport const prerender = false;' + text.slice(at);
}

function makeRuntime(rel) {
  if (!exists(rel)) return;
  let text = read(rel);
  text = removeFunctionBlock(text, 'getStaticPaths');
  text = addPrerenderFalse(text);
  write(rel, text);
  console.log('SSR/on-demand route:', rel);
}

function replacePermalinkField(text, label) {
  const field = `    {
      name: "permalink",
      label: "Permalink / URL Slug",
      type: "string",
      description: "Public frontend URL slug. Spaces are automatically converted to dashes. Example: my-custom-url${label === 'blog' ? ' or /blog/my-custom-url' : ''}. Leave blank to use the Tina filename.",
      ui: {
        parse: (value) => slugifyFilename(value),
      },
    },`;

  if (/name:\s*["']permalink["']/.test(text)) {
    return text.replace(/\n\s*\{\s*\n\s*name:\s*["']permalink["'],[\s\S]*?\n\s*\},/, '\n' + field);
  }

  // Insert after the title field object if no permalink field exists.
  const titleIdx = text.indexOf('name: "title"');
  if (titleIdx < 0) return text;
  let objStart = text.lastIndexOf('{', titleIdx);
  let depth = 0, objEnd = -1;
  for (let i = objStart; i < text.length; i++) {
    if (text[i] === '{') depth++;
    else if (text[i] === '}') {
      depth--;
      if (depth === 0) { objEnd = i + 1; break; }
    }
  }
  if (objEnd > 0) return text.slice(0, objEnd + 1) + '\n' + field + text.slice(objEnd + 1);
  return text;
}

// 1) Central permalink helpers: public URL uses permalink first, then real filename. Both are slugified.
write('src/lib/permalinks.ts', `function cleanSlug(value?: string | null): string {
  if (!value || typeof value !== "string") return "";
  let input = value.trim().toLowerCase();
  if (!input) return "";
  if (input.startsWith("http://") || input.startsWith("https://")) input = input.split("/").slice(3).join("/");
  input = input.split("?")[0].split("#")[0].split("\\\\").join("/");
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

// 2) Blog collection: keep field, auto slugify, make router use it.
if (exists('tina/collections/blog.ts')) {
  let text = read('tina/collections/blog.ts');
  text = replacePermalinkField(text, 'blog');
  text = text.replace(/router:\s*\(\{\s*document\s*\}\)\s*=>\s*[^,\n]+,/, "router: ({ document }) => '/blog/' + (slugifyFilename(document?.permalink) || slugifyFilename(document?._sys?.filename || '')),");
  write('tina/collections/blog.ts', text);
  console.log('Updated tina/collections/blog.ts');
}

// 3) Page collection: keep field, auto slugify, router uses permalink fallback filename.
if (exists('tina/collections/page.ts')) {
  let text = read('tina/collections/page.ts');
  text = replacePermalinkField(text, 'page');
  text = text.replace(/const slug = [^;]*;/, "const slug = slugifyFilename(document?.permalink) || slugifyFilename(document?._sys?.filename || '');");
  write('tina/collections/page.ts', text);
  console.log('Updated tina/collections/page.ts');
}

// 4) Make live Node routes on-demand so changed/new permalink values work without stale getStaticPaths.
makeRuntime('src/pages/blog/[...slug].astro');
makeRuntime('src/pages/[...slug].astro');
makeRuntime('src/pages/blog/index.astro');

// 5) Frontend shortcut: show the same public URL field behavior.
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

console.log('\nDone. Build next: pnpm exec tinacms build --skip-cloud-checks -c "astro build"');