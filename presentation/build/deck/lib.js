// FootureX deck composition toolkit (pptxgenjs). All coordinates in inches on a 13.333 x 7.5 canvas.
const fs = require('fs');
const path = require('path');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const sharp = require('sharp');
const lu = require('react-icons/lu');

const ROOT = path.join(__dirname, '..', '..');
const BRAND = JSON.parse(fs.readFileSync(path.join(ROOT, 'brand', 'brand.json'), 'utf8'));
const C = BRAND.colors;
const F = BRAND.fonts;
const W = 13.333, H = 7.5, M = 0.6;
const ASSET = (p) => path.join(ROOT, 'assets', p);
const LABELS = JSON.parse(fs.readFileSync(ASSET('renders/labels.json'), 'utf8'));
const TOTAL = 117;

const warnings = [];
const isCyr = (t) => /[Ѐ-ӿ]/.test(t);
const plain = (t) => (Array.isArray(t) ? t.map((r) => (typeof r === 'string' ? r : r.text)).join('') : String(t));
const bodyFont = (t) => (/[●◐○]/.test(t ? plain(t) : '') ? F.displayCyrillic : F.bodyCyrillic); // Montserrat for running text; ●◐○ only exist in Unbounded
const dispFont = (t) => (isCyr(plain(t)) ? F.displayCyrillic : F.displayLatin);
// Zen Dots and Poppins have no Cyrillic and no arrows: swap to the matching Cyrillic-capable face when needed
const safeFont = (font, t) => {
  const txt = plain(t);
  if (font === F.displayLatin && /[Ѐ-ӿ→←↔●◐○]/.test(txt)) return F.displayCyrillic;
  if (font === F.bodyLatin && /[Ѐ-ӿ→←↔●◐○]/.test(txt)) return /[●◐○]/.test(txt) ? F.displayCyrillic : F.bodyCyrillic;
  return font;
};

function logoPath(kind = 'onDark') {
  const key = kind === true || kind === false ? 'onDark' : kind;
  return { path: path.join(ROOT, 'brand', BRAND.logo[key]), placeholder: false };
}
// logo proportions are read from the files themselves (PNG IHDR), so a replaced logo keeps its geometry
const pngRatio = (key) => { const b = fs.readFileSync(path.join(ROOT, 'brand', BRAND.logo[key])); return b.readUInt32BE(16) / b.readUInt32BE(20); };
// image size from PNG (IHDR) or JPEG (SOF) headers
function imgSize(file) {
  const b = fs.readFileSync(file);
  if (b[0] === 0x89) return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
  for (let i = 2; i < b.length - 9;) {
    if (b[i] !== 0xff) { i++; continue; }
    const m = b[i + 1];
    if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return { w: b.readUInt16BE(i + 7), h: b.readUInt16BE(i + 5) };
    i += 2 + b.readUInt16BE(i + 2);
  }
  throw new Error('unknown image size ' + file);
}
const LOGO_RATIO = pngRatio('onDark'); // lockup: mark + FootureX (brandbook page header)
const HERO_RATIO = pngRatio('hero');   // two-tone wordmark (brandbook cover)

// ---------------------------------------------------------------- icons
const iconCache = new Map();
async function icon(name, color = C.accent, size = 256) {
  const key = `${name}-${color}`;
  if (iconCache.has(key)) return iconCache.get(key);
  const Comp = lu[name];
  if (!Comp) throw new Error('icon not found ' + name);
  const svg = ReactDOMServer.renderToStaticMarkup(React.createElement(Comp, { color: '#' + color, size: String(size), strokeWidth: 1.6 }));
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  const data = 'image/png;base64,' + buf.toString('base64');
  iconCache.set(key, data);
  return data;
}

// ---------------------------------------------------------------- text fit estimate (warning only)
function estLines(text, w, size, font) {
  const k = font === F.displayCyrillic ? 0.74 : font === F.displayLatin ? 0.8 : font === F.bodyLatin ? 0.6 : 0.6;
  const cpl = Math.max(1, Math.floor((w * 72) / (size * k)));
  return String(text).split('\n').reduce((s, p) => s + Math.max(1, Math.ceil(p.length / cpl)), 0);
}

class Deck {
  constructor(pres) {
    this.pres = pres;
    this.n = 0;
    this.chapter = '';
    this.notesLog = [];
    this.statusLog = [];
    this.sourcesLog = [];
    this.anim = {};
  }

