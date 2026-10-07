#!/usr/bin/env node
// LinkedIn carousel builder. No npm packages: Node plus any Chromium browser.
//
//   node carousel.mjs doctor                      what is installed and set up
//   node carousel.mjs templates                   list template ids
//   node carousel.mjs config-path                 show the user-owned brand file location
//   node carousel.mjs html <deck.html>            assemble HTML without a browser or checks
//   node carousel.mjs demo <template-id> [--out dir]   preview a template's sample deck (no PDF)
//   node carousel.mjs check <deck.html>           build carousel.html, run the checker, write overview.png
//   node carousel.mjs build <deck.html>           after preview approval: check + PDF + PNG slides
//
// Options: --out <dir>  --config <branding-config.json>  --no-png  --png-scale <1|2>  --placeholder-brand
// Exit codes: 0 completed (warnings may remain), 2 layout errors, 1 runtime/export failure.

import { readFileSync, writeFileSync, existsSync, mkdirSync, mkdtempSync, rmSync, statSync, readdirSync, copyFileSync } from 'node:fs';
import { spawn, spawnSync } from 'node:child_process';
import { dirname, join, resolve, extname, isAbsolute } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { tmpdir, platform, homedir } from 'node:os';
import { createHash } from 'node:crypto';

const SKILL_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const TEMPLATE_DIR = join(SKILL_DIR, 'templates');
const PLACEHOLDER_BRAND = {
  author_name: 'Your Name',
  publication_name: 'Your Publication',
  positioning: 'yourname.substack.com',
  photo_path: '',
};

function fail(message, code = 1) {
  throw Object.assign(new Error(message), { exitCode: code });
}

function configPathFor(args) {
  if (args.config || process.env.CAROUSEL_CONFIG) return resolve(args.config || process.env.CAROUSEL_CONFIG);
  const base = platform() === 'win32'
    ? (process.env.APPDATA || join(homedir(), 'AppData', 'Roaming'))
    : (process.env.XDG_CONFIG_HOME || join(homedir(), '.config'));
  return join(base, 'maker-labs', 'linkedin-carousel-html', 'branding-config.json');
}

function validOutput(path) {
  if (!existsSync(path) || !statSync(path).isFile()) return false;
  const data = readFileSync(path);
  if (extname(path) === '.png') return data.length > 32 && data.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])) && data.subarray(-8, -4).toString() === 'IEND';
  if (extname(path) === '.pdf') return data.subarray(0, 5).toString() === '%PDF-' && data.subarray(-1024).includes(Buffer.from('%%EOF'));
  return data.length > 0;
}

function requirePng(path, width, height) {
  if (!validOutput(path)) fail(`Missing or incomplete PNG: ${path}`);
  const data = readFileSync(path);
  if (width && (data.readUInt32BE(16) !== width || data.readUInt32BE(20) !== height)) fail(`Wrong PNG dimensions: ${path}`);
}

// ---------- arguments ----------
function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) { args._.push(a); continue; }
    const key = a.slice(2);
    if (['no-png', 'placeholder-brand'].includes(key)) args[key] = true;
    else if (['out', 'config', 'png-scale'].includes(key)) {
      if (!argv[i + 1] || argv[i + 1].startsWith('--')) fail(`Missing value for --${key}`);
      args[key] = argv[++i];
    } else fail(`Unknown option: --${key}`);
  }
  if (args['png-scale'] && !['1', '2'].includes(args['png-scale'])) fail('--png-scale must be 1 or 2.');
  return args;
}

