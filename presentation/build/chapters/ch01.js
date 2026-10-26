// ГЛАВА I. CORPORATE IDENTITY (1–10)
const { C, F, W, H, M, logoPath, LOGO_RATIO, HERO_RATIO } = require('../deck/lib');
const { renderPanel } = require('./common');

module.exports = async (d, pres) => {
  // 1 — Title
  {
    const s = d.slide({
      master: 'FX_COVER', logTitle: 'FootureX Uzbekistan — титульный слайд', kicker: false,
      notes: 'ТЕЗИС: FootureX Uzbekistan — технологическая компания из Ташкента с долгосрочной стратегией экосистемы.\nПодача: открываем не игрой, а компанией. Подчеркнуть: документ — стратегическая презентация, статус «проект для обсуждения».\nСвязка: далее — корпоративное видение «Creating the Future».\nЛоготип и вордмарк — по FootureX Brand Book v1.0 (знак извлечён из брендбука).',
      pre: (s) => d.fullImage(s, 'renders/hero-cover.jpg', { overlay: 'left', name: '!!render' }),
    });
    s.addImage({ path: logoPath('mark').path, x: M, y: 1.2, w: 0.75, h: 0.75, objectName: '!!mark' });
    s.addImage({ path: logoPath('hero').path, x: M, y: 2.15, w: 5.6, h: 5.6 / HERO_RATIO, objectName: '!!logo' });
    d.text(s, 'U Z B E K I S T A N', { x: M + 0.02, y: 2.95, w: 6, h: 0.4, fontSize: 18, fontFace: F.displayLatin, color: C.accent, objectName: '!!uz' });
    d.text(s, 'Corporate Vision & Strategic Development', { x: M, y: 3.6, w: 7, h: 0.45, fontSize: 20, fontFace: F.bodyLatin, color: C.text });
    d.text(s, 'Технологическая компания, создающая экосистему цифровых продуктов, искусственного интеллекта, игр, образования, киберспорта и спорта', { x: M, y: 4.15, w: 6.2, h: 0.95, fontSize: 14, color: 'B8C1D4', lineSpacingMultiple: 1.15 });
    d.text(s, 'MChJ «FootureX Uzbekistan»  ·  FootureX Uzbekistan LLC  ·  Ташкент, Республика Узбекистан', { x: M, y: 5.55, w: 8, h: 0.3, fontSize: 11, color: 'B8C1D4' });
    d.text(s, 'Версия 1.0  ·  Октябрь 2026  ·  Проект для обсуждения  ·  Конфиденциально', { x: M, y: 5.9, w: 8, h: 0.3, fontSize: 10, color: '8A93A6' });
    d.caption(s, 'Концептуальная визуализация');
  }

  // 2 — Creating the Future
  {
    const s = renderPanel(d, {
      img: 'renders/hero-close.jpg', side: 'left', title: 'Корпоративное видение', status: 'VISION', scale: 1.0, dx: 3.4,
      notes: 'ТЕЗИС: мы строим не продукт, а технологическую платформу роста, где каждое направление усиливает остальные.\nПодача: три опоры видения — технологии, игры и AI, спорт и городские инновации. Цифровые направления — фундамент ближайших лет; физическая инфраструктура — долгосрочная амбиция.\nСвязка: далее — откуда компания и почему Узбекистан.',
    });
    d.text(s, 'Creating the Future', { x: M, y: 2.0, w: 7, h: 0.75, fontSize: 34, fontFace: F.displayLatin, color: C.text, objectName: 'a1_big' });
    d.text(s, 'Мы строим технологическую компанию, которая соединяет программное обеспечение, искусственный интеллект, игры, образование и спорт в единую экосистему — из Ташкента для региона и мира.', { x: M, y: 2.95, w: 5.9, h: 1.3, fontSize: 15.5, color: 'E6ECF5', lineSpacingMultiple: 1.15, objectName: 'a2_lead' });
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
      source: 'Источники: Национальный комитет по статистике РУз (01.01.2026; пресс-релиз 27.01.2026); DataReportal «Digital 2026: Uzbekistan»; invest.gov.uz / Нацкомстат (ВВП 2025).',
      caption: '3D-карта: Natural Earth · схематично',
      notes: 'ТЕЗИС: Узбекистан — крупнейший по населению рынок Центральной Азии с молодым, цифровым и быстро растущим обществом; Ташкент — естественный хаб.\nДанные: население 38,24 млн на 01.01.2026 (+1,8% за год); средний возраст 29,5 года; интернет-пользователи 33,1 млн, проникновение 89,0% (конец 2025); рост ВВП 7,7% в 2025 г., ВВП свыше $145 млрд.\nСвязка: далее — кто мы.',
    });
    const L = d.constructor ? null : null;
    d.text(s, 'Ташкент', { x: 7.35, y: 2.0, w: 5.4, h: 0.6, fontSize: 30, color: C.text, display: true });
    d.text(s, 'Столица и крупнейший деловой центр Центральной Азии. Отсюда FootureX планирует выход на рынки региона.', { x: 7.35, y: 2.65, w: 5.3, h: 0.65, fontSize: 13, color: 'B8C1D4' });
    const st = [['38,24 млн', 'население на 01.01.2026'], ['29,5 года', 'средний возраст населения'], ['89%', 'проникновение интернета (DataReportal)'], ['+7,7%', 'рост ВВП в 2025 году']];
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
    d.text(s, 'FootureX Uzbekistan — технологическая компания из Ташкента, которая разрабатывает программное обеспечение и AI-решения, создаёт игры и формирует долгосрочную экосистему образования, киберспорта и спорта.', { x: M, y: 2.0, w: 6.0, h: 1.95, fontSize: 17, color: C.text, lineSpacingMultiple: 1.12, objectName: 'a1_def' });
    d.text(s, 'Позиционирование', { x: M, y: 4.3, w: 6, h: 0.3, fontSize: 12, bold: true, color: C.accent });
    d.text(s, 'Technology, Gaming, Artificial Intelligence, Sports & Urban Innovation Ecosystem', { x: M, y: 4.63, w: 6.0, h: 0.75, fontSize: 15, fontFace: F.bodyLatin, color: 'E6ECF5' });
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
      source: 'Факт квалификации: УЕФА/ФИФА, сообщения kun.uz (10.06.2025), fergana.agency. Хронология основателей — по данным компании, требует подтверждения.',
      notes: 'ТЕЗИС: идея выросла из футбольной игры, но логика масштабирования привела к экосистеме.\nПодача: пять шагов эволюции. Контекст: сборная Узбекистана впервые в истории квалифицировалась на чемпионат мира ФИФА 2026 (июнь 2025) — футбольный интерес в стране на историческом пике.\nТРЕБУЕТСЯ ПОДТВЕРЖДЕНИЕ: даты и персоналии основания компании не предоставлены — слайд описывает логику, а не хронологию.\nСвязка: далее — миссия.',
    });
    d.steps(s, [
      { title: 'Футбол как общий язык', text: 'Футбол — самый массовый вид спорта страны. Сборная Узбекистана впервые вышла на чемпионат мира ФИФА 2026.' },
      { title: 'Цифровое поколение', text: 'Молодое население, 89% интернет-проникновения и Telegram как ежедневная платформа общения.' },
      { title: 'Идея FootureX Game', text: 'Футбольный менеджер в Telegram Web App: команда, развитие игроков, PvP и сезоны без установки приложения.' },
      { title: 'От игры к компании', text: 'Игре нужны собственные технологии, AI, аналитика и сообщество — так появилась технологическая основа.' },
      { title: 'Экосистема', text: 'IT и AI-услуги дают выручку и компетенции; игры, образование и спорт формируют долгосрочную ценность бренда.' },
    ], { y: 2.35, titleH: 0.62, textH: 2.3, textSize: 12.5 });
  }

  // 6 — Mission
  {
    const s = renderPanel(d, {
      img: 'renders/hero-final.jpg', side: 'left', title: 'Миссия компании', status: 'CONFIRM', scale: 1.15, dx: 3.2, overlay: 'left',
      source: 'Миссия игрового направления — BX-001 Business Plan, v0.0.17. Манифест — FootureX Brand Book v1.0. Корпоративная миссия — проект формулировки.',
      notes: 'ТЕЗИС: миссия соединяет технологии и спорт вокруг людей.\nМиссия игрового направления (BX-001): создание крупнейшей футбольной цифровой экосистемы Центральной Азии с дальнейшим выходом на международный рынок.\nМанифест брендбука: «FootureX строится как платформа на десятилетия. Каждый этап финансирует следующий, каждое решение работает на долгосрочное видение. Не игра в Telegram — а спортивная инфраструктура.»\nКорпоративная миссия — ПРЕДЛАГАЕМАЯ формулировка для утверждения руководством.\nСвязка: далее — видение на 10–20 лет.',
    });
    d.text(s, 'Корпоративная миссия · проект формулировки', { x: M, y: 2.0, w: 6, h: 0.3, fontSize: 12, bold: true, color: C.accent });
    d.text(s, 'Создавать технологии и цифровые продукты, которые объединяют людей вокруг спорта, знаний и инноваций — и раскрывают таланты Узбекистана для мировой индустрии.', { x: M, y: 2.4, w: 6.1, h: 1.55, fontSize: 17, color: C.text, lineSpacingMultiple: 1.12, objectName: 'a1_m' });
    d.text(s, 'Миссия игрового направления · BX-001', { x: M, y: 4.1, w: 6, h: 0.3, fontSize: 12, bold: true, color: C.accent });
    d.text(s, 'Крупнейшая футбольная цифровая экосистема Центральной Азии с дальнейшим выходом на международный рынок.', { x: M, y: 4.45, w: 6.1, h: 0.8, fontSize: 14, color: 'E6ECF5', objectName: 'a2_g' });
    d.text(s, '«Не игра в Telegram — а спортивная инфраструктура.» — манифест бренда', { x: M, y: 5.45, w: 6.1, h: 0.6, fontSize: 12.5, italic: true, color: C.soft, objectName: 'a3_g' });
  }

  // 7 — Vision 10–20 years
  {
    const s = d.slide({
      title: 'Видение на 10–20 лет: четыре горизонта развития', status: 'AMB',
      notes: 'ТЕЗИС: амбиция масштабная, но последовательность реалистична — от цифровых направлений к физической инфраструктуре.\nГоды отсчитываются от запуска операционной деятельности (дата требует подтверждения). Горизонты 3–4 зависят от финансирования, земельных и регуляторных согласований.\nРАСХОЖДЕНИЕ: BX-001 задаёт горизонт игрового проекта 10–12 лет; корпоративная концепция — 10–20 лет для всей группы, включая инфраструктуру. Это разные уровни, но горизонт стоит согласовать.\nФинансирование первых горизонтов — по стадиям BX-008: Bootstrap → Seed → Growth → Ecosystem Expansion.\nСвязка: далее — ценности, на которых строится компания.',
    });
    d.timeline(s, [
      { label: 'Годы 1–3', title: 'Фундамент', text: 'IT- и AI-услуги как источник выручки. Запуск FootureX Game в Telegram. Пилот Game Dev Academy.' },
      { label: 'Годы 4–6', title: 'Масштаб', text: 'AI SaaS-продукты, киберспорт и сообщество, рост академии, выход на рынки Центральной Азии.', color: C.accent2 },
      { label: 'Годы 7–10', title: 'Спорт', text: 'FootureX Football Academy, формирование FC FootureX, ТЭО стадиона и поиск партнёров.', color: C.dot },
      { label: 'Годы 11–20', title: 'Инфраструктура', text: 'FootureX Stadium и FootureX City — при наличии земли, разрешений и проектного финансирования.', color: C.muted },
    ], { y: 3.25, titleH: 0.45, textH: 1.2, textSize: 12.5, labelSize: 15 });
    const fund = ['Bootstrap и Seed (BX-008), выручка IT/AI', 'Growth-раунд после метрик (BX-008)', 'Стратегические и спортивные партнёры', 'Проектное финансирование, ГЧП, девелоперы'];
    d.text(s, 'Основной источник финансирования горизонта', { x: M, y: 5.3, w: 8, h: 0.3, fontSize: 11, bold: true, color: '8A93A6' });
    fund.forEach((t, i) => { const x = M + i * 3.066; d.card(s, x, 5.65, 2.93, 0.82, { name: `a${i + 5}_f` }); d.text(s, t, { x: x + 0.2, y: 5.65, w: 2.55, h: 0.85, fontSize: 12, valign: 'middle', color: 'D3D9E5', objectName: `a${i + 5}_ft` }); });
    d.text(s, 'Цифровые направления финансируют и усиливают физические — не наоборот.', { x: M, y: 1.95, w: 12, h: 0.4, fontSize: 15, color: 'B8C1D4', italic: true });
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
      title: 'Десять направлений деятельности и их текущий статус', status: 'CONFIRM',
      notes: 'ТЕЗИС: десять направлений — единая система, но с разной степенью готовности.\nЛегенда статусов: «План · Фаза 1» — планируемые к запуску первыми; «В разработке» — продукт в работе; «Концепция» — стратегическая концепция; «Амбиция» — долгосрочная цель.\nТРЕБУЕТСЯ ПОДТВЕРЖДЕНИЕ: статусы присвоены консервативно по брифу; фактическое состояние каждого направления должно подтвердить руководство.\nСвязка: далее — карта экосистемы.',
    });
    const items = [
      ['LuCodeXml', 'FootureX Technologies', 'ПО, ERP/CRM/POS, веб и мобайл', 'План · Фаза 1', C.accent],
      ['LuBot', 'FootureX AI', 'AI-агенты и автоматизация', 'План · Фаза 1', C.accent],
      ['LuGamepad2', 'FootureX Game Development', 'Студия: свои и заказные игры', 'План · Фаза 1', C.accent],
      ['LuSmartphone', 'FootureX Game', 'Футбольный менеджер в Telegram', 'Foundation', C.accent2],
      ['LuGraduationCap', 'FootureX Game Dev Academy', 'Подготовка кадров индустрии', 'План · пилот', C.accent],
      ['LuTrophy', 'Game Community & Esports', 'Сообщество, турниры, медиа', 'Концепция', C.warn],
      ['LuShield', 'FC FootureX', 'Профессиональный клуб', 'Концепция', C.warn],
      ['LuGoal', 'FootureX Football Academy', 'Детско-юношеский футбол', 'Концепция', C.warn],
      ['LuLandmark', 'FootureX Stadium', 'Стадион и esports-арена', 'Амбиция', C.steel],
      ['LuBuilding2', 'FootureX City', 'Многофункциональный квартал', 'Амбиция', C.steel],
    ];
    const cw = 2.27, ch = 2.15, gap = 0.19;
    for (let i = 0; i < items.length; i++) {
      const [ic, t, sub, tag, col] = items[i];
      const x = M + (i % 5) * (cw + gap), y = 2.0 + Math.floor(i / 5) * (ch + gap);
      d.card(s, x, y, cw, ch, { name: `a${i + 1}_c` });
      await d.iconBadge(s, ic, x + 0.2, y + 0.2, 0.46, { name: `a${i + 1}_i`, color: col === C.steel ? C.steel : col === C.warn ? C.warn : col === C.accent2 ? C.accent2 : C.accent, bg: col === C.accent ? '142A70' : col === C.accent2 ? '142A70' : col === C.warn ? '142A70' : '0E1629' });
      d.text(s, t, { x: x + 0.2, y: y + 0.78, w: cw - 0.35, h: 0.5, fontSize: 11.5, bold: true, objectName: `a${i + 1}_t` });
      d.text(s, sub, { x: x + 0.2, y: y + 1.3, w: cw - 0.35, h: 0.42, fontSize: 10, color: 'B8C1D4', objectName: `a${i + 1}_s` });
      d.pill(s, tag, x + 0.2, y + ch - 0.42, { color: col, fontSize: 8, h: 0.26, w: 1.35 });
    }
  }

  // 10 — Ecosystem map
  {
    const s = d.slide({
      title: 'FootureX Ecosystem: как направления усиливают друг друга', status: 'VISION',
      notes: 'ТЕЗИС: экосистема создаёт перекрёстные эффекты — каждое направление поставляет другим клиентов, технологии, таланты или аудиторию.\nПримеры связей: Technologies и AI строят платформу для игры; игра формирует сообщество и киберспорт; академия готовит кадры для студии; AI-аналитика служит футбольной академии; стадион и City объединяют аудитории офлайн.\nСвязка: глава II — рынки и стратегия.',
    });
    await d.hub(s, 'ECOSYSTEM CORE', [
      { title: 'Technologies', sub: 'платформа и выручка', icon: 'LuCodeXml' },
      { title: 'AI', sub: 'агенты и аналитика', icon: 'LuBot' },
      { title: 'Game Development', sub: 'студия', icon: 'LuGamepad2' },
      { title: 'FootureX Game', sub: 'Telegram Web App', icon: 'LuSmartphone', color: C.accent2 },
      { title: 'Community & Esports', sub: 'аудитория', icon: 'LuTrophy', color: C.warn },
      { title: 'Game Dev Academy', sub: 'кадры', icon: 'LuGraduationCap' },
      { title: 'FC FootureX', sub: 'клуб', icon: 'LuShield', color: C.warn },
      { title: 'Football Academy', sub: 'таланты', icon: 'LuGoal', color: C.warn },
      { title: 'FootureX Stadium', sub: 'офлайн-арена', icon: 'LuLandmark', color: C.steel },
      { title: 'FootureX City', sub: 'городская среда', icon: 'LuBuilding2', color: C.steel },
    ], { cy: 4.3, rx: 4.85, ry: 2.05, nw: 2.4, nh: 0.7, fs: 10.5 });
  }
};
