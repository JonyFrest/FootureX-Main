// ГЛАВА X. BUSINESS & FINANCIAL MODEL (95–106)
// Документальная основа: BX-001, BX-008, BX-013 (каталог цен). Выручка, пользователи, инвестиции и окупаемость
// в документах не заданы — показаны структура, формулы и статус «Требуется подтверждение» (правила 12–13 ТЗ).
const { C, F, W, H, M, icon } = require('../deck/lib');
const FM = require('../../assets/finmodel.json');

const S13 = 'Источник: BX-013 Approved Services Catalog, v1.0 (июнь 2026); расчёты — арифметика по ценам каталога (Excel-приложение).';
const S8 = 'Источник: BX-008 Investment & Partnership Strategy, v0.4.92.';
const TBC = 'Требуется подтверждение';
const usd = (v, d = 2) => '$' + v.toFixed(d).replace('.', ',');

function tag(d, s, t, col) {
  d.text(s, t, { x: M, y: 1.68, w: 11, h: 0.26, fontSize: 9, bold: true, color: col || C.dot, charSpacing: 0.5 });
}

module.exports = async (d, pres) => {
  // 95 — Overall business model (flywheel)
  {
    const s = d.slide({
      title: 'Общая бизнес-модель FootureX Uzbekistan: маховик экосистемы', status: 'CONCEPT',
      notes: 'ТЕЗИС: бизнес-модель — маховик: сервисная выручка финансирует продукты, продукты создают аудиторию, аудитория — бренд и спрос, бренд — клиентов и таланты.\nПорядок: (1) IT и AI-услуги → (2) продукты: игра и AI SaaS → (3) аудитория и сообщество → (4) образование и таланты → (5) спорт и бренд → (6) новые клиенты и партнёры → снова (1).\nСвязка: далее — Business Model Canvas.',
    });
    const ci = d.chapterInfo;
    d.text(s, ci.num, { x: M - 0.05, y: 1.95, w: 4.5, h: 1.45, fontSize: 88, fontFace: F.displayLatin, color: C.accent, objectName: '!!roman' });
    d.text(s, ci.ru.toUpperCase(), { x: M, y: 3.45, w: 5.8, h: 0.35, fontSize: 13, bold: true, color: 'B8C1D4', charSpacing: 2 });
    d.text(s, 'Сервисная выручка финансирует продукты; продукты создают аудиторию; аудитория усиливает бренд, который приводит клиентов, таланты и партнёров.', { x: M, y: 3.95, w: 4.9, h: 1.6, fontSize: 15, color: 'E6ECF5', lineSpacingMultiple: 1.15, objectName: 'a1_lead' });
    const nodes = [['IT и AI-услуги', 'выручка и компетенции', 'LuCodeXml'], ['Продукты', 'FootureX Game, AI SaaS', 'LuSmartphone'], ['Аудитория', 'игроки и сообщество', 'LuUsers'], ['Таланты', 'академия и студия', 'LuGraduationCap'], ['Спорт и бренд', 'футбол и киберспорт', 'LuTrophy'], ['Клиенты и партнёры', 'спрос на услуги', 'LuHandshake']];
    const cx = 9.25, cy = 4.3, rx = 2.6, ry = 1.95;
    s.addShape(pres.shapes.OVAL, { x: cx - rx, y: cy - ry, w: rx * 2, h: ry * 2, fill: { type: 'none' }, line: { color: C.accent, width: 1.25, dashType: 'dash' } });
    s.addShape(pres.shapes.OVAL, { x: cx - 0.95, y: cy - 0.55, w: 1.9, h: 1.1, fill: { color: '142A70' }, line: { color: C.accent, width: 1.5 } });
    d.text(s, 'FLYWHEEL', { x: cx - 0.95, y: cy - 0.2, w: 1.9, h: 0.4, fontSize: 12, fontFace: F.displayLatin, color: C.accent, align: 'center', valign: 'middle' });
    for (let i = 0; i < nodes.length; i++) {
      const [t, x2, ic] = nodes[i];
      const ang = -Math.PI / 2 + (i / nodes.length) * Math.PI * 2;
      const x = cx + Math.cos(ang) * rx, y = cy + Math.sin(ang) * ry;
      d.card(s, x - 1.15, y - 0.4, 2.3, 0.8, { name: `a${i + 2}_n` });
      s.addImage({ data: await icon(ic, C.accent), x: x - 1.02, y: y - 0.16, w: 0.32, h: 0.32 });
      d.text(s, t, { x: x - 0.62, y: y - 0.34, w: 1.7, h: 0.34, fontSize: 11.5, bold: true, valign: 'bottom', objectName: `a${i + 2}_t` });
      d.text(s, x2, { x: x - 0.62, y: y + 0.02, w: 1.72, h: 0.3, fontSize: 9, color: '8A93A6', objectName: `a${i + 2}_d` });
    }
  }

  // 96 — Business Model Canvas
  {
    const s = d.slide({
      title: 'Business Model Canvas', status: 'FRAME',
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
      ['Потоки доходов', 'Game (BX-001/BX-013): Battle Pass, пакеты FTXcoin, косметика, турниры, партнёрства · IT и AI: проекты, SLA, подписка · обучение · спонсорство', 2.5, 2, 2.5, 1],
    ];
    const gx = M, gy = 1.95, cw = (W - 2 * M) / 5, rh = 1.5;
    blocks.forEach(([t, body, c, r, w, h], i) => {
      const x = gx + c * cw, y = gy + r * rh, ww = w * cw - 0.08, hh = h * rh - 0.08;
      d.card(s, x, y, ww, hh, { name: `a${i + 1}_b`, fill: i === 3 ? C.outline : C.surface, line: i === 3 ? C.accent2 : C.line });
      const two = t.length > 20 && w === 1;
      d.text(s, t, { x: x + 0.14, y: y + 0.08, w: ww - 0.28, h: two ? 0.42 : 0.26, fontSize: 10.5, bold: true, color: '2593FA' });
      d.text(s, body, { x: x + 0.14, y: y + (two ? 0.55 : 0.38), w: ww - 0.28, h: hh - (two ? 0.6 : 0.43), fontSize: 9.5, color: 'D3D9E5', lineSpacingMultiple: 1.12, noFit: true });
    });
    d.text(s, '* Целевые партнёрства; соглашения отсутствуют, требуют подтверждения.', { x: M, y: 6.48, w: 10, h: 0.26, fontSize: 9.5, color: '8A93A6' });
  }

  // 97 — Revenue streams by direction
  {
    const s = d.slide({
      title: 'Источники доходов по направлениям', status: 'NODATA',
      source: 'Источники: BX-001 (монетизация игры), BX-013 (каталог), корпоративная концепция FootureX Uzbekistan (прочие направления).',
      notes: 'ТЕЗИС: документировано только устройство монетизации игрового направления; объёмы выручки не заданы ни по одному направлению.\nBX-001: Battle Pass, косметика, игровые наборы, премиум-функции, турнирные билеты, брендовые партнёрства, рекламные интеграции; дополнительно — киберспорт, спонсорство, цифровой мерч, токенизированная экосистема.\nПравило ТЗ: игровые финансовые показатели не переносятся на всю компанию; доходы маркетплейса, клуба, стадиона и недвижимости не считаются подтверждёнными.\nСвязка: далее — экономика по направлениям.',
    });
    tag(d, s, 'ВЫРУЧКА ПО НАПРАВЛЕНИЯМ НЕ ЗАДАНА В ДОКУМЕНТАХ · ПОКАЗАНА МОДЕЛЬ ДОХОДА И ЕЁ ОСНОВА');
    d.table(s, [
      ['Направление', 'Модель дохода', 'Основа', 'Объём'],
      ['FootureX Game', 'Premium Pass · пакеты FTXcoin · косметика · турниры · партнёрства · реклама', 'BX-001, BX-013', TBC],
      ['Community & Esports', 'Спонсорство · турнирные билеты · медиа · цифровой мерч', 'BX-001 (доп. источники)', TBC],
      ['Technologies · AI', 'Проекты разработки · SLA-поддержка · внедрения AI · подписка', 'Корпоративная концепция', TBC],
      ['Game Dev Academy', 'Платные программы · корпоративное обучение · партнёрства с работодателями', 'Корпоративная концепция', TBC],
      ['FC FootureX · Football Academy', 'Спонсорство · билеты · обучение · трансферы', 'Концепция; не подтверждено', TBC],
      ['Stadium · City', 'Аренда, события, недвижимость — долгосрочные амбиции', 'Концепция; не подтверждено', TBC],
    ], { x: M, y: 2.05, w: W - 2 * M, colW: [2.75, 5.0, 2.45, 1.93], rowH: 0.56, size: 11, hSize: 10.5, boldFirstCol: true });
    d.text(s, [{ text: 'Revenue ≠ Sink ≠ оборот P2P. ', options: { bold: true, color: C.accent } }, { text: 'Выручка FootureX Game — только реальные платежи через Telegram Stars / TON (BX-013).' }], { x: M, y: 6.05, w: 11, h: 0.32, fontSize: 11.5, color: 'D3D9E5' });
  }

  // 98 — IT economics
  {
    const s = d.slide({
      title: 'Экономика IT-услуг', status: 'NODATA', source: 'Корпоративная концепция FootureX Uzbekistan. Документы BX не описывают направление Technologies.',
      notes: 'ТЕЗИС: экономика IT-услуг определяется загрузкой специалистов, ставкой и себестоимостью часа; эти значения компания не предоставила.\nПредыдущая версия содержала иллюстративные ставки и численность — они удалены как не подтверждённые документами.\nЧто нужно от руководства: портфель договоров, ставки, численность, загрузка, фонд оплаты труда.\nСвязка: далее — AI.',
    });
    tag(d, s, 'СТРУКТУРА ЭКОНОМИКИ · ЗНАЧЕНИЯ ТРЕБУЮТ ПОДТВЕРЖДЕНИЯ');
    d.steps(s, [
      { title: 'Специалисты', text: 'Численность оплачиваемых специалистов (FTE)' },
      { title: 'Загрузка', text: 'Доля оплачиваемых часов' },
      { title: 'Ставка', text: 'Цена часа или фиксированная цена проекта' },
      { title: 'Выручка', text: 'FTE × часы × загрузка × ставка + SLA' },
      { title: 'Маржа', text: 'Выручка − ФОТ − субподряд − инфраструктура' },
    ], { y: 2.2, textH: 0.95 });
    d.table(s, [
      ['Драйвер', 'Значение', 'Источник данных'],
      ['FTE, загрузка, ставка', TBC, 'Штатное расписание, договоры'],
      ['Портфель и pipeline договоров', TBC, 'CRM, подписанные договоры'],
      ['Фонд оплаты труда', TBC, 'Бухгалтерия'],
    ], { x: M, y: 4.75, w: 8.2, colW: [3.2, 2.2, 2.8], rowH: 0.4, size: 11, hSize: 10.5, boldFirstCol: true });
    d.insight(s, 9.0, 4.75, 3.73, 1.75, 'Логика модели', ['Сервисная выручка — источник денежного потока', 'Без подтверждённых договоров выручка не прогнозируется'], { fontSize: 10.5, name: 'a6_ins' });
  }

  // 99 — AI economics
  {
    const s = d.slide({
      title: 'Экономика AI-продуктов: проекты и подписка', status: 'NODATA', source: 'Корпоративная концепция FootureX Uzbekistan. Документы BX не описывают направление AI.',
      notes: 'ТЕЗИС: AI-направление сочетает проектную модель (внедрение) и подписку; объёмы и цены не предоставлены.\nКлючевые метрики подписки: MRR, отток, ARPA, CAC, LTV, стоимость инференса на клиента.\nСвязка: далее — экономика Game Development.',
    });
    tag(d, s, 'СТРУКТУРА ЭКОНОМИКИ · ЗНАЧЕНИЯ ТРЕБУЮТ ПОДТВЕРЖДЕНИЯ');
    const col = (x, t, items, a) => { d.card(s, x, 2.05, 5.95, 2.6, { name: a }); d.text(s, t, { x: x + 0.25, y: 2.2, w: 5.4, h: 0.32, fontSize: 13.5, bold: true, color: C.accent }); d.bullets(s, items, x + 0.25, 2.65, 5.45, 1.9, { fontSize: 11.5, gap: 5 }); };
    col(M, 'Проекты внедрения', ['Выручка = количество проектов × средний чек', 'Себестоимость: команда, данные, интеграции', 'Количество и чек — ' + TBC.toLowerCase()], 'a1_c');
    col(6.78, 'Подписка (SaaS)', ['MRR = платящие клиенты × ARPA', 'Отток, CAC, LTV = ARPA × маржа / отток', 'Инференс и облако — переменные затраты'], 'a2_c');
    d.table(s, [
      ['Метрика', 'Формула', 'Значение'],
      ['LTV клиента', 'ARPA × валовая маржа / месячный отток', TBC],
      ['CAC payback', 'CAC / (ARPA × валовая маржа)', TBC],
    ], { x: M, y: 4.9, w: W - 2 * M, colW: [2.6, 6.0, 3.53], rowH: 0.4, size: 11, hSize: 10.5, boldFirstCol: true });
  }

  // 100 — Game development economics: BX-013 catalog
  {
    const s = d.slide({
      title: 'Экономика Game Development: утверждённый каталог цен', status: 'DOC', source: S13,
      notes: 'ТЕЗИС: для FootureX Game утверждены цены (BX-013), но не объёмы — поэтому показан каталог и производные цены, а не прогноз выручки.\nПакеты FTXcoin: 30 — $1.99; 60 — $3.99; 90 — $5.99; 150 — $9.50; 400 — $24.99. Пакет 120 исключён. Цена 1 FTXcoin — от $0,0625 (пакет 400) до $0,0666 (пакет 90).\nPremium Pass — $3.99 за сезон 14 дней (≈ $0,285 в день; при покупке каждого сезона — максимум ≈ $104 в год на одного плательщика).\nНаборы в FTXcoin имеют долларовый эквивалент по цене пакетов: например, Legendary Pack (89 FTXcoin) ≈ $5,56–5,92.\nКомиссии Telegram/TON и налоги в BX-013 не указаны.\nСвязка: далее — футбольное и киберспортивное направления.',
    });
    tag(d, s, 'ЦЕНЫ — ДОКУМЕНТ BX-013 · USD-ЭКВИВАЛЕНТЫ — РАСЧЁТ · ОБЪЁМЫ ПРОДАЖ НЕ ЗАДАНЫ', C.accent);
    d.table(s, [
      ['Пакет FTXcoin', 'Цена', 'USD за 1 FTXcoin'],
      ...FM.packs.map((p) => [String(p.qty), usd(p.usd), usd(p.usdPerCoin, 4)]),
    ], { x: M, y: 2.05, w: 4.3, colW: [1.5, 1.2, 1.6], rowH: 0.4, size: 11, hSize: 10, boldFirstCol: true });
    d.text(s, 'Пакет 120 исключён каталогом', { x: M, y: 4.55, w: 4.3, h: 0.25, fontSize: 9.5, color: C.muted });
    const eq = FM.packUsd.filter((p) => ['Rare Pack', 'Legendary Pack', 'Immortal Pack', 'Elite Pack'].includes(p.name));
    d.table(s, [
      ['Набор', 'FTXcoin', 'USD-экв.'],
      ...eq.map((p) => [p.name, String(p.ftx), usd(p.usdLow) + '–' + usd(p.usdHigh).slice(1)]),
    ], { x: 5.1, y: 2.05, w: 4.0, colW: [1.6, 0.9, 1.5], rowH: 0.4, size: 11, hSize: 10, boldFirstCol: true });
    d.text(s, 'Common 200 Coins · Uncommon 800 Coins · Free — каждые 24 ч', { x: 5.1, y: 4.15, w: 4.0, h: 0.42, fontSize: 9.5, color: C.muted });
    d.card(s, M, 4.95, 8.5, 1.45, { name: 'a3_c', line: C.accent2 });
    d.text(s, '$3.99', { x: M + 0.25, y: 5.05, w: 1.9, h: 0.6, fontSize: 28, fontFace: F.displayLatin, color: C.text });
    d.text(s, 'Premium Pass · 14 дней · 100 уровней', { x: M + 0.25, y: 5.7, w: 2.6, h: 0.55, fontSize: 10.5, color: C.soft });
    d.text(s, [{ text: usd(FM.pass.perDay, 3) + ' в день', options: { bold: true, color: C.accent } }, { text: '  ·  ' }, { text: '≈ ' + FM.pass.seasonsPerYear.toFixed(0) + ' сезонов в год', options: { bold: true, color: C.accent } }, { text: '\nМаксимум на одного плательщика при покупке каждого сезона — ≈ ' + usd(FM.pass.maxPerYear, 0) + ' в год. Количество плательщиков — ' + TBC.toLowerCase() + '.' }], { x: 3.2, y: 5.05, w: 5.75, h: 1.25, fontSize: 11, color: 'D3D9E5', valign: 'middle' });
    d.phoneImg(s, 'game-store', 9.7, 1.85, 4.55, '!!phoneA');
    d.caption(s, 'Концепт · цены BX-013', 9.2, 6.42, { w: 3.4 });
  }

  // 101 — Football & esports economics
  {
    const s = d.slide({
      title: 'Экономика футбольного и киберспортивного направлений', status: 'CALC', source: S13 + ' Футбол — корпоративная концепция, не подтверждено.',
      notes: 'ТЕЗИС: соревновательная экономика внутри игры описана точно (BX-013), но это экономика внутриигровой валюты; денежные доходы киберспорта и футбола не заданы.\nРасчёт при максимальном составе 48 мест (базовое число мест в BX-013 не указано; +4 места за 20 FTXcoin до лимита 48):\nFan: 48 × 5 = 240 FTXcoin за сезон → 96 создателю / 96 в призовой фонд / 48 в казну.\nPro: 48 × 8 = 384 → 144 / 144 / 96.\nMaster: 48 × 12 = 576 → 240 / 240 / 96.\nКазна — сток валюты (sink), а не выручка; доли создателя и фонда — оборот между пользователями.\nФутбольный клуб и академия: спонсорство, билеты, трансферы, обучение — объёмы не предоставлены, доходы не считаются подтверждёнными.\nСвязка: далее — CAPEX и OPEX.',
    });
    tag(d, s, 'РАСЧЁТ ПО BX-013 · ВНУТРИИГРОВАЯ ВАЛЮТА, НЕ ДЕНЕЖНАЯ ВЫРУЧКА');
    d.table(s, [
      ['Лига · 48 мест · 7 дней', 'Взносы', 'Создателю', 'Призовой фонд', 'Казна (sink)'],
      ...FM.leagues.map((l) => [l.name, l.gross + ' FTXcoin', String(l.toCreator), String(l.toPool), String(l.toTreasury)]),
    ], { x: M, y: 2.05, w: 7.6, colW: [2.3, 1.5, 1.2, 1.4, 1.2], rowH: 0.44, size: 11.5, hSize: 10.5, boldFirstCol: true });
    d.chart(s, pres.charts.BAR, [
      { name: 'Создателю', labels: FM.leagues.map((l) => l.name.replace(' League', '')), values: FM.leagues.map((l) => l.toCreator) },
      { name: 'Призовой фонд', labels: FM.leagues.map((l) => l.name.replace(' League', '')), values: FM.leagues.map((l) => l.toPool) },
      { name: 'Казна', labels: FM.leagues.map((l) => l.name.replace(' League', '')), values: FM.leagues.map((l) => l.toTreasury) },
    ], { x: M, y: 3.95, w: 7.6, h: 2.45, showValue: false, colors: [C.accent2, C.accent, C.dot], extra: { barGrouping: 'stacked', barDir: 'bar', barGapWidthPct: 45 }, name: 'a2_chart' });
    d.card(s, 8.5, 2.05, 4.23, 2.05, { name: 'a3_c' });
    d.text(s, 'Esports · денежные доходы', { x: 8.72, y: 2.18, w: 3.8, h: 0.3, fontSize: 12.5, bold: true, color: C.accent });
    d.text(s, 'Спонсорство, турнирные билеты, медиа, цифровой мерч (BX-001). Объёмы — ' + TBC.toLowerCase() + '.', { x: 8.72, y: 2.55, w: 3.8, h: 1.45, fontSize: 11, color: C.soft });
    d.card(s, 8.5, 4.3, 4.23, 2.1, { name: 'a4_c', line: C.dot });
    d.text(s, 'FC FootureX · Academy', { x: 8.72, y: 4.43, w: 3.8, h: 0.3, fontSize: 12.5, bold: true, color: C.dot });
    d.text(s, 'Спонсорство, билеты, обучение, трансферы. Доходы клуба и академии не считаются подтверждёнными; модель строится после решения о лицензировании и базе.', { x: 8.72, y: 4.8, w: 3.8, h: 1.5, fontSize: 11, color: C.soft });
  }

  // 102 — CAPEX & OPEX structure
  {
    const s = d.slide({
      title: 'Структура капитальных и операционных затрат', status: 'NODATA', source: S8 + ' Состав ролей — BX-002; архитектура — BX-005.',
      notes: 'ТЕЗИС: структура затрат определяется документами (приоритеты Seed — BX-008, роли — BX-002, инфраструктура — BX-005), но суммы не предоставлены.\nПриоритеты Seed-раунда BX-008: Backend, Gameplay, Infrastructure, LiveOps, Marketing.\nCAPEX физических направлений (студия, учебные пространства, футбольная база, стадион) зависит от решений о площадках и в предыдущей версии был иллюстративным — суммы удалены.\nСвязка: далее — финансовая модель.',
    });
    tag(d, s, 'СТАТЬИ ЗАТРАТ ПО ДОКУМЕНТАМ · СУММЫ ТРЕБУЮТ ПОДТВЕРЖДЕНИЯ');
    d.table(s, [
      ['OPEX · FootureX Game', 'Основа', 'Сумма'],
      ['Backend и Gameplay (команда разработки)', 'BX-008 Seed, BX-002', TBC],
      ['Infrastructure: облако, БД, мониторинг', 'BX-005, BX-008', TBC],
      ['LiveOps: сезоны, события, аналитика', 'BX-008, BX-004', TBC],
      ['Marketing и рост сообщества', 'BX-008', TBC],
      ['Безопасность и антифрод', 'BX-002, BX-005', TBC],
      ['Управление: COO, CFO и др.', 'BX-002', TBC],
    ], { x: M, y: 2.05, w: 7.1, colW: [3.5, 1.9, 1.7], rowH: 0.48, size: 11, hSize: 10.5, boldFirstCol: true });
    d.table(s, [
      ['CAPEX · прочие направления', 'Сумма'],
      ['IT-оборудование и офис', TBC],
      ['Esports-студия и арена', TBC],
      ['Учебные пространства Academy', TBC],
      ['Футбольная база, стадион, City', TBC],
    ], { x: 7.95, y: 2.05, w: 4.78, colW: [2.95, 1.83], rowH: 0.48, size: 11, hSize: 10.5, boldFirstCol: true });
    d.text(s, 'Стадион и City — только после решения о модели площадки (варианты A → B → C, глава IX).', { x: 7.95, y: 4.6, w: 4.78, h: 0.6, fontSize: 10.5, color: C.dot });
  }

  // 103 — 5-year financial model framework (driver tree)
  {
    const s = d.slide({
      title: 'Финансовая модель на 5 лет: структура и формулы', status: 'FRAME', source: 'Шаблон: лист «Драйверы (шаблон)» Excel-приложения. Значения не заданы.',
      notes: 'ТЕЗИС: модель построена как дерево драйверов; все входы пустые и заполняются руководством, результаты считаются формулами.\nВыручка игры: MAU × Conversion × ARPPU × месяцы + партнёрства. Gross Profit = Revenue − комиссии платформ − прямые затраты. EBITDA = GP − OPEX. Net Profit = (EBITDA − D&A) × (1 − налог). OCF = NP + D&A − ΔWC. FCF = OCF − CAPEX. CAC = UA / новые пользователи. LTV = ARPPU × (1 − комиссия) × срок жизни.\nВажно: модель — по FootureX Game; другие направления добавляются отдельными блоками, игровые показатели не переносятся на компанию.\nСвязка: далее — прогноз выручки и денежных потоков.',
    });
    tag(d, s, 'ДЕРЕВО ДРАЙВЕРОВ · ВВОДЫ ПУСТЫЕ · РЕЗУЛЬТАТЫ — ФОРМУЛЫ');
    const box = (x, y, w, t, sub, col, a) => {
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h: 0.62, rectRadius: 0.1, fill: { color: C.surface }, line: { color: col || C.line, width: 1 }, objectName: a });
      d.text(s, t, { x: x + 0.1, y: y + 0.05, w: w - 0.2, h: 0.28, fontSize: 11, bold: true, align: 'center', fontFace: F.bodyLatin });
      d.text(s, sub, { x: x + 0.1, y: y + 0.32, w: w - 0.2, h: 0.24, fontSize: 8.5, color: C.muted, align: 'center' });
    };
    const ln = (x1, y1, x2, y2) => s.addShape(pres.shapes.LINE, { x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1) || 0.001, h: Math.abs(y2 - y1) || 0.001, flipH: x2 < x1, line: { color: C.line, width: 1 } });
    // row inputs
    const inp = [['MAU', 'BX-008 KPI'], ['Conversion', 'BX-008 KPI'], ['ARPPU', 'цены BX-013'], ['Партнёрства', 'BX-001'], ['Комиссии', 'не в BX'], ['OPEX', 'BX-002/005'], ['CAPEX', 'по решениям']];
    const iw = 1.6, gap = (W - 2 * M - iw * 7) / 6;
    inp.forEach(([t, sub], i) => box(M + i * (iw + gap), 2.05, iw, t, sub, C.dot, `a1_i${i}`));
    const mid = [['Revenue', 'Stars / TON', 1.5], ['Gross Profit · Margin', 'Rev − комиссии − прямые', 4.4], ['EBITDA → Net Profit', 'GP − OPEX − D&A − налог', 7.3], ['OCF → FCF', 'NP + D&A − ΔWC − CAPEX', 10.2]];
    mid.forEach(([t, sub, x], i) => { box(x, 3.35, 2.55, t, sub, C.accent2, `a2_m${i}`); if (i) s.addShape(pres.shapes.LINE, { x: x - 0.35, y: 3.66, w: 0.33, h: 0, line: { color: C.accent, width: 1.25, endArrowType: 'triangle' } }); });
    ln(M + 0.8, 2.67, 2.6, 3.35); ln(M + iw + gap + 0.8, 2.67, 2.75, 3.35); ln(M + 2 * (iw + gap) + 0.8, 2.67, 2.9, 3.35); ln(M + 3 * (iw + gap) + 0.8, 2.67, 2.9, 3.35);
    ln(M + 4 * (iw + gap) + 0.8, 2.67, 5.6, 3.35); ln(M + 5 * (iw + gap) + 0.8, 2.67, 8.6, 3.35); ln(M + 6 * (iw + gap) + 0.8, 2.67, 11.5, 3.35);
    const out = [['Break-even', 'Revenue = все затраты'], ['Unit economics', 'ARPPU, маржа на плательщика'], ['CAC · LTV', 'UA / новые · ARPPU × срок жизни'], ['ROI · Payback', 'после ввода инвестиций']];
    out.forEach(([t, sub], i) => box(M + i * 3.07, 4.65, 2.85, t, sub, C.accent, `a3_o${i}`));
    d.card(s, M, 5.55, W - 2 * M, 0.85, { name: 'a4_c', line: C.dot });
    d.text(s, [{ text: 'Статус всех значений: ', options: { bold: true, color: C.dot } }, { text: 'требуется подтверждение. Цены — из BX-013; MAU, конверсия, ARPPU, затраты, инвестиции и сроки руководство не предоставило. Расчёт — после заполнения шаблона.' }], { x: M + 0.25, y: 5.55, w: 11.6, h: 0.85, fontSize: 11.5, valign: 'middle', color: 'D3D9E5' });
  }

  // 104 — Revenue, EBITDA, cash-flow forecast structure
  {
    const s = d.slide({
      title: 'Прогноз выручки, EBITDA и денежных потоков', status: 'NODATA', source: 'Структура прогноза — лист «Драйверы (шаблон)». ' + S8,
      notes: 'ТЕЗИС: прогноз не публикуется до заполнения драйверов; вместо графика показана структура отчёта, которую получит инвестор.\nKPI инвестора по BX-008: DAU, MAU, Retention, Revenue, Conversion, Community Growth — фактические значения пока не предоставлены (продукт на этапе Foundation).\nПредыдущая версия содержала иллюстративный прогноз — удалён по правилу 12 ТЗ.\nСвязка: далее — сценарии и безубыточность.',
    });
    tag(d, s, 'ПРОГНОЗ НЕ ПУБЛИКУЕТСЯ ДО ПОДТВЕРЖДЕНИЯ ДРАЙВЕРОВ');
    const yrs = ['Год 1', 'Год 2', 'Год 3', 'Год 4', 'Год 5'];
    d.table(s, [
      ['USD', ...yrs],
      ['Revenue', ...yrs.map(() => '—')],
      ['Gross Profit', ...yrs.map(() => '—')],
      ['EBITDA', ...yrs.map(() => '—')],
      ['Net Profit', ...yrs.map(() => '—')],
      ['Operating Cash Flow', ...yrs.map(() => '—')],
      ['Free Cash Flow', ...yrs.map(() => '—')],
      ['Накопленный FCF', ...yrs.map(() => '—')],
    ], { x: M, y: 2.05, w: 7.6, colW: [2.35, 1.05, 1.05, 1.05, 1.05, 1.05], rowH: 0.44, size: 11, hSize: 10.5, boldFirstCol: true, align: 'center' });
    d.card(s, 8.5, 2.05, 4.23, 3.5, { name: 'a2_c' });
    d.text(s, 'KPI инвестора · BX-008', { x: 8.72, y: 2.18, w: 3.8, h: 0.3, fontSize: 12.5, bold: true, color: C.accent });
    ['DAU', 'MAU', 'Retention', 'Revenue', 'Conversion', 'Community Growth'].forEach((k2, i) => {
      const y = 2.62 + i * 0.47;
      d.text(s, k2, { x: 8.72, y, w: 2.2, h: 0.36, fontSize: 11.5, bold: true, fontFace: F.bodyLatin, valign: 'middle' });
      d.text(s, 'нет данных', { x: 10.9, y, w: 1.6, h: 0.36, fontSize: 10.5, color: C.dot, align: 'right', valign: 'middle' });
    });
    d.text(s, 'Значения заполняются по факту тестов Foundation и утверждённому бизнес-плану.', { x: M, y: 5.75, w: 12, h: 0.3, fontSize: 11, color: C.soft });
  }

  // 105 — Scenarios & break-even
  {
    const s = d.slide({
      title: 'Сценарный анализ и точка безубыточности', status: 'FRAME', source: 'Методика сценариев — проект; переходы между стадиями — ' + S8.replace('Источник: ', ''),
      notes: 'ТЕЗИС: сценарии задаются не процентом от выручки, а значениями драйверов; точка безубыточности считается формулой после ввода затрат.\nБазовый / оптимистичный / пессимистичный сценарии различаются удержанием, конверсией, ARPPU, CAC и сроком перехода к Growth.\nТочка безубыточности (платящих в месяц) = постоянные затраты в месяц / (ARPPU × (1 − комиссия) − переменные затраты на плательщика).\nBX-008: переход к росту — только после подтверждения удержания, экономики и аудитории; это главный сценарный триггер.\nСвязка: далее — инвестиционная стратегия.',
    });
    tag(d, s, 'МЕТОДИКА СЦЕНАРИЕВ · ЗНАЧЕНИЯ ДРАЙВЕРОВ ТРЕБУЮТ ПОДТВЕРЖДЕНИЯ');
    d.table(s, [
      ['Драйвер', 'Пессимистичный', 'Базовый', 'Оптимистичный'],
      ['Retention D30', 'ниже цели', 'цель', 'выше цели'],
      ['Conversion в платящих', 'ниже цели', 'цель', 'выше цели'],
      ['ARPPU (цены BX-013)', 'меньше покупок', 'цель', 'больше покупок'],
      ['CAC', 'выше', 'цель', 'ниже'],
      ['Переход к Growth (BX-008)', 'позже', 'по плану', 'раньше'],
    ], { x: M, y: 2.05, w: 7.6, colW: [2.5, 1.7, 1.6, 1.8], rowH: 0.48, size: 11, hSize: 10.5, boldFirstCol: true });
    d.text(s, 'Целевые значения не заданы в документах — ' + TBC.toLowerCase() + '.', { x: M, y: 5.05, w: 7.6, h: 0.28, fontSize: 10, color: C.dot });
    d.card(s, 8.5, 2.05, 4.23, 4.35, { name: 'a2_c', line: C.accent2 });
    d.text(s, 'Break-even · формула', { x: 8.72, y: 2.18, w: 3.8, h: 0.3, fontSize: 12.5, bold: true, color: C.accent });
    d.text(s, 'Платящих в месяц =', { x: 8.72, y: 2.65, w: 3.8, h: 0.3, fontSize: 11.5, color: C.soft });
    d.text(s, 'Постоянные затраты', { x: 8.72, y: 3.05, w: 3.8, h: 0.32, fontSize: 13, bold: true, align: 'center' });
    s.addShape(pres.shapes.LINE, { x: 8.9, y: 3.45, w: 3.45, h: 0, line: { color: C.accent, width: 1.25 } });
    d.text(s, 'ARPPU × (1 − комиссия) − переменные затраты на плательщика', { x: 8.72, y: 3.55, w: 3.8, h: 0.6, fontSize: 11, align: 'center', color: 'D3D9E5' });
    d.text(s, 'ARPPU опирается на цены BX-013 (Premium Pass $3.99 за 14 дней; FTXcoin ≈ $0,0625–0,0666). Постоянные затраты и комиссии — ' + TBC.toLowerCase() + '.', { x: 8.72, y: 4.45, w: 3.8, h: 1.8, fontSize: 10.5, color: C.soft });
  }

  // 106 — Investment strategy & capital need (BX-008)
  {
    const s = d.slide({
      title: 'Инвестиционная стратегия и потребность в капитале', status: 'DOC', source: S8,
      notes: 'ТЕЗИС: BX-008 задаёт поэтапную стратегию: каждый следующий раунд — после подтверждения метрик предыдущего этапа.\nBootstrap: MVP, собственные средства, близкие партнёры, небольшие инвестиции. Seed: Backend, Gameplay, Infrastructure, LiveOps, Marketing. Growth: после подтверждения retention, экономики и аудитории; новые рынки. Ecosystem Expansion: медиа, киберспорт, blockchain, партнёрства, футбольная инфраструктура.\nПодтверждённые инвестиции: нет данных. Суммы раундов и оценка: требуется подтверждение.\nПартнёрские направления: Media, Sports, Technology. Blockchain — только после доказанной устойчивости ядра.\nСвязка: глава XI — управление и риски.',
    });
    d.table(s, [
      ['Стадия (BX-008)', 'Источники', 'Приоритеты использования', 'Сумма'],
      ['Bootstrap', 'Собственные средства, близкие партнёры, небольшие инвестиции', 'MVP: Telegram Web App, базовая экономика', TBC],
      ['Seed', 'Планируемый раунд', 'Backend · Gameplay · Infrastructure · LiveOps · Marketing', TBC],
      ['Growth', 'Планируемый раунд', 'Новые рынки, инфраструктура, конкурентные системы', TBC],
      ['Ecosystem Expansion', 'Стратегические партнёры', 'Медиа, киберспорт, blockchain, футбольная инфраструктура', TBC],
    ], { x: M, y: 2.05, w: W - 2 * M, colW: [2.3, 3.6, 4.3, 1.93], rowH: 0.55, size: 11, hSize: 10.5, boldFirstCol: true });
    const st = [['Подтверждённые инвестиции', 'нет данных', C.dot], ['Планируемые раунды', 'Seed → Growth', C.accent], ['Партнёрские направления', 'Media · Sports · Technology', C.accent2]];
    st.forEach(([l, v, col], i) => {
      const x = M + i * 4.1;
      d.card(s, x, 5.05, 3.9, 1.35, { name: `a${i + 2}_c`, line: col });
      d.text(s, l, { x: x + 0.22, y: 5.15, w: 3.5, h: 0.3, fontSize: 11, color: C.soft });
      d.text(s, v, { x: x + 0.22, y: 5.5, w: 3.5, h: 0.6, fontSize: 16, bold: true, color: col, fontFace: F.bodyCyrillic, valign: 'middle' });
    });
  }
};
