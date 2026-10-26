// ILLUSTRATIVE 5-year financial model for FootureX Uzbekistan (USD thousand).
// Every driver below is an ASSUMPTION for scenario analysis, not company data. Replace with the
// approved business plan / financial model. Outputs: ../assets/finmodel.json and ../output/*.xlsx
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

const Y = ['Год 1', 'Год 2', 'Год 3', 'Год 4', 'Год 5'];
const COLS = ['C', 'D', 'E', 'F', 'G'];

// [key, label, unit, values, scenarioScaled?]
const A = [
  ['sec', 'FootureX Technologies — IT-услуги'],
  ['it_fte', 'Оплачиваемые специалисты (FTE)', 'чел.', [8, 16, 28, 40, 55], true],
  ['it_hours', 'Рабочих часов на FTE в год', 'ч', [1760, 1760, 1760, 1760, 1760]],
  ['it_util', 'Загрузка (utilization)', '%', [0.70, 0.75, 0.78, 0.80, 0.80]],
  ['it_rate', 'Средняя ставка', '$/ч', [22, 24, 26, 28, 30]],
  ['it_cost', 'Полная стоимость FTE', '$ тыс./год', [14, 15, 16.5, 18, 19.5]],
  ['sec', 'FootureX AI — проекты и SaaS'],
  ['ai_proj', 'AI-проекты (внедрения агентов)', 'шт.', [4, 8, 12, 15, 18], true],
  ['ai_ticket', 'Средний чек проекта', '$ тыс.', [15, 22, 28, 32, 35]],
  ['ai_proj_cogs', 'Себестоимость проектов', '% выручки', [0.55, 0.55, 0.52, 0.50, 0.50]],
  ['saas_end', 'Платящие SaaS-клиенты на конец года', 'шт.', [10, 45, 120, 240, 400], true],
  ['saas_arpa', 'ARPA (средний чек в месяц)', '$', [120, 140, 160, 180, 200]],
  ['saas_cogs', 'Себестоимость SaaS (инференс, облако, поддержка)', '% выручки', [0.32, 0.30, 0.28, 0.27, 0.26]],
  ['saas_churn', 'Отток клиентов в месяц', '%', [0.03, 0.028, 0.025, 0.022, 0.02]],
  ['saas_cac', 'CAC SaaS', '$', [700, 800, 900, 950, 1000]],
  ['sec', 'FootureX Game — Telegram Web App (только денежная выручка)'],
  ['g_mau', 'Средний MAU', 'тыс.', [40, 150, 350, 600, 900], true],
  ['g_months', 'Месяцев коммерческой эксплуатации', 'мес.', [6, 12, 12, 12, 12]],
  ['g_conv', 'Доля платящих', '%', [0.015, 0.02, 0.025, 0.028, 0.03]],
  ['g_arppu', 'ARPPU в месяц', '$', [6, 7, 8, 8.5, 9]],
  ['g_ad', 'Рекламная выручка на MAU в месяц', '$', [0.03, 0.03, 0.03, 0.03, 0.03]],
  ['g_fee', 'Комиссии платформ и платёжных провайдеров', '% IAP', [0.30, 0.30, 0.30, 0.30, 0.30]],
  ['g_host', 'Хостинг и LiveOps-инфраструктура', '% выручки', [0.08, 0.06, 0.05, 0.05, 0.05]],
  ['g_ua', 'Маркетинг и привлечение игроков (UA)', '$ тыс.', [60, 250, 450, 650, 850]],
  ['g_new', 'Новые игроки за год', 'тыс.', [120, 400, 700, 1000, 1300], true],
  ['sec', 'FootureX Game Development — заказная разработка'],
  ['gd_rev', 'Выручка заказной разработки игр', '$ тыс.', [0, 120, 300, 450, 600], true],
  ['gd_cogs', 'Себестоимость заказной разработки', '% выручки', [0.55, 0.55, 0.55, 0.55, 0.55]],
  ['sec', 'FootureX Game Dev Academy'],
  ['ac_students', 'Слушатели в год', 'чел.', [60, 180, 360, 540, 720], true],
  ['ac_price', 'Средняя стоимость обучения', '$', [700, 750, 800, 850, 900]],
  ['ac_cogs', 'Себестоимость обучения (преподаватели, контент)', '% выручки', [0.48, 0.46, 0.45, 0.45, 0.45]],
  ['sec', 'FootureX Game Community & Esports'],
  ['es_rev', 'Спонсорство, билеты, медиа', '$ тыс.', [0, 40, 120, 250, 400], true],
  ['es_cogs', 'Прямые затраты мероприятий и призовые', '% выручки', [0.65, 0.65, 0.62, 0.60, 0.58]],
  ['sec', 'FootureX Football Academy — пилот (FC, стадион, City вне модели)'],
  ['fa_rev', 'Выручка детско-юношеских программ', '$ тыс.', [0, 0, 0, 80, 160], true],
  ['fa_cost', 'Операционные затраты академии', '$ тыс.', [0, 0, 0, 250, 350]],
  ['sec', 'Операционные расходы (OPEX)'],
  ['ox_admin', 'Управление и административный персонал', '$ тыс.', [180, 300, 450, 600, 750]],
  ['ox_rnd', 'R&D продуктовых команд (игра, AI SaaS)', '$ тыс.', [220, 380, 520, 650, 780]],
  ['ox_office', 'Офис и инфраструктура', '$ тыс.', [36, 60, 96, 130, 160]],
  ['ox_mkt', 'Маркетинг и B2B-продажи', '$ тыс.', [40, 90, 150, 220, 300]],
  ['ox_legal', 'Юридические, аудит, комплаенс, прочие', '$ тыс.', [30, 50, 80, 110, 140]],
  ['sec', 'CAPEX и прочее'],
  ['cx_it', 'Оборудование, IT-инфраструктура, офис', '$ тыс.', [120, 90, 150, 180, 200]],
  ['cx_es', 'Esports-студия и стриминг', '$ тыс.', [0, 80, 40, 60, 60]],
  ['cx_ac', 'Учебные пространства академии', '$ тыс.', [0, 100, 120, 60, 60]],
  ['cx_fa', 'Тренировочная база Football Academy (улучшения арендуемого объекта)', '$ тыс.', [0, 0, 0, 300, 200]],
  ['dep_years', 'Срок амортизации', 'лет', [4, 4, 4, 4, 4]],
  ['wc', 'Оборотный капитал', '% прироста выручки', [0.08, 0.08, 0.08, 0.08, 0.08]],
  ['tax', 'Налог на прибыль (без учёта льгот IT Park)', '%', [0.15, 0.15, 0.15, 0.15, 0.15]],
];
const S = { base: 1.0, pess: 0.7, opt: 1.3 };

