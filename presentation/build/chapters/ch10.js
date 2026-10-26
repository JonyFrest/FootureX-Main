// ГЛАВА X. BUSINESS & FINANCIAL MODEL (95–106) — illustrative, assumption-driven model (build/finmodel.js)
const { C, F, W, H, M } = require('../deck/lib');
const FM = require('../../assets/finmodel.json');

const B = FM.base, A = FM.assump;
const YRS = ['Год 1', 'Год 2', 'Год 3', 'Год 4', 'Год 5'];
const r0 = (v) => Math.round(v);
const fmtK = (v) => (v < 0 ? '−' : '') + Math.abs(Math.round(v)).toLocaleString('ru-RU').replace(/ /g, ' ');
const fmtM = (v) => (v < 0 ? '−' : '') + '$' + (Math.abs(v) / 1000).toFixed(2).replace('.', ',') + ' млн';
const SRC = 'Расчёт: иллюстративная финансовая модель FootureX (Excel-приложение), USD тыс. Все значения — допущения; не являются прогнозом руководства.';
const CALC_NOTE = 'Финансовые показатели — расчётный сценарий на основе допущений. Он заменяется утверждённой финансовой моделью компании; при расхождениях приоритет у документов компании.';

function badge(d, s) {
  d.text(s, 'ИЛЛЮСТРАТИВНЫЙ СЦЕНАРИЙ · USD тыс. · ДОПУЩЕНИЯ ТРЕБУЮТ ПОДТВЕРЖДЕНИЯ', { x: M, y: 1.68, w: 9, h: 0.26, fontSize: 9, bold: true, color: 'C98A16', charSpacing: 0.5 });
}

