// ГЛАВА V. GAME DEVELOPMENT (41–52) — документальная основа: BX-001, BX-003, BX-004, BX-005, BX-007, BX-013
const { C, F, W, H, M } = require('../deck/lib');

const SRC = {
  b1: 'Источник: BX-001 Business Plan / Strategic Business Architecture, v0.0.17.',
  b3: 'Источник: BX-003 Economy Design Document, v0.1.01; BX-013 Approved Services Catalog, v1.0 (июнь 2026).',
  b4: 'Источник: BX-004 Game System Design, v0.0.19.',
  b5: 'Источники: BX-005 Technical Architecture, v0.0.79; BX-007 Telegram Web App Architecture, v0.1.21.',
  b13: 'Источник: BX-013 Approved Services Catalog, v1.0 (июнь 2026) — заменяет цены BX-010.',
};

module.exports = async (d, pres) => {
  // 41 — Studio opener
  {
    const s = d.slide({
      title: 'FootureX Game Development Studio', status: 'CONCEPT', source: SRC.b1 + ' Telegram как платформа запуска — BX-007.',
      notes: 'ТЕЗИС: игровая студия FootureX (концепция) создаёт собственные игры и выполняет разработку для заказчиков; её флагманская IP — FootureX Game. По BX-001 это долгосрочная спортивно-цифровая экосистема, а не одна игра: футбольный симулятор, Telegram Web App, игровая экономика, пользовательские лиги, цифровая карьера игроков, соревновательная инфраструктура, социальные механики и перспективная blockchain-инфраструктура.\nМиссия игрового проекта (BX-001): создание крупнейшей футбольной цифровой экосистемы Центральной Азии с дальнейшим выходом на международный рынок. Горизонт — 10–12 лет.\nСтатус: FootureX Game — в разработке, операционный этап Stage 0 MVP (BX-016, по BX-015 §15). В коде MVP реализованы вход через Telegram, создание клуба, состав и тактика, серверный движок матчей и учёт валют с firewalls; магазин, платежи, лиги и маркетплейс — в плане. Foundation — первый продуктовый этап по BX-001. Формулировку статуса подтверждает владелец. Экраны — концепты интерфейса с демо-данными.\nСвязка: далее — архитектура экосистемы.',
    });
    const ci = d.chapterInfo;
    d.text(s, ci.num, { x: M - 0.05, y: 1.95, w: 4, h: 1.45, fontSize: 88, fontFace: F.displayLatin, color: C.accent, objectName: '!!roman' });
    d.text(s, ci.ru.toUpperCase(), { x: M, y: 3.45, w: 5.8, h: 0.35, fontSize: 13, bold: true, color: C.soft, charSpacing: 2 });
    d.text(s, 'Студия собственных и заказных игр. Флагманская IP — FootureX Game: по BX-001 — крупнейшая футбольная цифровая экосистема Центральной Азии.', { x: M, y: 3.95, w: 5.3, h: 1.3, fontSize: 14.5, color: 'FFFFFF', lineSpacingMultiple: 1.15, objectName: 'a1_lead' });
    [['10–12', 'лет · горизонт игрового проекта'], ['Telegram', 'платформа запуска (BX-007)'], ['Stage 0', 'MVP в разработке (BX-016)']].forEach(([v, l], i) => {
      const x = M + i * 1.8;
      d.text(s, v, { x, y: 5.4, w: 1.75, h: 0.42, fontSize: v.length > 6 ? 14 : 20, fontFace: F.displayLatin, color: C.accent, objectName: `a${i + 2}_v` });
      d.text(s, l, { x, y: 5.85, w: 1.7, h: 0.5, fontSize: 10.5, color: C.soft, objectName: `a${i + 2}_l` });
    });
    d.phoneImg(s, 'game-home', 6.2, 1.95, 4.5, '!!phoneA');
    d.phoneImg(s, 'game-squad', 8.35, 1.7, 4.95, '!!phoneB');
    d.phoneImg(s, 'game-player', 10.55, 1.95, 4.5, '!!phoneC');
    d.caption(s, 'Концепт интерфейса · демо-данные', W - M - 3.2, 6.5);
  }

  // 42 — Studio concept + flagship architecture (BX-001)
  {
    const s = d.slide({
      title: 'Концепция игровой студии: собственные IP и разработка на заказ', status: 'CONCEPT',
      source: 'Направления студии — корпоративная концепция (бриф). Архитектура флагмана — BX-001 Business Plan, v0.0.17; распределение систем по этапам — по BX-001/BX-008, согласуется с бэклогом Stage 0 (BX-016).',
      notes: 'ТЕЗИС: студия — самостоятельное направление: собственные игры (IP), разработка для заказчиков, LiveOps и игровая аналитика, проектирование игровых экономик. Флагманская IP — FootureX Game.\nСтатус студии: концепция; заказная разработка документами BX не описана, клиентов и договоров нет.\nСправа — 12 систем архитектуры FootureX Game по BX-001. Распределение систем по этапам (Foundation / Ecosystem Expansion / после подтверждения) — по BX-001 и BX-008; согласуется с бэклогом Stage 0 (BX-016): Game Core, Telegram, Economy, Progression, Battle Pass, LiveOps и Web Platform (лендинг) — Stage 0; в League System на Stage 0 только базовые системные лиги, полные и пользовательские — Stage 1; Marketplace — Stage 1; blockchain/NFT — Stage 2.\nСвязка: далее — продуктовая стратегия флагмана.',
    });
    const lines = [['LuGamepad2', 'Собственные игры (IP)', 'FootureX Game — флагман; будущие проекты на той же платформе.'], ['LuBriefcase', 'Разработка на заказ', 'Игры и игровые механики для брендов, банков, телекома и студий.'],
      ['LuRefreshCw', 'LiveOps и аналитика', 'Сезоны, события и игровая аналитика как услуга.'], ['LuScale', 'Game Economy Design', 'Экономики по принципам BX-003: эмиссия, баланс источников и расходов.']];
    for (let i = 0; i < 4; i++) {
      const [ic, t, x2] = lines[i];
      const x = M + (i % 2) * 3.2, y = 2.0 + Math.floor(i / 2) * 2.27;
      d.card(s, x, y, 3.05, 2.12, { name: `a${i + 1}_c` });
      await d.iconBadge(s, ic, x + 0.22, y + 0.22, 0.5, { name: `a${i + 1}_i` });
      d.text(s, t, { x: x + 0.22, y: y + 0.85, w: 2.65, h: 0.32, fontSize: 13.5, bold: true });
      d.text(s, x2, { x: x + 0.22, y: y + 1.2, w: 2.65, h: 0.8, fontSize: 11, color: C.soft });
    }
    const px = 7.15, pw = W - M - px;
    d.card(s, px, 2.0, pw, 4.42, { name: 'a5_c', line: C.accent2 });
    d.text(s, 'Флагманская IP · архитектура FootureX Game (BX-001)', { x: px + 0.22, y: 2.13, w: pw - 0.4, h: 0.3, fontSize: 12.5, bold: true, color: C.accent });
    const sys = [['Game Core', 'F'], ['Telegram Ecosystem', 'F'], ['Economy System', 'F'], ['Progression', 'F'], ['Battle Pass', 'F'], ['LiveOps', 'F'],
      ['Web Platform', 'F'], ['League System', 'E'], ['Marketplace', 'E'], ['Social Layer', 'E'], ['Media Direction', 'E'], ['Future Blockchain', 'B']];
    const SC = { F: C.accent2, E: C.dot, B: C.muted };
    sys.forEach(([t, k], i) => {
      const x = px + 0.22 + (i % 2) * ((pw - 0.54) / 2 + 0.1), y = 2.6 + Math.floor(i / 2) * 0.5, w = (pw - 0.54) / 2;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h: 0.4, rectRadius: 0.08, fill: { color: k === 'F' ? C.outline : C.surface }, line: { color: SC[k], width: 0.9, dashType: k === 'B' ? 'dash' : 'solid' }, objectName: `a${6 + Math.floor(i / 4)}_s${i}` });
      d.text(s, t, { x: x + 0.12, y, w: w - 0.2, h: 0.4, fontSize: 11, bold: true, valign: 'middle', fontFace: F.bodyLatin });
    });
    [['Foundation', C.accent2], ['Ecosystem Expansion', C.dot], ['после подтверждения ядра (пунктир)', C.muted]].forEach(([t, col], i) => {
      const x = px + 0.22 + i * 1.75;
      s.addShape(pres.shapes.OVAL, { x, y: 5.68, w: 0.14, h: 0.14, fill: i === 2 ? { type: 'none' } : { color: col }, line: { color: col, width: i === 2 ? 1 : 0, dashType: i === 2 ? 'dash' : 'solid' } });
      d.text(s, t, { x: x + 0.2, y: 5.6, w: 1.6, h: 0.3, fontSize: 9.5, color: C.soft, valign: 'middle' });
    });
    d.text(s, 'Этапы по BX-001/BX-008; согласуется с бэклогом Stage 0 (BX-016)', { x: px + 0.22, y: 5.95, w: pw - 0.4, h: 0.3, fontSize: 9.5, color: C.muted });
  }

  // 43 — Product strategy (BX-001)
  {
    const s = d.slide({
      title: 'Продуктовая стратегия GameDev: флагманская IP FootureX Game', status: 'DOC', source: SRC.b1,
      notes: 'ТЕЗИС: продуктовая стратегия BX-001 задаёт пять целей, четыре принципа бизнес-модели, четыре целевых сегмента и последовательную географию.\nЦели: узнаваемая IP; устойчивая игровая экономика; инфраструктура киберспорта и лиг; интеграция реальных спортивных проектов; платформа развития молодёжи и футбольных талантов.\nБизнес-модель: Freemium, Live Service, Seasonal Economy, Controlled Marketplace.\nАудитория: школьники 12–17, студенты 18–24, football gamers 16–30, пользователи Telegram 15–35.\nГеография: Ташкент и Узбекистан → СНГ → международный рынок.\nСвязка: далее — основной игровой продукт.',
    });
    const col = (x, w, title, items, a) => {
      d.card(s, x, 2.0, w, 4.45, { name: a });
      d.text(s, title, { x: x + 0.22, y: 2.15, w: w - 0.4, h: 0.32, fontSize: 13, bold: true, color: C.accent });
      d.bullets(s, items, x + 0.22, 2.6, w - 0.4, 3.7, { fontSize: 11.5, gap: 6 });
    };
    col(M, 3.4, 'Цели BX-001', ['Узнаваемая интеллектуальная собственность', 'Устойчивая игровая экономика', 'Инфраструктура киберспорта и лиг', 'Интеграция реальных спортивных проектов', 'Платформа развития молодёжи и футбольных талантов'], 'a1_c');
    col(4.2, 2.75, 'Бизнес-модель', ['Freemium', 'Live Service', 'Seasonal Economy', 'Controlled Marketplace'], 'a2_c');
    d.card(s, 7.15, 2.0, 5.58, 2.55, { name: 'a3_c' });
    d.text(s, 'Целевая аудитория', { x: 7.37, y: 2.15, w: 5, h: 0.32, fontSize: 13, bold: true, color: C.accent });
    [['12–17', 'школьники'], ['18–24', 'студенты'], ['16–30', 'football gamers'], ['15–35', 'пользователи Telegram']].forEach(([a, b], i) => {
      const x = 7.37 + (i % 2) * 2.65, y = 2.62 + Math.floor(i / 2) * 0.88;
      d.text(s, a, { x, y, w: 1.2, h: 0.4, fontSize: 18, fontFace: F.displayLatin, color: C.text });
      d.text(s, b, { x: x + 1.25, y: y + 0.04, w: 1.4, h: 0.4, fontSize: 11.5, color: C.soft, valign: 'middle' });
    });
    d.card(s, 7.15, 4.75, 5.58, 1.7, { name: 'a4_c' });
    d.text(s, 'География', { x: 7.37, y: 4.9, w: 5, h: 0.32, fontSize: 13, bold: true, color: C.accent });
    ['Ташкент и Узбекистан', 'СНГ', 'Международный рынок'].forEach((t, i) => {
      const x = 7.37 + i * 1.75;
      d.pill(s, t, x, 5.45, { w: 1.62, h: 0.5, fontSize: 9.5, color: i === 0 ? C.accent2 : C.line, fill: i === 0 ? C.outline : C.surface });
      if (i < 2) s.addShape(pres.shapes.LINE, { x: x + 1.63, y: 5.7, w: 0.11, h: 0, line: { color: C.accent, width: 1.25, endArrowType: 'triangle' } });
    });
  }

  // 44 — Football Manager main product (BX-004 core loop)
  {
    const s = d.slide({
      title: 'Football Manager — основной игровой продукт', status: 'DOC', source: SRC.b4,
      notes: 'ТЕЗИС: BX-004 проектирует FootureX как Football Manager, Competitive Ecosystem, Progression Platform и Social Football Universe; удержание строится на главном игровом цикле.\nЦикл: Login → Daily Systems → Training → Squad Management → Matches → Rewards → Progression → Marketplace → Events → League → Repeat.\nГлавный принцип BX-004: пользователь должен возвращаться ради интересного игрового опыта, а не из-за искусственного принуждения.\nСвязка: далее — архитектура приложения.',
    });
    d.phoneImg(s, 'game-home', M, 1.95, 4.55, '!!phoneA');
    d.caption(s, 'Концепт интерфейса', M, 6.42, { align: 'left' });
    const roles = ['Football Manager', 'Competitive Ecosystem', 'Progression Platform', 'Social Football Universe'];
    roles.forEach((t, i) => d.pill(s, t, 3.05 + i * 2.43, 2.0, { w: 2.33, h: 0.42, fontSize: 9.5, color: C.accent2, fill: C.outline }));
    // core loop as ring of 10 steps
    const loop = ['Login', 'Daily Systems', 'Training', 'Squad Management', 'Matches', 'Rewards', 'Progression', 'Marketplace', 'Events', 'League'];
    const cx = 7.95, cy = 4.55, rx = 3.85, ry = 1.55;
    s.addShape(pres.shapes.OVAL, { x: cx - rx, y: cy - ry, w: rx * 2, h: ry * 2, fill: { type: 'none' }, line: { color: C.line, width: 1, dashType: 'dash' } });
    d.text(s, 'REPEAT', { x: cx - 1.2, y: cy - 0.35, w: 2.4, h: 0.4, fontSize: 16, fontFace: F.displayLatin, color: C.accent, align: 'center' });
    d.text(s, 'главный игровой цикл · BX-004', { x: cx - 1.6, y: cy + 0.08, w: 3.2, h: 0.3, fontSize: 10, color: C.muted, align: 'center' });
    loop.forEach((t, i) => {
      const ang = -Math.PI / 2 + (i / loop.length) * Math.PI * 2;
      const x = cx + Math.cos(ang) * rx, y = cy + Math.sin(ang) * ry;
      const w = 1.86;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x - w / 2, y: y - 0.22, w, h: 0.44, rectRadius: 0.22, fill: { color: C.surface }, line: { color: i === 0 ? C.accent2 : C.line, width: 1 }, objectName: `a${i + 1}_l` });
      d.text(s, `${i + 1}. ${t}`, { x: x - w / 2, y: y - 0.22, w, h: 0.44, fontSize: 9.5, bold: true, align: 'center', valign: 'middle', fontFace: F.bodyLatin, objectName: `a${i + 1}_t` });
    });
  }

  // 45 — App architecture (BX-005 + BX-007)
  {
    const s = d.slide({
      title: 'Архитектура игрового приложения', status: 'DOC', source: SRC.b5,
      notes: 'ТЕЗИС: FootureX строится как масштабируемая Live-Service Platform; Telegram Bot — навигационный шлюз, Web App — интерфейс, Backend API — основная логика; критическая игровая логика рассчитывается на сервере.\nBX-007: Telegram → Bot → Web App → API Gateway → Backend → Database → Realtime. Функции бота: запуск Web App, уведомления, события, Deep Links, поддержка, реферальная система.\nBX-005: Client → API Gateway → Auth Layer → Core Services → Databases → Realtime → Analytics → Monitoring. Frontend: React, Next.js, TypeScript, Tailwind, Zustand/Redux, WebSocket. Backend: Node.js, NestJS, TypeScript, PostgreSQL, Redis, RabbitMQ/Kafka, WebSocket Gateway, Docker. API: REST, WebSocket, внутренние события; JWT, Rate Limiting, API Versioning, Validation.\nВАЖНО: это целевая архитектура документов. В коде MVP Stage 0 уже реализованы: вход через Telegram с проверкой initData (HMAC) и JWT, REST API на NestJS, PostgreSQL/Prisma, серверный детерминированный движок матчей, учёт валют с firewalls и идемпотентностью (BX-017 и код MVP). Отличия MVP от целевого стека: интерфейс на React + Vite (не Next.js), Redis, очереди и WebSocket — на следующих этапах. Актуальность перечня на дату показа подтверждает техническая команда.\nПринципы BX-005: Scalability, Modularity, Security First, API-Driven, Observability, Fault Tolerance; критическая логика — на сервере.\nСвязка: далее — состав и управление командой.',
    });
    d.layers(s, [
      { title: 'Telegram (BX-007)', items: ['Telegram Bot · шлюз', 'Web App · интерфейс', 'Deep Links · рефералы', 'Уведомления'] },
      { title: 'Вход', items: ['API Gateway', 'Auth Layer · JWT', 'Rate Limiting', 'API Versioning'] },
      { title: 'Core Services', items: ['Auth · User', 'Match · League', 'Economy · Marketplace', 'Notification', 'Analytics · LiveOps'] },
      { title: 'Данные и события', items: ['PostgreSQL · данные', 'Redis · сессии, очереди', 'RabbitMQ / Kafka', 'WebSocket Gateway'] },
      { title: 'Match Pipeline', items: ['Queue → Matchmaking', 'Session → Simulation', 'Validation → Storage', 'Rewards'] },
      { title: 'Эксплуатация', items: ['Docker · оркестрация', 'Мониторинг', 'Резервное копирование', 'Аудит и антифрод'] },
    ], { y: 2.0, lh: 0.56, gap: 0.07, labelW: 2.35, itemSize: 10 });
    d.tag(s, 'ЦЕЛЕВАЯ АРХИТЕКТУРА ПО BX-005 / BX-007 · ЧАСТЬ КОМПОНЕНТОВ УЖЕ В КОДЕ MVP (STAGE 0)', C.dot);
    d.text(s, [{ text: 'Стек BX-005: ', options: { bold: true, color: C.accent } }, { text: 'Frontend — React, Next.js, TypeScript · Backend — Node.js, NestJS, PostgreSQL, Redis, RabbitMQ/Kafka · API — REST, WebSocket, JWT' }], { x: M, y: 5.84, w: 12.1, h: 0.3, fontSize: 10.5, color: C.soft });
    d.text(s, [{ text: 'Уже в коде MVP: ', options: { bold: true, color: C.accent } }, { text: 'вход через Telegram + JWT · REST API на NestJS · PostgreSQL · серверный движок матчей · учёт валют с firewalls' }], { x: M, y: 6.13, w: 12.1, h: 0.3, fontSize: 10.5, color: C.soft });
  }

  // 46 — Squad management (BX-004)
  {
    const s = d.slide({
      title: 'Создание команды и управление составом', status: 'DOC', source: SRC.b4,
      notes: 'ТЕЗИС: глубина менеджмента — в сочетании состава, тактики и сыгранности.\nBX-004: Squad System — основной состав, резерв, молодёжный состав, тактические настройки. Tactical System — Formation, Pressing, Tempo, Defensive Line, Attack Focus. Chemistry System — лига, страна, клубные связи, специальные игровые комбинации. Player Identity System — Level, Reputation, Rank, Club History, Achievements, Seasonal Stats.\nBX-004 — целевой дизайн. В MVP Stage 0 реализована упрощённая модель: 11 игроков, формация, прессинг и темп, сыгранность по соответствию позиций; резерв, молодёжный состав и полная тактика — следующие этапы.\nСвязка: далее — развитие футболистов.',
    });
    d.phoneImg(s, 'game-squad', W - M - 4.55 * 430 / 900, 1.85, 4.55, '!!phoneA');
    d.caption(s, 'Концепт · имена вымышлены', W - M - 3.2, 6.55);
    const blocks = [
      ['Squad System', ['Основной состав', 'Резерв', 'Молодёжный состав', 'Тактические настройки']],
      ['Tactical System', ['Formation', 'Pressing', 'Tempo', 'Defensive Line', 'Attack Focus']],
      ['Chemistry System', ['Лига', 'Страна', 'Клубные связи', 'Специальные комбинации']],
      ['Player Identity', ['Level · Reputation · Rank', 'Club History', 'Achievements', 'Seasonal Stats']],
    ];
    blocks.forEach(([t, items], i) => {
      const x = M + (i % 2) * 4.7, y = 2.0 + Math.floor(i / 2) * 2.28;
      d.card(s, x, y, 4.5, 2.1, { name: `a${i + 1}_c` });
      d.text(s, t, { x: x + 0.22, y: y + 0.15, w: 3.4, h: 0.32, fontSize: 13.5, bold: true, color: C.accent, fontFace: F.bodyLatin });
      d.bullets(s, items, x + 0.22, y + 0.58, 3.4, 1.45, { fontSize: 11.5, gap: 3 });
    });
  }

  // 47 — Player development (BX-004 + rarity reconciliation with BX-013)
  {
    const s = d.slide({
      title: 'Развитие футболистов и игровые характеристики', status: 'DOC', source: SRC.b4 + ' Редкость — BX-013 v1.0.',
      notes: 'ТЕЗИС: каждый футболист описывается 8 открытыми и 5 скрытыми характеристиками и развивается через тренировки, матчи, специальных тренеров, события и Evolution System.\nРАСХОЖДЕНИЕ ДОКУМЕНТОВ: BX-004 v0.0.19 приводит категории Common, Rare, Elite, Legendary, Iconic; утверждённый каталог BX-013 v1.0 — Common → Uncommon → Rare → Epic → Legendary → Immortal, а Elite — отдельная сезонная/премиальная категория; Iconic в BX-013 отсутствует. В презентации применяется линейка BX-013 как более поздняя и утверждённая; BX-004 требует обновления. Код MVP использует линейку BX-013.\nBX-004 — целевой дизайн (8 открытых и 5 скрытых характеристик). В MVP Stage 0 — упрощённый набор из 6 характеристик: скорость, удар, пас, защита, физика, игра вратаря.\nСвязка: далее — лиги, PvP и турниры.',
    });
    d.phoneImg(s, 'game-player', M, 1.85, 4.55, '!!phoneA');
    d.caption(s, 'Концепт · имена вымышлены', M, 6.42, { align: 'left' });
    d.card(s, 3.05, 2.0, 4.6, 2.35, { name: 'a1_c' });
    d.text(s, 'Характеристики · 8 открытых', { x: 3.27, y: 2.13, w: 4.2, h: 0.3, fontSize: 12.5, bold: true, color: C.accent });
    ['Pace', 'Shooting', 'Passing', 'Dribbling', 'Defense', 'Physical', 'Stamina', 'Vision'].forEach((t, i) => d.pill(s, t, 3.27 + (i % 4) * 1.06, 2.58 + Math.floor(i / 4) * 0.42, { w: 0.98, h: 0.32, fontSize: 9, color: C.accent2 }));
    d.text(s, 'Скрытые: Mentality · Consistency · Pressure Resistance · Chemistry Adaptation · Injury Resistance', { x: 3.27, y: 3.5, w: 4.2, h: 0.7, fontSize: 10.5, color: C.soft });
    d.card(s, 3.05, 4.5, 4.6, 1.95, { name: 'a2_c' });
    d.text(s, 'Progression System', { x: 3.27, y: 4.63, w: 4.2, h: 0.3, fontSize: 12.5, bold: true, color: C.accent, fontFace: F.bodyLatin });
    d.bullets(s, ['Тренировки и матчи', 'Специальные тренеры', 'Игровые события', 'Evolution System'], 3.27, 5.03, 4.2, 1.35, { fontSize: 11.5, gap: 3 });
    d.card(s, 7.85, 2.0, 4.88, 4.45, { name: 'a3_c', line: C.dot });
    d.text(s, 'Редкость: расхождение версий', { x: 8.07, y: 2.13, w: 4.5, h: 0.3, fontSize: 12.5, bold: true, color: C.dot });
    d.text(s, 'BX-004 · v0.0.19', { x: 8.07, y: 2.55, w: 4.5, h: 0.25, fontSize: 10, color: C.muted });
    d.text(s, 'Common · Rare · Elite · Legendary · Iconic', { x: 8.07, y: 2.82, w: 4.5, h: 0.3, fontSize: 11.5, fontFace: F.bodyLatin, color: C.soft });
    d.text(s, 'BX-013 · v1.0 · утверждено', { x: 8.07, y: 3.3, w: 4.5, h: 0.25, fontSize: 10, color: C.accent });
    ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Immortal'].forEach((t, i) => {
      const y = 3.62 + i * 0.36;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 8.07, y, w: 1.25 + i * 0.5, h: 0.28, rectRadius: 0.06, fill: { color: i < 2 ? C.line : i < 4 ? C.outline : C.accent2 }, line: { color: C.accent2, width: 0.5 } });
      d.text(s, t, { x: 8.15, y, w: 2.6, h: 0.28, fontSize: 9.5, bold: true, valign: 'middle', fontFace: F.bodyLatin });
    });
    d.text(s, '+ Elite — отдельная сезонная/премиальная категория. В презентации — утверждённый каталог BX-013; финальная линейка — решение основателя.', { x: 8.07, y: 5.85, w: 4.5, h: 0.5, fontSize: 9.5, color: C.dot });
  }

  // 48 — Leagues, PvP, tournaments (BX-004 + BX-013)
  {
    const s = d.slide({
      title: 'Лиги, PvP и турниры: соревновательная структура', status: 'DOC', source: SRC.b4 + ' Цены лиг и взносы — BX-013 v1.0.',
      notes: 'ТЕЗИС: соревновательная структура объединяет шесть типов матчей, четыре типа лиг и честный матчмейкинг.\nBX-004: Quick Match, Ranked, Tournament, League, Friendly, Event Match; лиги Public, Private, Competitive, Sponsored; матчмейкинг учитывает ранг, силу команды, скрытый MMR, поведение и регион задержки.\nBX-013: системные лиги бесплатно (ранги 19–100); Fan League — создание 69 FTXcoin, Pro — 109, Master — 149; дополнительные 4 места до лимита 48 — 20 FTXcoin. Взносы за 7-дневный сезон: Fan 5 (2 создателю / 2 в призовой фонд / 1 в казну), Pro 8 (3/3/2), Master 12 (5/5/2).\nВажно: взносы в FTXcoin — расход внутриигровой валюты и оборот между пользователями, а не денежная выручка.\nМодель данных MVP: лига по умолчанию на 20 мест, до 48 с расширениями (20 + 7 × 4 = 48); доля «казна» обозначена как сжигание (treasuryBurn). Это значения кода, а не текст каталога — норму BX-013 подтверждает владелец. Ранги 19–100 — системная рейтинговая лестница на шкале рейтинга клуба 1–100 (новый клуб получает 100). Базовые системные лиги — Stage 0, полные и пользовательские — Stage 1 (BX-016).\nСвязка: далее — экономика.',
    });
    d.phoneImg(s, 'game-league', W - M - 4.55 * 430 / 900, 1.85, 4.55, '!!phoneA');
    d.caption(s, 'Концепт интерфейса', W - M - 3.2, 6.45);
    d.card(s, M, 2.0, 4.15, 2.05, { name: 'a1_c' });
    d.text(s, 'Типы матчей', { x: M + 0.22, y: 2.13, w: 3.7, h: 0.3, fontSize: 12.5, bold: true, color: C.accent });
    ['Quick Match', 'Ranked', 'Tournament', 'League', 'Friendly', 'Event Match'].forEach((t, i) => d.pill(s, t, M + 0.22 + (i % 2) * 1.85, 2.55 + Math.floor(i / 2) * 0.44, { w: 1.75, h: 0.34, fontSize: 9, color: C.accent2 }));
    d.card(s, 4.95, 2.0, 3.85, 2.05, { name: 'a2_c' });
    d.text(s, 'Типы лиг · PvP', { x: 5.17, y: 2.13, w: 3.4, h: 0.3, fontSize: 12.5, bold: true, color: C.accent });
    d.text(s, 'Public · Private · Competitive · Sponsored', { x: 5.17, y: 2.5, w: 3.45, h: 0.5, fontSize: 11, fontFace: F.bodyLatin, color: C.text });
    d.text(s, 'Матчмейкинг: ранг, сила команды, скрытый MMR, поведение, регион задержки', { x: 5.17, y: 3.05, w: 3.45, h: 0.85, fontSize: 10.5, color: C.soft });
    d.table(s, [
      ['Лига (BX-013)', 'Создание', 'Взнос / 7 дней', 'Создателю · фонд · казна'],
      ['Системная (ранги 19–100)', 'бесплатно', '—', '—'],
      ['Fan League', '69 FTXcoin', '5 FTXcoin', '2 · 2 · 1'],
      ['Pro League', '109 FTXcoin', '8 FTXcoin', '3 · 3 · 2'],
      ['Master League', '149 FTXcoin', '12 FTXcoin', '5 · 5 · 2'],
    ], { x: M, y: 4.25, w: 8.2, colW: [2.6, 1.6, 1.7, 2.3], rowH: 0.36, size: 10.5, hSize: 10, boldFirstCol: true });
    d.text(s, '+4 места за 20 FTXcoin, лимит 48 · доли создателя и фонда — оборот между пользователями; казна в модели данных MVP — сжигание (требует подтверждения). Взносы — не выручка.', { x: M, y: 6.08, w: 8.3, h: 0.42, fontSize: 10, color: C.dot });
    d.tag(s, 'ЦЕНЫ УТВЕРЖДЕНЫ (BX-013) · ПОЛЬЗОВАТЕЛЬСКИЕ ЛИГИ — ЭТАП ECOSYSTEM EXPANSION (BX-001)', C.accent);
  }

  // 49 — In-game economy (BX-003 + BX-013 + brandbook)
  {
    const s = d.slide({
      title: 'Внутриигровая экономика: валюты отдельно от выручки', status: 'DOC', source: SRC.b3 + ' Терминология — FootureX Brand Book v1.0.',
      notes: 'ТЕЗИС: экономика держится на контроле эмиссии и балансе источников и расходов; выручка — только реальные платежи через Telegram Stars / TON (BX-013).\nCoins — мягкая валюта: источники — матчи, ежедневные награды, задания, достижения, сезоны, события; вывод из обращения — Upgrades, Contracts, League Participation, Crafting, Repair, Reroll (BX-003).\nFTXcoin — премиальная внутриигровая валюта без листинга (BX-013).\nТелеграм Stars / TON — платёжные механизмы (BX-013); TON — внешний механизм будущих blockchain-операций (BX-003); blockchain не обязателен для участия.\nFOOTX — перспективный внешний токен позднего этапа (BX-013; брендбук: с листингом на бирже). В коде MVP FOOTX отделён от игровой экономики «стеной»: FTXcoin не конвертируется в FOOTX и не связан с ним (firewall).\nFirewalls MVP: Coins ↛ FTXcoin; FTXcoin ↛ FOOTX; вывод любой внутренней валюты в деньги запрещён; «победа не продаётся» — сила состава ограничена капом на сервере.\nЦелевое правило анти-инфляции у владельца — расход не меньше источника (BX-011, документ не предоставлен).\nВНИМАНИЕ — правила Telegram (core.telegram.org/bots/payments-stars, проверено 28.10.2026): цифровые товары и услуги в ботах и Mini Apps оплачиваются только в Telegram Stars; TON используется разработчиком для вывода средств (Stars → TON через Fragment). Формулировка BX-013 «Stars / TON» требует решения владельца и юридического заключения; цены BX-013 не меняются.\nВерсия источника: код MVP ссылается на BX-003 v2; расхождения ниже сформулированы по доступной версии v0.1.01 — до получения v2 их актуальность не подтверждена.\nРАСХОЖДЕНИЯ: (1) роль FTXcoin: BX-003 — стратегическая игровая экономика; BX-013 — премиальная валюта, продаваемая пакетами; брендбук — валюта для управления, стейкинга и призовых внутри турниров. (2) BX-003 перечисляет Stars и TON среди валют, BX-013 — как платёжные механизмы. Требуется единая редакция.\nСвязка: далее — маркетплейс.',
    });
    d.tag(s, 'ВЫРУЧКА = ПОКУПКА FTXcoin И PREMIUM PASS ЗА TELEGRAM STARS / TON (BX-013) · ДВИЖЕНИЕ COINS И FTXcoin ВНУТРИ ИГРЫ — НЕ ВЫРУЧКА', C.accent);
    d.table(s, [
      ['Валюта / механизм', 'Тип', 'Роль в экосистеме', 'Документ'],
      ['Coins', 'мягкая внутриигровая', 'улучшения, контракты, покупки, восстановление', 'BX-003, BX-013'],
      ['FTXcoin', 'премиальная, без листинга', 'наборы, лиги, создание игроков; не выводится, не конвертируется в FOOTX', 'BX-013 · брендбук'],
      ['Telegram Stars', 'платёжный механизм', 'Premium Pass, премиум, косметика, бусты, кастомизация', 'BX-003, BX-013'],
      ['TON', 'внешний механизм', 'платежи; будущие blockchain-операции (не обязательны)', 'BX-003, BX-013'],
      ['FOOTX', 'внешний токен (поздний этап)', 'перспектива; отделён от игровой экономики', 'BX-013 · брендбук'],
    ], { x: M, y: 2.0, w: 8.15, colW: [1.75, 1.95, 3.15, 1.3], rowH: 0.48, size: 10.5, hSize: 10, boldFirstCol: true });
    d.card(s, M, 5.05, 8.15, 1.4, { name: 'a2_c' });
    d.text(s, 'Coins: источники → сток', { x: M + 0.22, y: 5.15, w: 7.6, h: 0.3, fontSize: 12, bold: true, color: C.accent });
    d.text(s, 'Матчи · ежедневные награды · задания · достижения · сезоны · события  →  Upgrades · Contracts · League Participation · Crafting · Repair · Reroll', { x: M + 0.22, y: 5.5, w: 7.7, h: 0.85, fontSize: 10.5, color: C.soft });
    d.card(s, 8.95, 2.0, 3.78, 2.35, { name: 'a3_c' });
    d.text(s, 'Принципы BX-003', { x: 9.17, y: 2.13, w: 3.4, h: 0.3, fontSize: 12.5, bold: true, color: C.accent });
    d.bullets(s, ['Контроль эмиссии', 'Баланс источников и расходов', 'Без гиперинфляции · «победа не продаётся»', 'Защита ценности активов и прогресса'], 9.17, 2.53, 3.4, 1.75, { fontSize: 10.5, gap: 3 });
    d.card(s, 8.95, 4.5, 3.78, 1.95, { name: 'a4_c', line: C.dot });
    d.text(s, 'Требует единой редакции', { x: 9.17, y: 4.62, w: 3.4, h: 0.3, fontSize: 12, bold: true, color: C.dot });
    d.text(s, 'Роль FTXcoin различается в BX-003, BX-013 и брендбуке (премиальная валюта / управление, стейкинг, призовые). Stars и TON: валюта или платёжный механизм.', { x: 9.17, y: 4.98, w: 3.42, h: 1.4, fontSize: 9.5, color: C.soft });
  }

  // 50 — Marketplace & digital assets (BX-013)
  {
    const s = d.slide({
      title: 'Marketplace и цифровые активы: контролируемый рынок', status: 'DOC', source: SRC.b13 + ' Blockchain — BX-003, BX-008.',
      notes: 'ТЕЗИС: Controlled Marketplace (BX-001) оживляет экономику, но строго отделяет доходы платформы от расходов валют и оборота между пользователями.\nBX-013: продажа игроков и активов, аренда, крафт, слияние, скаутинг; косметика, коллекционные дропы, турниры, сезонные награды, восстановление энергии, статусные преимущества.\nИсключено каталогом: прямой вывод FTXcoin в реальные деньги, конвертация Coins в FTXcoin, нечестные лутбоксы, ставки. В коде MVP дополнительно: вывод Coins тоже запрещён (нет play-to-earn), любые конвертации между внутренними валютами запрещены, FTXcoin не связан с FOOTX. Разрешится ли позднее обмен FTXcoin → Coins — вопрос владельцу.\nBlockchain и токенизированная экономика развиваются только после подтверждения устойчивости основного продукта (BX-008) и не являются обязательным условием участия (BX-003).\nСвязка: далее — LiveOps и удержание.',
    });
    d.tag(s, 'ЦЕНЫ И ПРАВИЛА УТВЕРЖДЕНЫ (BX-013) · ЗАПУСК MARKETPLACE — ЭТАП ECOSYSTEM EXPANSION (BX-001)', C.accent);
    d.phoneImg(s, 'game-market', M, 1.85, 4.55, '!!phoneA');
    d.caption(s, 'Концепт · имена вымышлены', M, 6.42, { align: 'left' });
    const three = [['Revenue', 'Реальные денежные поступления через Telegram Stars / TON', C.accent2], ['Sink', 'Расход внутренней валюты — сам по себе не выручка', C.accent], ['Оборот P2P', 'Обмен между пользователями внутри платформы', C.dot]];
    three.forEach(([t, x2, col], i) => {
      const x = 3.05 + i * 3.25;
      d.card(s, x, 2.0, 3.05, 1.65, { name: `a${i + 1}_c`, line: col });
      d.text(s, t, { x: x + 0.2, y: 2.12, w: 2.7, h: 0.4, fontSize: 15, fontFace: /[А-яЁё]/.test(t) ? F.displayCyrillic : F.displayLatin, color: col });
      d.text(s, x2, { x: x + 0.2, y: 2.6, w: 2.7, h: 0.95, fontSize: 11, color: C.soft });
    });
    d.card(s, 3.05, 3.85, 4.7, 2.6, { name: 'a4_c' });
    d.text(s, 'Механики Marketplace', { x: 3.27, y: 3.98, w: 4.3, h: 0.3, fontSize: 12.5, bold: true, color: C.accent });
    d.bullets(s, ['Продажа игроков и активов', 'Аренда', 'Крафт и слияние', 'Скаутинг', 'Доп. услуги: косметика, дропы, турниры, энергия, статусы'], 3.27, 4.4, 4.3, 1.95, { fontSize: 11, gap: 3 });
    d.card(s, 7.95, 3.85, 4.78, 2.6, { name: 'a5_c', line: C.dot });
    d.text(s, 'Исключено и ограничено', { x: 8.17, y: 3.98, w: 4.4, h: 0.3, fontSize: 12.5, bold: true, color: C.dot });
    d.bullets(s, ['Вывод Coins и FTXcoin в деньги', 'Конвертация Coins → FTXcoin и FTXcoin → FOOTX', 'Нечестные лутбоксы (BX-013)', 'Ставки (BX-013)', 'Blockchain — не обязателен для участия (BX-003)'], 8.17, 4.4, 4.4, 1.95, { fontSize: 11, gap: 3 });
  }

  // 51 — LiveOps & retention (BX-004 + BX-013)
  {
    const s = d.slide({
      title: 'LiveOps, сезоны и удержание игроков', status: 'DOC', source: SRC.b4 + ' Battle Pass — BX-013 v1.0.',
      notes: 'ТЕЗИС: удержание строится на сезонном ритме и честной ценности, а не на принуждении.\nRetention Systems (BX-004): Daily Rewards, Missions, Leagues, Battle Pass, Tournaments. New Player Experience: Tutorial → Starter Squad → First Match → Rewards → League Introduction. Anti-Cheat: серверная проверка действий, поведенческий анализ, защита от манипуляций статистикой.\nBattle Pass (BX-013): Free — бесплатно; Premium Pass — $3.99 за сезон 14 дней, 100 уровней.\nЦелевые значения удержания (D1/D7/D30) в документах не заданы — требуется подтверждение после тестов.\nСвязка: далее — план развития и выпуска.',
    });
    d.phoneImg(s, 'game-season', W - M - 4.55 * 430 / 900, 1.85, 4.55, '!!phoneA');
    d.caption(s, 'Концепт интерфейса', W - M - 3.2, 6.55);
    d.card(s, M, 2.0, 4.6, 2.2, { name: 'a1_c' });
    d.text(s, 'Retention Systems', { x: M + 0.22, y: 2.13, w: 3.6, h: 0.3, fontSize: 12.5, bold: true, color: C.accent, fontFace: F.bodyLatin });
    d.bullets(s, ['Daily Rewards', 'Missions', 'Leagues', 'Battle Pass', 'Tournaments'], M + 0.22, 2.53, 3.6, 1.6, { fontSize: 11, gap: 2 });
    d.card(s, 5.4, 2.0, 4.4, 2.2, { name: 'a2_c', line: C.accent2 });
    d.text(s, 'Battle Pass · BX-013', { x: 5.62, y: 2.13, w: 3.9, h: 0.3, fontSize: 12.5, bold: true, color: C.accent });
    d.text(s, '$3,99', { x: 5.62, y: 2.55, w: 2, h: 0.6, fontSize: 30, fontFace: F.displayLatin, color: C.text });
    d.text(s, 'Premium Pass · сезон 14 дней · 100 уровней · Free Pass — бесплатно', { x: 5.62, y: 3.25, w: 3.95, h: 0.8, fontSize: 11, color: C.soft });
    d.text(s, 'New Player Experience', { x: M, y: 4.45, w: 6, h: 0.3, fontSize: 12.5, bold: true, color: C.accent, fontFace: F.bodyLatin });
    ['Tutorial', 'Starter Squad', 'First Match', 'Rewards', 'League Intro'].forEach((t, i) => {
      const x = M + i * 1.86;
      d.pill(s, t, x, 4.88, { w: 1.7, h: 0.42, fontSize: 9.5, color: C.accent2, fill: i === 0 ? C.outline : C.surface });
      if (i < 4) s.addShape(pres.shapes.LINE, { x: x + 1.7, y: 5.09, w: 0.16, h: 0, line: { color: C.accent, width: 1.25, endArrowType: 'triangle' } });
    });
    d.card(s, M, 5.55, 9.2, 0.9, { name: 'a3_c' });
    d.text(s, [{ text: 'Принцип BX-004: ', options: { bold: true, color: C.accent } }, { text: 'пользователь возвращается ради интересного игрового опыта, а не из-за искусственного принуждения. Anti-Cheat — серверная проверка, поведенческий анализ.' }], { x: M + 0.22, y: 5.55, w: 8.8, h: 0.9, fontSize: 11.5, valign: 'middle', color: 'B8C1D4' });
  }

  // 52 — Release plan: product stages (BX-001) and investment stages (BX-008) as two separate lanes
  {
    const s = d.slide({
      title: 'План развития и выпуска игрового продукта', status: 'DOC', source: SRC.b1 + ' Инвестиционные стадии — BX-008 Investment & Partnership Strategy, v0.4.92.',
      notes: 'ТЕЗИС: у игрового продукта три шкалы, и их нельзя смешивать: продуктовая (BX-001), инвестиционная (BX-008) и операционная (BX-015 §15 / BX-016: Stage 0 → Stage 1 → Stage 2). Продуктовые этапы BX-001: Foundation → Ecosystem Expansion. Инвестиционные стадии BX-008: Bootstrap → Seed → Growth → Ecosystem Expansion.\nFoundation (BX-001): Telegram Web App, базовый gameplay, регистрация, игровая экономика, первые сезоны, тестовые турниры, MVP сайта. Ecosystem Expansion (BX-001): Marketplace, League System, Social Systems, игровые события, аналитика, масштабирование.\nBX-008: Bootstrap — MVP, собственные средства и близкие партнёры; Seed — Backend, Gameplay, Infrastructure, LiveOps, Marketing; Growth — после подтверждения retention, экономики и аудитории; Ecosystem Expansion (BX-008) — медиа, киберспорт, blockchain, партнёрства, футбольная инфраструктура.\nОперационные этапы (BX-016, BX-017): Stage 0 — MVP, идёт сейчас (вход, клуб, матч, базовый менеджмент, магазин; закрытая бета → публичный запуск в Узбекистане; завершается кейсом для Seed); Stage 1 — полные лиги и Marketplace; Stage 2 — NFT. По BX-017 маркетплейс отнесён к Stage 2 — уточнить.\nГлоссарий: Фазы 1–4 — горизонты группы (слайд 7); Foundation / Ecosystem Expansion — продукт (BX-001); Bootstrap…Ecosystem Expansion — инвестиции (BX-008); Stage 0/1/2 — разработка игры (BX-015).\nВНИМАНИЕ: «Ecosystem Expansion» в BX-001 и BX-008 означает разное — соответствие трёх шкал требует решения основателя. Календарные даты в документах не указаны.\nСвязка: глава VI — сообщество и киберспорт.',
    });
    const lane = (y, label, sub, items, col) => {
      d.text(s, label, { x: M, y: y - 0.02, w: 2.2, h: 0.32, fontSize: 13, bold: true, color: col });
      d.text(s, sub, { x: M, y: y + 0.3, w: 2.2, h: 0.5, fontSize: 9.5, color: C.muted });
      const x0 = 2.95, w = W - M - x0, n = items.length, gap = 0.16, iw = (w - gap * (n - 1)) / n;
      items.forEach(([t, x2], i) => {
        const x = x0 + i * (iw + gap);
        s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: iw, h: 1.62, rectRadius: 0.1, fill: { color: i === 0 ? C.outline : C.surface }, line: { color: col, width: 0.9 }, objectName: `a${(y > 4 ? 3 : 1) + Math.min(1, i)}_${y > 4 ? 'b' : 't'}${i}` });
        d.text(s, t, { x: x + 0.18, y: y + 0.12, w: iw - 0.3, h: 0.32, fontSize: t.length > 12 && n > 2 ? 10.5 : 13, fontFace: F.displayLatin, color: col });
        d.text(s, x2, { x: x + 0.18, y: y + 0.5, w: iw - 0.3, h: 1.05, fontSize: 10.5, color: C.soft });
        if (i < n - 1) s.addShape(pres.shapes.LINE, { x: x + iw + 0.01, y: y + 0.81, w: gap - 0.02, h: 0, line: { color: col, width: 1.25, endArrowType: 'triangle' } });
      });
    };
    lane(2.0, 'Продукт', 'этапы BX-001', [['Foundation', 'Telegram Web App · базовый gameplay · регистрация · экономика · первые сезоны · тестовые турниры · MVP сайта'], ['Ecosystem Expansion', 'Marketplace · League System · Social Systems · игровые события · аналитика · масштабирование']], C.accent);
    lane(3.9, 'Инвестиции', 'стадии BX-008', [['Bootstrap', 'MVP · собственные средства · близкие партнёры'], ['Seed', 'Backend · Gameplay · Infrastructure · LiveOps · Marketing'], ['Growth', 'После подтверждения retention, экономики и аудитории · новые рынки'], ['Ecosystem Expansion', 'Медиа · киберспорт · blockchain · партнёрства · футбольная инфраструктура']], C.dot);
    d.card(s, M, 5.72, W - 2 * M, 0.72, { name: 'a5_g' });
    d.text(s, [{ text: 'Разработка сейчас: ', options: { bold: true, color: C.accent } }, { text: 'Stage 0 — MVP (BX-016) → Stage 1 — полные лиги и Marketplace → Stage 2 — NFT. Рост — после подтверждения удержания, экономики и аудитории (BX-008). Соответствие шкал и даты — решение основателя.' }], { x: M + 0.25, y: 5.72, w: 11.6, h: 0.72, fontSize: 11, valign: 'middle', color: C.soft });
  }
};