function compute(mult) {
  const a = {};
  for (const r of A) if (r[0] !== 'sec') a[r[0]] = r[3].map((v) => (r[4] ? v * mult : v));
  const yrs = [0, 1, 2, 3, 4];
  const o = {};
  const f = (fn) => yrs.map(fn);
  o.rev_it = f((i) => (a.it_fte[i] * a.it_hours[i] * a.it_util[i] * a.it_rate[i]) / 1000);
  o.rev_ai_proj = f((i) => a.ai_proj[i] * a.ai_ticket[i]);
  const saasStart = f((i) => (i === 0 ? 0 : a.saas_end[i - 1]));
  o.rev_saas = f((i) => (((saasStart[i] + a.saas_end[i]) / 2) * a.saas_arpa[i] * 12) / 1000);
  o.rev_game_iap = f((i) => a.g_mau[i] * 1000 * a.g_conv[i] * a.g_arppu[i] * a.g_months[i] / 1000);
  o.rev_game_ad = f((i) => (a.g_mau[i] * 1000 * a.g_ad[i] * a.g_months[i]) / 1000);
  o.rev_gamedev = a.gd_rev;
  o.rev_academy = f((i) => (a.ac_students[i] * a.ac_price[i]) / 1000);
  o.rev_esports = a.es_rev;
  o.rev_football = a.fa_rev;
  o.revenue = f((i) => ['rev_it', 'rev_ai_proj', 'rev_saas', 'rev_game_iap', 'rev_game_ad', 'rev_gamedev', 'rev_academy', 'rev_esports', 'rev_football'].reduce((s, k) => s + o[k][i], 0));
  o.cogs = f((i) => a.it_fte[i] * a.it_cost[i] + o.rev_ai_proj[i] * a.ai_proj_cogs[i] + o.rev_saas[i] * a.saas_cogs[i]
    + o.rev_game_iap[i] * a.g_fee[i] + (o.rev_game_iap[i] + o.rev_game_ad[i]) * a.g_host[i] + o.rev_gamedev[i] * a.gd_cogs[i]
    + o.rev_academy[i] * a.ac_cogs[i] + o.rev_esports[i] * a.es_cogs[i] + a.fa_cost[i]);
  o.gross = f((i) => o.revenue[i] - o.cogs[i]);
  o.gm = f((i) => o.gross[i] / o.revenue[i]);
  o.ua = f((i) => a.g_ua[i] * (mult === 1 ? 1 : mult < 1 ? 0.85 : 1.15));
  o.opex = f((i) => a.ox_admin[i] + a.ox_rnd[i] + a.ox_office[i] + a.ox_mkt[i] + a.ox_legal[i] + o.ua[i]);
  o.ebitda = f((i) => o.gross[i] - o.opex[i]);
  o.capex = f((i) => a.cx_it[i] + a.cx_es[i] + a.cx_ac[i] + a.cx_fa[i]);
  o.da = f((i) => yrs.filter((j) => j <= i && i - j < a.dep_years[j]).reduce((s, j) => s + o.capex[j] / a.dep_years[j], 0));
  o.ebit = f((i) => o.ebitda[i] - o.da[i]);
  let lossCf = 0; o.tax = [];
  for (const i of yrs) { let base = o.ebit[i]; if (base < 0) { lossCf += -base; o.tax.push(0); } else { const off = Math.min(lossCf, base); lossCf -= off; o.tax.push((base - off) * a.tax[i]); } }
  o.net = f((i) => o.ebit[i] - o.tax[i]);
  o.dwc = f((i) => (o.revenue[i] - (i ? o.revenue[i - 1] : 0)) * a.wc[i]);
  o.ocf = f((i) => o.net[i] + o.da[i] - o.dwc[i]);
  o.fcf = f((i) => o.ocf[i] - o.capex[i]);
  o.cumfcf = []; yrs.reduce((s, i) => { o.cumfcf.push(s + o.fcf[i]); return s + o.fcf[i]; }, 0);
  o.peakFunding = -Math.min(0, ...o.cumfcf);
  o.funding = Math.ceil((o.peakFunding * 1.25) / 50) * 50; // +25% contingency, rounded to 50k
  o.beEbitda = o.ebitda.findIndex((v) => v > 0) + 1 || null;
  o.payback = o.cumfcf.findIndex((v) => v >= 0) + 1 || null;
  o.roi5 = o.cumfcf[4] / o.funding; // simple 5y cash ROI on required funding
  // unit economics
  const saasGM = 1 - a.saas_cogs[2];
  o.unit = {
    saas: { arpa: a.saas_arpa[2], gm: saasGM, churn: a.saas_churn[2], cac: a.saas_cac[2], ltv: (a.saas_arpa[2] * saasGM) / a.saas_churn[2], payback: a.saas_cac[2] / (a.saas_arpa[2] * saasGM) },
    game: (() => { const i = 2; const arpu = (o.rev_game_iap[i] * (1 - a.g_fee[i]) + o.rev_game_ad[i]) * 1000 / (a.g_mau[i] * 1000 * 12); const life = 8; const cac = (a.g_ua[i] * 1000) / (a.g_new[i] * 1000);
      return { arpuMonthNet: arpu, lifetimeMonths: life, ltv: arpu * life * (1 - a.g_host[i]), cac }; })(),
    it: { rate: a.it_rate[2], costPerHour: (a.it_cost[2] * 1000) / (a.it_hours[2] * a.it_util[2]), margin: 1 - (a.it_cost[2] * 1000) / (a.it_hours[2] * a.it_util[2]) / a.it_rate[2] },
    academy: { price: a.ac_price[2], gm: 1 - a.ac_cogs[2] },
  };
  o.a = a;
  return o;
}