module.exports = async (d, pres) => {
  // 95 — Overall business model (flywheel)
  {
    const s = d.slide({
      title: 'Общая бизнес-модель FootureX Uzbekistan: маховик экосистемы', status: 'VISION',
      notes: 'ТЕЗИС: бизнес-модель — маховик: сервисная выручка финансирует продукты, продукты создают аудиторию, аудитория — бренд и спрос, бренд — клиентов и таланты.\nПорядок: (1) IT и AI-услуги → (2) продукты: игра и AI SaaS → (3) аудитория и сообщество → (4) образование и таланты → (5) спорт и бренд → (6) новые клиенты и партнёры → снова (1).\nСвязка: далее — Business Model Canvas.',
    });
    const ci = d.chapterInfo;
    d.text(s, ci.num, { x: M - 0.05, y: 1.95, w: 4.5, h: 1.45, fontSize: 88, fontFace: F.displayLatin, color: C.accent, objectName: '!!roman' });
    d.text(s, ci.ru.toUpperCase(), { x: M, y: 3.45, w: 5.8, h: 0.35, fontSize: 13, bold: true, color: 'C9D3E3', charSpacing: 2 });
    d.text(s, 'Сервисная выручка финансирует продукты; продукты создают аудиторию; аудитория усиливает бренд, который приводит клиентов, таланты и партнёров.', { x: M, y: 3.95, w: 4.9, h: 1.6, fontSize: 15, color: 'E6ECF5', lineSpacingMultiple: 1.15, objectName: 'a1_lead' });
    const nodes = [['IT и AI-услуги', 'выручка и компетенции', 'LuCodeXml'], ['Продукты', 'FootureX Game, AI SaaS', 'LuSmartphone'], ['Аудитория', 'игроки и сообщество', 'LuUsers'], ['Таланты', 'академия и студия', 'LuGraduationCap'], ['Спорт и бренд', 'футбол и киберспорт', 'LuTrophy'], ['Клиенты и партнёры', 'спрос на услуги', 'LuHandshake']];
    const cx = 9.25, cy = 4.3, rx = 2.6, ry = 1.95;
    s.addShape(pres.shapes.OVAL, { x: cx - rx, y: cy - ry, w: rx * 2, h: ry * 2, fill: { type: 'none' }, line: { color: C.accent, width: 1.25, dashType: 'dash' } });
    s.addShape(pres.shapes.OVAL, { x: cx - 0.95, y: cy - 0.55, w: 1.9, h: 1.1, fill: { color: '0F2E22' }, line: { color: C.accent, width: 1.5 } });
    d.text(s, 'FLYWHEEL', { x: cx - 0.95, y: cy - 0.2, w: 1.9, h: 0.4, fontSize: 12, fontFace: F.displayLatin, color: C.accent, align: 'center', valign: 'middle' });
    for (let i = 0; i < nodes.length; i++) {
      const [t, x2, ic] = nodes[i];
      const ang = -Math.PI / 2 + (i / nodes.length) * Math.PI * 2;
      const x = cx + Math.cos(ang) * rx, y = cy + Math.sin(ang) * ry;
      d.card(s, x - 1.15, y - 0.4, 2.3, 0.8, { name: `a${i + 2}_n` });
      s.addImage({ data: await require('../deck/lib').icon(ic, C.accent), x: x - 1.02, y: y - 0.16, w: 0.32, h: 0.32 });
      d.text(s, t, { x: x - 0.62, y: y - 0.34, w: 1.7, h: 0.34, fontSize: 11.5, bold: true, valign: 'bottom', objectName: `a${i + 2}_t` });
      d.text(s, x2, { x: x - 0.62, y: y + 0.02, w: 1.72, h: 0.3, fontSize: 9, color: '8D99AE', objectName: `a${i + 2}_d` });
    }
  }

  // 96 — Business Model Canvas
  {
    const s = d.slide({
      dark: false, title: 'Business Model Canvas', status: 'FRAME',
      notes: 'ТЕЗИС: канва показывает, что экосистема держится на общих ресурсах — технологиях, людях и бренде — и обслуживает несколько клиентских сегментов.\nСтатус: проектная канва для обсуждения с руководством.\nСвязка: далее — источники доходов по направлениям.',
    });
    const blocks = [
      ['Ключевые партнёры', 'IT Park и программы поддержки*\nПлатёжные провайдеры\nTelegram-платформа\nВузы и работодатели\nСпортивные организации*', 0, 0, 1, 2],
      ['Ключевые активности', 'Разработка ПО и AI\nGame development и LiveOps\nОбучение\nТурниры и медиа', 1, 0, 1, 1],
      ['Ключевые ресурсы', 'Инженерная команда\nТехнологическая платформа\nБренд FootureX\nСообщество игроков', 1, 1, 1, 1],
      ['Ценностные предложения', 'Бизнесу: автоматизация и AI с результатом\nИгрокам: футбол в Telegram\nСтудентам: профессия через практику\nПартнёрам: молодая цифровая аудитория', 2, 0, 1, 2],
      ['Отношения с клиентами', 'Аккаунт-менеджмент и SLA\nСообщество и LiveOps\nНаставничество', 3, 0, 1, 1],
      ['Каналы', 'Прямые продажи B2B\nTelegram и медиа\nПартнёрские сети', 3, 1, 1, 1],
      ['Клиентские сегменты', 'МСБ и корпорации\nИгроки и болельщики\nСтуденты и семьи\nСпонсоры и бренды', 4, 0, 1, 2],
      ['Структура затрат', 'Команда (разработка, R&D, админ.) · привлечение игроков · облако и инфраструктура · CAPEX: оборудование, студии, учебные пространства', 0, 2, 2.5, 1],
      ['Потоки доходов', 'IT-проекты и SLA · AI-проекты и SaaS · покупки в игре и реклама · обучение · спонсорство и события', 2.5, 2, 2.5, 1],
    ];
    const gx = M, gy = 1.95, cw = (W - 2 * M) / 5, rh = 1.5;
    blocks.forEach(([t, body, c, r, w, h], i) => {
      const x = gx + c * cw, y = gy + r * rh, ww = w * cw - 0.08, hh = h * rh - 0.08;
      d.card(s, x, y, ww, hh, { name: `a${i + 1}_b`, fill: i === 3 ? 'E3F8EE' : 'FFFFFF', line: i === 3 ? '9FE3C2' : C.lightLine });
      const two = t.length > 20 && w === 1;
      d.text(s, t, { x: x + 0.14, y: y + 0.08, w: ww - 0.28, h: two ? 0.42 : 0.26, fontSize: 10.5, bold: true, color: '0B6B45' });
      d.text(s, body, { x: x + 0.14, y: y + (two ? 0.55 : 0.38), w: ww - 0.28, h: hh - (two ? 0.6 : 0.43), fontSize: 9.5, color: '2A3343', lineSpacingMultiple: 1.12, noFit: true });
    });
    d.text(s, '* Целевые партнёрства; соглашения отсутствуют, требуют подтверждения.', { x: M, y: 6.48, w: 10, h: 0.26, fontSize: 9.5, color: '6B7486' });
  }

  // 97 — Revenue streams by direction
  {
    const s = d.slide({
      dark: false, title: 'Источники доходов по направлениям', status: 'CALC', source: SRC,
      notes: 'ТЕЗИС: структура выручки диверсифицируется — от доминирования IT-услуг в Годы 1–2 к сбалансированному портфелю к Году 5.\nДанные модели (базовый сценарий, USD тыс.): выручка ' + B.revenue.map(r0).join(' → ') + '.\nВажно: выручка игры — только реальные денежные платежи и реклама; внутриигровая валюта не учитывается. FC FootureX, стадион и City в модели отсутствуют.\n' + CALC_NOTE + '\nСвязка: далее — экономика IT-услуг.',
    });
    badge(d, s);
    const ser = [['IT-услуги', B.rev_it], ['AI (проекты + SaaS)', B.rev_ai_proj.map((v, i) => v + B.rev_saas[i])], ['Игра (покупки + реклама)', B.rev_game_iap.map((v, i) => v + B.rev_game_ad[i])], ['Заказная разработка игр', B.rev_gamedev], ['Академия', B.rev_academy], ['Esports и Football Academy', B.rev_esports.map((v, i) => v + B.rev_football[i])]];
    d.chart(s, pres.charts.BAR, ser.map(([n, v]) => ({ name: n, labels: YRS, values: v.map(r0) })), { x: M, y: 2.05, w: 8.0, h: 4.45, showValue: false, legend: true, colors: [C.accent, C.accent2, '0E9F64', C.steel, C.warn, '7A8699'], extra: { barGrouping: 'stacked', barGapWidthPct: 55 } });
    d.insight(s, 8.85, 2.05, 3.88, 4.45, 'Структура Года 5', [
      `IT-услуги: ${Math.round(B.rev_it[4] / B.revenue[4] * 100)}%`,
      `Игра: ${Math.round((B.rev_game_iap[4] + B.rev_game_ad[4]) / B.revenue[4] * 100)}%`,
      `AI: ${Math.round((B.rev_ai_proj[4] + B.rev_saas[4]) / B.revenue[4] * 100)}%`,
      `Академия: ${Math.round(B.rev_academy[4] / B.revenue[4] * 100)}%`,
      'FX Coins не являются выручкой',
      'Стадион и City — вне модели',
    ], { fontSize: 12 });
  }

  // 98 — IT economics
  {
    const s = d.slide({
      dark: false, title: 'Экономика IT-услуг', status: 'CALC', source: SRC,
      notes: 'ТЕЗИС: IT-услуги — предсказуемый бизнес с маржой выше 50%, который финансирует продуктовые направления.\nДрайверы модели: FTE 8 → 55; загрузка 70% → 80%; ставка $22 → $30/ч; полная стоимость FTE $14 → $19,5 тыс./год.\nЧувствительность: каждые −5 п.п. загрузки снижают валовую маржу примерно на 4 п.п.\n' + CALC_NOTE + '\nСвязка: далее — экономика AI-продуктов.',
    });
    badge(d, s);
    const gm = B.rev_it.map((v, i) => v - A.it_fte[i] * A.it_cost[i]);
    d.chart(s, pres.charts.BAR, [{ name: 'Выручка', labels: YRS, values: B.rev_it.map(r0) }, { name: 'Валовая прибыль', labels: YRS, values: gm.map(r0) }], { x: M, y: 2.05, w: 7.4, h: 4.45, labelPos: 'outEnd', extra: { barGapWidthPct: 60 } });
    d.table(s, [
      ['Драйвер', 'Год 1', 'Год 3', 'Год 5'],
      ['Оплачиваемые FTE', '8', '28', '55'],
      ['Загрузка', '70%', '78%', '80%'],
      ['Ставка, $/ч', '22', '26', '30'],
      ['Себестоимость часа, $', String(Math.round(A.it_cost[0] * 1000 / (1760 * 0.7))), String(Math.round(A.it_cost[2] * 1000 / (1760 * 0.78))), String(Math.round(A.it_cost[4] * 1000 / (1760 * 0.8)))],
      ['Валовая маржа', Math.round(gm[0] / B.rev_it[0] * 100) + '%', Math.round(gm[2] / B.rev_it[2] * 100) + '%', Math.round(gm[4] / B.rev_it[4] * 100) + '%'],
    ], { x: 8.25, y: 2.05, w: 4.48, colW: [1.9, 0.86, 0.86, 0.86], rowH: 0.55, size: 11.5, boldFirstCol: true });
  }

  // 99 — AI economics
  {
    const s = d.slide({
      dark: false, title: 'Экономика AI-продуктов: проекты сегодня, подписка завтра', status: 'CALC', source: SRC,
      notes: 'ТЕЗИС: AI-проекты дают раннюю выручку, SaaS — масштабируемую повторяющуюся выручку с высокой маржой.\nДопущения: проекты 4 → 18 в год, средний чек $15 → $35 тыс.; SaaS-клиенты 10 → 400, ARPA $120 → $200/мес; отток 3% → 2% в месяц; CAC $700 → $1 000.\nЮнит-экономика Года 3: LTV ≈ $4 608; LTV/CAC ≈ 5,1; окупаемость CAC ≈ 7,8 мес.\n' + CALC_NOTE + '\nСвязка: далее — экономика Game Development.',
    });
    badge(d, s);
    d.chart(s, pres.charts.BAR, [{ name: 'AI-проекты', labels: YRS, values: B.rev_ai_proj.map(r0) }, { name: 'AI SaaS', labels: YRS, values: B.rev_saas.map(r0) }], { x: M, y: 2.05, w: 7.4, h: 4.45, showValue: false, colors: [C.accent2, C.accent], extra: { barGrouping: 'stacked', barGapWidthPct: 55 } });
    d.card(s, 8.25, 2.05, 4.48, 4.45, { name: 'a2_ue' });
    d.text(s, 'Юнит-экономика SaaS · Год 3', { x: 8.48, y: 2.22, w: 4, h: 0.3, fontSize: 12.5, bold: true, color: '0B6B45' });
    [['ARPA', '$160 / мес'], ['Валовая маржа', '72%'], ['Отток', '2,5% / мес'], ['LTV', '≈ $4 608'], ['CAC', '$900'], ['LTV / CAC', '≈ 5,1×'], ['Окупаемость CAC', '≈ 7,8 мес']].forEach(([k, v], i) => {
      const y = 2.68 + i * 0.52;
      d.text(s, k, { x: 8.48, y, w: 2.1, h: 0.45, fontSize: 12, color: '4A5466', valign: 'middle' });
      d.text(s, v, { x: 10.5, y, w: 2.0, h: 0.45, fontSize: 15, bold: true, color: i === 5 ? '0E9F64' : C.lightText, align: 'right', valign: 'middle' });
    });
  }

  // 100 — Game development economics
  {
    const s = d.slide({
      dark: false, title: 'Экономика Game Development: реальная выручка', status: 'CALC', source: SRC,
      notes: 'ТЕЗИС: игра монетизируется покупками и рекламой; экономика держится на соотношении LTV и стоимости привлечения игрока.\nДопущения: средний MAU 40 тыс. → 900 тыс.; доля платящих 1,5% → 3%; ARPPU $6 → $9 в месяц; реклама $0,03 на MAU в месяц; комиссии платформ и платёжных провайдеров 30% покупок; UA $60 → $850 тыс. в год.\nЮнит-экономика Года 3: чистая выручка на MAU ≈ $0,17/мес; LTV ≈ $1,29 (8 мес. жизни); CAC ≈ $0,64 → LTV/CAC ≈ 2,0.\nFX Coins и любые внутриигровые валюты не являются выручкой.\n' + CALC_NOTE + '\nСвязка: далее — футбол и киберспорт.',
    });
    badge(d, s);
    d.chart(s, pres.charts.BAR, [{ name: 'Покупки в игре (реальные платежи)', labels: YRS, values: B.rev_game_iap.map(r0) }, { name: 'Реклама', labels: YRS, values: B.rev_game_ad.map(r0) }, { name: 'Заказная разработка', labels: YRS, values: B.rev_gamedev.map(r0) }], { x: M, y: 2.05, w: 7.4, h: 4.45, showValue: false, colors: [C.accent, C.accent2, C.steel], extra: { barGrouping: 'stacked', barGapWidthPct: 55 } });
    d.card(s, 8.25, 2.05, 4.48, 4.45, { name: 'a2_ue' });
    d.text(s, 'Юнит-экономика игрока · Год 3', { x: 8.48, y: 2.22, w: 4, h: 0.3, fontSize: 12.5, bold: true, color: '0B6B45' });
    [['Средний MAU', '350 тыс.'], ['Доля платящих', '2,5%'], ['ARPPU', '$8 / мес'], ['Чистая выручка на MAU', '≈ $0,17 / мес'], ['LTV игрока', '≈ $1,29'], ['CAC игрока', '≈ $0,64'], ['LTV / CAC', '≈ 2,0×']].forEach(([k, v], i) => {
      const y = 2.68 + i * 0.52;
      d.text(s, k, { x: 8.48, y, w: 2.3, h: 0.45, fontSize: 12, color: '4A5466', valign: 'middle' });
      d.text(s, v, { x: 10.6, y, w: 1.9, h: 0.45, fontSize: 15, bold: true, color: i === 6 ? '0E9F64' : C.lightText, align: 'right', valign: 'middle' });
    });
  }

  // 101 — Football & esports economics
  {
    const s = d.slide({
      dark: false, title: 'Экономика футбольного и киберспортивного направлений', status: 'CALC', source: SRC,
      notes: 'ТЕЗИС: в пятилетнем горизонте футбол и киберспорт — инвестиции в бренд и аудиторию, а не источник прибыли; профессиональный клуб и стадион требуют отдельного финансирования.\nВ модели: esports — положительная валовая прибыль; Football Academy (пилот с Года 4) — операционный убыток ≈ $170–190 тыс. в год, CAPEX $500 тыс.\nВне модели: FC FootureX (зарплаты, лицензирование, инфраструктура) — требуется отдельный бизнес-план; потенциальный доход академии от компенсаций за подготовку и механизма солидарности ФИФА не учитывается (консервативно).\n' + CALC_NOTE + '\nСвязка: далее — CAPEX и OPEX.',
    });
    badge(d, s);
    const esG = B.rev_esports.map((v, i) => v * (1 - A.es_cogs[i]));
    const faN = B.rev_football.map((v, i) => v - A.fa_cost[i]);
    d.table(s, [
      ['USD тыс.', ...YRS],
      ['Esports: выручка', ...B.rev_esports.map(fmtK)],
      ['Esports: валовая прибыль', ...esG.map(fmtK)],
      ['Football Academy: выручка', ...B.rev_football.map(fmtK)],
      ['Football Academy: затраты', ...A.fa_cost.map((v) => fmtK(-v))],
      [{ text: 'Football Academy: результат', bold: true }, ...faN.map((v) => ({ text: fmtK(v), bold: true, color: v < 0 ? 'C0392B' : v > 0 ? '0E9F64' : '2A3343' }))],
      ['Football Academy: CAPEX', ...A.cx_fa.map(fmtK)],
    ], { x: M, y: 2.05, w: 7.6, colW: [2.6, 1, 1, 1, 1, 1], rowH: 0.56, size: 11.5, align: 'right' });
    d.insight(s, 8.45, 2.05, 4.28, 4.45, 'Вне пятилетней модели', ['FC FootureX — отдельный бизнес-план и финансирование', 'Стадион и City — проектное финансирование по итогам ТЭО', 'Доход от компенсаций ФИФА — не учитывается (консервативно)', 'Призовые и спонсорство — по фактическим договорам'], { fontSize: 12 });
  }

  // 102 — CAPEX & OPEX
  {
    const s = d.slide({
      dark: false, title: 'Структура капитальных и операционных затрат', status: 'CALC', source: SRC,
      notes: 'ТЕЗИС: модель капиталоэффективна — основная часть затрат операционные (команда и привлечение игроков), CAPEX ограничен оборудованием и оснащением арендуемых пространств.\nCAPEX за 5 лет (база): ' + fmtK(B.capex.reduce((a, b) => a + b, 0)) + ' тыс.; OPEX растёт с ' + fmtK(B.opex[0]) + ' до ' + fmtK(B.opex[4]) + ' тыс. в год.\nСтадион и City в CAPEX не включены.\n' + CALC_NOTE + '\nСвязка: далее — финансовая модель на 5 лет.',
    });
    badge(d, s);
    d.chart(s, pres.charts.BAR, [['IT-инфраструктура и офис', A.cx_it], ['Esports-студия', A.cx_es], ['Учебные пространства', A.cx_ac], ['Оснащение арендуемой базы Football Academy', A.cx_fa]].map(([n, v]) => ({ name: n, labels: YRS, values: v })), { x: M, y: 2.05, w: 5.9, h: 4.45, title: 'CAPEX, USD тыс.', showValue: false, colors: [C.accent2, C.accent, C.steel, C.warn], extra: { barGrouping: 'stacked', barGapWidthPct: 55 } });
    d.chart(s, pres.charts.BAR, [['Управление', A.ox_admin], ['R&D продуктов', A.ox_rnd], ['Привлечение игроков (UA)', A.g_ua], ['Маркетинг и продажи', A.ox_mkt], ['Офис, юридические и прочие', A.ox_office.map((v, i) => v + A.ox_legal[i])]].map(([n, v]) => ({ name: n, labels: YRS, values: v })), { x: 6.83, y: 2.05, w: 5.9, h: 4.45, title: 'OPEX, USD тыс.', showValue: false, colors: [C.steel, C.accent, '0E9F64', C.accent2, '7A8699'], name: 'a2_chart', extra: { barGrouping: 'stacked', barGapWidthPct: 55 } });
  }

  // 103 — 5-year financial model (P&L)
  {
    const s = d.slide({
      dark: false, title: 'Финансовая модель на 5 лет', status: 'CALC', source: SRC,
      notes: 'ТЕЗИС: в базовом сценарии EBITDA становится положительной в Году 3, чистая прибыль — в Году 4, свободный денежный поток — в Году 5.\nКлючевые допущения: см. лист «Допущения» в Excel-модели; налог на прибыль 15% без льгот IT Park; амортизация 4 года; оборотный капитал 8% прироста выручки.\n' + CALC_NOTE + '\nСвязка: далее — динамика выручки, EBITDA и денежных потоков.',
    });
    badge(d, s);
    const gmP = B.gross.map((g, i) => Math.round(g / B.revenue[i] * 100) + '%');
    const row = (label, arr, o = {}) => [{ text: label, bold: !!o.bold }, ...arr.map((v) => ({ text: o.pct ? v : fmtK(v), bold: !!o.bold, color: !o.pct && v < 0 ? 'C0392B' : undefined, align: 'right' }))];
    d.table(s, [
      ['USD тыс.', ...YRS],
      row('Выручка', B.revenue, { bold: true }),
      row('Себестоимость', B.cogs.map((v) => -v)),
      row('Валовая прибыль', B.gross, { bold: true }),
      row('Валовая маржа', gmP, { pct: true }),
      row('OPEX (включая UA)', B.opex.map((v) => -v)),
      row('EBITDA', B.ebitda, { bold: true }),
      row('Амортизация', B.da.map((v) => -v)),
      row('Налог на прибыль', B.tax.map((v) => -v)),
      row('Чистая прибыль', B.net, { bold: true }),
      row('Операционный денежный поток', B.ocf),
      row('CAPEX', B.capex.map((v) => -v)),
      row('Свободный денежный поток (FCF)', B.fcf, { bold: true }),
    ], { y: 2.05, colW: [3.93, 1.64, 1.64, 1.64, 1.64, 1.64], rowH: 0.34, size: 11, hSize: 11 });
  }

  // 104 — Revenue, EBITDA, cash flows
  {
    const s = d.slide({
      dark: false, title: 'Прогноз выручки, EBITDA и денежных потоков', status: 'CALC', source: SRC,
      notes: 'ТЕЗИС: рост выручки в ≈25 раз за 5 лет сопровождается переходом EBITDA и FCF в положительную зону; пик потребности в финансировании — Год 4.\nДанные (база): выручка ' + B.revenue.map(r0).join(' / ') + '; EBITDA ' + B.ebitda.map(r0).join(' / ') + '; FCF ' + B.fcf.map(r0).join(' / ') + '; накопленный FCF ' + B.cumfcf.map(r0).join(' / ') + ' (USD тыс.).\n' + CALC_NOTE + '\nСвязка: далее — сценарный анализ.',
    });
    badge(d, s);
    d.chart(s, pres.charts.BAR, [{ name: 'Выручка', labels: YRS, values: B.revenue.map(r0) }, { name: 'EBITDA', labels: YRS, values: B.ebitda.map(r0) }, { name: 'FCF', labels: YRS, values: B.fcf.map(r0) }], { x: M, y: 2.05, w: 7.3, h: 4.45, title: 'USD тыс., базовый сценарий', showValue: false, minVal: -2000, majorUnit: 2000, colors: [C.accent, C.accent2, C.warn], extra: { barGapWidthPct: 50 } });
    d.chart(s, pres.charts.LINE, [{ name: 'Накопленный FCF', labels: YRS, values: B.cumfcf.map(r0) }], { x: 8.1, y: 2.05, w: 4.63, h: 4.45, title: 'Накопленный FCF, USD тыс.', minVal: -2000, showValue: false, majorUnit: 500, colors: [C.warn], name: 'a2_chart', extra: { lineSize: 2.5, lineDataSymbol: 'circle', lineDataSymbolSize: 7 } });
  }

  // 105 — Scenarios & break-even
  {
    const s = d.slide({
      dark: false, title: 'Сценарный анализ и точка безубыточности', status: 'CALC', source: SRC + ' Сценарии: 70% / 100% / 130% объёмных драйверов.',
      notes: 'ТЕЗИС: даже в пессимистичном сценарии EBITDA становится положительной к Году 5; от сценария зависит прежде всего объём необходимого капитала.\nСценарии: пессимистичный — 70% объёмных драйверов (FTE, MAU, клиенты, слушатели), UA −15%; оптимистичный — 130%, UA +15%. Цены, ставки и фиксированные OPEX не меняются.\nБезубыточность по EBITDA: база — Год 3; оптимистичный — Год 3; пессимистичный — Год 5. Окупаемость по накопленному FCF: оптимистичный — Год 5; база — за пределами 5 лет (≈ Год 6 при сохранении FCF Года 5); пессимистичный — за пределами горизонта.\n' + CALC_NOTE + '\nСвязка: далее — инвестиционная стратегия.',
    });
    badge(d, s);
    const P = FM.pess, O = FM.opt;
    d.chart(s, pres.charts.LINE, [{ name: 'Пессимистичный', labels: YRS, values: P.cumfcf.map(r0) }, { name: 'Базовый', labels: YRS, values: B.cumfcf.map(r0) }, { name: 'Оптимистичный', labels: YRS, values: O.cumfcf.map(r0) }], { x: M, y: 2.05, w: 6.0, h: 4.45, title: 'Накопленный FCF по сценариям, USD тыс.', showValue: false, minVal: -4000, colors: ['C0392B', C.accent2, C.accent], extra: { lineSize: 2.25, lineDataSymbol: 'circle', lineDataSymbolSize: 6 } });
    const be = (o) => (o.beEbitda ? 'Год ' + o.beEbitda : '> 5 лет');
    const pb = (o, k) => (o.payback ? 'Год ' + o.payback : k === 'base' ? '≈ Год 6*' : '> 5 лет');
    d.table(s, [
      ['Показатель', 'Песс.', 'База', 'Опт.'],
      ['Выручка, Год 5', fmtK(P.revenue[4]), fmtK(B.revenue[4]), fmtK(O.revenue[4])],
      ['EBITDA, Год 5', fmtK(P.ebitda[4]), fmtK(B.ebitda[4]), fmtK(O.ebitda[4])],
      ['Чистая прибыль, Год 5', fmtK(P.net[4]), fmtK(B.net[4]), fmtK(O.net[4])],
      ['EBITDA > 0', be(P), be(B), be(O)],
      ['Окупаемость (FCF)', pb(P), pb(B, 'base'), pb(O)],
      ['Капитал с резервом 25%', fmtK(P.funding), fmtK(B.funding), fmtK(O.funding)],
    ], { x: 6.85, y: 2.05, w: 5.88, colW: [2.28, 1.2, 1.2, 1.2], rowH: 0.52, size: 11.5, align: 'right', boldFirstCol: true });
    d.text(s, '* Экстраполяция при сохранении FCF Года 5; за пределами горизонта модели.', { x: 6.85, y: 5.85, w: 5.88, h: 0.3, fontSize: 9.5, color: '6B7486' });
  }

  // 106 — Investment strategy & capital need
  {
    const s = d.slide({
      dark: false, title: 'Инвестиционная стратегия и потребность в капитале', status: 'CALC', source: SRC,
      notes: 'ТЕЗИС: для выхода цифровых направлений на самоокупаемость в базовом сценарии требуется ≈ $2,2 млн (пиковая потребность ≈ $1,74 млн + резерв 25%), привлекаемых в два этапа.\nПредлагаемая структура (для решения участников): посевной этап ≈ $0,8 млн (Год 1) и раунд роста ≈ $1,4 млн (Годы 2–3). Диапазон по сценариям: $1,4–4,3 млн.\nДоходность: денежный ROI за 5 лет (накопленный FCF / капитал) — база −31%, оптимистичный +122%, пессимистичный −79%; EBITDA Года 5 / капитал (база) ≈ 89%.\nВАЖНО: ни одна сумма не является привлечённым финансированием. Инвестиции в FC FootureX, стадион и City — отдельные проекты с собственными источниками.\nСвязка: глава XI — управление и исполнение.',
    });
    badge(d, s);
    d.stats(s, [
      { value: fmtM(B.funding), label: 'потребность в капитале, базовый сценарий (с резервом 25%)' },
      { value: '$1,4–4,3 млн', label: 'диапазон по сценариям: оптимистичный — пессимистичный' },
      { value: 'Год 3', label: 'EBITDA > 0 в базовом сценарии' },
    ], { y: 2.05, h: 1.55, valueSize: 24, labelSize: 11.5 });
    d.card(s, M, 3.85, 5.9, 2.6, { name: 'a4_r' });
    d.text(s, 'Предлагаемая структура раундов', { x: M + 0.25, y: 4.0, w: 5.4, h: 0.3, fontSize: 13, bold: true, color: '0B6B45' });
    d.table(s, [
      ['Этап', 'Сумма', 'Назначение'],
      ['Посевной · Год 1', '≈ $0,8 млн', 'Команда, запуск игры, первые клиенты'],
      ['Раунд роста · Годы 2–3', '≈ $1,4 млн', 'UA, AI SaaS, академия, регион'],
    ], { x: M + 0.25, y: 4.42, w: 5.4, colW: [1.85, 1.15, 2.4], rowH: 0.5, size: 10.5 });
    d.card(s, 6.83, 3.85, 5.9, 2.6, { name: 'a5_r' });
    d.text(s, 'Доходность для инвестора (база)', { x: 7.08, y: 4.0, w: 5.4, h: 0.3, fontSize: 13, bold: true, color: '0B6B45' });
    [['Денежный ROI за 5 лет', Math.round(B.cumfcf[4] / B.funding * 100) + '%'], ['EBITDA Года 5 / капитал', '≈ ' + Math.round(B.ebitda[4] / B.funding * 100) + '%'], ['Окупаемость', '≈ Год 6']].forEach(([k, v], i) => {
      const y = 4.45 + i * 0.52;
      d.text(s, k, { x: 7.08, y, w: 3.3, h: 0.45, fontSize: 12, color: '4A5466', valign: 'middle' });
      d.text(s, v.replace('-', '−'), { x: 10.3, y, w: 2.2, h: 0.45, fontSize: 16, bold: true, align: 'right', valign: 'middle' });
    });
    d.text(s, 'Не является привлечённым финансированием', { x: 7.08, y: 6.02, w: 5.4, h: 0.3, fontSize: 10, bold: true, color: 'C98A16' });
  }
};
