// FootureX Uzbekistan — 117-slide corporate presentation generator.
// usage: node build.js   ->  ../output/FootureX_Uzbekistan_Corporate_Presentation.pptx
const pptxgen = require('pptxgenjs');
const path = require('path');
const fs = require('fs');
const { Deck, C, F, W, H, M, ASSET, TOTAL, logoPath, LOGO_RATIO, warnings } = require('./deck/lib');

const OUT = path.join(__dirname, '..', 'output', 'FootureX_Uzbekistan_Corporate_Presentation.pptx');

const THEME = {
  name: 'FootureX Brand Book v1.0',
  headFontFace: F.displayCyrillic,
  bodyFontFace: F.bodyCyrillic,
  colors: { dk1: C.bg, lt1: 'FFFFFF', dk2: C.surface, lt2: C.soft, accent1: C.accent2, accent2: C.accent, accent3: C.kit, accent4: C.dot, accent5: C.line, accent6: C.outline, hlink: C.accent, folHlink: C.muted },
};

const CHAPTERS = [
  ['I', 'CORPORATE IDENTITY', 'Корпоративная идентичность'],
  ['II', 'MARKET & STRATEGY', 'Рынки и стратегия'],
  ['III', 'IT SERVICES', 'IT-услуги'],
  ['IV', 'ARTIFICIAL INTELLIGENCE', 'Искусственный интеллект'],
  ['V', 'GAME DEVELOPMENT', 'Разработка игр'],
  ['VI', 'GAME COMMUNITY & ESPORTS', 'Сообщество и киберспорт'],
  ['VII', 'EDUCATION & ACADEMY', 'Образование и академия'],
  ['VIII', 'FOOTBALL DEVELOPMENT', 'Развитие футбола'],
  ['IX', 'STADIUM & CITY', 'Стадион и город'],
  ['X', 'BUSINESS & FINANCIAL MODEL', 'Бизнес-модель и финансы'],
  ['XI', 'GOVERNANCE & EXECUTION', 'Управление и исполнение'],
  ['XII', 'FUTURE VISION', 'Видение будущего'],
];

function masters(pres) {
  const ld = logoPath(true), ll = logoPath(false);
  const titlePh = (color) => ({ placeholder: { options: { name: 'title', type: 'title', x: M, y: 0.72, w: W - 2 * M, h: 1.0, fontFace: F.displayCyrillic, fontSize: 23, color, valign: 'top', align: 'left', margin: 0, lineSpacingMultiple: 1.05 }, text: '' } });
  const footer = (lg, numColor) => [
    { image: { x: M, y: 7.06, w: 0.2 * LOGO_RATIO, h: 0.2, path: lg.path } },
    { text: { text: `/ ${TOTAL}`, options: { x: W - M - 0.55, y: 7.04, w: 0.55, h: 0.26, fontFace: F.bodyLatin, fontSize: 9, color: numColor, align: 'left', valign: 'middle', margin: 0 } } },
  ];
  const num = (color) => ({ x: W - M - 1.05, y: 7.04, w: 0.48, h: 0.26, fontFace: F.bodyLatin, fontSize: 9, color, align: 'right', valign: 'middle', margin: 0 });
  pres.defineSlideMaster({ title: 'FX_DARK', background: { path: ASSET('renders/bg-dark.jpg') }, objects: [...footer(ld, C.muted), titlePh(C.text)], slideNumber: num(C.text) });
  pres.defineSlideMaster({ title: 'FX_LIGHT', background: { color: C.lightBg }, objects: [...footer(ll, '6B7486'), titlePh(C.lightText)], slideNumber: num(C.lightText) });
  pres.defineSlideMaster({ title: 'FX_FULL', background: { color: C.bg }, objects: [titlePh(C.text)] });
  pres.defineSlideMaster({ title: 'FX_COVER', background: { color: C.bg }, objects: [] });
}

(async () => {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE';
  pres.title = 'FootureX Uzbekistan — Corporate Vision & Strategic Development';
  pres.subject = 'Корпоративная стратегическая презентация, 117 слайдов';
  pres.author = 'FootureX Uzbekistan';
  pres.company = 'FootureX Uzbekistan LLC';
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  masters(pres);
  const d = new Deck(pres);

  // full-bleed slide chrome added on the slide itself (master objects would sit under the image)
  d.fullChrome = (s) => {
    const lg = logoPath(true);
    s.addImage({ path: lg.path, x: M, y: 7.06, w: 0.2 * LOGO_RATIO, h: 0.2 });
    s.slideNumber = { x: W - M - 1.05, y: 7.04, w: 0.48, h: 0.26, fontFace: F.bodyLatin, fontSize: 9, color: C.text, align: 'right', valign: 'middle', margin: 0 };
    d.text(s, `/ ${TOTAL}`, { x: W - M - 0.55, y: 7.04, w: 0.55, h: 0.26, fontFace: F.bodyLatin, fontSize: 9, color: 'A9B4C7', valign: 'middle' });
  };
  d.setChapter = (i) => {
    const [num, en, ru] = CHAPTERS[i];
    d.section = `${num}. ${en}`;
    pres.addSection({ title: d.section });
    d.chapterKicker = `${num} · ${en}`;
    d.chapterFooter = `FOOTUREX UZBEKISTAN · ${en}`;
    d.chapterInfo = { num, en, ru };
  };
  d.CHAPTERS = CHAPTERS;

  for (let i = 1; i <= 12; i++) {
    const f = path.join(__dirname, 'chapters', `ch${String(i).padStart(2, '0')}.js`);
    if (!fs.existsSync(f)) continue;
    d.setChapter(i - 1);
    await require(f)(d, pres);
  }

  console.log('slides:', d.n);
  if (warnings.length) console.log('WARNINGS:\n' + warnings.join('\n'));
  await pres.writeFile({ fileName: OUT });
  require('child_process').execFileSync('python3', [path.join(__dirname, 'postprocess.py'), OUT], { stdio: 'inherit' });
  fs.writeFileSync(path.join(__dirname, '..', 'output', 'slide_log.json'), JSON.stringify({ slides: d.notesLog, status: d.statusLog, sources: d.sourcesLog }, null, 1));
  console.log('wrote', OUT);
})().catch((e) => { console.error(e); process.exit(1); });