const R = { base: compute(S.base), pess: compute(S.pess), opt: compute(S.opt) };
const round = (x) => (Array.isArray(x) ? x.map((v) => Math.round(v * 10) / 10) : x);
const summary = {};
for (const [k, o] of Object.entries(R)) {
  summary[k] = {};
  for (const [kk, v] of Object.entries(o)) if (kk !== 'a') summary[k][kk] = round(v);
}
summary.assump = R.base.a;
fs.writeFileSync(path.join(__dirname, '..', 'assets', 'finmodel.json'), JSON.stringify(summary, null, 1));
for (const k of ['pess', 'base', 'opt']) {
  const o = R[k];
  console.log(k, 'REV', round(o.revenue).join(' | '), '\n   EBITDA', round(o.ebitda).join(' | '), '\n   NET', round(o.net).join(' | '), '\n   FCF', round(o.fcf).join(' | '), '\n   cumFCF', round(o.cumfcf).join(' | '), '\n   GM', o.gm.map((v) => (v * 100).toFixed(0)).join(' | '), 'funding', o.funding, 'BE', o.beEbitda, 'payback', o.payback, 'ROI', o.roi5.toFixed(2));
}
console.log(JSON.stringify(R.base.unit));

// ---------------------------------------------------------------- Excel with live formulas (base case)
(async () => {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'FootureX Uzbekistan — illustrative model';
  const hdr = (ws, row) => { ws.getRow(row).font = { bold: true, color: { argb: 'FFFFFFFF' } }; ws.getRow(row).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0E1521' } }; };
  const note = wb.addWorksheet('Читать первым');
  note.getColumn(1).width = 120;
  ['ИЛЛЮСТРАТИВНАЯ ФИНАНСОВАЯ МОДЕЛЬ FOOTUREX UZBEKISTAN (USD тыс.)', '',
    'Статус: расчётный сценарий на основе допущений. Не является финансовой отчётностью, прогнозом руководства или предложением инвестиций.',
    'Все драйверы на листе «Допущения» требуют подтверждения бизнес-планом и утверждённой финансовой моделью компании.',
    'Выручка игры учитывает только денежные платежи пользователей и рекламу. Внутриигровая валюта (FX Coins) не является выручкой.',
    'Проекты FC FootureX (профессиональный клуб), FootureX Stadium и FootureX City НЕ включены: требуются отдельные ТЭО, земля, разрешения и проектное финансирование.',
    'Льготы резидентов IT Park не учтены (консервативно): налог на прибыль 15%. Применимость льгот требует юридического подтверждения.',
    'Сценарии: пессимистичный = 70% объёмных драйверов; оптимистичный = 130%. Цены, ставки и фиксированные OPEX не масштабируются.',
    'Синие ячейки — вводимые допущения. Лист «P&L и денежный поток» считается формулами из допущений (базовый сценарий).'].forEach((t, i) => { note.getCell(`A${i + 1}`).value = t; });
  note.getCell('A1').font = { bold: true, size: 14 };

  const ws = wb.addWorksheet('Допущения');
  ws.columns = [{ width: 58 }, { width: 18 }, ...COLS.map(() => ({ width: 12 }))];
  ws.addRow(['Драйвер', 'Ед.', ...Y]); hdr(ws, 1);
  const addr = {};
  for (const r of A) {
    if (r[0] === 'sec') { const row = ws.addRow([r[1]]); row.font = { bold: true }; continue; }
    const row = ws.addRow([r[1], r[2], ...r[3]]);
    addr[r[0]] = row.number;
    COLS.forEach((c) => { const cell = ws.getCell(`${c}${row.number}`); cell.font = { color: { argb: 'FF1F4FD8' } }; if (r[2].includes('%')) cell.numFmt = '0.0%'; });
  }
  const pl = wb.addWorksheet('P&L и денежный поток');
  pl.columns = [{ width: 52 }, { width: 6 }, ...COLS.map(() => ({ width: 13 }))];
  pl.addRow(['Показатель (USD тыс.)', '', ...Y]); hdr(pl, 1);
  const P = {};
  const D = (k, c) => `'Допущения'!${c}${addr[k]}`;
  const rowF = (key, label, fn, bold) => { const row = pl.addRow([label, '']); P[key] = row.number; COLS.forEach((c, i) => { pl.getCell(`${c}${row.number}`).value = { formula: fn(c, i) }; pl.getCell(`${c}${row.number}`).numFmt = '#,##0.0;[Red]-#,##0.0'; }); if (bold) row.font = { bold: true }; };
  const prev = (c) => COLS[COLS.indexOf(c) - 1];
  rowF('rev_it', 'Выручка: IT-услуги', (c) => `${D('it_fte', c)}*${D('it_hours', c)}*${D('it_util', c)}*${D('it_rate', c)}/1000`);
  rowF('rev_ai_proj', 'Выручка: AI-проекты', (c) => `${D('ai_proj', c)}*${D('ai_ticket', c)}`);
  rowF('rev_saas', 'Выручка: AI SaaS', (c, i) => `((${i ? D('saas_end', prev(c)) : 0}+${D('saas_end', c)})/2)*${D('saas_arpa', c)}*12/1000`);
  rowF('rev_iap', 'Выручка: игра — покупки (IAP)', (c) => `${D('g_mau', c)}*1000*${D('g_conv', c)}*${D('g_arppu', c)}*${D('g_months', c)}/1000`);
  rowF('rev_ad', 'Выручка: игра — реклама', (c) => `${D('g_mau', c)}*1000*${D('g_ad', c)}*${D('g_months', c)}/1000`);
  rowF('rev_gd', 'Выручка: заказная разработка игр', (c) => `${D('gd_rev', c)}`);
  rowF('rev_ac', 'Выручка: Game Dev Academy', (c) => `${D('ac_students', c)}*${D('ac_price', c)}/1000`);
  rowF('rev_es', 'Выручка: Community & Esports', (c) => `${D('es_rev', c)}`);
  rowF('rev_fa', 'Выручка: Football Academy (пилот)', (c) => `${D('fa_rev', c)}`);
  rowF('rev', 'ВЫРУЧКА', (c) => `SUM(${c}${P.rev_it}:${c}${P.rev_fa})`, true);
  rowF('cogs', 'Себестоимость (прямые затраты)', (c) => `${D('it_fte', c)}*${D('it_cost', c)}+${c}${P.rev_ai_proj}*${D('ai_proj_cogs', c)}+${c}${P.rev_saas}*${D('saas_cogs', c)}+${c}${P.rev_iap}*${D('g_fee', c)}+(${c}${P.rev_iap}+${c}${P.rev_ad})*${D('g_host', c)}+${c}${P.rev_gd}*${D('gd_cogs', c)}+${c}${P.rev_ac}*${D('ac_cogs', c)}+${c}${P.rev_es}*${D('es_cogs', c)}+${D('fa_cost', c)}`);
  rowF('gross', 'ВАЛОВАЯ ПРИБЫЛЬ', (c) => `${c}${P.rev}-${c}${P.cogs}`, true);
  rowF('gm', 'Валовая маржа, %', (c) => `IF(${c}${P.rev}=0,0,${c}${P.gross}/${c}${P.rev}*100)`);
  rowF('opex', 'OPEX (включая UA игры)', (c) => ['ox_admin', 'ox_rnd', 'ox_office', 'ox_mkt', 'ox_legal', 'g_ua'].map((k) => D(k, c)).join('+'));
  rowF('ebitda', 'EBITDA', (c) => `${c}${P.gross}-${c}${P.opex}`, true);
  rowF('capex', 'CAPEX', (c) => ['cx_it', 'cx_es', 'cx_ac', 'cx_fa'].map((k) => D(k, c)).join('+'));
  rowF('da', 'Амортизация', (c, i) => COLS.slice(0, i + 1).map((cc) => `${cc}${P.capex}/${D('dep_years', cc)}`).slice(-4).join('+'));
  rowF('ebit', 'EBIT', (c) => `${c}${P.ebitda}-${c}${P.da}`);
  rowF('cumebit', 'Накопленный EBIT (для переноса убытков)', (c, i) => (i ? `${prev(c)}${P.cumebit}+${c}${P.ebit}` : `${c}${P.ebit}`));
  rowF('tax', 'Налог на прибыль', (c, i) => `MAX(0,MIN(${c}${P.ebit},${c}${P.cumebit}))*${D('tax', c)}`);
  rowF('net', 'ЧИСТАЯ ПРИБЫЛЬ', (c) => `${c}${P.ebit}-${c}${P.tax}`, true);
  rowF('dwc', 'Изменение оборотного капитала', (c, i) => `(${c}${P.rev}-${i ? `${prev(c)}${P.rev}` : 0})*${D('wc', c)}`);
  rowF('ocf', 'ОПЕРАЦИОННЫЙ ДЕНЕЖНЫЙ ПОТОК', (c) => `${c}${P.net}+${c}${P.da}-${c}${P.dwc}`, true);
  rowF('fcf', 'СВОБОДНЫЙ ДЕНЕЖНЫЙ ПОТОК (FCF)', (c) => `${c}${P.ocf}-${c}${P.capex}`, true);
  rowF('cum', 'Накопленный FCF', (c, i) => (i ? `${prev(c)}${P.cum}+${c}${P.fcf}` : `${c}${P.fcf}`));
  pl.addRow([]);
  const fr = pl.addRow(['Пиковая потребность в финансировании (до резерва)', '', { formula: `-MIN(0,C${P.cum}:G${P.cum})` }]); fr.font = { bold: true };
  pl.addRow(['Резерв на непредвиденные расходы', '', 0.25]);
  const fr2 = pl.addRow(['Потребность в капитале с резервом (округл. до 50)', '', { formula: `CEILING(C${fr.number}*(1+C${fr.number + 1}),50)` }]); fr2.font = { bold: true };

  const sc = wb.addWorksheet('Сценарии');
  sc.columns = [{ width: 40 }, { width: 14 }, { width: 14 }, { width: 14 }];
  sc.addRow(['Показатель (USD тыс.)', 'Пессимистичный', 'Базовый', 'Оптимистичный']); hdr(sc, 1);
  const sv = (fn) => ['pess', 'base', 'opt'].map((k) => fn(R[k]));
  sc.addRow(['Выручка, Год 5', ...sv((o) => +o.revenue[4].toFixed(1))]);
  sc.addRow(['EBITDA, Год 5', ...sv((o) => +o.ebitda[4].toFixed(1))]);
  sc.addRow(['Чистая прибыль, Год 5', ...sv((o) => +o.net[4].toFixed(1))]);
  sc.addRow(['Накопленный FCF за 5 лет', ...sv((o) => +o.cumfcf[4].toFixed(1))]);
  sc.addRow(['Год выхода EBITDA в плюс', ...sv((o) => (o.beEbitda ? `Год ${o.beEbitda}` : '> 5 лет'))]);
  sc.addRow(['Окупаемость (накопленный FCF ≥ 0)', ...sv((o) => (o.payback ? `Год ${o.payback}` : '> 5 лет'))]);
  sc.addRow(['Потребность в капитале (с резервом 25%)', ...sv((o) => o.funding)]);
  sc.addRow(['Значения сценариев рассчитаны скриптом build/finmodel.js; базовый сценарий пересчитывается формулами на листе P&L.']);
  const file = path.join(__dirname, '..', 'output', 'FootureX_Illustrative_Financial_Model.xlsx');
  await wb.xlsx.writeFile(file);
  console.log('wrote', file);
})();
