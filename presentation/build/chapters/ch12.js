// ГЛАВА XII. FUTURE VISION (114–117)
const { C, F, W, H, M, logoPath, LOGO_RATIO } = require('../deck/lib');
const { opener, renderPanel } = require('./common');
const FM = require('../../assets/finmodel.json');

module.exports = async (d, pres) => {
  // 114 — Ecosystem of the future
  await opener(d, {
    img: 'renders/city-smart-smart.jpg', title: 'FootureX Uzbekistan — экосистема будущего', status: 'VISION', scale: 1.1, dx: 2.0,
    lead: 'Через 10–20 лет FootureX — группа, где программное обеспечение, AI, игры, образование, киберспорт и футбол работают как одна система.',
    points: [['10', 'направлений одной экосистемы'], ['4', 'фазы последовательной реализации'], ['1', 'бренд: FootureX']],
    notes: 'ТЕЗИС: экосистема будущего — результат последовательности, а не одновременного запуска всего.\nВизуализация — концептуальная (Smart City FootureX).\nСвязка: далее — влияние на индустрию Узбекистана.',
  });

  // 115 — Strategic impact on Uzbekistan
  {
    const A = FM.assump;
    const s = d.slide({
      title: 'Стратегическое влияние на технологическую и спортивную индустрию Узбекистана', status: 'CALC',
      source: 'Целевые ориентиры — из иллюстративной модели FootureX (базовый сценарий, 5 лет); не являются обязательствами.',
      notes: 'ТЕЗИС: FootureX создаёт эффект для страны — рабочие места, кадры, экспорт, цифровые продукты и детский футбол.\nОриентиры модели за 5 лет: ≈1 860 слушателей академии; 55 оплачиваемых IT-специалистов к Году 5 (без учёта продуктовых команд и администрации); до 900 тыс. среднемесячных игроков; экспорт IT-услуг как цель статуса экспортёра.\nВклад соответствует государственным стратегиям «Цифровой Узбекистан — 2030» и развития ИИ до 2030 г.\nСвязка: далее — международное развитие.',
    });
    d.stats(s, [
      { value: '≈1 860', label: 'слушателей Game Dev Academy за 5 лет' },
      { value: '55', label: 'оплачиваемых IT-специалистов к Году 5' },
      { value: '900 тыс.', label: 'среднемесячная аудитория игры к Году 5' },
      { value: '6', label: 'отраслевых пакетов ПО для малого и среднего бизнеса' },
    ], { y: 2.0, h: 1.75, valueSize: 28 });
    await d.cards(s, [
      { icon: 'LuTrendingUp', title: 'IT-экспорт', text: 'Экспортные проекты Technologies и AI в Центральной Азии и СНГ.' },
      { icon: 'LuGraduationCap', title: 'Кадры индустрии', text: 'Подготовка разработчиков, дизайнеров и AI-инженеров.' },
      { icon: 'LuGamepad2', title: 'Цифровые продукты', text: 'Собственные игры и AI-продукты, созданные в Узбекистане.' },
      { icon: 'LuGoal', title: 'Детский футбол', text: 'Академия, данные и путь к профессиональной карьере.' },
    ], { cols: 4, y: 4.05, h: 2.4, iconLeft: false, titleSize: 13.5, textSize: 11.5 });
  }

  // 116 — International development
  {
    const s = renderPanel(d, {
      img: 'renders/map-main.jpg', side: 'right', title: 'Международное развитие и долгосрочные амбиции', status: 'AMB',
      caption: '3D-карта: Natural Earth · схематично',
      notes: 'ТЕЗИС: международный рост идёт концентрическими кругами — от Узбекистана к Центральной Азии и далее по мере подтверждения продуктов.\nКруги: (1) Узбекистан — база и полигон; (2) Центральная Азия — Казахстан, Кыргызстан, Таджикистан, Туркменистан; (3) СНГ и тюркоязычные рынки — для игры и IT-экспорта; (4) глобальный цифровой рынок — через Telegram и SaaS.\nСтатус: долгосрочная амбиция; присутствия за рубежом нет.\nСвязка: финальный слайд.',
    });
    const circ = [['01', 'Узбекистан', 'База, команда, полигон продуктов'], ['02', 'Центральная Азия', 'Игра, IT-экспорт, академия онлайн'], ['03', 'СНГ и тюркоязычные рынки', 'Локализация игры, AI SaaS'], ['04', 'Глобальный цифровой рынок', 'Telegram, SaaS, лицензирование']];
    circ.forEach(([n, t, x2], i) => {
      const y = 2.05 + i * 1.08;
      d.card(s, 7.3, y, 5.43, 0.92, { name: `a${i + 1}_c`, fill: C.bg, transparency: 15 });
      d.text(s, n, { x: 7.5, y, w: 0.7, h: 0.92, fontSize: 18, fontFace: F.displayLatin, color: i === 0 ? C.accent : i === 1 ? C.accent2 : i === 2 ? C.warn : C.steel, valign: 'middle' });
      d.text(s, t, { x: 8.3, y: y + 0.12, w: 4.3, h: 0.34, fontSize: 14, bold: true });
      d.text(s, x2, { x: 8.3, y: y + 0.47, w: 4.3, h: 0.32, fontSize: 11.5, color: 'B9C3D4' });
    });
  }

  // 117 — Final
  {
    const s = d.slide({
      master: 'FX_FULL', title: 'FootureX Uzbekistan: Building the Future', status: 'VISION',
      notes: 'ТЕЗИС: FootureX Uzbekistan — это не презентация одной игры, а стратегия технологической компании.\nЗакрытие: благодарность, приглашение к обсуждению партнёрства и инвестиций.\nКонтактные данные — вставить после подтверждения.',
      pre: (s) => d.fullImage(s, 'renders/hero-final.jpg', { overlay: ['left', 'topbottom'], dx: 3.3, name: '!!render' }),
    });
    const lg = logoPath(true);
    s.addImage({ path: lg.path, x: M, y: 2.15, w: 5.4, h: 5.4 / LOGO_RATIO, objectName: '!!logo' });
    d.text(s, 'BUILDING THE FUTURE', { x: M, y: 2.95, w: 7, h: 0.5, fontSize: 22, fontFace: F.displayLatin, color: C.accent, charSpacing: 3, objectName: '!!uz' });
    d.text(s, 'Технологии · Игры · AI · Образование · Киберспорт · Футбол · Городские инновации', { x: M, y: 3.75, w: 6.6, h: 0.7, fontSize: 14, color: 'E6ECF5' });
    d.text(s, 'Благодарим за внимание. Приглашаем к диалогу о партнёрстве и инвестициях.', { x: M, y: 4.6, w: 6.4, h: 0.65, fontSize: 13, color: 'B9C3D4' });
    d.text(s, 'MChJ «FootureX Uzbekistan» · Ташкент, Республика Узбекистан', { x: M, y: 5.55, w: 7, h: 0.3, fontSize: 11, color: 'C9D3E3' });
    d.text(s, 'Контактные данные: требуется подтверждение', { x: M, y: 5.9, w: 7, h: 0.3, fontSize: 10, color: '7D899E' });
    d.caption(s, 'Концептуальная визуализация');
  }
};
