import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, rmSync, chmodSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const skill = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const script = join(skill, 'scripts/carousel.mjs');
const scratch = mkdtempSync(join(tmpdir(), 'carousel-tests-'));
const browser = join(scratch, 'browser.mjs');
// Deterministic browser boundary stub; real rendering is tested separately.
writeFileSync(browser, `#!${process.execPath}
import {writeFileSync, readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const args=process.argv.slice(2), mode=process.env.TEST_BROWSER_MODE;
if(mode==='crash') process.exit(7);
const url=new URL(args.at(-1));
const total=(readFileSync(fileURLToPath(url),'utf8').match(/<section class="slide/g)||[]).length;
if(args.includes('--dump-dom')) {
 const slides=Array.from({length:total},(_,i)=>({n:i+1,type:'content',words:10,maxWords:100,fill:70,largestGap:50,errors:mode==='layout-error'?['Text is clipped']:[],warnings:[]}));
 console.log(mode==='no-report'?'<html></html>':'<html><script type="application/json" id="carousel-report">'+JSON.stringify({slides,fontsFailed:[]})+'</script></html>');
} else {
 const pdf=args.find(x=>x.startsWith('--print-to-pdf='));
 const png=args.find(x=>x.startsWith('--screenshot='));
 if(pdf && mode!=='no-pdf') writeFileSync(pdf.slice(15),'%PDF-1.4\\nmock PDF boundary fixture\\n%%EOF');
 if(png && !(mode==='no-slide' && url.searchParams.has('slide'))) {
  const buf=Buffer.alloc(48); Buffer.from([137,80,78,71,13,10,26,10]).copy(buf);
  const scale=args.includes('--force-device-scale-factor=1')?1:2;
  buf.writeUInt32BE(mode==='wrong-size'?1:1080*scale,16); buf.writeUInt32BE(1350*scale,20); buf.write('IEND',40);
  writeFileSync(png.slice(13),buf);
 }
}
`);
chmodSync(browser, 0o755);
const source = readFileSync(join(skill, 'templates/sticky-notes.html'), 'utf8');
const sections = source.match(/<section\b[\s\S]*?<\/section>/g);
function deck(count, name) {
  const path = join(scratch, `${name}.html`);
  writeFileSync(path, source.slice(0, source.indexOf('<section')) + sections[0] + sections[1].repeat(count - 2) + sections[2]);
  return path;
}
const six = deck(6, 'six'), three = deck(3, 'three');
function run(args, mode = '', env = {}) {
  return spawnSync(process.execPath, [script, ...args], {
    encoding: 'utf8', timeout: 30000,
    env: { ...process.env, CAROUSEL_CONFIG: '', XDG_CONFIG_HOME: join(scratch, 'config'), CAROUSEL_BROWSER: browser, TEST_BROWSER_MODE: mode, ...env },
  });
}
function build(path, out, mode = '', extra = []) {
  return run(['build', path, '--out', out, '--placeholder-brand', ...extra], mode);
}
test.after(() => rmSync(scratch, {recursive:true,force:true}));

test('external config is reused by doctor and HTML; override wins', () => {
  const config = run(['config-path']).stdout.trim();
  assert.ok(!config.startsWith(skill));
  mkdirSync(dirname(config), {recursive:true});
  writeFileSync(config, JSON.stringify({first_time_setup:false,branding:{author_name:'Example Person',positioning:'Testing',template:'swiss-grid'}}));
  const doctor=run(['doctor']); assert.equal(doctor.status,0,doctor.stderr); assert.match(doctor.stdout,/Example Person.*swiss-grid/);
  const out=join(scratch,'html-only');
  const html=run(['html',three,'--out',out],'',{CAROUSEL_BROWSER:'/missing/browser'});
  assert.equal(html.status,0,html.stderr); assert.match(readFileSync(join(out,'carousel.html'),'utf8'),/Example Person/);
  assert.ok(!existsSync(join(out,'carousel.pdf'))); assert.match(html.stdout,/automatic checks.*not run/);
  assert.equal(run(['config-path','--config',join(scratch,'explicit.json')],'',{CAROUSEL_CONFIG:join(scratch,'env.json')}).stdout.trim(),join(scratch,'explicit.json'));
});

