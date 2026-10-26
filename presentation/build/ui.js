// Interface concept mockups (HTML -> PNG). All screens are CONCEPTS for the presentation, not shipped UI.
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const OUT = path.join(__dirname, '..', 'assets', 'ui');
const FONTS = path.join(__dirname, '..', 'brand', 'fonts');

const fontFace = ['ZenDots-Regular', 'Montserrat-Regular', 'Montserrat-Medium', 'Montserrat-SemiBold', 'Montserrat-Bold', 'Poppins-Regular', 'Poppins-SemiBold']
  .map((f) => {
    const [fam, w] = f.split('-');
    const weight = { Regular: 400, Medium: 500, SemiBold: 600, Bold: 700 }[w];
    const family = fam === 'ZenDots' ? 'Zen Dots' : fam;
    return `@font-face{font-family:'${family}';font-weight:${weight};src:url(data:font/ttf;base64,${fs.readFileSync(path.join(FONTS, f + '.ttf')).toString('base64')})}`;
  }).join('\n');

const CSS = `${fontFace}
*{box-sizing:border-box;margin:0;padding:0}
body{background:transparent;font-family:Montserrat;color:#F4F7FB}
.phone{width:430px;height:900px;border-radius:64px;background:#1b2230;padding:14px;box-shadow:0 0 0 2px #2b3446 inset, 0 30px 80px rgba(0,0,0,.5)}
.screen{width:402px;height:872px;border-radius:52px;overflow:hidden;background:linear-gradient(180deg,#0c1424,#070B12 60%);position:relative}
.notch{position:absolute;top:10px;left:50%;transform:translateX(-50%);width:120px;height:32px;border-radius:20px;background:#000}
.status{height:52px;display:flex;justify-content:space-between;align-items:flex-end;padding:0 30px 4px;font:600 14px Poppins}
.tg{height:48px;display:flex;align-items:center;gap:10px;padding:0 18px;border-bottom:1px solid #1c2638;font:600 15px Montserrat}
.tg .x{color:#8D99AE;font-size:13px}.tg .t{flex:1;text-align:center}.tg .dots{color:#8D99AE}
.wrap{padding:14px 18px}
.brand{font-family:'Zen Dots';letter-spacing:1px}
.card{background:#0E1521;border:1px solid #1f2a3d;border-radius:18px;padding:14px}
.row{display:flex;gap:10px;align-items:center}
.muted{color:#8D99AE}.acc{color:#1ED68A}.blue{color:#3D8BFF}.warn{color:#FFB547}
.pill{display:inline-block;padding:4px 10px;border-radius:99px;font-size:11px;font-weight:600;background:#13253a;color:#9fc3ff}
.pill.g{background:#0f2e22;color:#1ED68A}
.btn{background:#1ED68A;color:#04130c;border-radius:14px;padding:14px;text-align:center;font-weight:700;font-size:15px}
.bar{height:6px;border-radius:6px;background:#1c2638;overflow:hidden}.bar i{display:block;height:100%;background:#1ED68A;border-radius:6px}
.tabbar{position:absolute;bottom:0;left:0;right:0;height:78px;background:#0a101b;border-top:1px solid #1c2638;display:flex;justify-content:space-around;padding-top:12px;font-size:10px;color:#8D99AE;text-align:center}
.tabbar b{display:block;width:22px;height:22px;margin:0 auto 4px;border-radius:7px;border:2px solid #3a4760}
.tabbar .on{color:#1ED68A}.tabbar .on b{border-color:#1ED68A;background:#0f2e22}
.concept{position:absolute;bottom:86px;right:16px;font-size:9px;color:#5b6578;letter-spacing:.5px}
.desk{width:1440px;height:900px;border-radius:18px;overflow:hidden;background:#070B12;border:1px solid #26324a;box-shadow:0 30px 80px rgba(0,0,0,.5);display:flex;flex-direction:column}
.chrome{height:44px;background:#0b111c;display:flex;align-items:center;gap:8px;padding:0 18px;border-bottom:1px solid #1c2638}
.chrome i{width:12px;height:12px;border-radius:50%;background:#2b3446;display:inline-block}
.url{margin-left:24px;background:#121a28;border-radius:8px;padding:6px 14px;font:500 13px Poppins;color:#8D99AE;width:520px}
.app{flex:1;display:flex}
.side{width:230px;background:#0b111c;border-right:1px solid #1c2638;padding:22px 16px;font-size:14px}
.side div{padding:10px 12px;border-radius:10px;color:#8D99AE;margin-bottom:4px}
.side .on{background:#0f2e22;color:#1ED68A;font-weight:600}
.main{flex:1;padding:26px 30px;display:flex;flex-direction:column;gap:18px}
h1{font:600 26px Montserrat}h2{font:600 16px Montserrat;margin-bottom:10px}
.kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.kpi .v{font:600 28px Montserrat;margin-top:6px}.kpi .d{font-size:12px;margin-top:4px}
table{width:100%;border-collapse:collapse;font-size:13px}td,th{padding:9px 6px;border-bottom:1px solid #1c2638;text-align:left}th{color:#8D99AE;font-weight:500}
`;

