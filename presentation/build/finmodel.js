// FootureX — documented price catalog (BX-013 v1.0) + derived calculations + blank driver template.
// No invented revenue, users, investments or payback: every input sheet value comes from BX-013,
// every calculated value is a formula over those inputs, every forecast driver is left blank.
// Outputs: ../assets/finmodel.json (used by the deck) and ../output/FootureX_Catalog_and_Model_Template.xlsx
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

const SRC = 'BX-013 Approved Services Catalog v1.0 (июнь 2026)';

// ---------------------------------------------------------------- documented data (BX-013)
const packs = [[30, 1.99], [60, 3.99], [90, 5.99], [150, 9.5], [400, 24.99]]; // FTXcoin, USD
const premiumPass = { price: 3.99, days: 14, levels: 100 };
const gamePacks = [
  ['Free Pack', 'каждые 24 ч', null, null], ['Common Pack', '200 Coins', 'Coins', 200], ['Uncommon Pack', '800 Coins', 'Coins', 800],
  ['Rare Pack', '39 FTXcoin', 'FTXcoin', 39], ['Epic Pack', '59 FTXcoin', 'FTXcoin', 59], ['Legendary Pack', '89 FTXcoin', 'FTXcoin', 89],
  ['Immortal Pack', '139 FTXcoin', 'FTXcoin', 139], ['Elite Pack', '149 FTXcoin', 'FTXcoin', 149], ['Create Player', '30 FTXcoin', 'FTXcoin', 30],
];
const leagues = [
  // name, create, fee per 7-day season, creator, prize pool, treasury
  ['Fan League', 69, 5, 2, 2, 1], ['Pro League', 109, 8, 3, 3, 2], ['Master League', 149, 12, 5, 5, 2],
];
const seats = { extra: 4, extraPrice: 20, limit: 48 };

// ---------------------------------------------------------------- derived (pure arithmetic over BX-013)
const perCoin = packs.map(([q, p]) => ({ qty: q, usd: p, usdPerCoin: p / q, coinsPerUsd: q / p }));
const minUsd = Math.min(...perCoin.map((x) => x.usdPerCoin)), maxUsd = Math.max(...perCoin.map((x) => x.usdPerCoin));
const packUsd = gamePacks.filter((g) => g[2] === 'FTXcoin').map(([n, , , q]) => ({ name: n, ftx: q, usdLow: q * minUsd, usdHigh: q * maxUsd }));
const leagueFull = leagues.map(([n, cr, fee, a, b, c]) => ({ name: n, create: cr, fee, creator: a, pool: b, treasury: c, seats: seats.limit, gross: fee * seats.limit, toCreator: a * seats.limit, toPool: b * seats.limit, toTreasury: c * seats.limit, check: a + b + c === fee }));
const pass = { ...premiumPass, perDay: premiumPass.price / premiumPass.days, seasonsPerYear: 365 / premiumPass.days, maxPerYear: premiumPass.price * (365 / premiumPass.days) };

const out = { source: SRC, packs: perCoin, minUsd, maxUsd, gamePacks, packUsd, leagues: leagueFull, seats, pass };
fs.writeFileSync(path.join(__dirname, '..', 'assets', 'finmodel.json'), JSON.stringify(out, null, 1));