test('browser crash fails without replacing existing exports', () => {
  const out=join(scratch,'crash'); mkdirSync(out); writeFileSync(join(out,'carousel.pdf'),'old export');
  const r=build(three,out,'crash'); assert.equal(r.status,1); assert.match(r.stderr,/code 7/);
  assert.equal(readFileSync(join(out,'carousel.pdf'),'utf8'),'old export');
  assert.ok(!existsSync(join(out,'overview.png')));
});
test('missing checker report blocks export and removes stale report', () => {
  const out=join(scratch,'no-report'); mkdirSync(out); writeFileSync(join(out,'report.json'),'old report');
  const r=build(three,out,'no-report'); assert.equal(r.status,1); assert.match(r.stderr,/valid report/);
  assert.ok(!existsSync(join(out,'report.json'))); assert.ok(!existsSync(join(out,'carousel.pdf')));
});
test('layout errors stop before exporting', () => {
  const out=join(scratch,'layout'); const r=build(three,out,'layout-error');
  assert.equal(r.status,2); assert.ok(existsSync(join(out,'report.json'))); assert.ok(!existsSync(join(out,'carousel.pdf')));
});
for (const mode of ['no-pdf','no-slide','wrong-size']) {
  test(`${mode} fails without publishing partial exports`, () => {
    const out=join(scratch,mode); const r=build(three,out,mode);
    assert.equal(r.status,1,r.stdout+r.stderr); assert.ok(!existsSync(join(out,'carousel.pdf')));
    assert.ok(!readdirSync(out).some(n=>n.startsWith('.carousel-export-')));
  });
}
test('shorter rebuild removes only obsolete generated slides; no-png clears generated PNGs', () => {
  const out=join(scratch,'shorten'); let r=build(six,out); assert.equal(r.status,0,r.stderr);
  const slides=join(out,'slides'); writeFileSync(join(slides,'notes.txt'),'keep');
  r=build(three,out); assert.equal(r.status,0,r.stderr);
  assert.deepEqual(readdirSync(slides).sort(),['notes.txt','slide-01.png','slide-02.png','slide-03.png']);
  r=build(three,out,'',['--no-png']); assert.equal(r.status,0,r.stderr);
  assert.deepEqual(readdirSync(slides),['notes.txt']);
});
test('bad config and invalid flags have clear failures', () => {
  const config=join(scratch,'bad.json'); writeFileSync(config,JSON.stringify({first_time_setup:false,branding:{author_name:3}}));
  const r=run(['html',three,'--config',config]); assert.equal(r.status,1); assert.match(r.stderr,/nonempty text/);
  assert.equal(run(['build',three,'--out']).status,1);
  assert.equal(run(['build',three,'--png-scale','4']).status,1);
});

test('logo is embedded losslessly in HTML without a browser and uses contain sizing', () => {
  const logo = join(scratch, 'logo.png');
  const bytes = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLttAAAAABJRU5ErkJggg==', 'base64');
  writeFileSync(logo, bytes);
  const config = join(scratch, 'logo-brand.json');
  writeFileSync(config, JSON.stringify({first_time_setup:false,branding:{author_name:'Logo Test',photo_path:logo,image_type:'logo',template:'sticky-notes'}}));
  const out = join(scratch, 'logo-output');
  const r = run(['html',three,'--config',config,'--out',out], '', {CAROUSEL_BROWSER:'/missing/browser'});
  assert.equal(r.status,0,r.stderr);
  const html = readFileSync(join(out,'carousel.html'),'utf8');
  const embedded = html.match(/data:image\/png;base64,([^"\)]+)/)[1];
  assert.deepEqual(Buffer.from(embedded,'base64'),bytes);
  assert.match(html,/class="has-photo has-logo"/);
  assert.match(html,/html\.has-logo \.avatar \{ background-size: contain;.*border-radius: 0;/);
});

test('a missing chosen image fails instead of silently switching to initials', () => {
  const config = join(scratch, 'missing-image.json');
  writeFileSync(config, JSON.stringify({first_time_setup:false,branding:{author_name:'Example',photo_path:join(scratch,'missing.png'),image_type:'logo'}}));
  const r = run(['html',three,'--config',config,'--out',join(scratch,'missing-image')]);
  assert.equal(r.status,1); assert.match(r.stderr,/replacement or an explicit no-image choice/);
});

test('demo and check create review files without exporting PDF or slide PNGs', () => {
  for (const [command, input] of [['demo','sticky-notes'], ['check',three]]) {
    const out = join(scratch, `${command}-preview`);
    const r = run([command,input,'--placeholder-brand','--out',out]);
    assert.equal(r.status,0,r.stderr);
    for (const name of ['carousel.html','overview.png','report.json']) assert.ok(existsSync(join(out,name)));
    assert.ok(!existsSync(join(out,'carousel.pdf')));
    assert.ok(!existsSync(join(out,'slides')));
  }
});
