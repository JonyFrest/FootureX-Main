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
const fullSeasons = Math.floor(365 / premiumPass.days); // same as INT() in the workbook
const pass = { ...premiumPass, perDay: premiumPass.price / premiumPass.days, seasonsPerYear: fullSeasons, maxPerYear: premiumPass.price * fullSeasons };

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
    ['Сценарии', 'Коэффициенты пессимистичного / базового / оптимистичного сценария к драйверам; выбор сценария — ячейка B3', 'Требуется подтверждение'],
    ['Драйверы (шаблон)', 'Дерево драйверов на 5 лет: пустые жёлтые ячейки заполняет руководство; итоги пусты, пока не введены их вводы. Включает P&L, денежные потоки, ROI, окупаемость, безубыточность, CAC, LTV', 'Требуется подтверждение'],
    ['Классификация', 'Разграничение: реальные данные / расчёт / требует подтверждения', '—'],
    ['', '', ''],
    ['Правила', 'Revenue игры = реальные платежи через Telegram Stars / TON (BX-013) + B2B-договоры (партнёрства, реклама). Sink (расход валюты) ≠ выручка. Оборот между пользователями ≠ выручка платформы.', 'BX-013, BX-001'],
    ['', 'Игровые показатели не переносятся на всю компанию FootureX Uzbekistan.', 'Консолидированное ТЗ'],
    ['', 'Комиссии Telegram/TON и налоги в BX-013 не указаны — в шаблоне вынесены отдельными вводами.', 'Требуется подтверждение'],
    ['', 'Доли (%) вводятся десятичной дробью: 0,05 = 5%. Ввод проверяется (0–1).', '—'],
    ['Пересчёт', 'Файл, собранный генератором, содержит формулы без сохранённых значений; Excel пересчитает их при открытии. Для превью без Excel: пересчёт в LibreOffice (см. README репозитория).', '—'],
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
  c.addRow(['Free Pass (дни и уровни — допущение по аналогии с Premium)', 0, 14, 100]);
  const pp = c.addRow(['Premium Pass', premiumPass.price, premiumPass.days, premiumPass.levels]); [2, 3, 4].forEach((k) => (pp.getCell(k).font = inputFont)); pp.getCell(2).numFmt = '$0.00';
  c.addRow([]); const gh = c.addRow(['Игровые наборы', 'Цена', 'Валюта', 'Кол-во']); head(c, gh.number);
  const packRow = {};
  gamePacks.forEach(([n, t, cur, q]) => { const row = c.addRow([n, t, cur || '—', q]); row.getCell(4).font = inputFont; packRow[n] = row.number; });
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
    const row = k.addRow([n, { formula: `'Каталог BX-013'!D${packRow[n]}` }, null, null]); const rn = row.number;
    row.getCell(3).value = { formula: `B${rn}*${minRef}` }; row.getCell(4).value = { formula: `B${rn}*${maxRef}` };
    row.getCell(3).numFmt = '$0.00'; row.getCell(4).numFmt = '$0.00';
  });
  k.addRow([]); const lh2 = k.addRow(['Лига при лимите мест (максимум)', 'Мест', 'Взносы за сезон, FTXcoin', 'Создателю', 'Призовой фонд', 'Казна']); head(k, lh2.number);
  leagues.forEach((l, i) => {
    const cr = leagueRow0 + i;
    const row = k.addRow([l[0], { formula: `'Каталог BX-013'!F${seatsRow}` }]); const rn = row.number;
    row.getCell(3).value = { formula: `B${rn}*'Каталог BX-013'!C${cr}` };
    row.getCell(4).value = { formula: `B${rn}*'Каталог BX-013'!D${cr}` };
    row.getCell(5).value = { formula: `B${rn}*'Каталог BX-013'!E${cr}` };
    row.getCell(6).value = { formula: `B${rn}*'Каталог BX-013'!F${cr}` };
  });
  k.addRow(['Взносы — внутриигровая валюта: оборот между пользователями и расход валюты, а не денежная выручка. Базовое число мест BX-013 не задаёт; назначение казны не определено.']);
  k.addRow([]); const bh = k.addRow(['Premium Pass', 'USD за сезон', 'USD в день', 'Полных сезонов в год', 'Макс. USD в год на 1 плательщика']); head(k, bh.number);
  const bp = k.addRow(['Premium Pass', { formula: `'Каталог BX-013'!B${pp.number}` }]); const bn = bp.number;
  bp.getCell(3).value = { formula: `B${bn}/'Каталог BX-013'!C${pp.number}` }; bp.getCell(4).value = { formula: `INT(365/'Каталог BX-013'!C${pp.number})` }; bp.getCell(5).value = { formula: `B${bn}*D${bn}` };
  bp.getCell(2).numFmt = '$0.00'; bp.getCell(3).numFmt = '$0.000'; bp.getCell(4).numFmt = '0'; bp.getCell(5).numFmt = '$0.00';
  k.columns = [{ width: 30 }, { width: 12 }, { width: 24 }, { width: 22 }, { width: 30 }, { width: 14 }];

  // 4. Scenarios — multipliers on the base drivers (blank = 1), selected by a single cell
  const sc = wb.addWorksheet('Сценарии');
  title(sc, 'Сценарии: коэффициенты к базовым драйверам', 'Выберите сценарий в ячейке B3 (1 — пессимистичный, 2 — базовый, 3 — оптимистичный). Пустой коэффициент = 1. Значения не заданы.');
  const selRow = sc.addRow(['Выбранный сценарий', 2]); selRow.getCell(2).font = inputFont;
  const SEL = `$B$${selRow.number}`;
  selRow.getCell(2).dataValidation = { type: 'list', allowBlank: false, formulae: ['"1,2,3"'] };
  sc.addRow([]); const sh = sc.addRow(['Драйвер', 'Пессимистичный', 'Базовый', 'Оптимистичный', 'Применяется']); head(sc, sh.number);
  const mult = {};
  [['conv', 'Conversion'], ['arppu', 'ARPPU'], ['life', 'Срок жизни платящего (Retention)'], ['ua', 'Затраты на привлечение (CAC)'], ['months', 'Месяцев коммерческой работы (срок перехода к Growth)']].forEach(([key, label]) => {
    const row = sc.addRow([label, null, null, null]); const rn = row.number;
    for (let q = 2; q <= 4; q++) { row.getCell(q).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: TODO } }; row.getCell(q).numFmt = '0.00'; row.getCell(q).dataValidation = { type: 'decimal', operator: 'between', allowBlank: true, formulae: [0, 5], showErrorMessage: true, errorTitle: 'Коэффициент', error: 'Коэффициент к базовому драйверу: от 0 до 5 (1 = без изменений)' }; }
    row.getCell(5).value = { formula: `IF(INDEX(B${rn}:D${rn},1,${SEL})="",1,INDEX(B${rn}:D${rn},1,${SEL}))` }; row.getCell(5).numFmt = '0.00';
    mult[key] = `'Сценарии'!$E$${rn}`;
  });
  sc.columns = [{ width: 46 }, { width: 16 }, { width: 14 }, { width: 16 }, { width: 14 }];

  // 5. Driver template — blank inputs, formula outputs (outputs stay empty until their inputs are filled)
  const t = wb.addWorksheet('Драйверы (шаблон)');
  title(t, 'Шаблон драйверной модели FootureX Game на 5 лет', 'Жёлтые ячейки — вводы руководства (сейчас пусто). Результаты — формулы с учётом листа «Сценарии». Не переносится на всю компанию.');
  t.addRow([]); t.addRow(['Показатель', 'Ед.', 'Год 1', 'Год 2', 'Год 3', 'Год 4', 'Год 5', 'Источник / формула']); head(t, 4);
  const rows = {}, deps = {};
  const FMT = { 'USD': '#,##0;[Red]-#,##0', 'чел.': '#,##0', '%': '0.0%', 'мес.': '0.0', 'USD/мес.': '#,##0.00', 'x': '0.0' };
  const cols = ['C', 'D', 'E', 'F', 'G'];
  const R = (k2, col) => `${col}${rows[k2]}`;
  const Nn = (k2, col) => `N(${R(k2, col)})`;
  const input = (key, label, unit, src) => {
    const row = t.addRow([label, unit, null, null, null, null, null, src]); rows[key] = row.number; deps[key] = [key];
    for (let q = 3; q <= 7; q++) {
      row.getCell(q).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: TODO } };
      row.getCell(q).numFmt = FMT[unit] || '#,##0';
      if (unit === '%') row.getCell(q).dataValidation = { type: 'decimal', operator: 'between', allowBlank: true, formulae: [0, 1], showErrorMessage: true, errorTitle: 'Доля', error: 'Введите долю от 0 до 1 (например, 0,05 = 5%)' };
    }
  };
  // calc: f(col) -> expression; dep: keys whose inputs must be present (any) for the row to show a value
  const calc = (key, label, unit, f, dep, src, fmt) => {
    const ins = [...new Set(dep.flatMap((d2) => deps[d2]))];
    deps[key] = ins;
    const row = t.addRow([label, unit, ...cols.map((c2) => ({ formula: `IF(COUNT(${ins.map((d2) => R(d2, c2)).join(',')})=0,"",${f(c2)})` })), src]);
    rows[key] = row.number;
    for (let q = 3; q <= 7; q++) row.getCell(q).numFmt = fmt || FMT[unit] || '#,##0';
  };
  const sec = (s2) => { const row = t.addRow([s2]); row.font = { bold: true, color: { argb: BLUE } }; };
  sec('Аудитория (KPI BX-008)');
  input('mau', 'MAU, средний', 'чел.', 'Требуется подтверждение');
  input('dau', 'DAU, средний (справочно, KPI)', 'чел.', 'Требуется подтверждение');
  input('ret', 'Retention D30 (справочно, KPI)', '%', 'Требуется подтверждение');
  input('conv', 'Conversion в платящих (в месяц)', '%', 'Требуется подтверждение');
  input('new', 'Новые пользователи за год', 'чел.', 'Требуется подтверждение');
  sec('Денежная выручка через Telegram Stars / TON (BX-013)');
  calc('payers', 'Платящие в месяц', 'чел.', (c2) => `${Nn('mau', c2)}*${Nn('conv', c2)}*${mult.conv}`, ['mau', 'conv'], '= MAU × Conversion × коэффициент сценария');
  input('arppu', 'ARPPU в месяц', 'USD/мес.', 'Требуется подтверждение; цены — лист «Каталог BX-013»');
  input('months', 'Месяцев коммерческой работы', 'мес.', 'Требуется подтверждение');
  calc('iap', 'Покупки: Premium Pass, пакеты FTXcoin, косметика', 'USD', (c2) => `${Nn('payers', c2)}*${Nn('arppu', c2)}*${mult.arppu}*${Nn('months', c2)}*${mult.months}`, ['payers', 'arppu', 'months'], '= платящие × ARPPU × месяцы (× сценарий)');
  input('fee', 'Комиссии платформ и платёжных провайдеров', '%', 'Не указаны в BX — требуется подтверждение');
  sec('Прочая денежная выручка (B2B-договоры, не Stars / TON)');
  input('part', 'Партнёрства, реклама, спонсорство', 'USD', 'Требуется подтверждение (BX-001)');
  sec('Итог выручки и затраты');
  calc('rev', 'Revenue (валовая)', 'USD', (c2) => `${Nn('iap', c2)}+${Nn('part', c2)}`, ['iap', 'part'], '= покупки + B2B');
  input('cogs', 'Хостинг, инфраструктура, LiveOps (прямые, постоянные)', 'USD', 'Требуется подтверждение');
  input('vcost', 'Переменные затраты на платящего в месяц', 'USD/мес.', 'Требуется подтверждение (поддержка, платёжная обработка и т. п.)');
  calc('gp', 'Gross Profit', 'USD', (c2) => `${Nn('rev', c2)}-${Nn('iap', c2)}*${Nn('fee', c2)}-${Nn('cogs', c2)}-${Nn('payers', c2)}*${Nn('vcost', c2)}*${Nn('months', c2)}*${mult.months}`, ['rev', 'fee', 'cogs', 'vcost'], '= Revenue − комиссии с покупок − прямые затраты − переменные затраты на платящих');
  calc('gm', 'Gross Margin', '%', (c2) => `IF(${Nn('rev', c2)}=0,"",${Nn('gp', c2)}/${Nn('rev', c2)})`, ['gp'], '= GP / Revenue');
  input('team', 'Команда (роли BX-002)', 'USD', 'Требуется подтверждение');
  input('ua', 'Маркетинг и привлечение (UA)', 'USD', 'Требуется подтверждение');
  input('other', 'Прочие OPEX', 'USD', 'Требуется подтверждение');
  calc('ebitda', 'EBITDA', 'USD', (c2) => `${Nn('gp', c2)}-${Nn('team', c2)}-${Nn('ua', c2)}*${mult.ua}-${Nn('other', c2)}`, ['gp', 'team', 'ua', 'other'], '= GP − команда − UA × сценарий − прочие OPEX');
  input('da', 'Амортизация (D&A)', 'USD', 'Требуется подтверждение');
  input('tax', 'Ставка налога на прибыль', '%', 'Требуется подтверждение (режим IT Park — уточнить)');
  calc('pbt', 'Прибыль до налога', 'USD', (c2) => `${Nn('ebitda', c2)}-${Nn('da', c2)}`, ['ebitda', 'da'], '= EBITDA − D&A');
  calc('np', 'Net Profit', 'USD', (c2) => `${Nn('pbt', c2)}-MAX(0,${Nn('pbt', c2)})*${Nn('tax', c2)}`, ['pbt', 'tax'], '= прибыль до налога − налог (налог только с положительной прибыли; переносы убытков не моделируются)');
  input('wc', 'Изменение оборотного капитала', 'USD', 'Требуется подтверждение');
  calc('ocf', 'Operating Cash Flow', 'USD', (c2) => `${Nn('np', c2)}+${Nn('da', c2)}-${Nn('wc', c2)}`, ['np', 'wc'], '= NP + D&A − ΔWC');
  input('capex', 'CAPEX', 'USD', 'Требуется подтверждение');
  calc('fcf', 'Free Cash Flow', 'USD', (c2) => `${Nn('ocf', c2)}-${Nn('capex', c2)}`, ['ocf', 'capex'], '= OCF − CAPEX');
  calc('cum', 'Накопленный FCF', 'USD', (c2) => (c2 === 'C' ? Nn('fcf', c2) : `N(${String.fromCharCode(c2.charCodeAt(0) - 1)}${rows.fcf + 1})+${Nn('fcf', c2)}`), ['fcf'], 'Нарастающим итогом');
  sec('Инвестиции и окупаемость (стадии BX-008)');
  input('inv', 'Привлечённые инвестиции в году', 'USD', 'Подтверждённых инвестиций нет — требуется подтверждение');
  calc('cuminv', 'Накопленные инвестиции', 'USD', (c2) => (c2 === 'C' ? Nn('inv', c2) : `N(${String.fromCharCode(c2.charCodeAt(0) - 1)}${rows.inv + 1})+${Nn('inv', c2)}`), ['inv'], 'Нарастающим итогом');
  calc('roi', 'ROI накопленный', '%', (c2) => `IF(${Nn('cuminv', c2)}=0,"",(${Nn('cum', c2)}-${Nn('cuminv', c2)})/${Nn('cuminv', c2)})`, ['cum', 'inv'], '= (накопленный FCF − накопленные инвестиции) / накопленные инвестиции');
  calc('pb', 'Инвестиции возвращены (1 = да)', 'x', (c2) => `IF(AND(${Nn('cuminv', c2)}>0,${Nn('cum', c2)}>=${Nn('cuminv', c2)}),1,0)`, ['cum', 'inv'], 'Накопленный FCF ≥ накопленные инвестиции', '0');
  calc('pbs', 'Возврат сохраняется до конца горизонта (1 = да)', 'x', (c2) => `MIN(${c2}${rows.pb}:$G$${rows.pb})`, ['cum', 'inv'], 'Условие выполняется в этом и во всех следующих годах', '0');
  const pbRow = t.addRow(['Срок окупаемости инвестиций', 'год', { formula: `IF(COUNTIF(C${rows.pbs}:G${rows.pbs},1)=0,"",MATCH(1,C${rows.pbs}:G${rows.pbs},0))` }, null, null, null, null, 'Первый год, начиная с которого накопленный FCF не ниже накопленных инвестиций до конца горизонта; пусто — не достигнута']);
  rows.payback = pbRow.number;
  sec('Безубыточность и юнит-экономика');
  calc('be', 'Точка безубыточности по EBITDA: платящих в месяц', 'чел.', (c2) => `IF(${Nn('arppu', c2)}*${mult.arppu}*(1-${Nn('fee', c2)})-${Nn('vcost', c2)}<=0,"",MAX(0,(${Nn('cogs', c2)}+${Nn('team', c2)}+${Nn('ua', c2)}*${mult.ua}+${Nn('other', c2)}-${Nn('part', c2)})/(${Nn('months', c2)}*${mult.months}))/(${Nn('arppu', c2)}*${mult.arppu}*(1-${Nn('fee', c2)})-${Nn('vcost', c2)}))`, ['arppu', 'months', 'cogs', 'team', 'ua', 'other'], '= (постоянные затраты + UA − B2B-выручка) в месяц работы / (ARPPU × (1 − комиссия) − переменные затраты на платящего); при этом числе платящих EBITDA = 0');
  calc('cac', 'CAC на нового платящего', 'USD', (c2) => `IF(${Nn('new', c2)}*${Nn('conv', c2)}*${mult.conv}=0,"",${Nn('ua', c2)}*${mult.ua}/(${Nn('new', c2)}*${Nn('conv', c2)}*${mult.conv}))`, ['ua', 'new', 'conv'], '= UA × сценарий / (новые пользователи × Conversion) — та же база, что у LTV', '#,##0.00');
  input('life', 'Средний срок жизни платящего', 'мес.', 'Требуется подтверждение');
  calc('ltv', 'LTV платящего', 'USD', (c2) => `(${Nn('arppu', c2)}*${mult.arppu}*(1-${Nn('fee', c2)})-${Nn('vcost', c2)})*${Nn('life', c2)}*${mult.life}`, ['arppu', 'life'], '= (ARPPU × (1 − комиссия) − переменные затраты) × срок жизни (× сценарий)', '#,##0.00');
  calc('ltvcac', 'LTV / CAC', 'x', (c2) => `IF(OR(${R('cac', c2)}="",${Nn('cac', c2)}=0),"",${Nn('ltv', c2)}/${Nn('cac', c2)})`, ['ltv', 'cac'], '= LTV / CAC');
  t.columns = [{ width: 46 }, { width: 10 }, { width: 13 }, { width: 13 }, { width: 13 }, { width: 13 }, { width: 13 }, { width: 60 }];
  t.views = [{ state: 'frozen', xSplit: 2, ySplit: 4 }];

  // 6. Classification
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