// ---------------------------------------------------------------- workbook
(async () => {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'FootureX Uzbekistan';
  const BLUE = 'FF2550FA', HDR = 'FF142A70', INPUT = 'FF2593FA', TODO = 'FFFFF2CC';
  const head = (ws, r) => { ws.getRow(r).eachCell((c) => { c.font = { bold: true, color: { argb: 'FFFFFFFF' } }; c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: HDR } }; }); };
  const title = (ws, t, sub) => { ws.getCell('A1').value = t; ws.getCell('A1').font = { bold: true, size: 14, color: { argb: BLUE } }; ws.getCell('A2').value = sub; ws.getCell('A2').font = { italic: true, color: { argb: 'FF666666' } }; };
  const inputFont = { color: { argb: INPUT }, bold: true };

  // 1. README
  const r = wb.addWorksheet('README');
  title(r, 'FootureX — каталог цен BX-013 и шаблон финансовой модели', 'Файл не содержит прогнозов: выручка, пользователи, инвестиции и окупаемость не заданы.');
  [
    ['Лист', 'Содержание', 'Статус данных'],
    ['Каталог BX-013', 'Цены пакетов FTXcoin, Premium Pass, игровых наборов, лиг (синий шрифт — значения документа)', 'Документ BX-013 v1.0'],
    ['Расчёты по каталогу', 'Цена 1 FTXcoin по пакетам, долларовый эквивалент наборов, распределение взносов лиги', 'Расчёт по данным BX (формулы)'],
    ['Драйверы (шаблон)', 'Дерево драйверов на 5 лет: пустые жёлтые ячейки заполняет руководство', 'Требуется подтверждение'],
    ['Классификация', 'Разграничение: реальные данные / расчёт / требует подтверждения', '—'],
    ['', '', ''],
    ['Правила', 'Revenue = реальные платежи через Telegram Stars / TON. Sink (расход валюты) ≠ выручка. Оборот между пользователями ≠ выручка платформы.', 'BX-013'],
    ['', 'Игровые показатели не переносятся на всю компанию FootureX Uzbekistan.', 'Консолидированное ТЗ'],
    ['', 'Комиссии Telegram/TON и налоги в BX-013 не указаны — в шаблоне вынесены отдельными вводами.', 'Требуется подтверждение'],
  ].forEach((row, i) => { if (i === 0) r.addRow([]); r.addRow(row); });
  head(r, 4);
  r.columns = [{ width: 22 }, { width: 95 }, { width: 28 }];

  // 2. Catalog
  const c = wb.addWorksheet('Каталог BX-013');
  title(c, 'Утверждённый каталог услуг и цен', SRC + ' — заменяет цены BX-010');
  c.addRow([]); c.addRow(['Пакеты FTXcoin', 'Кол-во FTXcoin', 'Цена, USD']); head(c, 4);
  packs.forEach(([q, p]) => { const row = c.addRow(['Пакет ' + q, q, p]); row.getCell(2).font = inputFont; row.getCell(3).font = inputFont; row.getCell(3).numFmt = '$0.00'; });
  c.addRow(['Пакет 120 исключён из каталога']);
  c.addRow([]); const pr = c.addRow(['Battle Pass', 'Цена, USD', 'Дней в сезоне', 'Уровней']); head(c, pr.number);
  c.addRow(['Free Pass', 0, 14, 100]);
  const pp = c.addRow(['Premium Pass', premiumPass.price, premiumPass.days, premiumPass.levels]); [2, 3, 4].forEach((k) => (pp.getCell(k).font = inputFont)); pp.getCell(2).numFmt = '$0.00';
  c.addRow([]); const gh = c.addRow(['Игровые наборы', 'Цена', 'Валюта', 'Кол-во']); head(c, gh.number);
  gamePacks.forEach(([n, t, cur, q]) => { const row = c.addRow([n, t, cur || '—', q]); row.getCell(4).font = inputFont; });
  c.addRow([]); const lh = c.addRow(['Лиги', 'Создание, FTXcoin', 'Взнос за 7 дней', 'Создателю', 'Призовой фонд', 'Казна']); head(c, lh.number);
  c.addRow(['Системные (ранги 19–100)', 0, 0, 0, 0, 0]);
  const leagueRow0 = c.rowCount + 1;
  leagues.forEach((l) => { const row = c.addRow(l); for (let k = 2; k <= 6; k++) row.getCell(k).font = inputFont; });
  c.addRow([]);
  const sr = c.addRow(['Доп. места', seats.extra, 'за FTXcoin', seats.extraPrice, 'лимит мест', seats.limit]); [2, 4, 6].forEach((k) => (sr.getCell(k).font = inputFont));
  const seatsRow = sr.number;
  c.addRow([]); c.addRow(['Исключено: вывод FTXcoin в деньги; конвертация Coins → FTXcoin; нечестные лутбоксы; ставки.']);
  c.columns = [{ width: 30 }, { width: 18 }, { width: 16 }, { width: 14 }, { width: 16 }, { width: 12 }];

  // 3. Calculations (formulas referencing catalog)
  const k = wb.addWorksheet('Расчёты по каталогу');
  title(k, 'Расчёты только по ценам BX-013', 'Формулы ссылаются на лист «Каталог BX-013». Без допущений об объёмах.');
  k.addRow([]); k.addRow(['Пакет', 'FTXcoin', 'USD', 'USD за 1 FTXcoin', 'FTXcoin за 1 USD']); head(k, 4);
  packs.forEach((_, i) => {
    const cr = 5 + i;
    const row = k.addRow([{ formula: `'Каталог BX-013'!A${cr}` }, { formula: `'Каталог BX-013'!B${cr}` }, { formula: `'Каталог BX-013'!C${cr}` }, { formula: `C${5 + i}/B${5 + i}` }, { formula: `B${5 + i}/C${5 + i}` }]);
    row.getCell(3).numFmt = '$0.00'; row.getCell(4).numFmt = '$0.0000'; row.getCell(5).numFmt = '0.00';
  });
  const mn = k.addRow(['Мин. цена 1 FTXcoin', '', '', { formula: 'MIN(D5:D9)' }]); mn.getCell(4).numFmt = '$0.0000';
  const mx = k.addRow(['Макс. цена 1 FTXcoin', '', '', { formula: 'MAX(D5:D9)' }]); mx.getCell(4).numFmt = '$0.0000';
  const minRef = `D${mn.number}`, maxRef = `D${mx.number}`;
  k.addRow([]); const ph = k.addRow(['Набор', 'FTXcoin', 'Эквивалент USD (мин.)', 'Эквивалент USD (макс.)']); head(k, ph.number);
  gamePacks.filter((g) => g[2] === 'FTXcoin').forEach(([n, , , q]) => {
    const row = k.addRow([n, q, null, null]); const rn = row.number;
    row.getCell(3).value = { formula: `B${rn}*${minRef}` }; row.getCell(4).value = { formula: `B${rn}*${maxRef}` };
    row.getCell(3).numFmt = '$0.00'; row.getCell(4).numFmt = '$0.00';
  });
  k.addRow([]); const lh2 = k.addRow(['Лига при полном составе', 'Мест', 'Взносы за сезон, FTXcoin', 'Создателю', 'Призовой фонд', 'Казна (sink)']); head(k, lh2.number);
  leagues.forEach((l, i) => {
    const cr = leagueRow0 + i;
    const row = k.addRow([l[0], { formula: `'Каталог BX-013'!F${seatsRow}` }]); const rn = row.number;
    row.getCell(3).value = { formula: `B${rn}*'Каталог BX-013'!C${cr}` };
    row.getCell(4).value = { formula: `B${rn}*'Каталог BX-013'!D${cr}` };
    row.getCell(5).value = { formula: `B${rn}*'Каталог BX-013'!E${cr}` };
    row.getCell(6).value = { formula: `B${rn}*'Каталог BX-013'!F${cr}` };
  });
  k.addRow(['Взносы — внутриигровая валюта: оборот между пользователями и sink, а не денежная выручка платформы.']);
  k.addRow([]); const bh = k.addRow(['Premium Pass', 'USD за сезон', 'USD в день', 'Сезонов в год', 'Макс. USD в год на 1 плательщика']); head(k, bh.number);
  const bp = k.addRow(['Premium Pass', { formula: `'Каталог BX-013'!B${pp.number}` }]); const bn = bp.number;
  bp.getCell(3).value = { formula: `B${bn}/'Каталог BX-013'!C${pp.number}` }; bp.getCell(4).value = { formula: `365/'Каталог BX-013'!C${pp.number}` }; bp.getCell(5).value = { formula: `B${bn}*D${bn}` };
  bp.getCell(2).numFmt = '$0.00'; bp.getCell(3).numFmt = '$0.000'; bp.getCell(4).numFmt = '0.0'; bp.getCell(5).numFmt = '$0.00';
  k.columns = [{ width: 30 }, { width: 12 }, { width: 24 }, { width: 22 }, { width: 30 }, { width: 14 }];

  // 4. Driver template — blank inputs, formula outputs
  const t = wb.addWorksheet('Драйверы (шаблон)');
  title(t, 'Шаблон драйверной модели FootureX Game на 5 лет', 'Жёлтые ячейки — вводы руководства (сейчас пусто). Результаты считаются формулами. Не переносится на всю компанию.');
  t.addRow([]); t.addRow(['Показатель', 'Ед.', 'Год 1', 'Год 2', 'Год 3', 'Год 4', 'Год 5', 'Источник / формула']); head(t, 4);
  const rows = {};
  const add = (key, label, unit, f, src) => {
    const vals = [];
    for (let i = 0; i < 5; i++) { const col = String.fromCharCode(67 + i); vals.push(f ? { formula: f(col) } : null); }
    const row = t.addRow([label, unit, ...vals, src]); rows[key] = row.number;
    if (!f) for (let i = 3; i <= 7; i++) row.getCell(i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: TODO } };
    return row;
  };
  const R = (k2, col) => `${col}${rows[k2]}`;
  const sec = (s) => { const row = t.addRow([s]); row.font = { bold: true, color: { argb: BLUE } }; };
  sec('Аудитория (BX-008 KPI)');
  add('mau', 'MAU, средний', 'чел.', null, 'Требуется подтверждение');
  add('dau', 'DAU, средний', 'чел.', null, 'Требуется подтверждение');
  add('ret', 'Retention D30', '%', null, 'Требуется подтверждение');
  add('conv', 'Conversion в платящих (в месяц)', '%', null, 'Требуется подтверждение');
  add('new', 'Новые пользователи за год', 'чел.', null, 'Требуется подтверждение');
  sec('Денежная выручка (только Stars / TON)');
  add('payers', 'Платящие в месяц', 'чел.', (c2) => `${R('mau', c2)}*${R('conv', c2)}`, '= MAU × Conversion');
  add('arppu', 'ARPPU в месяц', 'USD', null, 'Требуется подтверждение; цены — лист «Каталог BX-013»');
  add('months', 'Месяцев коммерческой работы', 'мес.', null, 'Требуется подтверждение');
  add('iap', 'Покупки (Premium Pass, FTXcoin, косметика)', 'USD', (c2) => `${R('payers', c2)}*${R('arppu', c2)}*${R('months', c2)}`, '= платящие × ARPPU × месяцы');
  add('part', 'Партнёрства, реклама, спонсорство', 'USD', null, 'Требуется подтверждение (BX-001)');
  add('rev', 'Revenue (валовая)', 'USD', (c2) => `${R('iap', c2)}+${R('part', c2)}`, 'Сумма');
  add('fee', 'Комиссии платформ и платёжных провайдеров', '% IAP', null, 'Не указаны в BX — требуется подтверждение');
  sec('Затраты');
  add('cogs', 'Хостинг, инфраструктура, LiveOps (прямые)', 'USD', null, 'Требуется подтверждение');
  add('gp', 'Gross Profit', 'USD', (c2) => `${R('rev', c2)}-${R('iap', c2)}*${R('fee', c2)}-${R('cogs', c2)}`, '= Revenue − комиссии − прямые затраты');
  add('gm', 'Gross Margin', '%', (c2) => `IF(${R('rev', c2)}=0,"",${R('gp', c2)}/${R('rev', c2)})`, '= GP / Revenue');
  add('team', 'Команда (BX-002 роли)', 'USD', null, 'Требуется подтверждение');
  add('ua', 'Маркетинг и привлечение (UA)', 'USD', null, 'Требуется подтверждение');
  add('other', 'Прочие OPEX', 'USD', null, 'Требуется подтверждение');
  add('ebitda', 'EBITDA', 'USD', (c2) => `${R('gp', c2)}-${R('team', c2)}-${R('ua', c2)}-${R('other', c2)}`, '= GP − OPEX');
  add('da', 'Амортизация', 'USD', null, 'Требуется подтверждение');
  add('tax', 'Налог на прибыль', '%', null, 'Требуется подтверждение (режим IT Park — уточнить)');
  add('np', 'Net Profit', 'USD', (c2) => `(${R('ebitda', c2)}-${R('da', c2)})*(1-${R('tax', c2)})`, '= (EBITDA − D&A) × (1 − налог)');
  add('wc', 'Изменение оборотного капитала', 'USD', null, 'Требуется подтверждение');
  add('ocf', 'Operating Cash Flow', 'USD', (c2) => `${R('np', c2)}+${R('da', c2)}-${R('wc', c2)}`, '= NP + D&A − ΔWC');
  add('capex', 'CAPEX', 'USD', null, 'Требуется подтверждение');
  add('fcf', 'Free Cash Flow', 'USD', (c2) => `${R('ocf', c2)}-${R('capex', c2)}`, '= OCF − CAPEX');
  add('cum', 'Накопленный FCF', 'USD', (c2) => (c2 === 'C' ? `${R('fcf', c2)}` : `${String.fromCharCode(c2.charCodeAt(0) - 1)}${rows.fcf + 1}+${R('fcf', c2)}`), 'Нарастающим итогом');
  sec('Юнит-экономика');
  add('cac', 'CAC', 'USD', (c2) => `IF(${R('new', c2)}=0,"",${R('ua', c2)}/${R('new', c2)})`, '= UA / новые пользователи');
  add('life', 'Средний срок жизни платящего', 'мес.', null, 'Требуется подтверждение');
  add('ltv', 'LTV платящего', 'USD', (c2) => `${R('arppu', c2)}*(1-${R('fee', c2)})*${R('life', c2)}`, '= ARPPU × (1 − комиссия) × срок жизни');
  add('roi', 'ROI (накопленный)', '%', null, 'Считается после ввода инвестиций');
  t.columns = [{ width: 44 }, { width: 9 }, { width: 13 }, { width: 13 }, { width: 13 }, { width: 13 }, { width: 13 }, { width: 52 }];

  // 5. Classification
  const z = wb.addWorksheet('Классификация');
  title(z, 'Классификация данных презентации', 'Правило 13 консолидированного ТЗ');
  z.addRow([]); z.addRow(['Категория', 'Примеры', 'Как показано']); head(z, 4);
  [
    ['Реальные данные (документы)', 'Цены BX-013; структура экономики BX-003; этапы BX-001/BX-008; роли BX-002', 'Статус «Документы BX», ссылка на документ'],
    ['Расчёт по данным BX', 'Цена 1 FTXcoin по пакетам; USD-эквивалент наборов; распределение взносов лиги; Premium Pass в день', 'Статус «Расчёт по данным BX», формулы в Excel'],
    ['Требует подтверждения', 'MAU/DAU, конверсия, ARPPU, выручка, затраты, инвестиции, окупаемость, даты, комиссии', 'Статус «Цифры не предоставлены» / «Требуется подтверждение», пустые ячейки'],
  ].forEach((x) => z.addRow(x));
  z.columns = [{ width: 30 }, { width: 80 }, { width: 50 }];

  const outDir = path.join(__dirname, '..', 'output');
  for (const f of fs.readdirSync(outDir)) if (/Financial_Model\.xlsx$/.test(f)) fs.unlinkSync(path.join(outDir, f));
  await wb.xlsx.writeFile(path.join(outDir, 'FootureX_Catalog_and_Model_Template.xlsx'));
  console.log('minUsd', minUsd.toFixed(4), 'maxUsd', maxUsd.toFixed(4));
  console.log(JSON.stringify(leagueFull.map((l) => [l.name, l.gross, l.toCreator, l.toPool, l.toTreasury, l.check])));
  console.log('pass', pass.perDay.toFixed(3), pass.seasonsPerYear.toFixed(2), pass.maxPerYear.toFixed(2));
})();