// ---------- browser ----------
function findBrowser() {
  if (process.env.CAROUSEL_BROWSER) return existsSync(process.env.CAROUSEL_BROWSER) ? process.env.CAROUSEL_BROWSER : null;
  const os = platform();
  const candidates = [];
  if (os === 'darwin') {
    for (const base of ['/Applications', join(homedir(), 'Applications')]) {
      candidates.push(
        join(base, 'Google Chrome.app/Contents/MacOS/Google Chrome'),
        join(base, 'Microsoft Edge.app/Contents/MacOS/Microsoft Edge'),
        join(base, 'Brave Browser.app/Contents/MacOS/Brave Browser'),
        join(base, 'Chromium.app/Contents/MacOS/Chromium'),
      );
    }
  } else if (os === 'win32') {
    const roots = [process.env['PROGRAMFILES'], process.env['PROGRAMFILES(X86)'], process.env['LOCALAPPDATA']].filter(Boolean);
    for (const root of roots) {
      candidates.push(
        join(root, 'Google/Chrome/Application/chrome.exe'),
        join(root, 'Microsoft/Edge/Application/msedge.exe'),
        join(root, 'BraveSoftware/Brave-Browser/Application/brave.exe'),
      );
    }
  } else {
    for (const name of ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser', 'microsoft-edge', 'brave-browser']) {
      const found = spawnSync('which', [name], { encoding: 'utf8' });
      if (found.status === 0 && found.stdout.trim()) candidates.push(found.stdout.trim());
    }
  }
  return candidates.find((p) => existsSync(p)) || null;
}

// Each run gets its own throwaway profile, so it works while the user's browser is open and
// several runs can go in parallel. A browser on a fresh profile often lingers after it has
// written its output, so we stop it as soon as the output is complete instead of waiting for exit.
//   outFile: the file the run writes (screenshot or PDF)
//   stdoutUntil: text that marks the end of the output we need from --dump-dom
function runBrowser(browser, args, { outFile, stdoutUntil, timeoutMs = 60000 } = {}) {
  return new Promise((done) => {
    const profile = mkdtempSync(join(tmpdir(), 'carousel-profile-'));
    if (outFile) rmSync(outFile, { force: true });
    const child = spawn(browser, [
      '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
      '--disable-extensions', '--hide-scrollbars', '--virtual-time-budget=10000',
      `--user-data-dir=${profile}`, ...args,
    ], { stdio: ['ignore', 'pipe', 'ignore'] });
    let stdout = '', settled = false, lastSize = -1, stable = 0;
    child.stdout.on('data', (d) => { stdout += d; });
    const complete = () => outFile ? validOutput(outFile) : !!(stdoutUntil && stdout.includes(stdoutUntil));
    const finish = (reason) => {
      if (settled) return;
      settled = true;
      clearInterval(poll);
      clearTimeout(timer);
      try { child.kill('SIGKILL'); } catch { /* already gone */ }
      setTimeout(() => {
        try { rmSync(profile, { recursive: true, force: true }); } catch { /* still locked, the OS clears tmp */ }
        done({ stdout, ok: !reason && complete(), error: reason || (complete() ? null : 'Browser exited before producing complete output.') });
      }, 150);
    };
    const poll = setInterval(() => {
      if (outFile && existsSync(outFile)) {
        const size = statSync(outFile).size;
        stable = size > 0 && size === lastSize ? stable + 1 : 0;
        lastSize = size;
        if (stable >= 2 && complete()) finish();
      }
      if (stdoutUntil && stdout.includes(stdoutUntil)) finish();
    }, 150);
    const timer = setTimeout(() => finish(`Browser timed out after ${timeoutMs / 1000}s.`), timeoutMs);
    child.on('error', (err) => finish(`Cannot start browser: ${err.message}`));
    child.on('close', (code) => finish(code === 0 ? undefined : `Browser exited with code ${code}.`));
  });
}