  // text box with automatic font choice; opts.display uses display fonts
  text(s, t, o = {}) {
    o = Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined));
    const fontFace = safeFont(o.fontFace || (o.display ? dispFont(t) : bodyFont(t)), t);
    const size = o.fontSize || 14;
    if (o.w && o.h && typeof t === 'string' && !o.noFit) {
      const lines = estLines(t, o.w - (o.margin ? 0.1 : 0), size, fontFace);
      const need = (lines * size * (o.lineSpacingMultiple || 1.18)) / 72;
      if (need > o.h + 0.02) warnings.push(`slide ${this.n}: text may overflow (${need.toFixed(2)} > ${o.h}) "${t.slice(0, 50)}"`);
    }
    const opts = { isTextBox: true, margin: 0, color: o.color || (this.dark ? C.text : C.lightText), valign: 'top', fit: 'none', ...o, fontFace, fontSize: size };
    delete opts.display; delete opts.noFit;
    if (Array.isArray(t)) t = t.map((r) => (typeof r === 'string' ? { text: r } : { ...r, options: { ...r.options, fontFace: safeFont(r.options?.fontFace || (r.options?.display ? dispFont(r.text) : bodyFont(r.text)), r.text) } }));
    s.addText(t, opts);
  }

  slide(o) {
    this.n++;
    this.dark = true; // brandbook: dark base only
    const master = o.master || 'FX_DARK';
    const s = this.pres.addSlide({ masterName: master, sectionTitle: this.section });
    s._fx = { n: this.n, dark: this.dark };
    if (o.pre) o.pre(s);
    if (master === 'FX_FULL' && this.fullChrome) this.fullChrome(s, o);
    if (o.title && master !== 'FX_COVER') {
      const words = o.title.split(' ');
      const cut = words.length > 1 ? words.length - 1 : 0;
      const runs = cut ? [{ text: words.slice(0, cut).join(' ') + ' ' }, { text: words.slice(cut).join(' '), options: { color: C.accent } }] : [{ text: o.title }];
      s.addText(runs, { placeholder: 'title' });
      if (estLines(o.title, 12.1, 24, F.displayCyrillic) > 2) warnings.push(`slide ${this.n}: title > 2 lines: ${o.title}`);
    }
    if (o.kicker !== false && master !== 'FX_COVER') this.kicker(s, o.kicker || this.chapterKicker);
    if (o.status) this.status(s, o.status);
    if (o.source) this.source(s, o.source);
    if (master !== 'FX_COVER') this.footerChapter(s);
    if (o.notes) s.addNotes(o.notes);
    this.notesLog.push({ n: this.n, title: o.title || o.logTitle || '', status: o.status || '', source: o.source || '', notes: o.notes || '' });
    return s;
  }

  kicker(s, t) {
    this.text(s, '— · ' + t, { x: M, y: 0.36, w: 8.6, h: 0.26, fontSize: 10, fontFace: F.displayLatin, color: C.accent, charSpacing: 1.5, objectName: '!!kicker' });
  }
  footerChapter(s) {
    this.text(s, this.chapterFooter || '', { x: 4.2, y: 7.06, w: 5.0, h: 0.24, fontSize: 9, fontFace: F.displayLatin, color: C.muted, align: 'center', objectName: '!!chapter' });
  }

  status(s, key) {
    const ST = {
      ACT: ['ДЕЙСТВУЮЩЕЕ', C.accent], DEV: ['ПРОЕКТ · ЭТАП FOUNDATION', C.accent2], PLAN: ['КОНЦЕПЦИЯ · ФАЗА 1', C.accent], CONCEPT: ['СТРАТЕГИЧЕСКАЯ КОНЦЕПЦИЯ', C.dot],
      AMB: ['ДОЛГОСРОЧНАЯ АМБИЦИЯ', C.muted], CALC: ['РАСЧЁТ ПО ДАННЫМ BX', C.dot], MARKET: ['РЫНОЧНЫЕ ДАННЫЕ · ИСТОЧНИКИ', C.accent],
      FRAME: ['УПРАВЛЕНЧЕСКАЯ МОДЕЛЬ · ПРОЕКТ', C.soft], VISION: ['ВИДЕНИЕ', C.accent], CONFIRM: ['ТРЕБУЕТСЯ ПОДТВЕРЖДЕНИЕ', C.dot],
      DOC: ['ДОКУМЕНТЫ BX', C.accent2], NODATA: ['ЦИФРЫ НЕ ПРЕДОСТАВЛЕНЫ', C.dot], BRAND: ['БРЕНДБУК V1.0', C.accent2],
    };
    const [label, col] = ST[key] || [key, C.steel];
    const w = Math.max(1.15, 0.5 + label.length * 0.092);
    const x = W - M - w;
    s.addShape(this.pres.shapes.ROUNDED_RECTANGLE, { x, y: 0.3, w, h: 0.32, rectRadius: 0.16, fill: { color: C.surface }, line: { color: col, width: 0.75 }, objectName: '!!statusbg' });
    s.addShape(this.pres.shapes.OVAL, { x: x + 0.13, y: 0.41, w: 0.1, h: 0.1, fill: { color: col }, line: { color: col, width: 0 }, objectName: '!!statusdot' });
    this.text(s, label, { x: x + 0.26, y: 0.3, w: w - 0.32, h: 0.32, fontSize: 8.5, bold: true, color: this.dark ? C.text : C.lightText, valign: 'middle', align: 'center', charSpacing: 0.5, objectName: '!!status' });
    this.statusLog.push([this.n, label]);
  }

  // short status line under the title (what kind of statement the slide makes)
  tag(s, t, col) {
    this.text(s, t, { x: M, y: 1.66, w: 11.5, h: 0.28, fontSize: 9.5, bold: true, color: col || C.dot, charSpacing: 0.5 });
  }

  source(s, t) {
    this.text(s, t, { x: M, y: 6.5, w: 9.6, h: 0.42, fontSize: 9, color: C.muted, italic: false, valign: 'bottom', noFit: true, objectName: 'source' });
    this.sourcesLog.push([this.n, t]);
  }

  // ---------------------------------------------------------------- primitives
  card(s, x, y, w, h, o = {}) {
    s.addShape(this.pres.shapes.ROUNDED_RECTANGLE, {
      x, y, w, h, rectRadius: o.r ?? 0.12,
      fill: { color: o.fill || (C.surface), transparency: o.transparency || 0 },
      line: { color: o.line || (C.line), width: o.lineW ?? 0.75 },
      
      objectName: o.name,
    });
  }
  async iconBadge(s, name, x, y, d = 0.52, o = {}) {
    const col = o.color || C.accent;
    s.addShape(this.pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: o.bg || C.outline }, line: { color: o.bg || C.outline, width: 0 }, objectName: o.name ? o.name + 'bg' : undefined });
    const pad = d * 0.24;
    s.addImage({ data: await icon(name, col), x: x + pad, y: y + pad, w: d - 2 * pad, h: d - 2 * pad, objectName: o.name });
  }
  pill(s, t, x, y, o = {}) {
    const w = o.w || 0.3 + t.length * 0.075;
    const col = o.color || C.accent;
    s.addShape(this.pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h: o.h || 0.3, rectRadius: (o.h || 0.3) / 2, fill: { color: o.fill || C.surface }, line: { color: o.line || col, width: 0.5 } });
    this.text(s, t, { x, y, w, h: o.h || 0.3, fontSize: o.fontSize || 9, bold: true, color: o.textColor || (this.dark ? C.text : C.lightText), align: 'center', valign: 'middle' });
    return w;
  }
  caption(s, t = 'Концептуальная визуализация', x = W - M - 3.2, y = 6.74, o = {}) {
    if (o.backing) { // readable on busy imagery
      const tw = Math.min(o.w || 3.2, 0.25 + t.length * 0.062);
      const bx = (o.align || 'right') === 'right' ? x + (o.w || 3.2) - tw : x;
      s.addShape(this.pres.shapes.ROUNDED_RECTANGLE, { x: bx - 0.04, y: y - 0.02, w: tw + 0.08, h: 0.28, rectRadius: 0.06, fill: { color: C.bg, transparency: 25 }, line: { color: C.bg, width: 0 } });
    }
    this.text(s, t, { x, y, w: o.w || 3.2, h: 0.24, fontSize: 9, color: o.color || C.muted, align: o.align || 'right', italic: true, valign: 'bottom' });
  }
  bg(s, img = 'renders/bg-dark.jpg') {
    s.addImage({ path: ASSET(img), x: 0, y: 0, w: W, h: H });
  }
  fullImage(s, img, o = {}) {
    const sc = o.scale || 1;
    const w = W * sc, h = H * sc;
    s.addImage({ path: ASSET(img), x: (W - w) / 2 + (o.dx || 0), y: (H - h) / 2 + (o.dy || 0), w, h, objectName: o.name || '!!render' });
    // camera-path flythrough video on top of the still (the still is the video's last frame, so Morph continues from it)
    if (o.video && !(fs.existsSync(ASSET(`video/${o.video}-flythrough-poster.png`)) && fs.existsSync(ASSET(`video/${o.video}-flythrough.mp4`)))) warnings.push(`video ${o.video} missing — run npm run video`);
    else if (o.video) {
      const poster = 'data:image/png;base64,' + fs.readFileSync(ASSET(`video/${o.video}-flythrough-poster.png`)).toString('base64');
      s.addMedia({ type: 'video', path: ASSET(`video/${o.video}-flythrough.mp4`), cover: poster, x: 0, y: 0, w: W, h: H, objectName: 'flythrough' });
    }
    if (o.overlay) for (const ov of [].concat(o.overlay)) s.addImage({ path: ASSET(`renders/ov-${ov}.png`), x: 0, y: 0, w: W, h: H, objectName: `ov-${ov}` });
  }
  // image cropped into a box (cover)
  boxImage(s, img, x, y, w, h, o = {}) {
    // pptxgenjs 'cover' needs the image's own proportions in w/h and the frame in sizing; otherwise it stretches
    const meta = o.meta || imgSize(ASSET(img));
    s.addImage({ path: ASSET(img), x, y, w: h * meta.w / meta.h, h, sizing: { type: 'cover', w, h }, rounding: false, objectName: o.name });
    if (o.border !== false) s.addShape(this.pres.shapes.RECTANGLE, { x, y, w, h, fill: { type: 'none' }, line: { color: C.line, width: 0.75 } });
    if (o.caption !== false) this.caption(s, o.caption || 'Концептуальная визуализация', x + w - 2.6, y + h - 0.3, { w: 2.5, backing: true });
  }

  bullets(s, items, x, y, w, h, o = {}) {
    const size = o.fontSize || 14;
    const runs = items.map((it, i) => {
      const t = typeof it === 'string' ? it : it.text;
      const r = { text: t, options: { bullet: o.numbered ? { type: 'number' } : { code: '25A0', indent: 16 }, breakLine: i < items.length - 1, paraSpaceAfter: o.gap ?? 7, color: o.color || (this.dark ? 'B8C1D4' : 'B8C1D4'), fontFace: bodyFont(t) } };
      return r;
    });
    const est = items.reduce((sum, it) => sum + estLines(typeof it === 'string' ? it : it.text, w - 0.3, size, F.bodyCyrillic), 0);
    const need = (est * size * 1.2 + items.length * (o.gap ?? 7)) / 72;
    if (need > h + 0.05) warnings.push(`slide ${this.n}: bullets may overflow (${need.toFixed(2)} > ${h})`);
    s.addText(runs, { x, y, w, h, fontSize: size, valign: 'top', margin: 0, isTextBox: true, color: o.color || (this.dark ? 'B8C1D4' : 'B8C1D4'), objectName: o.name, fit: 'none' });
  }

  // ---------------------------------------------------------------- composite blocks
  // grid of cards: items [{icon, title, text, tag}]
  async cards(s, items, o = {}) {
    const cols = o.cols || Math.min(items.length, 3);
    const rows = Math.ceil(items.length / cols);
    const x0 = o.x ?? M, y0 = o.y ?? 2.0, gw = o.w ?? W - 2 * M, gh = o.h ?? 4.6, gap = o.gap ?? 0.25;
    const cw = (gw - gap * (cols - 1)) / cols, ch = (gh - gap * (rows - 1)) / rows;
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      const x = x0 + (i % cols) * (cw + gap), y = y0 + Math.floor(i / cols) * (ch + gap);
      const a = `a${(o.animBase || 1) + i}_`;
      this.card(s, x, y, cw, ch, { name: a + 'card', fill: it.fill });
      let ty = y + 0.25;
      const pad = 0.25;
      if (it.icon && o.iconLeft) {
        await this.iconBadge(s, it.icon, x + pad, y + pad, 0.5, { name: a + 'icon', color: it.iconColor });
        this.text(s, it.title, { x: x + pad + 0.65, y: y + pad - 0.02, w: cw - 2 * pad - 0.65, h: 0.55, fontSize: o.titleSize || 14, bold: true, valign: 'middle', objectName: a + 't' });
        ty = y + pad + 0.68;
      } else {
        if (it.icon) { await this.iconBadge(s, it.icon, x + pad, y + pad, 0.5, { name: a + 'icon', color: it.iconColor }); ty = y + pad + 0.68; }
        if (it.num) { this.text(s, it.num, { x: x + pad, y: y + pad - 0.05, w: 1.2, h: 0.45, fontSize: 20, fontFace: F.displayLatin, color: it.numColor || C.accent, objectName: a + 'num' }); ty = y + pad + 0.5; }
        const th = o.titleH || (estLines(it.title, (cw - 2 * pad) * 0.86, o.titleSize || 15, F.bodyCyrillic) > 1 ? 0.58 : 0.32);
        this.text(s, it.title, { x: x + pad, y: ty, w: cw - 2 * pad, h: th, fontSize: o.titleSize || 15, bold: true, objectName: a + 't' });
        ty += th + 0.08;
      }
      if (it.text) this.text(s, it.text, { x: x + pad, y: ty, w: cw - 2 * pad, h: y + ch - ty - (it.tag ? 0.5 : 0.18), fontSize: o.textSize || 12.5, color: this.dark ? C.soft : C.soft, lineSpacingMultiple: 1.1, objectName: a + 'd' });
      if (it.tag) this.pill(s, it.tag, x + pad, y + ch - 0.48, { color: it.tagColor || C.accent, fontSize: 9, h: 0.27 });
      this.anim[this.n] = (this.anim[this.n] || 0) + 1;
    }
  }

  // big numbers: [{value, label, sub}]
  stats(s, items, o = {}) {
    const n = items.length, x0 = o.x ?? M, gw = o.w ?? W - 2 * M, gap = o.gap ?? 0.3, y = o.y ?? 2.2, h = o.h ?? 2.0;
    const cw = (gw - gap * (n - 1)) / n;
    items.forEach((it, i) => {
      const x = x0 + i * (cw + gap);
      const a = `a${(o.animBase || 1) + i}_`;
      if (o.cards !== false) this.card(s, x, y, cw, h, { name: a + 'card' });
      const vf = isCyr(it.value) ? F.displayCyrillic : F.displayLatin;
      let vs = o.valueSize || 38;
      while (vs > 16 && estLines(it.value, (cw - 0.5) * 0.92, vs, vf) > 1) vs -= 2;
      this.text(s, it.value, { x: x + 0.25, y: y + 0.22, w: cw - 0.5, h: 0.75, fontSize: vs, fontFace: isCyr(it.value) ? F.displayCyrillic : F.displayLatin, color: it.color || C.accent, valign: 'middle', objectName: a + 'v' });
      this.text(s, it.label, { x: x + 0.25, y: y + 1.02, w: cw - 0.5, h: h - 1.2, fontSize: o.labelSize || 12.5, color: C.soft, objectName: a + 'l' });
      if (it.sub) this.text(s, it.sub, { x: x + 0.25, y: y + h - 0.36, w: cw - 0.5, h: 0.26, fontSize: 9, color: C.muted, valign: 'bottom', objectName: a + 's' });
    });
  }

  // horizontal process: [{title, text}]
  steps(s, items, o = {}) {
    const n = items.length, x0 = o.x ?? M, gw = o.w ?? W - 2 * M, y = o.y ?? 2.3, gap = o.gap ?? 0.22;
    const cw = (gw - gap * (n - 1)) / n;
    items.forEach((it, i) => {
      const x = x0 + i * (cw + gap);
      const a = `a${i + 1}_`;
      s.addShape(this.pres.shapes.OVAL, { x, y, w: 0.62, h: 0.62, fill: { color: i === (o.highlight ?? -1) ? C.accent2 : C.surface }, line: { color: C.accent, width: 1.25 }, objectName: a + 'dot' });
      this.text(s, String(i + 1).padStart(2, '0'), { x, y, w: 0.62, h: 0.62, fontSize: 13, fontFace: F.displayLatin, color: i === (o.highlight ?? -1) ? 'FFFFFF' : C.accent, align: 'center', valign: 'middle', objectName: a + 'num' });
      if (i < n - 1) s.addShape(this.pres.shapes.LINE, { x: x + 0.72, y: y + 0.31, w: cw + gap - 0.82, h: 0, line: { color: C.line, width: 1.25, dashType: 'dash', endArrowType: 'triangle' }, objectName: a + 'ln' });
      const th = o.titleH || 0.6;
      const tsz = o.titleSize || (n >= 6 ? 12.5 : 14.5);
      this.text(s, it.title, { x, y: y + 0.85, w: cw - 0.05, h: th, fontSize: tsz, bold: true, objectName: a + 't' });
      if (it.text) this.text(s, it.text, { x, y: y + 0.85 + th + 0.05, w: cw - 0.05, h: o.textH || 2.1, fontSize: o.textSize || 12.5, color: this.dark ? C.soft : C.soft, lineSpacingMultiple: 1.1, objectName: a + 'd' });
    });
  }

  // table helper with brand styling
  table(s, rows, o = {}) {
    const dark = this.dark;
    const hdrFill = C.outline;
    const body = rows.map((r, ri) => r.map((cell, ci) => {
      const c = typeof cell === 'object' && cell !== null && !Array.isArray(cell) ? cell : { text: String(cell) };
      const isH = ri === 0 && o.header !== false;
      return {
        text: c.text,
        options: {
          fontFace: bodyFont(c.text), fontSize: isH ? (o.hSize || 11) : (o.size || 11.5), bold: isH || c.bold || (o.boldFirstCol && ci === 0),
          color: c.color || (isH ? 'FFFFFF' : 'B8C1D4'),
          fill: { color: c.fill || (isH ? hdrFill : (ri % 2 ? C.surface : '0B0F0E')) },
          align: c.align || (ci === 0 ? 'left' : o.align || 'left'), valign: 'middle', margin: [3, 6, 3, 6],
        },
      };
    }));
    s.addTable(body, { x: o.x ?? M, y: o.y ?? 2.0, w: o.w ?? W - 2 * M, colW: o.colW, rowH: o.rowH, border: { type: 'solid', pt: 0.5, color: dark ? C.line : C.lightLine }, autoPage: false, objectName: 'a1_table' });
  }

  // numbered callouts on a full-bleed render from projected labels
  callouts(s, renderKey, list, img = {}) {
    const L = LABELS[renderKey];
    const sc = img.scale || 1, ox = (W - W * sc) / 2 + (img.dx || 0), oy = (H - H * sc) / 2 + (img.dy || 0);
    list.forEach(([key, n, dx = 0, dy = 0], i) => {
      if (!L || !L[key]) { warnings.push(`missing label ${renderKey}.${key}`); return; }
      const x = ox + L[key][0] * W * sc + dx, y = oy + L[key][1] * H * sc + dy;
      s.addShape(this.pres.shapes.OVAL, { x: x - 0.2, y: y - 0.2, w: 0.4, h: 0.4, fill: { color: C.bg, transparency: 15 }, line: { color: C.accent, width: 1.5 }, objectName: `a${i + 1}_c` });
      this.text(s, String(n), { x: x - 0.2, y: y - 0.2, w: 0.4, h: 0.4, fontSize: 11, fontFace: F.displayLatin, color: C.accent, align: 'center', valign: 'middle', objectName: `a${i + 1}_cn` });
    });
  }

  // legend list: [[n, title, text]]
  legend(s, items, x, y, w, o = {}) {
    let cy = y;
    items.forEach(([n, t, d], i) => {
      s.addShape(this.pres.shapes.OVAL, { x, y: cy, w: 0.36, h: 0.36, fill: { color: C.bg }, line: { color: C.accent, width: 1.25 } });
      this.text(s, String(n), { x, y: cy, w: 0.36, h: 0.36, fontSize: 10, fontFace: F.displayLatin, color: C.accent, align: 'center', valign: 'middle' });
      this.text(s, t, { x: x + 0.5, y: cy - 0.02, w: w - 0.5, h: 0.28, fontSize: o.titleSize || 13, bold: true });
      if (d) this.text(s, d, { x: x + 0.5, y: cy + 0.27, w: w - 0.5, h: o.dh || 0.5, fontSize: o.textSize || 11.5, color: C.soft });
      cy += o.step || 0.86;
    });
  }

  // hub & spoke diagram (ecosystem)
  async hub(s, center, nodes, o = {}) {
    const cx = o.cx ?? W / 2, cy = o.cy ?? 4.35, rx = o.rx ?? 4.6, ry = o.ry ?? 2.05;
    const nw = o.nw ?? 2.35, nh = o.nh ?? 0.62;
    s.addShape(this.pres.shapes.OVAL, { x: cx - rx, y: cy - ry, w: rx * 2, h: ry * 2, fill: { type: 'none' }, line: { color: C.line, width: 1, dashType: 'dash' } });
    s.addShape(this.pres.shapes.OVAL, { x: cx - rx * 0.55, y: cy - ry * 0.55, w: rx * 1.1, h: ry * 1.1, fill: { type: 'none' }, line: { color: '273B51', width: 0.75 } });
    nodes.forEach((nd, i) => {
      const ang = -Math.PI / 2 + (i / nodes.length) * Math.PI * 2;
      const x = cx + Math.cos(ang) * rx, y = cy + Math.sin(ang) * ry;
      s.addShape(this.pres.shapes.LINE, { x: Math.min(cx, x), y: Math.min(cy, y), w: Math.abs(x - cx) || 0.001, h: Math.abs(y - cy) || 0.001, flipH: x < cx, flipV: y < cy, line: { color: C.line, width: 0.75 } });
    });
    const cw = o.cw ?? 2.6, chh = o.ch ?? 1.0;
    s.addShape(this.pres.shapes.ROUNDED_RECTANGLE, { x: cx - cw / 2, y: cy - chh / 2, w: cw, h: chh, rectRadius: 0.5, fill: { color: C.outline }, line: { color: C.accent2, width: 1.5 }, objectName: '!!hubcore' });
    // brand mark only (no lockup + descriptor combination, which the brandbook does not define)
    s.addImage({ path: logoPath('mark').path, x: cx - 0.24, y: cy - chh / 2 + 0.12, w: 0.48, h: 0.48, objectName: '!!hublogo' });
    this.text(s, center, { x: cx - cw / 2 + 0.1, y: cy + chh / 2 - 0.4, w: cw - 0.2, h: 0.3, fontSize: 10.5, color: C.text, align: 'center', bold: true, charSpacing: 1 });
    for (let i = 0; i < nodes.length; i++) {
      const nd = nodes[i];
      const ang = -Math.PI / 2 + (i / nodes.length) * Math.PI * 2;
      const x = cx + Math.cos(ang) * rx, y = cy + Math.sin(ang) * ry;
      const a = `a${i + 1}_`;
      s.addShape(this.pres.shapes.ROUNDED_RECTANGLE, { x: x - nw / 2, y: y - nh / 2, w: nw, h: nh, rectRadius: 0.12, fill: { color: C.surface }, line: { color: nd.color || (C.line), width: 1 }, objectName: a + 'n' });
      if (nd.icon) s.addImage({ data: await icon(nd.icon, nd.color || C.accent), x: x - nw / 2 + 0.14, y: y - 0.16, w: 0.32, h: 0.32, objectName: a + 'i' });
      this.text(s, nd.title, { x: x - nw / 2 + (nd.icon ? 0.54 : 0.15), y: y - nh / 2 + 0.06, w: nw - (nd.icon ? 0.64 : 0.3), h: nd.sub ? 0.28 : nh - 0.12, fontSize: o.fs || 11, bold: true, valign: nd.sub ? 'bottom' : 'middle', objectName: a + 't' });
      if (nd.sub) this.text(s, nd.sub, { x: x - nw / 2 + (nd.icon ? 0.54 : 0.15), y: y + 0.0, w: nw - (nd.icon ? 0.64 : 0.3), h: 0.24, fontSize: 9.5, color: nd.subColor || C.soft, objectName: a + 's' });
    }
  }

  // stacked architecture layers: [{title, items:[...], color}]
  layers(s, layers, o = {}) {
    const x = o.x ?? M, y0 = o.y ?? 2.0, w = o.w ?? W - 2 * M, lh = o.lh ?? 0.8, gap = o.gap ?? 0.14, lw = o.labelW ?? 2.6;
    layers.forEach((L, i) => {
      const y = y0 + i * (lh + gap);
      const a = `a${i + 1}_`;
      this.card(s, x, y, w, lh, { name: a + 'bg', fill: L.fill });
      s.addShape(this.pres.shapes.ROUNDED_RECTANGLE, { x: x + 0.1, y: y + 0.1, w: lw, h: lh - 0.2, rectRadius: 0.08, fill: { color: L.color || C.outline }, line: { color: L.color || C.outline, width: 0 }, objectName: a + 'lb' });
      this.text(s, L.title, { x: x + 0.22, y: y + 0.1, w: lw - 0.24, h: lh - 0.2, fontSize: o.titleSize || 12.5, bold: true, valign: 'middle', color: L.textColor || C.accent, objectName: a + 'lt' });
      const n = L.items.length; const iw = (w - lw - 0.3 - 0.12 * (n - 1) - 0.1) / n;
      L.items.forEach((t, j) => {
        const ix = x + lw + 0.3 + j * (iw + 0.12);
        s.addShape(this.pres.shapes.ROUNDED_RECTANGLE, { x: ix, y: y + 0.14, w: iw, h: lh - 0.28, rectRadius: 0.07, fill: { color: '0B0F0E' }, line: { color: C.line, width: 0.5 } });
        this.text(s, t, { x: ix + 0.08, y: y + 0.14, w: iw - 0.16, h: lh - 0.28, fontSize: o.itemSize || 11, align: 'center', valign: 'middle', color: this.dark ? 'B8C1D4' : 'B8C1D4' });
      });
    });
  }

  // horizontal timeline: [{label, title, text, color}]
  timeline(s, items, o = {}) {
    const x0 = o.x ?? M, w = o.w ?? W - 2 * M, y = o.y ?? 3.0, n = items.length;
    const step = w / n;
    s.addShape(this.pres.shapes.LINE, { x: x0, y, w, h: 0, line: { color: C.line, width: 1.5 } });
    items.forEach((it, i) => {
      const x = x0 + i * step;
      const a = `a${i + 1}_`;
      const col = it.color || C.accent;
      s.addShape(this.pres.shapes.OVAL, { x: x + 0.02, y: y - 0.11, w: 0.22, h: 0.22, fill: { color: col }, line: { color: this.dark ? C.bg : 'FFFFFF', width: 2 }, objectName: a + 'd' });
      this.text(s, it.label, { x, y: y - 0.62, w: step - 0.15, h: 0.36, fontSize: o.labelSize || 13, fontFace: isCyr(it.label) ? F.displayCyrillic : F.displayLatin, color: col, objectName: a + 'l' });
      this.text(s, it.title, { x, y: y + 0.28, w: step - 0.2, h: o.titleH || 0.55, fontSize: o.titleSize || 13.5, bold: true, objectName: a + 't' });
      if (it.text) this.text(s, it.text, { x, y: y + 0.28 + (o.titleH || 0.55) + 0.04, w: step - 0.2, h: o.textH || 2.4, fontSize: o.textSize || 11.5, color: this.dark ? C.soft : C.soft, lineSpacingMultiple: 1.1, objectName: a + 'x' });
    });
  }

  // native chart wrapper with brand styling
  chart(s, type, data, o = {}) {
    const dark = this.dark;
    const axis = dark ? '8A93A6' : '5B6578';
    const base = {
      x: o.x ?? M, y: o.y ?? 2.0, w: o.w ?? 7.6, h: o.h ?? 4.5,
      chartColors: o.colors || (data.length === 1 && type !== 'doughnut' && type !== 'pie' ? [C.accent2] : [C.accent2, C.accent, C.dot, C.soft, C.line, C.kit]),
      catAxisLabelColor: axis, valAxisLabelColor: axis, catAxisLabelFontFace: '+mn-lt', valAxisLabelFontFace: '+mn-lt', catAxisLabelFontSize: 10, valAxisLabelFontSize: 10,
      valGridLine: { color: '273B51', size: 0.5 }, catGridLine: { style: 'none' },
      catAxisLineShow: false, valAxisLineShow: false,
      showLegend: o.legend ?? data.length > 1, legendPos: 'b', legendFontFace: '+mn-lt', legendFontSize: 10, legendColor: axis,
      showValue: o.showValue ?? true, dataLabelColor: dark ? 'FFFFFF' : 'B8C1D4', dataLabelFontSize: 9, dataLabelFontFace: '+mn-lt',
      dataLabelPosition: o.labelPos, dataLabelFormatCode: o.fmt || '0',
      valAxisLabelFormatCode: o.axisFmt || '0', valAxisMajorUnit: o.majorUnit,
      showTitle: !!o.title, title: o.title, titleColor: dark ? C.text : C.lightText, titleFontFace: '+mn-lt', titleFontSize: 12,
      valAxisMinVal: o.minVal ?? 0,
      objectName: o.name || 'a1_chart',
      ...o.extra,
    };
    for (const k of Object.keys(base)) if (base[k] === undefined) delete base[k];
    s.addChart(type, data, base);
  }

  insight(s, x, y, w, h, title, lines, o = {}) {
    this.card(s, x, y, w, h, { name: o.name || 'a2_ins', fill: o.fill });
    this.text(s, title, { x: x + 0.25, y: y + 0.22, w: w - 0.5, h: 0.32, fontSize: 13, bold: true, color: o.titleColor || C.accent });
    this.bullets(s, lines, x + 0.25, y + 0.66, w - 0.5, h - 0.85, { fontSize: o.fontSize || 12, gap: o.gap ?? 6 });
  }

  phoneImg(s, img, x, y, h, name) {
    const w = h * (430 / 900);
    s.addImage({ path: ASSET(`ui/${img}.png`), x, y, w, h, objectName: name });
    return w;
  }
  deskImg(s, img, x, y, w, name) {
    const m = imgSize(ASSET(`ui/${img}.png`)); // proportions from the rendered PNG itself
    s.addImage({ path: ASSET(`ui/${img}.png`), x, y, w, h: w * m.h / m.w, objectName: name });
  }
}

module.exports = { Deck, C, F, W, H, M, ASSET, BRAND, TOTAL, logoPath, LOGO_RATIO, HERO_RATIO, icon, warnings, isCyr, bodyFont, dispFont, LABELS };