const phone = (title, body, tab = 0) => `<div class="phone"><div class="screen"><div class="notch"></div>
<div class="status"><span>9:41</span><span>5G ▮▮▮</span></div>
<div class="tg"><span class="x">Закрыть</span><span class="t">${title}</span><span class="dots">⋯</span></div>
${body}
<div class="concept">КОНЦЕПТ ИНТЕРФЕЙСА</div>
<div class="tabbar">${['Клуб', 'Состав', 'Матчи', 'Рынок', 'Сезон'].map((t, i) => `<div class="${i === tab ? 'on' : ''}"><b></b>${t}</div>`).join('')}</div>
</div></div>`;

const pitchSVG = (players) => `<svg viewBox="0 0 340 420" width="366" height="452" style="display:block;margin:0 auto">
<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0e4a31"/><stop offset="1" stop-color="#0a3523"/></linearGradient></defs>
<rect x="2" y="2" width="336" height="416" rx="16" fill="url(#g)" stroke="#2c7a55"/>
${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="2" y="${2 + i * 69.3}" width="336" height="34.6" fill="#ffffff" opacity=".025"/>`).join('')}
<g stroke="#cfe9dc" stroke-opacity=".55" fill="none" stroke-width="1.5"><rect x="14" y="14" width="312" height="392" rx="2"/><line x1="14" y1="210" x2="326" y2="210"/><circle cx="170" cy="210" r="40"/><rect x="90" y="14" width="160" height="60"/><rect x="90" y="346" width="160" height="60"/></g>
${players.map(([x, y, n, r, num]) => `<g transform="translate(${x},${y})"><circle r="21" fill="#0E1521" stroke="#1ED68A" stroke-width="2"/><text y="5" text-anchor="middle" font-family="Poppins" font-weight="600" font-size="14" fill="#F4F7FB">${num}</text><rect x="-30" y="25" width="60" height="18" rx="9" fill="#070B12" opacity=".85"/><text y="38" text-anchor="middle" font-family="Montserrat" font-size="10" fill="#c9d3e3">${n}</text><text x="18" y="-14" font-family="Poppins" font-weight="600" font-size="10" fill="#1ED68A">${r}</text></g>`).join('')}
</svg>`;

const SCREENS = {
  'game-home': phone('FootureX', `<div class="wrap" style="display:flex;flex-direction:column;gap:12px">
    <div class="row" style="justify-content:space-between"><div><div class="muted" style="font-size:12px">Ваш клуб</div><div style="font:700 20px Montserrat">FC Demo United</div></div><div class="pill g">Лига · Серебро II</div></div>
    <div class="card" style="background:linear-gradient(135deg,#0f2e22,#0e1521)"><div class="row" style="justify-content:space-between"><span class="muted" style="font-size:12px">Рейтинг команды</span><span class="pill">Сезон 3 · неделя 5</span></div>
      <div class="brand acc" style="font-size:44px;margin:6px 0">78.4</div><div class="bar"><i style="width:64%"></i></div><div class="muted" style="font-size:11px;margin-top:6px">64% до повышения в Лигу «Золото»</div></div>
    <div class="row"><div class="card" style="flex:1"><div class="muted" style="font-size:11px">Энергия</div><div style="font:600 20px Poppins">86 / 100</div></div><div class="card" style="flex:1"><div class="muted" style="font-size:11px">FX Coins*</div><div style="font:600 20px Poppins">12 450</div></div></div>
    <div class="card"><h2>Следующий матч</h2><div class="row" style="justify-content:space-between"><div style="text-align:center"><div class="brand" style="font-size:18px">FDU</div><div class="muted" style="font-size:11px">78.4</div></div><div style="font:600 13px Poppins" class="muted">PvP · 20:00</div><div style="text-align:center"><div class="brand" style="font-size:18px">TSH</div><div class="muted" style="font-size:11px">77.9</div></div></div></div>
    <div class="btn">Играть матч</div>
    <div class="muted" style="font-size:10px">* Внутриигровая валюта. Не является денежным средством и не обменивается на деньги.</div></div>`, 0),
  'game-squad': phone('Состав · 4-3-3', `<div class="wrap" style="padding-top:10px"><div class="row" style="justify-content:space-between;margin-bottom:8px"><span class="pill g">Химия 92</span><span class="pill">Схема 4-3-3</span><span class="pill">Сила 78.4</span></div>
    ${pitchSVG([[170, 54, 'Rakhimov', 81, 9], [70, 80, 'Yusupov', 79, 11], [270, 80, 'Saidov', 80, 7], [95, 180, 'Nazarov', 77, 8], [170, 200, 'Tursunov', 82, 10], [245, 180, 'Aliev', 76, 6], [40, 290, 'Karimov', 75, 3], [125, 300, 'Ergashev', 78, 4], [215, 300, 'Mirzaev', 77, 5], [300, 290, 'Umarov', 74, 2], [170, 372, 'Ismoilov', 80, 1]])}
    <div class="muted" style="font-size:10px;margin-top:6px">Имена игроков вымышлены</div></div>`, 1),
  'game-player': phone('Карточка игрока', `<div class="wrap" style="display:flex;flex-direction:column;gap:12px">
    <div class="card" style="background:linear-gradient(160deg,#103626,#0e1521 70%);text-align:center;padding:20px">
      <div class="row" style="justify-content:space-between"><span class="brand acc" style="font-size:34px">82</span><span class="pill g">CAM · Ур. 14</span></div>
      <div style="width:120px;height:120px;border-radius:60px;margin:6px auto 10px;background:radial-gradient(circle at 50% 35%,#2a3a55,#0e1521);border:2px solid #1ED68A"></div>
      <div style="font:700 20px Montserrat">D. Tursunov</div><div class="muted" style="font-size:12px">19 лет · Потенциал 88</div></div>
    <div class="card">${[['Скорость', 84], ['Удар', 79], ['Пас', 86], ['Дриблинг', 88], ['Защита', 52], ['Физика', 71]].map(([k, v]) => `<div class="row" style="margin:6px 0"><span style="width:90px;font-size:12px" class="muted">${k}</span><div class="bar" style="flex:1"><i style="width:${v}%;background:${v > 80 ? '#1ED68A' : '#3D8BFF'}"></i></div><span style="width:30px;text-align:right;font:600 13px Poppins">${v}</span></div>`).join('')}</div>
    <div class="row"><div class="btn" style="flex:1">Тренировка</div><div class="btn" style="flex:1;background:#13253a;color:#9fc3ff">Прогресс</div></div></div>`, 1),
  'game-league': phone('Лига · Серебро II', `<div class="wrap"><div class="row" style="gap:6px;margin-bottom:12px"><span class="pill g">Таблица</span><span class="pill">PvP-рейтинг</span><span class="pill">Турниры</span></div>
    <div class="card" style="padding:6px 12px"><table><tr><th>#</th><th>Клуб</th><th>И</th><th>О</th></tr>
    ${[['1', 'Samarkand Stars', 14, 34], ['2', 'FC Demo United', 14, 31], ['3', 'Bukhara Legion', 14, 29], ['4', 'Andijan Wolves', 14, 26], ['5', 'Navoi Titans', 14, 22], ['6', 'Fergana Eagles', 14, 21], ['7', 'Khiva Royals', 14, 17], ['8', 'Termez Sun', 14, 12]].map((r) => `<tr style="${r[1] === 'FC Demo United' ? 'color:#1ED68A;font-weight:600' : ''}"><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td style="font-family:Poppins;font-weight:600">${r[3]}</td></tr>`).join('')}</table></div>
    <div class="card" style="margin-top:12px"><div class="row" style="justify-content:space-between"><div><div class="muted" style="font-size:11px">Еженедельный турнир</div><div style="font:600 15px Montserrat">Cup of Tashkent · 64 клуба</div></div><span class="pill g">Регистрация</span></div></div>
    <div class="muted" style="font-size:10px;margin-top:8px">Названия клубов вымышлены</div></div>`, 2),
  'game-market': phone('Маркетплейс', `<div class="wrap"><div class="row" style="gap:6px;margin-bottom:12px"><span class="pill g">Игроки</span><span class="pill">Экипировка</span><span class="pill">Стадион</span></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">${[['A. Saidov', 'ST', 80, '4 200'], ['B. Nazarov', 'CM', 77, '2 950'], ['K. Aliev', 'CB', 79, '3 600'], ['R. Umarov', 'GK', 81, '4 800']].map(([n, p, r, c]) => `<div class="card" style="padding:12px"><div class="row" style="justify-content:space-between"><span class="brand acc" style="font-size:20px">${r}</span><span class="pill">${p}</span></div><div style="height:70px;border-radius:12px;margin:8px 0;background:radial-gradient(circle at 50% 40%,#22324c,#0e1521)"></div><div style="font:600 13px Montserrat">${n}</div><div class="row" style="justify-content:space-between;margin-top:6px"><span style="font:600 14px Poppins">${c}</span><span class="muted" style="font-size:10px">FX Coins*</span></div></div>`).join('')}</div>
    <div class="muted" style="font-size:10px;margin-top:10px">* Внутриигровые цифровые предметы. Правовой режим и модель монетизации требуют юридической проверки.</div></div>`, 3),
  'game-season': phone('Сезон 3 · «Восход»', `<div class="wrap" style="display:flex;flex-direction:column;gap:12px">
    <div class="card" style="background:linear-gradient(135deg,#13253a,#0e1521)"><div class="muted" style="font-size:11px">Сезонный пропуск</div><div class="row" style="justify-content:space-between"><span style="font:700 18px Montserrat">Уровень 23 / 50</span><span class="pill g">21 день</span></div><div class="bar" style="margin-top:10px"><i style="width:46%"></i></div>
      <div class="row" style="margin-top:12px;gap:6px">${[20, 21, 22, 23, 24, 25].map((l) => `<div style="flex:1;height:54px;border-radius:12px;border:1px solid ${l <= 23 ? '#1ED68A' : '#26324a'};background:${l <= 23 ? '#0f2e22' : '#0b111c'};display:flex;align-items:center;justify-content:center;font:600 13px Poppins">${l}</div>`).join('')}</div></div>
    <div class="card"><h2>Задания дня</h2>${[['Сыграйте 3 PvP-матча', 2, 3], ['Проведите 2 тренировки', 2, 2], ['Выиграйте турнирный матч', 0, 1]].map(([t, a, b]) => `<div class="row" style="justify-content:space-between;margin:8px 0;font-size:13px"><span>${t}</span><span class="${a === b ? 'acc' : 'muted'}" style="font:600 13px Poppins">${a}/${b}</span></div>`).join('')}</div>
    <div class="card"><div class="row" style="justify-content:space-between"><div><div class="muted" style="font-size:11px">Событие выходного дня</div><div style="font:600 15px Montserrat">Derby Weekend · x2 опыт</div></div><span class="pill">Сб–Вс</span></div></div></div>`, 4),
  'esports-bracket': phone('FootureX Cup', `<div class="wrap"><div class="row" style="gap:6px;margin-bottom:12px"><span class="pill g">Сетка</span><span class="pill">Трансляция</span><span class="pill">Призы</span></div>
    <svg width="366" height="560" viewBox="0 0 366 560">${(() => { let s = ''; const names = ['Tashkent', 'Samarkand', 'Bukhara', 'Fergana', 'Namangan', 'Andijan', 'Khiva', 'Nukus'];
      for (let i = 0; i < 8; i++) { const y = 20 + i * 66; s += `<rect x="0" y="${y}" width="110" height="34" rx="8" fill="#0E1521" stroke="#26324a"/><text x="10" y="${y + 22}" font-family="Montserrat" font-size="12" fill="#F4F7FB">${names[i]}</text>`; }
      for (let i = 0; i < 4; i++) { const y = 53 + i * 132; s += `<path d="M110 ${y - 16} H130 V${y + 50} H110 M130 ${y + 17} H150" stroke="#3a4760" fill="none"/><rect x="150" y="${y}" width="100" height="34" rx="8" fill="#0E1521" stroke="${i < 2 ? '#1ED68A' : '#26324a'}"/><text x="160" y="${y + 22}" font-family="Montserrat" font-size="12" fill="#F4F7FB">${names[i * 2]}</text>`; }
      for (let i = 0; i < 2; i++) { const y = 119 + i * 264; s += `<path d="M250 ${y - 49} H262 V${y + 83} H250 M262 ${y + 17} H274" stroke="#3a4760" fill="none"/><rect x="274" y="${y}" width="90" height="34" rx="8" fill="#0f2e22" stroke="#1ED68A"/><text x="284" y="${y + 22}" font-family="Montserrat" font-size="12" fill="#1ED68A">${names[i * 4]}</text>`; }
      return s; })()}</svg><div class="muted" style="font-size:10px">Региональный формат · концепт</div></div>`, 2),
  'stadium-app': phone('FootureX Stadium', `<div class="wrap" style="display:flex;flex-direction:column;gap:12px">
    <div class="card" style="background:linear-gradient(135deg,#13253a,#0e1521)"><div class="muted" style="font-size:11px">Электронный билет</div><div style="font:700 18px Montserrat;margin:4px 0">Сектор B · Ряд 12 · Место 18</div><div class="row" style="justify-content:space-between"><span class="pill g">Вход: ворота 4</span><span class="muted" style="font-size:12px">Сб 19:00</span></div>
      <div style="margin:14px auto 4px;width:140px;height:140px;background:repeating-linear-gradient(90deg,#F4F7FB 0 6px,transparent 6px 10px),#0e1521;border-radius:12px;opacity:.85"></div></div>
    <div class="row"><div class="card" style="flex:1"><div class="muted" style="font-size:11px">Заказ к месту</div><div style="font:600 15px Montserrat">Еда и напитки</div></div><div class="card" style="flex:1"><div class="muted" style="font-size:11px">Навигация</div><div style="font:600 15px Montserrat">Маршрут к месту</div></div></div>
    <div class="card"><div class="muted" style="font-size:11px">Live-статистика матча</div><div class="row" style="justify-content:space-between;margin-top:8px"><span style="font:600 26px Poppins">2 : 1</span><span class="pill">67′</span></div><div class="bar" style="margin-top:10px"><i style="width:58%;background:#3D8BFF"></i></div><div class="muted" style="font-size:11px;margin-top:6px">Владение мячом 58%</div></div></div>`, 2),
};

const DESKS = {
  'erp-dashboard': `<div class="desk"><div class="chrome"><i></i><i></i><i></i><div class="url">erp · демо-среда / обзор</div></div><div class="app">
    <div class="side"><div class="brand" style="color:#F4F7FB;font-size:16px;margin-bottom:18px">FX · ERP</div>${['Обзор', 'Продажи · CRM', 'Склад', 'Закупки · SRM', 'Касса · POS', 'Финансы', 'Персонал', 'Отчёты', 'AI-ассистент'].map((t, i) => `<div class="${i === 0 ? 'on' : ''}">${t}</div>`).join('')}</div>
    <div class="main"><div class="row" style="justify-content:space-between"><h1>Обзор бизнеса</h1><span class="pill">Демо-данные · концепт интерфейса</span></div>
      <div class="kpis">${[['Выручка (мес.)', '1,28 млрд сум', '+12% к пр. мес.'], ['Заказы', '4 812', '+6%'], ['Остатки на складе', '18 340 ед.', '−3%'], ['Дебиторка', '214 млн сум', '−9%']].map(([k, v, d]) => `<div class="card kpi"><div class="muted" style="font-size:13px">${k}</div><div class="v">${v}</div><div class="d acc">${d}</div></div>`).join('')}</div>
      <div class="row" style="gap:16px;align-items:stretch;flex:1"><div class="card" style="flex:2"><h2>Продажи по неделям</h2><svg width="100%" height="300" viewBox="0 0 700 300">${[120, 150, 140, 180, 170, 210, 200, 240, 230, 260, 250, 290].map((v, i) => `<rect x="${20 + i * 56}" y="${300 - v}" width="34" height="${v}" rx="6" fill="${i === 11 ? '#1ED68A' : '#22344f'}"/>`).join('')}</svg></div>
      <div class="card" style="flex:1"><h2>Последние операции</h2><table>${[['POS-2041', 'Оплачено', '1 240 000'], ['INV-3318', 'Отгрузка', '8 900 000'], ['PO-0912', 'Закупка', '5 410 000'], ['POS-2042', 'Оплачено', '640 000'], ['CRM-771', 'Сделка', '12 000 000'], ['POS-2043', 'Возврат', '−120 000']].map((r) => `<tr><td>${r[0]}</td><td class="muted">${r[1]}</td><td style="text-align:right;font-family:Poppins">${r[2]}</td></tr>`).join('')}</table></div></div></div></div></div>`,
  'ai-console': `<div class="desk" style="height:700px"><div class="chrome"><i></i><i></i><i></i><div class="url">ai-workspace · демо-среда</div></div><div class="app">
    <div class="side"><div class="brand" style="color:#F4F7FB;font-size:16px;margin-bottom:18px">FX · AI</div>${['Агенты', 'Оркестратор', 'Знания (RAG)', 'Интеграции', 'Журнал действий', 'Политики и доступы', 'Метрики качества'].map((t, i) => `<div class="${i === 0 ? 'on' : ''}">${t}</div>`).join('')}</div>
    <div class="main"><div class="row" style="justify-content:space-between"><h1>Мультиагентный контур · Продажи</h1><span class="pill">Концепт интерфейса</span></div>
      <div class="row" style="gap:16px;align-items:stretch;flex:1">
      <div class="card" style="flex:1.3;display:flex;flex-direction:column;gap:12px"><h2>Диалог с ассистентом</h2>
        <div style="align-self:flex-end;background:#13253a;border-radius:14px 14px 4px 14px;padding:12px 14px;max-width:80%;font-size:14px">Подготовь коммерческое предложение для клиента «Демо-Ритейл» и проверь остатки.</div>
        <div style="background:#0f2e22;border-radius:14px 14px 14px 4px;padding:12px 14px;max-width:85%;font-size:14px">Готово. Агент «Склад» подтвердил наличие 94% позиций, агент «Финансы» рассчитал скидку в пределах политики (5%). КП отправлено на согласование менеджеру.</div>
        <div class="row" style="gap:8px"><span class="pill g">CRM: сделка создана</span><span class="pill">ERP: резерв товара</span><span class="pill">Требует подтверждения человеком</span></div></div>
      <div class="card" style="flex:1"><h2>Агенты в контуре</h2><table>${[['Оркестратор', 'активен', '—'], ['Агент продаж', 'активен', '97%'], ['Агент склада', 'активен', '99%'], ['Агент финансов', 'ожидает', '98%'], ['Агент поддержки', 'активен', '94%']].map((r) => `<tr><td>${r[0]}</td><td class="${r[1] === 'активен' ? 'acc' : 'warn'}">${r[1]}</td><td class="muted" style="font-family:Poppins">${r[2]}</td></tr>`).join('')}</table><div class="muted" style="font-size:12px;margin-top:10px">Точность по тестовому набору · демо-значения</div></div></div></div></div></div>`,
  'lms': `<div class="desk" style="height:700px"><div class="chrome"><i></i><i></i><i></i><div class="url">academy · демо-среда / курс</div></div><div class="app">
    <div class="side"><div class="brand" style="color:#F4F7FB;font-size:16px;margin-bottom:18px">FX · ACADEMY</div>${['Мои курсы', 'Game Design', 'Unity / C#', '3D и Blender', 'UI/UX', 'AI для игр', 'Проекты', 'Карьера'].map((t, i) => `<div class="${i === 2 ? 'on' : ''}">${t}</div>`).join('')}</div>
    <div class="main"><div class="row" style="justify-content:space-between"><h1>Unity-разработчик · модуль 4 из 9</h1><span class="pill">Концепт интерфейса</span></div>
      <div class="card"><div class="row" style="justify-content:space-between"><span class="muted">Прогресс программы</span><span style="font:600 16px Poppins">44%</span></div><div class="bar" style="margin-top:10px;height:10px"><i style="width:44%"></i></div></div>
      <div class="kpis">${[['Лекции', '18 / 40'], ['Практика', '7 / 16'], ['Код-ревью', '5'], ['Командный проект', 'Спринт 2']].map(([k, v]) => `<div class="card kpi"><div class="muted" style="font-size:13px">${k}</div><div class="v" style="font-size:24px">${v}</div></div>`).join('')}</div>
      <div class="card" style="flex:1"><h2>Ближайшие занятия</h2><table>${[['Пн 19:00', 'Физика и коллизии в Unity', 'Онлайн'], ['Ср 19:00', 'Игровая экономика: баланс', 'Кампус'], ['Сб 11:00', 'Демо-день командных проектов', 'Кампус']].map((r) => `<tr><td style="font-weight:600">${r[0]}</td><td>${r[1]}</td><td class="muted">${r[2]}</td></tr>`).join('')}</table></div></div></div></div>`,
};

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ deviceScaleFactor: 3 });
  for (const [name, html] of Object.entries(SCREENS)) {
    await p.setViewportSize({ width: 430, height: 900 });
    await p.setContent(`<style>${CSS}</style>${html}`); await p.waitForTimeout(150);
    await p.locator('.phone').screenshot({ path: path.join(OUT, name + '.png'), omitBackground: true }); console.log('ui', name);
  }
  await p.close();
  const d = await b.newPage({ deviceScaleFactor: 1.5 });
  for (const [name, html] of Object.entries(DESKS)) {
    await d.setViewportSize({ width: 1440, height: 900 });
    await d.setContent(`<style>${CSS}</style>${html}`); await d.waitForTimeout(150);
    await d.locator('.desk').screenshot({ path: path.join(OUT, name + '.png'), omitBackground: true }); console.log('ui', name);
  }
  await b.close();
})();
