const fs = require('fs');
const path = require('path');

const root = process.cwd();
const stamp = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);
const backupRoot = path.join(root, '_hermes-backups', stamp + '-tina-rename-permalink-ssr');

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8').replace(/^\uFEFF/, '');
}

function write(rel, text) {
  fs.mkdirSync(path.dirname(path.join(root, rel)), { recursive: true });
  fs.writeFileSync(path.join(root, rel), text, 'utf8');
}

function exists(rel) {
  return fs.existsSync(path.join(root, rel));
}

function backup(rel) {
  const src = path.join(root, rel);
  if (!fs.existsSync(src)) return;
  const dst = path.join(backupRoot, rel);
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.copyFileSync(src, dst);
}

function removeFunctionBlock(text, functionName) {
  const needle = 'export async function ' + functionName + '(';
  const start = text.indexOf(needle);
  if (start < 0) return text;
  const brace = text.indexOf('{', start);
  if (brace < 0) return text;
  let depth = 0;
  let end = -1;
  for (let i = brace; i < text.length; i++) {
    const ch = text[i];
    if (ch === '{') depth++;
    if (ch === '}') {
      depth--;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }
  if (end < 0) return text;
  while (end < text.length && /[\r\n]/.test(text[end])) end++;
  return text.slice(0, start) + text.slice(end);
}

function addPrerenderFalseAfterImports(text) {
  if (/export\s+const\s+prerender\s*=/.test(text)) {
    return text.replace(/export\s+const\s+prerender\s*=\s*true\s*;/, 'export const prerender = false;');
  }
  const importMatches = [...text.matchAll(/^import .+;$/gm)];
  if (!importMatches.length) return 'export const prerender = false;\n' + text;
  const last = importMatches[importMatches.length - 1];
  const insertAt = last.index + last[0].length;
  return text.slice(0, insertAt) + '\n\nexport const prerender = false;' + text.slice(insertAt);
}

function makeRuntimeRoute(rel) {
  if (!exists(rel)) return;
  backup(rel);
  let text = read(rel);
  text = removeFunctionBlock(text, 'getStaticPaths');
  text = addPrerenderFalseAfterImports(text);
  write(rel, text);
  console.log('Updated runtime SSR route:', rel);
}

makeRuntimeRoute('src/pages/blog/[...slug].astro');
makeRuntimeRoute('src/pages/[...slug].astro');
makeRuntimeRoute('src/pages/blog/index.astro');

backup('src/lib/permalinks.ts');
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
  return fileSlug(item);
}

export function getBlogPermalink(item: any): string {
  const slug = getBlogRouteSlug(item);
  return slug ? "/blog/" + slug : "/blog";
}

export function getPageRouteSlug(item: any): string {
  return fileSlug(item);
}

export function getPagePermalink(item: any): string {
  const slug = getPageRouteSlug(item);
  if (!slug || slug === "home" || slug === "index") return "/";
  return "/" + slug;
}
`);
console.log('Updated filename-based permalinks: src/lib/permalinks.ts');

for (const rel of ['tina/collections/blog.ts', 'tina/collections/page.ts']) {
  if (!exists(rel)) continue;
  backup(rel);
  let text = read(rel);
  text = text.replace(/\n\s*\{\s*\n\s*name:\s*["']permalink["'],[\s\S]*?\n\s*\},/g, '');
  text = text.replace(
    /const slug = toPublicSlug\(document\?\.permalink\) \|\| toPublicSlug\(document\?\._sys\?\.filename\);/g,
    "const slug = slugifyFilename(document?._sys?.filename || '');"
  );
  write(rel, text);
  console.log('Removed misleading permalink field:', rel);
}

if (exists('tina/fields/view-frontend.ts')) {
  backup('tina/fields/view-frontend.ts');
  let text = read('tina/fields/view-frontend.ts');
  text = text.replace(
    /const raw =\s*values\?\.permalink \|\|\s*values\?\.filename \|\|\s*values\?\._sys\?\.filename \|\|\s*filenameFromBrowser\(kind\) \|\|/,
    'const raw =\n    values?._sys?.filename ||\n    values?.filename ||\n    filenameFromBrowser(kind) ||'
  );
  write('tina/fields/view-frontend.ts', text);
  console.log('Updated frontend shortcut to prefer Tina filename: tina/fields/view-frontend.ts');
}

console.log('');
console.log('Done. Backups saved under:', path.relative(root, backupRoot));
console.log('Next: pnpm exec tinacms build --skip-cloud-checks -c "astro build"');