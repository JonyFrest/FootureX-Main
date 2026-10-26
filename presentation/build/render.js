// Renders three.js concept scenes to JPEG via headless Chromium (SwiftShader WebGL).
// usage: node render.js <scene> [mode] [cam,cam]
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), sharp = require('sharp');
const [scene, mode = 'normal', camsArg] = process.argv.slice(2);
const OUT = path.join(__dirname, '..', 'assets', 'renders');
const W = 2560, H = 1440;
const MIME = { '.js': 'text/javascript', '.json': 'application/json', '.html': 'text/html' };
(async () => {
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const page = await browser.newPage({ viewport: { width: 800, height: 450 } });
  page.on('console', (m) => { if (m.type() === 'error') console.error('[page]', m.text()); });
  page.on('pageerror', (e) => console.error('[pageerror]', e.message));
  await page.route('http://r.local/**', async (route) => {
    const u = new URL(route.request().url()); let p = u.pathname;
    let file;
    if (p === '/index.html') return route.fulfill({ contentType: 'text/html', body: `<!doctype html><html><head><style>body{margin:0;background:#000}</style><script type="importmap">{"imports":{"three":"/three/build/three.module.js","three/addons/":"/three/examples/jsm/"}}</script></head><body><script type="module" src="/scenes/main.js"></script></body></html>` });
    if (p.startsWith('/three/')) file = path.join(__dirname, 'node_modules', p.slice(1));
    else file = path.join(__dirname, p.slice(1));
    if (!fs.existsSync(file)) return route.fulfill({ status: 404, body: 'nf ' + p });
    route.fulfill({ contentType: MIME[path.extname(file)] || 'application/octet-stream', body: fs.readFileSync(file) });
  });
  await page.goto(`http://r.local/index.html?scene=${scene}&mode=${mode}&w=${W}&h=${H}`);
  await page.waitForFunction('window.ready === true', null, { timeout: 300000 });
  const cams = camsArg ? camsArg.split(',') : await page.evaluate('window.cams');
  const meta = {};
  for (const cam of cams) {
    const t0 = Date.now();
    const r = await page.evaluate((c) => window.shot(c), cam);
    const buf = Buffer.from(r.img.split(',')[1], 'base64');
    const name = `${scene}${mode !== 'normal' ? '-' + mode : ''}-${cam}`;
    await sharp(buf).resize(1920, 1080, { kernel: 'lanczos3' }).jpeg({ quality: 86, mozjpeg: true }).toFile(path.join(OUT, name + '.jpg'));
    meta[name] = r.labels; console.log('rendered', name, (Date.now() - t0) + 'ms');
  }
  const mf = path.join(OUT, 'labels.json');
  const all = fs.existsSync(mf) ? JSON.parse(fs.readFileSync(mf)) : {};
  Object.assign(all, meta); fs.writeFileSync(mf, JSON.stringify(all, null, 1));
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