// ---------- brand ----------
function loadBrand(args) {
  if (args['placeholder-brand']) return { ...PLACEHOLDER_BRAND, placeholder: true };
  const configPath = configPathFor(args);
  if (!existsSync(configPath)) {
    fail(`No brand saved yet (${configPath} is missing). Run the first-time setup in setup.md, or pass --placeholder-brand.`, 1);
  }
  const config = JSON.parse(readFileSync(configPath, 'utf8'));
  if (config.first_time_setup !== false) {
    fail('Brand setup is not finished (first_time_setup is not false). Run the setup in setup.md, or pass --placeholder-brand.', 1);
  }
  const b = config.branding || {};
  if (typeof b.author_name !== 'string' || !b.author_name.trim()) fail('branding.author_name must be nonempty text.');
  for (const key of ['publication_name', 'positioning', 'photo_path', 'template', 'image_type']) {
    if (b[key] !== undefined && typeof b[key] !== 'string') fail(`branding.${key} must be text.`);
  }
  if ((b.positioning || '').length >= 60) fail('branding.positioning must be under 60 characters.');
  if (b.image_type && !['photo', 'logo'].includes(b.image_type)) fail('branding.image_type must be photo or logo.');
  let photo = b.photo_path || '';
  if (photo && !isAbsolute(photo)) photo = resolve(dirname(configPath), photo);
  return {
    author_name: b.author_name,
    publication_name: b.publication_name || b.author_name,
    positioning: b.positioning || '',
    photo_path: photo,
    image_type: b.image_type || 'photo',
    template: listTemplates().includes(b.template) ? b.template : '(choose a template)',
  };
}

const MIME = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.gif': 'image/gif' };

// Square-crop the photo to 320px with the browser, so no image library is needed.
async function photoDataUri(browser, photoPath, notes, imageType = 'photo') {
  if (!photoPath) return null;
  if (!existsSync(photoPath) || !statSync(photoPath).isFile()) fail(`Image not found at ${photoPath}. Ask for a replacement or an explicit no-image choice.`);
  const stat = statSync(photoPath);
  if (imageType === 'logo') {
    const mime = MIME[extname(photoPath).toLowerCase()];
    if (!['image/png', 'image/jpeg'].includes(mime) || stat.size >= 5000000) fail('Use a PNG or JPG logo under 5 MB.');
    return `data:${mime};base64,${readFileSync(photoPath).toString('base64')}`;
  }
  const key = createHash('sha1').update(`${photoPath}:${stat.mtimeMs}:${stat.size}`).digest('hex').slice(0, 16);
  const cached = join(tmpdir(), `carousel-avatar-${key}.png`);
  if (browser && !validOutput(cached)) {
    const page = join(tmpdir(), `carousel-avatar-${key}.html`);
    writeFileSync(page, `<!doctype html><body style="margin:0"><img src="${pathToFileURL(photoPath).href}" style="display:block;width:320px;height:320px;object-fit:cover">`);
    await runBrowser(browser, ['--window-size=320,320', `--screenshot=${cached}`, pathToFileURL(page).href], { outFile: cached });
    try { rmSync(page, { force: true }); } catch { /* ignore */ }
  }
  if (validOutput(cached)) {
    return `data:image/png;base64,${readFileSync(cached).toString('base64')}`;
  }
  const mime = MIME[extname(photoPath).toLowerCase()];
  if (mime && stat.size < 1500000) {
    notes.push('Could not resize the photo, so it is embedded at full size.');
    return `data:${mime};base64,${readFileSync(photoPath).toString('base64')}`;
  }
  fail('Could not read the photo. Supply a JPG or PNG under 1.5 MB, or explicitly choose no image.');
}

// ---------- assemble carousel.html ----------
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const pad = (n) => String(n).padStart(2, '0');

