// ГЛАВА I. CORPORATE IDENTITY (1–10)
const { C, F, W, H, M, logoPath, LOGO_RATIO, HERO_RATIO } = require('../deck/lib');
const { renderPanel } = require('./common');

module.exports = async (d, pres) => {
  // 1 — Title
  {
    const s = d.slide({
      master: 'FX_COVER', logTitle: 'FootureX Uzbekistan — титульный слайд', kicker: false,
      notes: 'ТЕЗИС: FootureX Uzbekistan — технологическая компания из Ташкента с долгосрочной стратегией экосистемы.\nПодача: открываем не игрой, а компанией. Подчеркнуть: документ — стратегическая презентация, статус «проект для обсуждения».\nСвязка: далее — корпоративное видение «Creating the Future».\nЗнак и вордмарк извлечены из FootureX Brand Book v1.0 без перерисовки; композиция — как на обложке брендбука.',
      pre: (s) => d.fullImage(s, 'renders/hero-cover.jpg', { overlay: 'left', name: '!!render' }),
    });
    // brandbook cover: mark centred on the wordmark's axis, wordmark below; "Uzbekistan" stays outside the logo as a subtitle
    const WM = 5.6, MK = 1.0;
    s.addImage({ path: logoPath('mark').path, x: M + (WM - MK) / 2, y: 0.95, w: MK, h: MK, objectName: '!!mark' });
    s.addImage({ path: logoPath('hero').path, x: M, y: 2.3, w: WM, h: WM / HERO_RATIO, objectName: '!!logo' });
    d.text(s, 'Uzbekistan  ·  Corporate Vision & Strategic Development', { x: M, y: 3.42, w: 8.6, h: 0.4, fontSize: 15, fontFace: F.bodyLatin, color: C.text, charSpacing: 0.5, objectName: '!!uz' });
    d.text(s, 'Технологическая компания, создающая экосистему цифровых продуктов, искусственного интеллекта, игр, образования, киберспорта и спорта', { x: M, y: 4.05, w: 6.2, h: 0.95, fontSize: 14, color: 'B8C1D4', lineSpacingMultiple: 1.15 });
    d.text(s, 'MChJ «FootureX Uzbekistan»  ·  FootureX Uzbekistan LLC  ·  Ташкент, Республика Узбекистан', { x: M, y: 5.55, w: 8, h: 0.3, fontSize: 11, color: 'B8C1D4' });
    d.text(s, 'Версия 1.0  ·  Октябрь 2026  ·  Проект для обсуждения  ·  Конфиденциально', { x: M, y: 5.9, w: 8, h: 0.3, fontSize: 10, color: '8A93A6' });
    d.caption(s, 'Концептуальная визуализация');
  }

  // 2 — Creating the Future
  {
    const s = renderPanel(d, {
      img: 'renders/hero-close.jpg', side: 'left', title: 'Корпоративное видение', status: 'VISION', scale: 1.0, dx: 4.6,
      notes: 'ТЕЗИС: мы строим не продукт, а технологическую платформу роста, где каждое направление усиливает остальные.\nПодача: три опоры видения — технологии, игры и AI, спорт и городские инновации. Цифровые направления — фундамент ближайших лет; физическая инфраструктура — долгосрочная амбиция.\nСвязка: далее — откуда компания и почему Узбекистан.',
    });
    d.text(s, 'Creating the Future', { x: M, y: 2.0, w: 7, h: 0.75, fontSize: 34, fontFace: F.displayLatin, color: C.text, objectName: 'a1_big' });
    d.text(s, 'Мы строим технологическую компанию, которая соединяет программное обеспечение, искусственный интеллект, игры, образование и спорт в единую экосистему — из Ташкента для региона и мира.', { x: M, y: 2.95, w: 5.9, h: 1.3, fontSize: 15.5, color: 'FFFFFF', lineSpacingMultiple: 1.15, objectName: 'a2_lead' });
    const pillars = [['Technology', 'Софт, автоматизация, облако'], ['Gaming & AI', 'Игры, AI-агенты, сообщество'], ['Sports & Urban', 'Футбол, стадион, городская среда']];
    pillars.forEach(([t, x2], i) => {
      const x = M + i * 2.0, y = 4.6;
      d.card(s, x, y, 1.85, 1.35, { name: `a${i + 3}_c`, fill: C.surface, transparency: 10 });
      d.text(s, t, { x: x + 0.18, y: y + 0.2, w: 1.6, h: 0.5, fontSize: 12, fontFace: F.displayLatin, color: C.accent, objectName: `a${i + 3}_t` });
      d.text(s, x2, { x: x + 0.18, y: y + 0.72, w: 1.55, h: 0.5, fontSize: 10.5, color: 'B8C1D4', objectName: `a${i + 3}_d` });
    });
  }

  // 3 — Uzbekistan, Tashkent
  {
    const s = renderPanel(d, {
      img: 'renders/map-main.jpg', side: 'right', title: 'Республика Узбекистан, Ташкент — происхождение компании', status: 'MARKET',
      source: 'Источники: Национальный комитет по статистике РУз — население на 01.10.2026 с учётом переписи (через UzDaily, 27.10.2026), средний возраст на 01.01.2026; DataReportal «Digital 2026: Uzbekistan»; Нацкомстат (ВВП 2025, предв., 24.01.2026).',
      caption: '3D-карта: Natural Earth · схематично',
      notes: 'ТЕЗИС: Узбекистан — крупнейший по населению рынок Центральной Азии с молодым, цифровым и быстро растущим обществом; Ташкент — естественный хаб.\nДанные: население 39,5 млн на 01.10.2026 (+1,8% за год; с учётом предварительных итогов переписи 2026 г.; на 01.01.2026 до учёта переписи — 38,24 млн); средний возраст 29,5 года (01.01.2026); интернет-пользователи 33,1 млн, проникновение 89,0% (конец 2025); рост ВВП 7,7% в 2025 г., ВВП ≈ $147 млрд (Нацкомстат, предварительно); I полугодие 2026 г. — +8,5%.\nСвязка: далее — кто мы.',
    });
    d.text(s, 'Ташкент', { x: 7.35, y: 2.0, w: 5.4, h: 0.6, fontSize: 30, color: C.text, display: true });
    d.text(s, 'Столица Узбекистана и крупнейший город Центральной Азии. Отсюда FootureX планирует выход на рынки региона.', { x: 7.35, y: 2.65, w: 5.3, h: 0.65, fontSize: 13, color: 'B8C1D4' });
    const st = [['39,5 млн', 'население на 01.10.2026'], ['29,5 года', 'средний возраст населения'], ['89%', 'проникновение интернета (DataReportal)'], ['+7,7%', 'рост ВВП в 2025 году']];
    st.forEach(([v, l], i) => {
      const x = 7.35 + (i % 2) * 2.75, y = 3.55 + Math.floor(i / 2) * 1.4;
      d.card(s, x, y, 2.55, 1.2, { name: `a${i + 1}_c` });
      d.text(s, v, { x: x + 0.2, y: y + 0.15, w: 2.2, h: 0.5, fontSize: 22, fontFace: F.displayLatin, color: C.accent, objectName: `a${i + 1}_v` });
      d.text(s, l, { x: x + 0.2, y: y + 0.68, w: 2.2, h: 0.42, fontSize: 10.5, color: 'B8C1D4', objectName: `a${i + 1}_l` });
    });
  }

  // 4 — Who we are
  {
    const s = d.slide({
      title: 'Кто мы: технологическая компания с экосистемной стратегией', status: 'CONFIRM',
      notes: 'ТЕЗИС: FootureX Uzbekistan — технологическая компания, а не одна игра.\nКорпоративные реквизиты: юридическое наименование MChJ «FootureX Uzbekistan»; международное — FootureX Uzbekistan LLC; Ташкент; планируемая ОПФ — ООО (MChJ).\nТРЕБУЕТСЯ ПОДТВЕРЖДЕНИЕ: факт и дата государственной регистрации, ИНН, уставный капитал, состав участников, статус резидента IT Park — документы не предоставлены.\nСвязка: далее — как возникла идея.',
    });
    d.text(s, 'FootureX Uzbekistan — технологическая компания из Ташкента, которая создаётся для разработки программного обеспечения, AI-решений и игр и строит долгосрочную экосистему образования, киберспорта и спорта.', { x: M, y: 2.0, w: 6.0, h: 1.95, fontSize: 17, color: C.text, lineSpacingMultiple: 1.12, objectName: 'a1_def' });
    d.text(s, 'Позиционирование', { x: M, y: 4.3, w: 6, h: 0.3, fontSize: 12, bold: true, color: C.accent });
    d.text(s, 'Technology, Gaming, Artificial Intelligence, Sports & Urban Innovation Ecosystem', { x: M, y: 4.63, w: 6.0, h: 0.75, fontSize: 15, fontFace: F.bodyLatin, color: 'FFFFFF' });
    d.text(s, 'Слоган бренда · Brand Book v1.0', { x: M, y: 5.5, w: 6, h: 0.3, fontSize: 12, bold: true, color: C.accent });
    d.text(s, 'We will create a digital football era.', { x: M, y: 5.83, w: 6.3, h: 0.45, fontSize: 14, fontFace: F.displayLatin, color: C.text });
    d.table(s, [
      ['Параметр', 'Значение'],
      ['Юридическое наименование', 'MChJ «FootureX Uzbekistan»'],
      ['Международное наименование', 'FootureX Uzbekistan LLC'],
      ['Страна происхождения', 'Республика Узбекистан'],
      ['Город', 'Ташкент'],
      ['Организационно-правовая форма', 'ООО / MChJ (планируемая)'],
      ['Основной бренд', 'FootureX'],
      ['Регистрационные данные', { text: 'Требуется подтверждение', color: C.dot, bold: true }],
    ], { x: 7.05, y: 2.05, w: 5.68, colW: [2.55, 3.13], rowH: 0.5, size: 11.5 });
  }

  // 5 — Origin story
  {
    const s = d.slide({
      title: 'История идеи: от футбольной игры к технологической экосистеме', status: 'CONFIRM',
      source: 'Чемпионат мира: AFC/ФИФА; kun.uz (квалификация, 05.06.2025); ФИФА (матчи группы K, июнь 2026). Хронология основателей — по данным компании, требует подтверждения.',
      notes: 'ТЕЗИС: идея выросла из футбольной игры, но логика масштабирования привела к экосистеме.\nПодача: пять шагов эволюции. Контекст: сборная Узбекистана впервые в истории квалифицировалась на чемпионат мира ФИФА (05.06.2025) и в июне 2026 г. впервые сыграла на нём (группа K) — футбольный интерес в стране на историческом пике.\nТРЕБУЕТСЯ ПОДТВЕРЖДЕНИЕ: даты и персоналии основания компании не предоставлены — слайд описывает логику, а не хронологию.\nСвязка: далее — миссия.',
    });
    d.steps(s, [
      { title: 'Футбол как общий язык', text: 'Футбол — самый массовый вид спорта страны. В 2026 г. сборная Узбекистана впервые в истории сыграла на чемпионате мира ФИФА.' },
      { title: 'Цифровое поколение', text: 'Молодое население, 89% интернет-проникновения и Telegram как ежедневная платформа общения.' },
      { title: 'Идея FootureX Game', text: 'Футбольный менеджер в Telegram Web App: команда, развитие игроков, PvP и сезоны без установки приложения.' },
      { title: 'От игры к компании', text: 'Игре нужны собственные технологии, AI, аналитика и сообщество — отсюда идея собственной технологической основы.' },
      { title: 'Экосистема', text: 'По модели IT и AI-услуги должны давать выручку и компетенции; игры, образование и спорт — долгосрочную ценность бренда.' },
    ], { y: 2.35, titleH: 0.62, textH: 2.3, textSize: 12.5 });
  }

  // 6 — Mission
  {
    const s = renderPanel(d, {
      img: 'renders/hero-final.jpg', side: 'left', title: 'Миссия компании', status: 'CONFIRM', scale: 1.15, dx: 3.2, overlay: 'left',
      source: 'Миссия игрового направления — BX-001 Business Plan, v0.0.17. Корпоративная миссия — проект формулировки; манифест бренда — слайд 8 (FootureX Brand Book v1.0).',
      notes: 'ТЕЗИС: миссия соединяет технологии и спорт вокруг людей.\nМиссия игрового направления (BX-001): создание крупнейшей футбольной цифровой экосистемы Центральной Азии с дальнейшим выходом на международный рынок.\nМанифест брендбука: «FootureX строится как платформа на десятилетия. Каждый этап финансирует следующий, каждое решение работает на долгосрочное видение. Не игра в Telegram — а спортивная инфраструктура.»\nКорпоративная миссия — ПРЕДЛАГАЕМАЯ формулировка для утверждения руководством.\nСвязка: далее — видение на 10–20 лет.',
    });
    d.text(s, 'Корпоративная миссия · проект формулировки', { x: M, y: 2.0, w: 6, h: 0.3, fontSize: 12, bold: true, color: C.accent });
    d.text(s, 'Создавать технологии и цифровые продукты, которые объединяют людей вокруг спорта, знаний и инноваций — и раскрывают таланты Узбекистана для мировой индустрии.', { x: M, y: 2.4, w: 6.1, h: 1.55, fontSize: 17, color: C.text, lineSpacingMultiple: 1.12, objectName: 'a1_m' });
    d.text(s, 'Миссия игрового направления · BX-001', { x: M, y: 4.1, w: 6, h: 0.3, fontSize: 12, bold: true, color: C.accent });
    d.text(s, 'Крупнейшая футбольная цифровая экосистема Центральной Азии с дальнейшим выходом на международный рынок.', { x: M, y: 4.45, w: 6.1, h: 0.8, fontSize: 14, color: 'FFFFFF', objectName: 'a2_g' });
  }

  // 7 — Vision 10–20 years
  {
    const s = d.slide({
      title: 'Видение на 10–20 лет: четыре горизонта развития', status: 'AMB',
      notes: 'ТЕЗИС: амбиция масштабная, но последовательность реалистична — от цифровых направлений к физической инфраструктуре.\nГоды отсчитываются от запуска операционной деятельности (дата требует подтверждения). Горизонты 3–4 зависят от финансирования, земельных и регуляторных согласований.\nРАСХОЖДЕНИЕ: BX-001 задаёт горизонт игрового проекта 10–12 лет; корпоративная концепция — 10–20 лет для всей группы, включая инфраструктуру. Это разные уровни, но горизонт стоит согласовать.\nФинансирование первых горизонтов — по стадиям BX-008: Bootstrap → Seed → Growth → Ecosystem Expansion.\nСвязка: далее — ценности, на которых строится компания.',
    });
    d.timeline(s, [
      { label: 'Годы 1–3', title: 'Фундамент', text: 'IT- и AI-услуги как источник выручки. Игровая студия, запуск FootureX Game в Telegram и сообщества. Пилот академии.' },
      { label: 'Годы 4–6', title: 'Масштаб', text: 'AI SaaS-продукты, FootureX Esports, рост академии, выход на рынки Центральной Азии.', color: C.accent2 },
      { label: 'Годы 7–10', title: 'Спорт', text: 'FootureX Football Academy, формирование FC FootureX, ТЭО стадиона и поиск партнёров.', color: C.dot },
      { label: 'Годы 11–20', title: 'Инфраструктура', text: 'FootureX Stadium и FootureX City — при наличии земли, разрешений и проектного финансирования.', color: C.muted },
    ], { y: 3.4, titleH: 0.42, textH: 1.08, textSize: 11.5, labelSize: 15 });
    const fund = ['IT/AI-выручка; для игры — Bootstrap и Seed (BX-008)', 'Growth-раунд после метрик (BX-008)', 'Стратегические и спортивные партнёры', 'Проектное финансирование, ГЧП, девелоперы'];
    d.text(s, 'Основной источник финансирования горизонта', { x: M, y: 5.3, w: 8, h: 0.3, fontSize: 11, bold: true, color: '8A93A6' });
    fund.forEach((t, i) => { const x = M + i * 3.066; d.card(s, x, 5.65, 2.93, 0.82, { name: `a${i + 5}_f` }); d.text(s, t, { x: x + 0.2, y: 5.65, w: 2.55, h: 0.85, fontSize: 12, valign: 'middle', color: 'B8C1D4', objectName: `a${i + 5}_ft` }); });
    d.text(s, 'Цифровые направления финансируют и усиливают физические — не наоборот.', { x: M, y: 1.95, w: 12, h: 0.4, fontSize: 15, color: 'B8C1D4', italic: true });
    d.text(s, 'Горизонт игрового проекта по BX-001 — 10–12 лет; горизонт группы — 10–20 лет. Годы — ориентиры от старта операционной деятельности.', { x: M, y: 2.38, w: 12, h: 0.3, fontSize: 10.5, color: C.dot });
  }

  // 8 — Values
  {
    const s = d.slide({
      title: 'Корпоративные ценности', status: 'BRAND', source: 'Источник: FootureX Brand Book v1.0, раздел 06 «Голос бренда и манифест».',
      notes: 'ТЕЗИС: ценности FootureX закреплены в брендбуке как четыре опоры голоса бренда — они же стандарт решений внутри компании.\nПрямота — коротко и по делу; если что-то ещё не сделано — так и пишем. Перспектива — мыслим десятилетиями. Конкретика — цифры важнее эпитетов. Уважение — к пользователю, партнёру, региону; Узбекистан — точка старта.\nСама презентация следует принципу «Прямоты»: статусы на каждом слайде отделяют действующее от планов и амбиций.\nСвязка: далее — основные направления деятельности.',
    });
    await d.cards(s, [
      { num: '01', title: 'Прямота', text: 'Говорим коротко и по делу. Не приукрашиваем, не используем громких слов без основания. Если что-то ещё не сделано — так и пишем.' },
      { num: '02', title: 'Перспектива', text: 'Мыслим десятилетиями. Каждое решение, текст, баннер работает на долгосрочное видение — не на короткую вспышку.' },
      { num: '03', title: 'Конкретика', text: 'Цифры важнее эпитетов — но только подтверждённые. Конкретное всегда лучше, чем «много», «сильно», «крупно».' },
      { num: '04', title: 'Уважение', text: 'К пользователю, партнёру, региону. Узбекистан — точка старта, а не временная локация.' },
    ], { cols: 4, y: 2.0, h: 3.0, titleSize: 15, textSize: 12 });
    d.card(s, M, 5.25, W - 2 * M, 1.2, { name: 'a5_c', fill: C.outline, line: C.accent2 });
    d.text(s, [{ text: 'Манифест. ', options: { bold: true, color: C.accent } }, { text: 'FootureX строится как платформа на десятилетия. Каждый этап финансирует следующий, каждое решение работает на долгосрочное видение. Не игра в Telegram — а спортивная инфраструктура.' }], { x: M + 0.3, y: 5.25, w: 11.5, h: 1.2, fontSize: 14, valign: 'middle', color: C.text });
  }

  // 9 — Directions
  {
    const s = d.slide({
      title: 'Основные направления деятельности и их текущий статус', status: 'CONFIRM',
      notes: 'ТЕЗИС: одиннадцать направлений — единая система, но с разной степенью готовности; ни одно не показано как действующее.\nЛегенда: «Концепция · Фаза 1» — направления, которые планируется запускать первыми (документами BX не описаны); «В разработке · Stage 0 MVP» — FootureX Game спроектирован в документах BX-001…BX-013, идёт разработка MVP (BX-016, BX-017, код MVP); продукт ещё не запущен, поэтому не «действует». Формулировку статуса подтверждает владелец; «Концепция» — стратегическая концепция; «Амбиция» — долгосрочная цель.\nCommunity и Esports разделены: сообщество растёт вместе с игрой, киберспорт по BX-008 относится к стадии Ecosystem Expansion.\nТРЕБУЕТСЯ ПОДТВЕРЖДЕНИЕ: фактическое состояние каждого направления должно подтвердить руководство.\nСвязка: далее — карта экосистемы.',
    });
    const items = [
      ['LuCodeXml', 'FootureX Technologies', 'ПО, ERP/CRM/POS, веб и мобайл', 'Концепция · Фаза 1', C.accent],
      ['LuBot', 'FootureX AI', 'AI-агенты и автоматизация', 'Концепция · Фаза 1', C.accent],
      ['LuGamepad2', 'FootureX Game Development', 'Студия: свои и заказные игры', 'Концепция · Фаза 1', C.accent],
      ['LuSmartphone', 'FootureX Game', 'Футбольный менеджер в Telegram', 'В разработке · Stage 0 MVP', C.accent2],
      ['LuGraduationCap', 'FootureX Game Dev Academy', 'Подготовка кадров индустрии', 'Концепция · пилот', C.accent],
      ['LuUsers', 'FootureX Game Community', 'Игровое сообщество и клубы', 'Концепция · с игрой', C.dot],
      ['LuTrophy', 'FootureX Esports', 'Турниры, лиги, команды', 'Концепция · Expansion', C.dot],
      ['LuShield', 'FC FootureX', 'Профессиональный клуб', 'Концепция', C.dot],
      ['LuGoal', 'FootureX Football Academy', 'Детско-юношеский футбол', 'Концепция', C.dot],
      ['LuLandmark', 'FootureX Stadium', 'Стадион и esports-арена', 'Амбиция', C.muted],
      ['LuBuilding2', 'FootureX City', 'Многофункциональный квартал', 'Амбиция', C.muted],
    ];
    const cols = 4, gx = 0.18, gy = 0.12, cw = (W - 2 * M - gx * (cols - 1)) / cols, ch = 1.5;
    for (let i = 0; i < items.length; i++) {
      const [ic, t, sub, tag, col] = items[i];
      const x = M + (i % cols) * (cw + gx), y = 2.0 + Math.floor(i / cols) * (ch + gy);
      d.card(s, x, y, cw, ch, { name: `a${Math.floor(i / cols) + 1}_c${i}`, line: col === C.accent2 ? C.accent2 : C.line });
      await d.iconBadge(s, ic, x + 0.18, y + 0.18, 0.46, { name: `a${Math.floor(i / cols) + 1}_i${i}`, color: col === C.muted ? C.soft : col });
      d.text(s, t, { x: x + 0.76, y: y + 0.14, w: cw - 0.9, h: 0.52, fontSize: 12, bold: true, valign: 'middle' });
      d.text(s, sub, { x: x + 0.76, y: y + 0.66, w: cw - 0.9, h: 0.4, fontSize: 10, color: C.soft });
      d.pill(s, tag, x + 0.76, y + ch - 0.4, { color: col, fontSize: 9, h: 0.26, w: Math.min(cw - 0.9, 0.5 + tag.length * 0.075) });
    }
    const lx = M + 3 * (cw + gx), ly = 2.0 + 2 * (ch + gy);
    d.card(s, lx, ly, cw, ch, { name: 'a3_leg', fill: C.bg, line: C.line });
    d.text(s, [{ text: 'Действующих направлений: ', options: { color: C.soft } }, { text: 'нет подтверждённых', options: { bold: true, color: C.text } }, { text: '\nFootureX Game — в разработке (MVP). Статусы — до подтверждения руководством', options: { color: C.muted, fontSize: 9.5 } }], { x: lx + 0.2, y: ly + 0.15, w: cw - 0.4, h: ch - 0.3, fontSize: 11, valign: 'middle' });
  }

  // 10 — Ecosystem map
  {
    const s = d.slide({
      title: 'FootureX Ecosystem: как направления усиливают друг друга', status: 'VISION',
      notes: 'ТЕЗИС: экосистема создаёт перекрёстные эффекты — каждое направление поставляет другим клиентов, технологии, таланты или аудиторию.\nПримеры связей: Technologies и AI строят платформу для игры; игра формирует сообщество, сообщество — киберспорт; академия готовит кадры для студии; AI-аналитика служит футбольной академии; стадион и City объединяют аудитории офлайн.\nСвязка: глава II — рынки и стратегия.',
    });
    await d.hub(s, 'ECOSYSTEM CORE', [
      { title: 'Technologies', sub: 'платформа и выручка', icon: 'LuCodeXml' },
      { title: 'AI', sub: 'агенты и аналитика', icon: 'LuBot' },
      { title: 'Game Development', sub: 'студия', icon: 'LuGamepad2' },
      { title: 'FootureX Game', sub: 'Telegram Web App', icon: 'LuSmartphone', color: C.accent2 },
      { title: 'Game Community', sub: 'аудитория', icon: 'LuUsers', color: C.dot },
      { title: 'FootureX Esports', sub: 'турниры', icon: 'LuTrophy', color: C.dot },
      { title: 'Game Dev Academy', sub: 'кадры', icon: 'LuGraduationCap' },
      { title: 'FC FootureX', sub: 'клуб', icon: 'LuShield', color: C.dot },
      { title: 'Football Academy', sub: 'таланты', icon: 'LuGoal', color: C.dot },
      { title: 'FootureX Stadium', sub: 'офлайн-арена', icon: 'LuLandmark', color: C.muted },
      { title: 'FootureX City', sub: 'городская среда', icon: 'LuBuilding2', color: C.muted },
    ], { cy: 4.3, rx: 4.95, ry: 2.1, nw: 2.3, nh: 0.66, fs: 10.5 });
  }
};
