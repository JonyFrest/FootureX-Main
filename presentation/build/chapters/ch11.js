// ГЛАВА XI. GOVERNANCE & EXECUTION (107–113)
const { C, F, W, H, M } = require('../deck/lib');

function node(d, s, x, y, w, h, t, sub, o = {}) {
  s.addShape(d.pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.08, fill: { color: o.fill || C.surface }, line: { color: o.line || C.line, width: o.lw || 1 }, objectName: o.name });
  const th = sub ? 0.27 : h - 0.12, ty = sub ? y + (h - 0.5) / 2 : y + 0.06;
  d.text(s, t, { x: x + 0.08, y: ty, w: w - 0.16, h: th, fontSize: o.fs || 11, bold: true, align: 'center', valign: sub ? 'top' : 'middle', color: o.color || C.text });
  if (sub) d.text(s, sub, { x: x + 0.08, y: ty + 0.28, w: w - 0.16, h: 0.22, fontSize: o.sfs || 9.5, align: 'center', valign: 'top', color: o.subColor || '8A93A6' });
}
const L = (d, s, x, y, w, h) => d.pres && s.addShape(d.pres.shapes.LINE, { x, y, w, h, line: { color: '273B51', width: 1 } });

module.exports = async (d, pres) => {
  // 107 — Corporate structure
  {
    const s = d.slide({
      title: 'Корпоративная структура FootureX Uzbekistan: целевая модель группы', status: 'FRAME',
      notes: 'ТЕЗИС: на старте все направления планируются как подразделения одного юридического лица (факт регистрации MChJ — требуется подтверждение); выделение дочерних компаний происходит поэтапно, когда направление готово к собственным инвесторам, лицензиям или партнёрам.\nВАЖНО: схема концептуальная. Ни одно подразделение не является зарегистрированным юридическим лицом — документы не предоставлены.\nПоэтапное выделение (вариант): (1) все направления внутри MChJ; (2) отдельные ДК для AI SaaS и игрового IP — при привлечении профильных инвесторов; (3) FC FootureX и Football Academy — отдельные организации, если этого требуют правила клубного лицензирования; (4) проектные компании (SPV) для Stadium и City с партнёрами.\nСвязка: далее — модель управления.',
    });
    node(d, s, 4.42, 1.95, 4.5, 0.7, 'MChJ «FootureX Uzbekistan»', 'материнская компания · регистрация — требует подтверждения', { name: 'a1_n', fill: '142A70', color: 'FFFFFF', line: '142A70', fs: 12, subColor: 'B8C1D4' });
    L(d, s, 6.67, 2.65, 0, 0.25); L(d, s, 2.05, 2.9, 9.25, 0);
    const clusters = [['Digital & Education', [['FootureX Technologies', 'подразделение → ДК'], ['FootureX AI', 'подразделение → ДК'], ['FootureX Game Dev Academy', 'подразделение → ДК']]], ['Gaming', [['FootureX Game Development', 'студия · подразделение'], ['FootureX Game', 'IP · подразделение → ДК'], ['FootureX Game Community', 'подразделение'], ['FootureX Esports', 'подразделение']]], ['Sports', [['FC FootureX', 'отдельная организация*'], ['FootureX Football Academy', 'отдельная организация*']]], ['Infrastructure', [['FootureX Stadium', 'SPV с партнёрами'], ['FootureX City', 'SPV с партнёрами']]]];
    clusters.forEach(([cl, units], i) => {
      const cx = 2.05 + i * 3.083, x = cx - 1.45;
      L(d, s, cx, 2.9, 0, 0.18);
      node(d, s, x, 3.08, 2.9, 0.45, cl, null, { name: `a${i + 2}_c`, fill: '142A70', line: '2550FA', color: '2593FA', fs: 12 });
      units.forEach(([u, st], j) => {
        node(d, s, x, 3.68 + j * 0.66, 2.9, 0.58, u, st, { fs: 10.5, sfs: 9.5 });
      });
    });
    d.text(s, '* Форма определяется требованиями клубного лицензирования. Все звенья — концептуальные; зарегистрированных дочерних компаний нет.', { x: M, y: 6.5, w: 12.1, h: 0.28, fontSize: 9.5, color: '8A93A6' });
  }

  // 108 — Governance model
  {
    const s = d.slide({
      title: 'Модель управления компанией', status: 'FRAME', source: 'Органы ООО — законодательство РУз; уровень управления и роли — BX-002 Organizational Structure, v0.0.23.',
      notes: 'ТЕЗИС: управление построено так, чтобы инвестор и участники видели решения, риски и деньги — с первого года.\nОрганы ООО по законодательству РУз: общее собрание участников, наблюдательный совет (при создании, по уставу), исполнительный орган (директор). BX-002: Founder / CEO совмещает Product Vision Owner, Executive Control и Investment Direction; предусмотрены роли COO, CTO, CPO, CFO, CMO, Head of LiveOps, Head of Security — статус найма не подтверждён, позиции не представлены как занятые.\nДополнительно (рекомендация): правление из руководителей направлений и комитеты — аудит и риски, инвестиционный, технологии и этика AI.\nФинансовый контроль: годовой бюджет, ежемесячная управленческая отчётность, матрица полномочий, двойная подпись платежей сверх лимита, ежегодный внешний аудит (по решению участников).\nСтатус: проект модели управления; закрепляется в уставе и внутренних положениях.\nСвязка: далее — структура подразделений и ответственности.',
    });
    node(d, s, 4.17, 1.95, 5.0, 0.62, 'Общее собрание участников', 'высший орган ООО', { name: 'a1_n', fill: '142A70', color: 'FFFFFF', line: '142A70', fs: 12, subColor: 'B8C1D4' });
    L(d, s, 6.67, 2.57, 0, 0.2);
    node(d, s, 4.17, 2.77, 5.0, 0.62, 'Наблюдательный совет', 'стратегия, бюджет, крупные сделки (при создании)', { name: 'a2_n', line: C.accent, lw: 1.5, fs: 12 });
    L(d, s, 6.67, 3.39, 0, 0.2);
    node(d, s, 4.17, 3.59, 5.0, 0.62, 'Founder / CEO', 'Product Vision · Executive Control · Investment Direction', { name: 'a3_n', fs: 12 });
    L(d, s, 6.67, 4.21, 0, 0.2);
    node(d, s, 4.17, 4.41, 5.0, 0.62, 'Executive team (BX-002)', 'COO · CTO · CPO · CFO · CMO · LiveOps · Security — предусмотрены', { name: 'a4_n', fs: 12 });
    const com = [['Комитет по аудиту и рискам', 'контроль, отчётность'], ['Инвестиционный комитет', 'CAPEX, новые направления'], ['Комитет по технологиям и этике AI', 'архитектура, данные, AI']];
    com.forEach(([t, x2], i) => { node(d, s, 9.65, 2.0 + i * 0.95, 3.08, 0.78, t, x2, { name: `a${5 + i}_k`, fill: '0E1629', fs: 10.5 }); });
    L(d, s, 9.17, 3.08, 0.24, 0); L(d, s, 9.41, 2.39, 0, 1.9); [2.39, 3.34, 4.29].forEach((yy) => L(d, s, 9.41, yy, 0.24, 0));
    d.text(s, 'Финансовый контроль', { x: M, y: 2.0, w: 3.2, h: 0.3, fontSize: 12.5, bold: true, color: '2593FA' });
    d.bullets(s, ['Годовой бюджет и инвестиционный план', 'Ежемесячная управленческая отчётность', 'Матрица полномочий и лимиты', 'Двойная подпись крупных платежей', 'Ежегодный внешний аудит'], M, 2.4, 3.3, 2.9, { fontSize: 11.5, gap: 5 });
    d.card(s, M, 5.35, W - 2 * M, 1.05, { name: 'a8_n', fill: '0E1629', line: '2550FA' });
    d.text(s, 'Органы ООО — по законодательству РУз и уставу. Уровень Founder / CEO и роли C-level — по BX-002; роли предусмотрены, но не представлены как занятые. Совет и комитеты — рекомендуемая модель.', { x: M + 0.3, y: 5.35, w: 11.5, h: 1.05, fontSize: 12.5, valign: 'middle', color: 'B8C1D4' });
  }

  // 109 — Divisions & responsibility
  {
    const s = d.slide({
      title: 'Структура подразделений и ответственности', status: 'DOC', source: 'Источник: BX-002 Organizational Structure, v0.0.23 (игровое направление). Прочие направления — корпоративная концепция.',
      notes: 'ТЕЗИС: игровое направление организовано по BX-002 как Hybrid Product Structure: Product-driven, Service-oriented, LiveOps Architecture.\nУправление: Founder / CEO — Product Vision Owner, Executive Control, Investment Direction. Роли C-level предусмотрены документом; кто их занимает — не подтверждено, поэтому позиции не показаны как занятые.\nProduct Department: продуктовое управление, геймдизайн, системная архитектура, UX, экономика. Development Department: Backend, Frontend, Telegram, DevOps, QA, Security.\nНаправления вне игры: руководители — по корпоративной концепции, назначения не утверждены.\nСвязка: далее — операционная модель.',
    });
    d.table(s, [
      ['Роль (BX-002)', 'Зона ответственности', 'Статус'],
      ['Founder / CEO', 'Product Vision · Executive Control · Investment Direction', 'основатель'],
      ['COO', 'Операционные процессы', 'предусмотрена'],
      ['CTO', 'Технологии и архитектура', 'предусмотрена'],
      ['CPO', 'Продукт и геймдизайн', 'предусмотрена'],
      ['CFO', 'Финансы и экономика', 'предусмотрена'],
      ['CMO', 'Маркетинг и сообщество', 'предусмотрена'],
      ['Head of LiveOps', 'Сезоны, события, удержание', 'предусмотрена'],
      ['Head of Security', 'Безопасность и антифрод', 'предусмотрена'],
    ], { x: M, y: 2.0, w: 7.2, colW: [1.9, 3.7, 1.6], rowH: 0.44, size: 10.5, hSize: 10, boldFirstCol: true });
    d.text(s, '«Предусмотрена» — роль заложена в BX-002; занятость позиции не подтверждена.', { x: M, y: 6.05, w: 7.2, h: 0.3, fontSize: 9.5, color: C.dot });
    const dept = (y, t, items, a) => { d.card(s, 8.1, y, 4.63, 1.85, { name: a }); d.text(s, t, { x: 8.32, y: y + 0.13, w: 4.2, h: 0.3, fontSize: 12.5, bold: true, color: C.accent, fontFace: F.bodyLatin }); items.forEach((it, k) => d.pill(s, it, 8.32 + (k % 3) * 1.42, y + 0.6 + Math.floor(k / 3) * 0.48, { w: 1.34, h: 0.36, fontSize: 9, color: C.accent2 })); };
    dept(2.0, 'Product Department', ['Product Mgmt', 'Game Design', 'Architecture', 'UX', 'Economy'], 'a2_c');
    dept(4.0, 'Development Department', ['Backend', 'Frontend', 'Telegram', 'DevOps', 'QA', 'Security'], 'a3_c');
    d.text(s, 'Hybrid Product Structure: Product-driven · Service-oriented · LiveOps', { x: 8.1, y: 6.0, w: 4.63, h: 0.4, fontSize: 9.5, color: C.soft, fontFace: F.bodyLatin });
  }

  // 110 — Operating model & quality
  {
    const s = d.slide({
      title: 'Операционная модель и контроль качества', status: 'FRAME',
      notes: 'ТЕЗИС: единая операционная система для всех направлений — от стратегии до аудита — позволяет управлять разными бизнесами одной командой.\nКонтур: стратегия и OKR (год/квартал) → портфель проектов → поставка (Agile) → качество (тесты, код-ревью, безопасность, клиентский NPS) → финансовый контроль (бюджет, управленческая отчётность, учёт по МСФО по мере готовности) → аудит и комплаенс.\nСвязка: далее — ключевые риски.',
    });
    d.layers(s, [
      { title: 'Стратегия', items: ['Стратегия на 3 года', 'Годовые OKR', 'Квартальный пересмотр'] },
      { title: 'Портфель', items: ['Приоритизация', 'Ворота качества проектов', 'Распределение ресурсов'] },
      { title: 'Поставка', items: ['Agile-спринты', 'Демо и ретроспективы', 'SLA клиентов'] },
      { title: 'Качество', items: ['Автотесты и код-ревью', 'Безопасность', 'NPS клиентов и игроков'] },
      { title: 'Финансы', items: ['Бюджет и прогноз', 'Ежемесячная отчётность', 'Переход на МСФО'] },
      { title: 'Аудит', items: ['Внутренний контроль', 'Внешний аудит', 'Комплаенс и данные'] },
    ], { y: 1.95, lh: 0.58, gap: 0.08, labelW: 2.2 });
    d.text(s, 'Игровое направление — Hybrid Product Structure (BX-002): Product-driven · Service-oriented · LiveOps Architecture', { x: M, y: 5.95, w: 12.1, h: 0.3, fontSize: 11, color: C.soft });
  }

  // 111 — Risks
  {
    const s = d.slide({
      title: 'Основные стратегические и финансовые риски', status: 'FRAME', source: 'Риски 2–6 — BX-008 Investment & Partnership Strategy, v0.4.92; меры — BX-003, BX-005, BX-006, BX-013. Оценка вероятности и влияния — экспертная.',
      notes: 'ТЕЗИС: главные риски — не технологические, а риски фокуса и финансирования; для каждого есть конкретная мера.\nКарта: 1 — финансирование не привлечено в срок; 2 — слишком быстрый рост и распыление фокуса; 3 — низкое удержание; 4 — нарушение игровой экономики; 5 — агрессивная монетизация и потеря доверия; 6 — слабая инфраструктура (риски 2–6 перечислены в BX-008); 7 — регулирование платежей, Stars/TON и токенов; 8 — зависимость от Telegram; 9 — кибербезопасность и мошенничество; 10 — земля и разрешения для Stadium/City.\nДополнительно (вне карты): дефицит кадров, концентрация IT-клиентов, валютный риск UZS/USD.\nОценка вероятности и влияния — экспертная, пересматривается ежеквартально комитетом по рискам.\nСвязка: далее — roadmap на 10 лет.',
    });
    const gx = M + 0.55, gy = 2.05, cs = 1.38;
    const heat = [['142A70', '1B3EE9', '2550FA'], ['0E1629', '142A70', '1B3EE9'], ['0E1629', '0E1629', '142A70']];
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) s.addShape(pres.shapes.RECTANGLE, { x: gx + c * cs, y: gy + r * cs, w: cs - 0.04, h: cs - 0.04, fill: { color: heat[r][c] }, line: { color: 'FFFFFF', width: 0 } });
    d.text(s, 'Влияние →', { x: gx, y: gy + 3 * cs + 0.02, w: 3 * cs, h: 0.28, fontSize: 10, color: '8A93A6', align: 'center' });
    d.text(s, 'Вероятность →', { x: M - 1.0, y: gy + 1.5 * cs - 0.14, w: 2.2, h: 0.28, fontSize: 10.5, color: C.soft, align: 'center', rotate: 270 });
    // [n, likelihood 0..2 (0 high), impact 0..2, dx, dy]
    const pts = [[1, 0, 2, 0.15, 0.15], [2, 0, 2, 0.75, 0.75], [3, 0, 1, 0.3, 0.3], [4, 1, 2, 0.2, 0.3], [5, 1, 1, 0.2, 0.2], [6, 1, 0, 0.6, 0.3], [7, 1, 1, 0.8, 0.8], [8, 2, 2, 0.45, 0.25], [9, 2, 1, 0.3, 0.5], [10, 0, 1, 0.85, 0.85]];
    pts.forEach(([n, lk, im, dx, dy], i) => {
      const x = gx + im * cs + dx, y = gy + lk * cs + dy;
      s.addShape(pres.shapes.OVAL, { x, y, w: 0.42, h: 0.42, fill: { color: '142A70' }, line: { color: 'FFFFFF', width: 1.5 }, objectName: `a${i + 1}_r` });
      d.text(s, String(n), { x, y, w: 0.42, h: 0.42, fontSize: 10, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' });
    });
    d.table(s, [
      ['#', 'Риск', 'Мера'],
      ['1', 'Финансирование не привлечено в срок', 'Этапность BX-008: раунд — после метрик'],
      ['2', 'Слишком быстрый рост, распыление фокуса', 'Фазы и ворота: новое — после метрик'],
      ['3', 'Низкое удержание (BX-008)', 'Тесты Foundation, LiveOps, A/B'],
      ['4', 'Нарушение игровой экономики (BX-008)', 'Контроль эмиссии, баланс sources/sinks'],
      ['5', 'Агрессивная монетизация, потеря доверия', 'Ограничение pay-to-win; без нечестных лутбоксов и ставок'],
      ['6', 'Слабая инфраструктура (BX-008)', 'Архитектура BX-005, мониторинг'],
      ['7', 'Регулирование платежей, Stars/TON, токенов', 'Юридическое заключение до запуска'],
      ['8', 'Зависимость от Telegram', 'Веб-платформа BX-006, своя база'],
      ['9', 'Кибербезопасность и мошенничество', 'Серверная валидация, антифрод'],
      ['10', 'Земля и разрешения Stadium/City', 'Опция A, ТЭО до обязательств'],
    ], { x: 5.35, y: 2.0, w: 7.38, colW: [0.4, 3.2, 3.78], rowH: 0.395, size: 10, hSize: 10 });
  }

  // 112 — 10-year roadmap (Gantt)
  {
    const s = d.slide({
      title: 'Roadmap развития на 10 лет', status: 'AMB',
      notes: 'ТЕЗИС: дорожная карта показывает последовательность — цифровые направления первыми, спорт и инфраструктура позже и при выполнении условий.\nСроки согласованы со слайдом 7 (горизонты): Г1–3 — фундамент (Technologies, AI, студия, FootureX Game с сообществом, пилот академии); Г4–6 — Esports и масштаб; Г7–10 — Football Academy, FC FootureX, ТЭО стадиона; City — подготовка не ранее Г9.\nFootureX Game: этапы BX-001 Foundation → Ecosystem Expansion; переход к росту — по условиям BX-008. Годы отсчитываются от запуска операционной деятельности; все сроки — ориентиры, требуют утверждения.\nСвязка: далее — KPI и контроль исполнения.',
    });
    // [name, realise from, to, prepare from, to, kind]  kind: d = digital, s = sport, i = infrastructure
    const rows = [['FootureX Technologies', 1, 10, 0, 0, 'd'], ['FootureX AI', 1, 10, 0, 0, 'd'], ['Game Development (студия)', 1, 10, 0, 0, 'd'], ['FootureX Game', 1, 10, 0, 0, 'd'],
      ['Game Dev Academy', 1, 10, 0, 0, 'd'], ['Game Community', 1, 10, 0, 0, 'd'], ['FootureX Esports', 4, 10, 2, 3, 's'], ['Football Academy', 7, 10, 5, 6, 's'], ['FC FootureX', 8, 10, 6, 7, 's'],
      ['FootureX Stadium', 0, 0, 7, 10, 'i'], ['FootureX City', 0, 0, 9, 10, 'i']];
    const x0 = 3.65, yw = (W - M - x0) / 10, y0 = 2.32, rh = 0.355;
    for (let yv = 1; yv <= 10; yv++) {
      d.text(s, 'Г' + yv, { x: x0 + (yv - 1) * yw, y: 1.98, w: yw, h: 0.28, fontSize: 10.5, bold: true, align: 'center', color: C.muted });
      s.addShape(pres.shapes.LINE, { x: x0 + (yv - 1) * yw, y: 2.28, w: 0, h: rows.length * rh + 0.06, line: { color: C.line, width: 0.75 } });
    }
    const COL = { d: C.accent, s: C.accent2, i: C.muted };
    rows.forEach(([t, a, b, pa, pb, k], i) => {
      const y = y0 + i * rh, col = COL[k];
      d.text(s, t, { x: M, y, w: 3.0, h: rh - 0.04, fontSize: 11, bold: true, valign: 'middle' });
      if (pa) s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x0 + (pa - 1) * yw + 0.03, y: y + 0.06, w: (pb - pa + 1) * yw - 0.06, h: rh - 0.14, rectRadius: 0.06, fill: { color: col, transparency: 75 }, line: { color: col, width: 0.75, dashType: 'dash' }, objectName: `a${i + 1}_p` });
      if (a) s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x0 + (a - 1) * yw + 0.03, y: y + 0.06, w: (b - a + 1) * yw - 0.06, h: rh - 0.14, rectRadius: 0.06, fill: { color: col }, line: { color: col, width: 0 }, objectName: `a${i + 1}_b` });
    });
    // legend
    const ly = 6.38;
    [['Цифровые · реализация', C.accent, false], ['Спорт · реализация', C.accent2, false], ['Подготовка: пилоты, ТЭО', C.accent2, true], ['Stadium, City · подготовка', C.muted, true]].forEach(([t, col, dash], i) => {
      const lx = M + i * 3.05;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: lx, y: ly + 0.04, w: 0.42, h: 0.2, rectRadius: 0.05, fill: { color: col, transparency: dash ? 75 : 0 }, line: { color: col, width: 0.75, dashType: dash ? 'dash' : 'solid' } });
      d.text(s, t, { x: lx + 0.52, y: ly, w: 2.5, h: 0.28, fontSize: 10, color: C.soft, valign: 'middle' });
    });
  }

  // 113 — KPI & control
  {
    const s = d.slide({
      title: 'KPI, контроль исполнения и ключевые этапы', status: 'NODATA',
      source: 'KPI игрового направления — BX-008 (DAU, MAU, Retention, Revenue, Conversion, Community Growth). Целевые значения не заданы документами.',
      notes: 'ТЕЗИС: каждое направление управляется 1–2 главными метриками с понятной частотой контроля; целевые значения утверждаются вместе с бизнес-планом.\nBX-008: инвестору важны DAU, MAU, Retention, Revenue, Conversion, Community Growth. Фактические значения появятся после тестов этапа Foundation.\nИллюстративные цели предыдущей версии удалены (правило 12 ТЗ).\nКонтроль: ежемесячный отчёт правлению, квартальный — наблюдательному совету, ежегодный — участникам.\nСвязка: глава XII — видение будущего.',
    });
    const T = 'Требуется подтверждение';
    d.table(s, [
      ['Направление', 'KPI', 'Основа', 'Цель', 'Контроль'],
      ['FootureX Game', 'DAU · MAU · Retention', 'BX-008', T, 'Еженедельно'],
      ['FootureX Game', 'Conversion · Revenue (Stars / TON)', 'BX-008, BX-013', T, 'Ежемесячно'],
      ['Community', 'Community Growth', 'BX-008', T, 'Ежемесячно'],
      ['Technologies', 'Выручка, маржа, загрузка', 'Концепция', T, 'Ежемесячно'],
      ['AI', 'Проекты, клиенты подписки', 'Концепция', T, 'Ежемесячно'],
      ['Academy', 'Слушатели, трудоустройство', 'Концепция', T, 'Ежеквартально'],
      ['Game Development', 'Проекты студии, клиенты', 'Концепция', T, 'Ежеквартально'],
      ['Esports', 'Участники, просмотры, спонсоры', 'Концепция', T, 'Ежеквартально'],
      ['FC FootureX', 'Лицензирование, состав', 'Концепция', T, 'Ежегодно'],
      ['Football Academy', 'Воспитанники, программы', 'Концепция', T, 'Ежегодно'],
      ['Stadium / City', 'Этап подготовки', 'Глава IX', 'Опция A → B → C', 'Ежегодно'],
    ], { y: 1.98, colW: [2.45, 3.3, 1.8, 2.75, 1.83], rowH: 0.36, size: 10, boldFirstCol: true });
  }
};