function assemble(deckSource, brand, photoUri) {
  let src = deckSource.replace(/<!--[\s\S]*?-->/g, '');

  const links = [];
  src = src.replace(/<link\b[^>]*>/gi, (tag) => { links.push(tag); return ''; });
  const styles = [];
  src = src.replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gi, (_, css) => { styles.push(css); return ''; });

  // Number the slides.
  const open = /<section\b[^>]*\bclass\s*=\s*"[^"]*\bslide\b[^"]*"[^>]*>/gi;
  const starts = [];
  let match;
  while ((match = open.exec(src))) starts.push(match.index);
  if (!starts.length) fail('No slides found. Each slide must be <section class="slide ...">.');
  const total = starts.length;
  let slidesHtml = '';
  starts.forEach((start, i) => {
    const end = i + 1 < total ? starts[i + 1] : src.length;
    slidesHtml += src.slice(start, end)
      .replace(/\{\{PAGE\}\}/g, pad(i + 1))
      .replace(/\{\{PAGE_RAW\}\}/g, String(i + 1));
  });

  const tokens = {
    '{{TOTAL}}': pad(total),
    '{{TOTAL_RAW}}': String(total),
    '{{AUTHOR_NAME}}': esc(brand.author_name),
    '{{AUTHOR_INITIAL}}': esc((brand.author_name.trim()[0] || '?').toUpperCase()),
    '{{PUBLICATION_NAME}}': esc(brand.publication_name),
    '{{PUBLICATION_NAME_UPPER}}': esc(brand.publication_name.toUpperCase()),
    '{{POSITIONING_TEXT}}': esc(brand.positioning),
  };
  let css = styles.join('\n');
  for (const [token, value] of Object.entries(tokens)) {
    slidesHtml = slidesHtml.split(token).join(value);
    css = css.split(token).join(value);
  }
  const leftover = [...new Set((slidesHtml + css).match(/\{\{[A-Z_]+\}\}/g) || [])];
  if (leftover.length) fail(`Unknown tokens in the deck: ${leftover.join(', ')}`);

  const titleMatch = slidesHtml.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : 'LinkedIn carousel';
  const baseCss = readFileSync(join(TEMPLATE_DIR, '_base.css'), 'utf8');
  const runtime = readFileSync(join(TEMPLATE_DIR, '_runtime.js'), 'utf8');
  const photoCss = photoUri ? `:root { --author-photo: url("${photoUri}"); }\n` : '';

  const html = `<!doctype html>
<html lang="en"${photoUri ? ` class="has-photo${brand.image_type === 'logo' ? ' has-logo' : ''}"` : ''}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
${links.join('\n')}
<style>
${baseCss}
${photoCss}${css}
${photoUri && brand.image_type === 'logo' ? 'html.has-logo .avatar { background-size: contain; background-repeat: no-repeat; background-color: transparent; border-radius: 0; }' : ''}
</style>
</head>
<body>
<main class="deck">
${slidesHtml.trim()}
</main>
<script>
${runtime}
</script>
</body>
</html>
`;
  return { html, total };
}

// ---------- commands ----------
async function runCheck(browser, htmlUrl, total) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await runBrowser(browser, ['--window-size=1080,1350', '--dump-dom', `${htmlUrl}?check=1`],
      { stdoutUntil: '</html>', timeoutMs: 25000 });
    const m = res.stdout.match(/<script type="application\/json" id="carousel-report">([\s\S]*?)<\/script>/);
    if (res.ok && m) {
      try {
        const report = JSON.parse(m[1]);
        if (Array.isArray(report.slides) && report.slides.length === total && report.slides.every((s, i) =>
          s.n === i + 1 && typeof s.type === 'string' && Array.isArray(s.errors) && Array.isArray(s.warnings))) return report;
      } catch { /* retry */ }
    }
    if (!res.ok) fail(res.error);
  }
  fail('The checker did not return a valid report. Export stopped; inspect carousel.html and retry.');
}

function printReport(report) {
  let errors = 0, warnings = 0;
  for (const s of report.slides) {
    const status = s.errors.length ? 'ERROR' : s.warnings.length ? 'WARN ' : 'ok   ';
    console.log(`${status} slide ${pad(s.n)} ${s.type.padEnd(7)} ${String(s.words).padStart(3)}/${s.maxWords} words  fill ${String(s.fill).padStart(3)}%  largest gap ${s.largestGap}px`);
    for (const e of s.errors) { console.log(`        error: ${e}`); errors++; }
    for (const w of s.warnings) { console.log(`        warn:  ${w}`); warnings++; }
  }
  if (report.fontsFailed && report.fontsFailed.length) {
    console.log(`warn:  fonts failed to load (${report.fontsFailed.join(', ')}). Check the internet connection and rebuild.`);
    warnings++;
  }
  console.log(`${errors} error(s), ${warnings} warning(s)`);
  return errors;
}

