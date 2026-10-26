// Camera-path flythrough of a three.js concept scene -> MP4 (H.264) for the architectural tour slides.
// The camera follows a centripetal Catmull-Rom spline through the scene's named key cameras (the same
// viewpoints used for the still renders), so the video and the slides show one consistent model.
// usage: node flythrough.js <scene> <cam,cam,...> <seconds> [fps=30] [w=1600] [h=900]
// requires: playwright (Chromium) and ffmpeg on PATH. Output: ../assets/video/<scene>-flythrough.mp4 + poster PNG (first frame).
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), sharp = require('sharp');
const { execFileSync } = require('child_process');

const [scene, camsArg, secArg, fpsArg = '30', wArg = '1600', hArg = '900'] = process.argv.slice(2);
if (!/^[a-z]+$/.test(scene || '') || !camsArg || !secArg) { console.error('usage: node flythrough.js <scene> <cam,cam,...> <seconds> [fps] [w] [h]'); process.exit(1); }
const FPS = +fpsArg, W = +wArg, H = +hArg, N = Math.round(+secArg * FPS);
if (![FPS, W, H, N].every((v) => Number.isFinite(v) && v > 1)) { console.error('fps, width, height and seconds must be positive numbers'); process.exit(1); }
const OUT = path.join(__dirname, '..', 'assets', 'video');
const FRAMES = path.join(OUT, `.frames-${scene}`);
const MIME = { '.js': 'text/javascript', '.json': 'application/json' };

// centripetal Catmull-Rom between p1 and p2
function cr(p0, p1, p2, p3, t) {
  const d = (a, b) => Math.max(1e-6, Math.sqrt(Math.hypot(...a.map((v, i) => v - b[i]))));
  const t0 = 0, t1 = t0 + d(p0, p1), t2 = t1 + d(p1, p2), t3 = t2 + d(p2, p3), u = t1 + (t2 - t1) * t;
  const L = (a, b, ta, tb) => a.map((v, i) => ((tb - u) * v + (u - ta) * b[i]) / (tb - ta));
  const A1 = L(p0, p1, t0, t1), A2 = L(p1, p2, t1, t2), A3 = L(p2, p3, t2, t3);
  const B1 = L(A1, A2, t0, t2), B2 = L(A2, A3, t1, t3);
  return L(B1, B2, t1, t2);
}
const ease = (x) => 0.5 - 0.5 * Math.cos(Math.PI * x); // ease in/out over the whole path

(async () => {
  fs.rmSync(FRAMES, { recursive: true, force: true }); fs.mkdirSync(FRAMES, { recursive: true });
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const page = await browser.newPage({ viewport: { width: 800, height: 450 } });
  page.on('pageerror', (e) => console.error('[pageerror]', e.message));
  await page.route('http://r.local/**', async (route) => {
    const p = new URL(route.request().url()).pathname;
    if (p === '/index.html') return route.fulfill({ contentType: 'text/html', body: `<!doctype html><html><head><style>body{margin:0;background:#000}</style><script type="importmap">{"imports":{"three":"/three/build/three.module.js","three/addons/":"/three/examples/jsm/"}}</script></head><body><script type="module" src="/scenes/main.js"></script></body></html>` });
    const file = p.startsWith('/three/') ? path.join(__dirname, 'node_modules', p.slice(1)) : path.join(__dirname, p.slice(1));
    if (!file.startsWith(__dirname) || !fs.existsSync(file)) return route.fulfill({ status: 404, body: 'nf' });
    route.fulfill({ contentType: MIME[path.extname(file)] || 'application/octet-stream', body: fs.readFileSync(file) });
  });
  await page.goto(`http://r.local/index.html?scene=${scene}&w=${W}&h=${H}`);
  await page.waitForFunction('window.ready === true', null, { timeout: 300000 });
  const info = await page.evaluate('window.camInfo');
  const keys = camsArg.split(',').map((k) => { if (!info[k]) throw new Error('unknown camera ' + k); return info[k]; });
  const defExp = await page.evaluate('window.defExposure');
  const P = keys.map((k) => k.pos), T = keys.map((k) => k.target), F = keys.map((k) => k.fov), X = keys.map((k) => k.exposure ?? defExp);
  const ext = (a) => [a[0].map((v, i) => 2 * v - a[1][i]), ...a, a[a.length - 1].map((v, i) => 2 * v - a[a.length - 2][i])];
  const PE = ext(P), TE = ext(T), seg = keys.length - 1;
  const t0 = Date.now();
  for (let f = 0; f < N; f++) {
    const g = ease(f / (N - 1)) * seg, s = Math.min(seg - 1, Math.floor(g)), u = g - s;
    const pos = cr(PE[s], PE[s + 1], PE[s + 2], PE[s + 3], u), target = cr(TE[s], TE[s + 1], TE[s + 2], TE[s + 3], u);
    const k = 0.5 - 0.5 * Math.cos(Math.PI * u);
    const fov = F[s] + (F[s + 1] - F[s]) * k, exp = X[s] + (X[s + 1] - X[s]) * k;
    const url = await page.evaluate(([a, b, c, e]) => window.shotAt(a, b, c, e), [pos, target, fov, exp]);
    fs.writeFileSync(path.join(FRAMES, String(f).padStart(5, '0') + '.jpg'), Buffer.from(url.split(',')[1], 'base64'));
    if (f % 30 === 0) console.log(`frame ${f}/${N} ${((Date.now() - t0) / (f + 1)).toFixed(0)} ms/frame`);
  }
  await browser.close();
  const mp4 = path.join(OUT, `${scene}-flythrough.mp4`);
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(FRAMES, '%05d.jpg'), '-c:v', 'libx264', '-preset', 'slow', '-crf', '27', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', mp4], { stdio: 'inherit' });
  await sharp(path.join(FRAMES, '00000.jpg')).resize(1280, 720).png({ compressionLevel: 9 }).toFile(path.join(OUT, `${scene}-flythrough-poster.png`));
  fs.rmSync(FRAMES, { recursive: true, force: true });
  console.log('wrote', mp4, (fs.statSync(mp4).size / 1e6).toFixed(1) + ' MB');
})().catch((e) => { console.error(e); process.exit(1); });
