const fs = require('fs');
const path = require('path');
const root = process.cwd();
const p = (rel) => path.join(root, rel);
const exists = (rel) => fs.existsSync(p(rel));
const read = (rel) => fs.readFileSync(p(rel), 'utf8').replace(/^\uFEFF/, '');
const write = (rel, txt) => { fs.mkdirSync(path.dirname(p(rel)), { recursive: true }); fs.writeFileSync(p(rel), txt, 'utf8'); };

// 1) Add image uploader field in Tina Global Config -> Site Identity & SEO.
{
  const rel = 'tina/collections/global-config.ts';
  if (!exists(rel)) throw new Error(rel + ' not found');
  let text = read(rel);
  if (!/name:\s*["']favicon["']/.test(text)) {
    text = text.replace(
      /\{\s*name:\s*["']logo["'],\s*label:\s*["']Logo["'],\s*type:\s*["']image["']\s*\},/,
      `{ name: "logo", label: "Logo", type: "image" },
        {
          name: "favicon",
          label: "Site Favicon",
          type: "image",
          description: "Upload the browser tab/site icon. Recommended: square PNG, SVG, or ICO.",
        },`
    );
  }
  if (!/name:\s*["']favicon["']/.test(text)) {
    throw new Error('Could not insert favicon field into tina/collections/global-config.ts');
  }
  write(rel, text);
  console.log('Patched Tina Global Config favicon field');
}

// 2) Add favicon default value to config JSON so field exists immediately.
{
  const rel = 'src/content/config/config.json';
  if (exists(rel)) {
    const data = JSON.parse(read(rel));
    data.seo = data.seo || {};
    if (!Object.prototype.hasOwnProperty.call(data.seo, 'favicon')) {
      data.seo.favicon = '/favicon.svg';
    }
    write(rel, JSON.stringify(data, null, 2) + '\n');
    console.log('Patched src/content/config/config.json default favicon');
  }
}

// 3) Make BaseHead accept dynamic favicon and render correct icon type.
{
  const rel = 'src/components/BaseHead.astro';
  if (!exists(rel)) throw new Error(rel + ' not found');
  let text = read(rel);

  if (!/favicon\?:\s*string/.test(text)) {
    text = text.replace(/\tnofollow\?: boolean;\n}/, '\tnofollow?: boolean;\n\tfavicon?: string;\n}');
  }

  if (!/\tfavicon\s*=\s*['"]\/favicon\.svg['"]/.test(text)) {
    text = text.replace(/\tnofollow = false,\n}/, '\tnofollow = false,\n\tfavicon = \'/favicon.svg\',\n}');
  }

  if (!/const faviconHref =/.test(text)) {
    text = text.replace(
      /const robots = \[noindex \? 'noindex' : 'index', nofollow \? 'nofollow' : 'follow'\]\.join\(', '\);/,
      `const robots = [noindex ? 'noindex' : 'index', nofollow ? 'nofollow' : 'follow'].join(', ');
const faviconHref = favicon || '/favicon.svg';
const faviconLower = faviconHref.toLowerCase();
const faviconType = faviconLower.endsWith('.png')
\t? 'image/png'
\t: faviconLower.endsWith('.ico')
\t\t? 'image/x-icon'
\t\t: faviconLower.endsWith('.jpg') || faviconLower.endsWith('.jpeg')
\t\t\t? 'image/jpeg'
\t\t\t: 'image/svg+xml';`
    );
  }

  text = text.replace(/<link rel="icon" type="image\/svg\+xml" href="\/favicon\.svg" \/>/, '<link rel="icon" type={faviconType} href={faviconHref} />');

  if (!/href=\{faviconHref\}/.test(text)) {
    throw new Error('Could not update favicon link in BaseHead.astro');
  }
  write(rel, text);
  console.log('Patched BaseHead dynamic favicon rendering');
}

// 4) Pass global config favicon from Base layout into BaseHead.
{
  const rel = 'src/layouts/Base.astro';
  if (!exists(rel)) throw new Error(rel + ' not found');
  let text = read(rel);

  if (!/favicon=\{config\?\.seo\?\.favicon/.test(text)) {
    text = text.replace(
      /\t\t\tcanonicalUrl=\{canonicalUrl\}\n\t\t\tnoindex=\{noindex\}/,
      '\t\t\tcanonicalUrl={canonicalUrl}\n\t\t\tfavicon={config?.seo?.favicon || undefined}\n\t\t\tnoindex={noindex}'
    );
  }

  if (!/favicon=\{config\?\.seo\?\.favicon/.test(text)) {
    throw new Error('Could not pass favicon prop in Base.astro');
  }
  write(rel, text);
  console.log('Patched Base layout to pass config.seo.favicon');
}

console.log('All favicon source patches applied.');