async function build(deckPath, args, { full, htmlOnly = false }) {
  deckPath = resolve(deckPath);
  if (!existsSync(deckPath)) fail(`Deck not found: ${deckPath}`);
  const browser = findBrowser();
  if (!browser && !htmlOnly) {
    fail('No Chromium browser found. Use the html command to generate carousel.html for manual printing, or set CAROUSEL_BROWSER to an available browser executable.');
  }
  const outDir = resolve(args.out || dirname(deckPath));
  mkdirSync(outDir, { recursive: true });

  const notes = [];
  const brand = loadBrand(args);
  const photoUri = await photoDataUri(htmlOnly ? null : browser, brand.photo_path, notes, brand.image_type);
  const { html, total } = assemble(readFileSync(deckPath, 'utf8'), brand, photoUri);
  const htmlPath = join(outDir, 'carousel.html');
  if (htmlPath === deckPath) fail('The deck source cannot be named carousel.html. Name it deck.html.');
  writeFileSync(htmlPath, html);
  const url = pathToFileURL(htmlPath).href;
  console.log(`Built ${htmlPath} (${total} slides)`);
  if (brand.placeholder) console.log('Using placeholder branding.');
  notes.forEach((n) => console.log('note:  ' + n));
  if (total < 6 || total > 10) console.log(`note:  ${total} slides. Finished carousels should have 6 to 10.`);
  if (htmlOnly) {
    console.log('HTML only: automatic checks and PDF/PNG export were not run. Open carousel.html in Chrome or Edge and use Save as PDF.');
    return;
  }
  rmSync(join(outDir, 'report.json'), { force: true });

  // Overview sheet: every slide in one image, for a quick visual review.
  const cols = Math.min(total, 4), rows = Math.ceil(total / 4);
  const sheetPath = join(outDir, 'overview.png');
  const sheetJob = runBrowser(browser, [
    `--window-size=${cols * 378 + (cols + 1) * 16},${Math.ceil(rows * 472.5) + (rows + 1) * 16}`,
    `--screenshot=${sheetPath}`, `${url}?sheet=1`,
  ], { outFile: sheetPath });
  const results = await Promise.allSettled([runCheck(browser, url, total), sheetJob]);
  if (results[0].status === 'rejected') throw results[0].reason;
  const report = results[0].value;
  writeFileSync(join(outDir, 'report.json'), JSON.stringify(report, null, 2));
  const errors = printReport(report);
  if (results[1].status === 'rejected' || !results[1].value.ok) fail('Overview rendering failed. Export stopped.');
  requirePng(sheetPath);
  console.log(`Overview: ${sheetPath}`);
  if (errors) fail('Layout errors found. Fix deck.html before exporting. Existing exports, if any, are from an earlier build.', 2);

  if (full) {
    const stage = mkdtempSync(join(outDir, '.carousel-export-'));
    try {
      const pdfPath = join(stage, 'carousel.pdf');
      const jobs = [runBrowser(browser, ['--no-pdf-header-footer', `--print-to-pdf=${pdfPath}`, url], { outFile: pdfPath })];
      if (!args['no-png']) {
        const scale = args['png-scale'] === '1' ? 1 : 2;
        const slidesDir = join(stage, 'slides');
        mkdirSync(slidesDir, { recursive: true });
        const queue = Array.from({ length: total }, (_, i) => i + 1);
        const worker = async () => {
          while (queue.length) {
            const n = queue.shift();
            const png = join(slidesDir, `slide-${pad(n)}.png`);
            const rendered = await runBrowser(browser, [
              '--window-size=1080,1350', `--force-device-scale-factor=${scale}`,
              `--screenshot=${png}`, `${url}?slide=${n}`,
            ], { outFile: png });
            if (!rendered.ok) fail(`Slide ${n}: ${rendered.error}`);
            requirePng(png, 1080 * scale, 1350 * scale);
          }
        };
        jobs.push(...Array.from({ length: Math.min(4, total) }, worker));
      }
      const exports = await Promise.allSettled(jobs);
      const rejected = exports.find((r) => r.status === 'rejected');
      if (rejected) throw rejected.reason;
      if (!exports[0].value.ok || !validOutput(pdfPath)) fail('PDF export failed. Existing exports, if any, are from an earlier build.');
      const finalSlides = join(outDir, 'slides');
      if (existsSync(finalSlides)) {
        for (const name of readdirSync(finalSlides)) {
          if (/^slide-\d+\.png$/.test(name)) rmSync(join(finalSlides, name));
        }
      }
      copyFileSync(pdfPath, join(outDir, 'carousel.pdf'));
      console.log(`PDF:      ${join(outDir, 'carousel.pdf')}`);
      if (!args['no-png']) {
        mkdirSync(finalSlides, { recursive: true });
        for (let n = 1; n <= total; n++) copyFileSync(join(stage, 'slides', `slide-${pad(n)}.png`), join(finalSlides, `slide-${pad(n)}.png`));
        console.log(`PNGs:     ${finalSlides} (${total} of ${total})`);
      }
    } finally { rmSync(stage, { recursive: true, force: true }); }
  }
}

