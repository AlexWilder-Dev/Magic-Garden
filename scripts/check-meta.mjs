// Verifies the link-preview tags survived the build, all with absolute URLs, and that og.jpg is in spec.
import { readFile, stat } from 'node:fs/promises';
import sharp from 'sharp';

const SITE = 'https://alexwilder-dev.github.io/magic-garden-battersea/';
const html = await readFile('dist/index.html', 'utf8');
const problems = [];

const attr = (selector) => {
  const [kind, key] = selector.split('=');
  const re = new RegExp(`<meta[^>]*${kind}="${key}"[^>]*content="([^"]*)"`, 'i');
  return html.match(re)?.[1];
};

const expect = {
  'property=og:type': 'website',
  'property=og:site_name': null,
  'property=og:title': 'The Magic Garden · Battersea',
  'property=og:description': 'A festival in a pub by Battersea Park. Live music most nights, a huge garden, open from 10:30am.',
  'property=og:url': SITE,
  'property=og:image': `${SITE}og.jpg`,
  'property=og:image:width': '1200',
  'property=og:image:height': '630',
  'property=og:image:alt': null,
  'name=twitter:card': 'summary_large_image',
  'name=twitter:title': null,
  'name=twitter:description': null,
  'name=twitter:image': `${SITE}og.jpg`,
  'name=description': 'A festival in a pub by Battersea Park. Live music most nights, a huge garden, open from 10:30am.',
};

for (const [sel, want] of Object.entries(expect)) {
  const got = attr(sel);
  if (got === undefined) problems.push(`missing ${sel}`);
  else if (want !== null && got !== want) problems.push(`${sel} is "${got}", expected "${want}"`);
  else console.log(`ok  ${sel} = ${got}`);
}

const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
if (title !== 'The Magic Garden · Battersea') problems.push(`title is "${title}"`);
else console.log(`ok  <title> = ${title}`);

for (const rel of ['icon', 'apple-touch-icon']) {
  const href = html.match(new RegExp(`<link[^>]*rel="${rel}"[^>]*href="([^"]*)"`))?.[1];
  if (!href) problems.push(`missing link rel=${rel}`);
  else if (!href.startsWith(SITE)) problems.push(`${rel} not absolute: ${href}`);
  else console.log(`ok  link ${rel} = ${href}`);
}

for (const m of html.matchAll(/<meta[^>]*(?:og:url|og:image"|twitter:image")[^>]*content="([^"]*)"/g)) {
  if (!m[1].startsWith('https://')) problems.push(`relative URL: ${m[1]}`);
}
if (html.includes('%BASE_URL%')) problems.push('unreplaced %BASE_URL%');

const meta = await sharp('dist/og.jpg').metadata();
const { size } = await stat('dist/og.jpg');
if (meta.format !== 'jpeg' || meta.width !== 1200 || meta.height !== 630) problems.push(`og.jpg is ${meta.format} ${meta.width}x${meta.height}`);
if (size >= 300 * 1024) problems.push(`og.jpg is ${(size / 1024).toFixed(0)}KB`);
console.log(`ok  og.jpg ${meta.format} ${meta.width}x${meta.height}, ${(size / 1024).toFixed(0)}KB`);

if (problems.length) {
  console.error('\n' + problems.join('\n'));
  process.exit(1);
}
console.log('\nLink preview checks passed.');
