// Shared chapter compositions.
const { C, F, W, H, M } = require('../deck/lib');

// Chapter opener: full-bleed render, giant roman numeral, chapter name, lead paragraph, optional points.
async function opener(d, o) {
  const s = d.slide({
    master: 'FX_FULL', title: o.title, status: o.status, notes: o.notes, source: o.source,
    pre: (s) => d.fullImage(s, o.img, { overlay: [o.overlay || 'left', 'topbottom'], scale: o.scale, dx: o.dx, dy: o.dy, name: '!!render' }),
  });
  const ci = d.chapterInfo;
  d.text(s, ci.num, { x: M - 0.05, y: 1.95, w: 5, h: 1.45, fontSize: 88, fontFace: F.displayLatin, color: C.accent, objectName: '!!roman' });
  d.text(s, ci.ru.toUpperCase(), { x: M, y: 3.45, w: 5.8, h: 0.35, fontSize: 13, bold: true, color: 'B8C1D4', charSpacing: 2 });
  d.text(s, o.lead, { x: M, y: 3.95, w: o.leadW || 5.2, h: 1.35, fontSize: 15, color: 'E6ECF5', lineSpacingMultiple: 1.15, objectName: 'a1_lead' });
  if (o.points) {
    const y = 5.45;
    o.points.forEach((p, i) => {
      const x = M + i * 1.9;
      const anyCyr = o.points.some((q) => /[А-яЁё]/.test(q[0]));
      d.text(s, p[0], { x, y, w: 1.8, h: 0.42, fontSize: anyCyr ? 16 : (p[0].length > 6 ? 17 : 22), fontFace: anyCyr ? F.displayCyrillic : F.displayLatin, color: C.accent, objectName: `a${i + 2}_pv` });
      d.text(s, p[1], { x, y: y + 0.46, w: 1.75, h: 0.55, fontSize: 10.5, color: 'B8C1D4', objectName: `a${i + 2}_pl` });
    });
  }
  if (o.caption !== false) d.caption(s, o.caption || 'Концептуальная визуализация');
  return s;
}

// Full-bleed render with side panel of text (left or right)
function renderPanel(d, o) {
  const side = o.side || 'left';
  const s = d.slide({
    master: 'FX_FULL', title: o.title, status: o.status, notes: o.notes, source: o.source,
    pre: (s) => d.fullImage(s, o.img, { overlay: [].concat(o.overlay || side, o.noTop ? [] : ['topbottom']), scale: o.scale, dx: o.dx, dy: o.dy, name: o.imgName || '!!render' }),
  });
  if (o.caption !== false) d.caption(s, o.caption || 'Концептуальная визуализация', side === 'left' ? W - M - 3.2 : M, side === 'left' ? 6.74 : 6.12, {});
  return s;
}

module.exports = { opener, renderPanel };