function listTemplates() {
  return readdirSync(TEMPLATE_DIR).filter((f) => f.endsWith('.html')).map((f) => f.replace(/\.html$/, '')).sort();
}

async function main() {
  const [command, ...rest] = process.argv.slice(2);
  const args = parseArgs(rest);

  if (command === 'doctor') {
    const browser = findBrowser();
    console.log(`Node:      ${process.version}`);
    console.log(`Browser:   ${browser || 'NOT FOUND (install Chrome or Edge, or set CAROUSEL_BROWSER)'}`);
    const configPath = configPathFor(args);
    console.log(`Config:    ${configPath}`);
    let brandLine = 'not set up (run setup.md)';
    if (existsSync(configPath)) {
      const c = JSON.parse(readFileSync(configPath, 'utf8'));
      if (c.first_time_setup === false) {
        const b = loadBrand(args);
        brandLine = `${b.author_name} / ${b.positioning} / ${b.template}`;
      }
    }
    console.log(`Brand:     ${brandLine}`);
    console.log(`Templates: ${listTemplates().join(', ')}`);
    process.exit(browser ? 0 : 1);
  }
  if (command === 'config-path') { console.log(configPathFor(args)); return; }
  if (command === 'templates') { console.log(listTemplates().join('\n')); return; }
  if (command === 'demo') {
    const id = args._[0];
    if (!id || !listTemplates().includes(id)) fail(`Unknown template. Choose one of: ${listTemplates().join(', ')}`);
    const configPath = configPathFor(args);
    const ready = existsSync(configPath) && JSON.parse(readFileSync(configPath, 'utf8')).first_time_setup === false;
    if (!ready && !args.config && !process.env.CAROUSEL_CONFIG) args['placeholder-brand'] = true;
    args.out = args.out || resolve(`carousel-demo-${id}`);
    return build(join(TEMPLATE_DIR, `${id}.html`), args, { full: false });
  }
  if (command === 'check' || command === 'build' || command === 'html') {
    if (!args._[0]) fail(`Usage: node carousel.mjs ${command} <deck.html>`);
    return build(args._[0], args, { full: command === 'build', htmlOnly: command === 'html' });
  }
  console.log('Usage: node carousel.mjs <doctor|config-path|templates|demo|html|check|build> ...  (see the header of this file)');
  process.exit(command ? 1 : 0);
}

main().catch((err) => { console.error('Error: ' + err.message); process.exitCode = err.exitCode || 1; });
