// Interface concept mockups (HTML -> PNG), FootureX Brand Book v1.0 palette.
// Game screens follow BX-004 (game systems) and BX-013 (approved catalog). All screens are CONCEPTS with demo data.
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const OUT = path.join(__dirname, '..', 'assets', 'ui');
const FONTS = path.join(__dirname, '..', 'brand', 'fonts');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const lu = require('react-icons/lu');
const ico = (n, size = 22) => ReactDOMServer.renderToStaticMarkup(React.createElement(lu[n], { size: String(size), strokeWidth: 1.8 }));
const HERO = 'data:image/jpeg;base64,' + fs.readFileSync(path.join(__dirname, '..', 'assets', 'renders', 'hero-close.jpg')).toString('base64');
const MARK = 'data:image/png;base64,' + fs.readFileSync(path.join(__dirname, '..', 'brand', 'logo', 'footurex-mark-white.png')).toString('base64');

const fontFace = ['ZenDots-Regular', 'Unbounded-Regular', 'Montserrat-Regular', 'Montserrat-Medium', 'Montserrat-SemiBold', 'Montserrat-Bold', 'Poppins-Regular', 'Poppins-Medium', 'Poppins-SemiBold', 'Poppins-Bold']
  .filter((f) => fs.existsSync(path.join(FONTS, f + '.ttf')))
  .map((f) => {
    const [fam, w] = f.split('-');
    const weight = { Regular: 400, Medium: 500, SemiBold: 600, Bold: 700 }[w];
    const family = fam === 'ZenDots' ? 'Zen Dots' : fam;
    return `@font-face{font-family:'${family}';font-weight:${weight};src:url(data:font/ttf;base64,${fs.readFileSync(path.join(FONTS, f + '.ttf')).toString('base64')})}`;
  }).join('\n');

// Brandbook: BG #0B0F0E · Primary #2550FA · Secondary #2593FA · Section #0E1629 · Border #273B51 · Dot #8EB4FF · Text #FFF · Soft #B8C1D4 · Mute #8A93A6
const CSS = `${fontFace}
*{box-sizing:border-box;margin:0;padding:0}
body{background:transparent;font-family:Poppins,Montserrat,sans-serif;color:#FFFFFF}
.phone{width:430px;height:900px;border-radius:64px;background:#141b26;padding:14px;box-shadow:0 0 0 2px #273B51 inset,0 30px 80px rgba(0,0,0,.5)}
.screen{width:402px;height:872px;border-radius:52px;overflow:hidden;background:radial-gradient(120% 60% at 100% 0%,#14244f 0%,#0B0F0E 55%);position:relative}
.notch{position:absolute;top:10px;left:50%;transform:translateX(-50%);width:120px;height:32px;border-radius:20px;background:#000}
.status{height:52px;display:flex;justify-content:space-between;align-items:flex-end;padding:0 30px 4px;font:600 14px Poppins,Montserrat}
.tg{height:48px;display:flex;align-items:center;gap:10px;padding:0 18px;border-bottom:1px solid #1a2638;font:600 15px Poppins,Montserrat}
.tg .x{color:#8A93A6;font-size:13px}.tg .t{flex:1;text-align:center;display:flex;align-items:center;justify-content:center;gap:8px}.tg .t img{width:18px;height:18px}.tg .dots{color:#8A93A6}
.wrap{padding:14px 18px}
.zd{font-family:'Zen Dots',Unbounded}
.card{background:#0E1629;border:1px solid #273B51;border-radius:18px;padding:14px}
.row{display:flex;gap:10px;align-items:center}
.muted{color:#8A93A6}.soft{color:#B8C1D4}.acc{color:#2593FA}.dot{color:#8EB4FF}
.pill{display:inline-block;padding:4px 10px;border-radius:99px;font-size:11px;font-weight:600;background:#0E1629;border:1px solid #142A70;color:#8EB4FF}
.pill.a{background:#142A70;color:#FFFFFF;border-color:#2550FA}
.btn{background:linear-gradient(135deg,#2593FA,#2550FA);color:#fff;border-radius:14px;padding:14px;text-align:center;font-weight:700;font-size:15px}
.btn.g{background:#0E1629;border:1px solid #273B51;color:#B8C1D4}
.bar{height:6px;border-radius:6px;background:#1a2638;overflow:hidden}.bar i{display:block;height:100%;background:linear-gradient(90deg,#2593FA,#2550FA);border-radius:6px}
.tabbar{position:absolute;bottom:0;left:0;right:0;height:78px;background:#0a0e14;border-top:1px solid #1a2638;display:flex;justify-content:space-around;padding-top:12px;font-size:10px;color:#8A93A6;text-align:center}
.tabbar svg{display:block;margin:0 auto 4px;color:#8A93A6}
.tabbar .on{color:#2593FA}.tabbar .on svg{color:#2593FA}
.ava{display:flex;align-items:center;justify-content:center;font:700 22px Poppins,Montserrat;color:#fff;background:linear-gradient(135deg,#2593FA,#2550FA)}
.concept{position:absolute;bottom:86px;right:16px;font-size:9px;color:#5d6678;letter-spacing:.5px}
.rar{font:600 10px Poppins,Montserrat;letter-spacing:1px;text-transform:uppercase}
.desk{width:1440px;height:900px;border-radius:18px;overflow:hidden;background:#0B0F0E;border:1px solid #273B51;box-shadow:0 30px 80px rgba(0,0,0,.5);display:flex;flex-direction:column}
.chrome{height:44px;background:#0a0e14;display:flex;align-items:center;gap:8px;padding:0 18px;border-bottom:1px solid #1a2638}
.chrome i{width:12px;height:12px;border-radius:50%;background:#273B51;display:inline-block}
.url{margin-left:24px;background:#0E1629;border-radius:8px;padding:6px 14px;font:500 13px Poppins,Montserrat;color:#8A93A6;width:520px}
.app{flex:1;display:flex}
.side{width:230px;background:#0a0e14;border-right:1px solid #1a2638;padding:22px 16px;font-size:14px}
.side div{padding:10px 12px;border-radius:10px;color:#8A93A6;margin-bottom:4px}
.side .on{background:#142A70;color:#FFFFFF;font-weight:600}
.main{flex:1;padding:26px 30px;display:flex;flex-direction:column;gap:18px}
h1{font:600 26px Poppins,Montserrat}h2{font:600 16px Poppins,Montserrat;margin-bottom:10px}
.kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.kpi .v{font:600 28px Poppins,Montserrat;margin-top:6px}.kpi .d{font-size:12px;margin-top:4px}
table{width:100%;border-collapse:collapse;font-size:13px}td,th{padding:9px 6px;border-bottom:1px solid #1a2638;text-align:left}th{color:#8A93A6;font-weight:500}
`;

const TABS = [['Клуб', 'LuShield'], ['Состав', 'LuUsers'], ['Матчи', 'LuSwords'], ['Рынок', 'LuStore'], ['Сезон', 'LuMedal']];
const phone = (title, body, tab = 0) => `<div class="phone"><div class="screen"><div class="notch"></div>
<div class="status"><span>9:41</span><span>5G ▮▮▮</span></div>
<div class="tg"><span class="x">Закрыть</span><span class="t"><img src="${MARK}">${title}</span><span class="dots">⋯</span></div>
${body}
<div class="concept">КОНЦЕПТ ИНТЕРФЕЙСА · ДЕМО-ДАННЫЕ</div>
<div class="tabbar">${TABS.map(([t, ic], i) => `<div class="${i === tab ? 'on' : ''}">${ico(ic)}${t}</div>`).join('')}</div>
</div></div>`;

const RAR = { Common: '#B8C1D4', Uncommon: '#8EB4FF', Rare: '#2593FA', Epic: '#6E7BFF', Legendary: '#2550FA', Immortal: '#FFFFFF', Elite: '#8EB4FF' };

const pitchSVG = (players) => `<svg viewBox="0 0 340 400" width="366" height="430" style="display:block;margin:0 auto">
<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#13285e"/><stop offset="1" stop-color="#0f2150"/></linearGradient></defs>
<rect x="2" y="2" width="336" height="396" rx="16" fill="url(#g)" stroke="#273B51"/>
${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="2" y="${2 + i * 66}" width="336" height="33" fill="#ffffff" opacity=".025"/>`).join('')}
<g stroke="#8EB4FF" stroke-opacity=".55" fill="none" stroke-width="1.5"><rect x="14" y="14" width="312" height="372" rx="2"/><line x1="14" y1="200" x2="326" y2="200"/><circle cx="170" cy="200" r="38"/><rect x="90" y="14" width="160" height="56"/><rect x="90" y="330" width="160" height="56"/></g>
${players.map(([x, y, n, r, num]) => `<g transform="translate(${x},${y})"><circle r="20" fill="#0E1629" stroke="#2593FA" stroke-width="2"/><text y="5" text-anchor="middle" font-family="Poppins" font-weight="600" font-size="13" fill="#FFFFFF">${num}</text><rect x="-30" y="24" width="60" height="17" rx="8.5" fill="#0B0F0E" opacity=".9"/><text y="36" text-anchor="middle" font-family="Poppins" font-size="9.5" fill="#B8C1D4">${n}</text><text x="17" y="-13" font-family="Poppins" font-weight="600" font-size="10" fill="#8EB4FF">${r}</text></g>`).join('')}
</svg>`;

const SCREENS = {
  'game-home': phone('FootureX', `<div class="wrap" style="display:flex;flex-direction:column;gap:11px">
    <div class="row" style="justify-content:space-between"><div><div class="muted" style="font-size:12px">Ваш клуб · Level 12</div><div style="font:700 20px Poppins,Montserrat">FC Demo United</div></div><span class="pill a">Ranked</span></div>
    <div class="row"><div class="card" style="flex:1;padding:12px"><div class="muted" style="font-size:11px">Coins</div><div class="zd" style="font-size:19px">12 450</div></div><div class="card" style="flex:1;padding:12px"><div class="muted" style="font-size:11px">FTXcoin</div><div class="zd acc" style="font-size:19px">45</div></div><div class="card" style="flex:1;padding:12px"><div class="muted" style="font-size:11px">Энергия</div><div class="zd" style="font-size:19px">86</div></div></div>
    <div class="card"><div class="row" style="justify-content:space-between"><span style="font:600 14px Poppins,Montserrat">Daily Systems</span><span class="pill">3 / 5</span></div>
      ${[['Ежедневная награда', 'получено'], ['Тренировка состава', '1 / 2'], ['Миссия: сыграть Ranked', '0 / 3']].map(([a, b]) => `<div class="row" style="justify-content:space-between;margin-top:9px;font-size:13px"><span class="soft">${a}</span><span class="dot" style="font-weight:600">${b}</span></div>`).join('')}</div>
    <div class="card" style="background:linear-gradient(135deg,#142A70,#0E1629)"><div class="row" style="justify-content:space-between"><span class="muted" style="font-size:12px">Battle Pass · сезон 14 дней</span><span class="pill a">Premium</span></div><div class="zd" style="font-size:22px;margin:6px 0">Уровень 23 / 100</div><div class="bar"><i style="width:23%"></i></div></div>
    <div class="btn">Играть: Quick · Ranked · League</div>
    <div class="muted" style="font-size:10px">Coins и FTXcoin — внутриигровые валюты. Вывод FTXcoin в деньги не предусмотрен (BX-013).</div></div>`, 0),
  'game-squad': phone('Состав · 4-3-3', `<div class="wrap" style="padding-top:10px"><div class="row" style="gap:6px;margin-bottom:8px"><span class="pill a">Основной</span><span class="pill">Резерв</span><span class="pill">Молодёжь</span><span class="pill">Chemistry 92</span></div>
    ${pitchSVG([[170, 52, 'Rakhimov', 81, 9], [70, 78, 'Yusupov', 79, 11], [270, 78, 'Saidov', 80, 7], [95, 172, 'Nazarov', 77, 8], [170, 192, 'Tursunov', 82, 10], [245, 172, 'Aliev', 76, 6], [40, 278, 'Karimov', 75, 3], [125, 288, 'Ergashev', 78, 4], [215, 288, 'Mirzaev', 77, 5], [300, 278, 'Umarov', 74, 2], [170, 356, 'Ismoilov', 80, 1]])}
    <div class="row" style="gap:6px;margin-top:8px;flex-wrap:wrap">${['Pressing: High', 'Tempo: Fast', 'Defensive Line: Mid', 'Attack Focus: Wings'].map((t) => `<span class="pill">${t}</span>`).join('')}</div>
    <div class="muted" style="font-size:10px;margin-top:6px">Имена игроков вымышлены</div></div>`, 1),
  'game-player': phone('Карточка игрока', `<div class="wrap" style="display:flex;flex-direction:column;gap:10px">
    <div class="card" style="background:linear-gradient(160deg,#142A70,#0E1629 70%);text-align:center;padding:16px">
      <div class="row" style="justify-content:space-between"><span class="zd" style="font-size:30px">82</span><span class="rar" style="color:#2550FA;background:#FFFFFF;padding:3px 8px;border-radius:6px">Legendary</span></div>
      <div class="ava" style="width:96px;height:96px;border-radius:48px;margin:2px auto 8px;border:2px solid #8EB4FF;font-size:30px">DT</div>
      <div style="font:700 18px Poppins,Montserrat">D. Tursunov</div><div class="muted" style="font-size:12px">CAM · 19 лет · молодёжный состав</div></div>
    <div class="card" style="padding:10px 14px">${[['Pace', 84], ['Shooting', 79], ['Passing', 86], ['Dribbling', 88], ['Defense', 52], ['Physical', 71], ['Stamina', 77], ['Vision', 85]].map(([k, v]) => `<div class="row" style="margin:5px 0"><span style="width:82px;font-size:12px" class="soft">${k}</span><div class="bar" style="flex:1"><i style="width:${v}%"></i></div><span style="width:28px;text-align:right;font:600 12px Poppins,Montserrat">${v}</span></div>`).join('')}
      <div class="muted" style="font-size:10.5px;margin-top:6px">Скрытые: Mentality · Consistency · Pressure Resistance · Chemistry Adaptation · Injury Resistance</div></div>
    <div class="row"><div class="btn" style="flex:1;padding:12px">Тренировка</div><div class="btn g" style="flex:1;padding:12px">Evolution</div></div></div>`, 1),
  'game-league': phone('Лиги', `<div class="wrap" style="display:flex;flex-direction:column;gap:10px"><div class="row" style="gap:6px"><span class="pill a">Пользовательские</span><span class="pill">Системные</span><span class="pill">Турниры</span></div>
    ${[['Fan League', '69', '5', '2 · 2 · 1'], ['Pro League', '109', '8', '3 · 3 · 2'], ['Master League', '149', '12', '5 · 5 · 2']].map(([n, c, f, s]) => `<div class="card"><div class="row" style="justify-content:space-between"><span style="font:600 15px Poppins,Montserrat">${n}</span><span class="pill">создание ${c} FTXcoin</span></div>
      <div class="row" style="justify-content:space-between;margin-top:8px;font-size:12px"><span class="soft">Взнос за сезон 7 дней</span><span class="zd acc" style="font-size:13px">${f} FTXcoin</span></div>
      <div class="row" style="justify-content:space-between;margin-top:4px;font-size:12px"><span class="muted">создателю · призовой фонд · казна</span><span class="dot" style="font-weight:600">${s}</span></div></div>`).join('')}
    <div class="card" style="padding:10px 14px"><div class="soft" style="font-size:12px">Пользовательская лига: +4 места за 20 FTXcoin · лимит 48 мест</div></div>
    <div class="card"><div class="row" style="justify-content:space-between"><span style="font:600 14px Poppins,Montserrat">Системные лиги</span><span class="pill a">бесплатно</span></div><div class="muted" style="font-size:12px;margin-top:6px">Ранги 19–100</div></div>
    <div class="card"><div style="font:600 13px Poppins,Montserrat">PvP-матчмейкинг</div><div class="muted" style="font-size:11.5px;margin-top:5px">Ранг · сила команды · скрытый MMR · поведение · регион задержки (BX-004)</div></div>
    <div class="muted" style="font-size:10px">Цены и распределение взносов — BX-013 v1.0</div></div>`, 2),
  'game-market': phone('Marketplace', `<div class="wrap"><div class="row" style="gap:5px;margin-bottom:12px;flex-wrap:wrap">${['Продажа', 'Аренда', 'Крафт', 'Слияние', 'Скаутинг'].map((t, i) => `<span class="pill ${i === 0 ? 'a' : ''}">${t}</span>`).join('')}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">${[['S. Yuldashev', 'ST', 80, 'Epic'], ['O. Hasanov', 'CM', 77, 'Rare'], ['J. Rakhmonov', 'CB', 79, 'Epic'], ['T. Qodirov', 'GK', 81, 'Legendary']].map(([n, p, r, rar]) => `<div class="card" style="padding:12px"><div class="row" style="justify-content:space-between"><span class="zd" style="font-size:20px">${r}</span><span class="pill">${p}</span></div><div class="ava" style="height:66px;border-radius:12px;margin:8px 0;opacity:.9">${n.split(' ').map((w) => w[0]).join('').replace('.', '')}</div><div style="font:600 13px Poppins,Montserrat">${n}</div><div class="rar" style="color:${RAR[rar]};margin-top:4px">${rar}</div></div>`).join('')}</div>
    <div class="card" style="margin-top:10px;padding:10px 12px"><div class="muted" style="font-size:10.5px">Оборот между пользователями ≠ выручка платформы. Не предусмотрены: вывод FTXcoin в деньги, конвертация Coins → FTXcoin, ставки (BX-013).</div></div></div>`, 3),
  'game-season': phone('Battle Pass', `<div class="wrap" style="display:flex;flex-direction:column;gap:11px">
    <div class="card" style="background:linear-gradient(135deg,#142A70,#0E1629)"><div class="muted" style="font-size:11px">Сезон · 14 дней · 100 уровней</div><div class="row" style="justify-content:space-between"><span class="zd" style="font-size:20px">23 / 100</span><span class="pill a">8 дней</span></div><div class="bar" style="margin-top:10px"><i style="width:23%"></i></div>
      <div class="row" style="margin-top:12px;gap:6px">${[20, 21, 22, 23, 24, 25].map((l) => `<div style="flex:1;height:50px;border-radius:12px;border:1px solid ${l <= 23 ? '#2593FA' : '#273B51'};background:${l <= 23 ? '#142A70' : '#0a0e14'};display:flex;align-items:center;justify-content:center;font:600 13px Poppins,Montserrat">${l}</div>`).join('')}</div></div>
    <div class="row"><div class="card" style="flex:1"><div class="muted" style="font-size:11px">Free Pass</div><div style="font:700 16px Poppins,Montserrat">Бесплатно</div></div><div class="card" style="flex:1;border-color:#2550FA"><div class="muted" style="font-size:11px">Premium Pass</div><div style="font:700 16px Poppins,Montserrat">$3.99 · сезон</div></div></div>
    <div class="card"><h2>Missions</h2>${[['Сыграйте 3 Ranked-матча', 2, 3], ['Проведите 2 тренировки', 2, 2], ['Победа в League Match', 0, 1], ['Сыграйте Event Match', 1, 1], ['Улучшите игрока (Evolution)', 0, 1]].map(([t, a, b]) => `<div class="row" style="justify-content:space-between;margin:7px 0;font-size:13px"><span class="soft">${t}</span><span class="${a === b ? 'acc' : 'muted'}" style="font:600 13px Poppins,Montserrat">${a}/${b}</span></div>`).join('')}</div>
    <div class="card"><h2>Награды уровня 24</h2><div class="row" style="gap:8px">${['Coins', 'Косметика', 'Набор'].map((t) => `<div style="flex:1;text-align:center;padding:10px 4px;border-radius:12px;border:1px solid #273B51;background:#0a0e14;font:600 12px Poppins,Montserrat">${t}</div>`).join('')}</div></div>
    <div class="muted" style="font-size:10px">Оплата — Telegram Stars / TON. Платные преимущества не гарантируют победу (BX-003).</div></div>`, 4),
  'game-store': phone('Магазин', `<div class="wrap" style="display:flex;flex-direction:column;gap:10px">
    <div class="row" style="gap:6px"><span class="pill a">Наборы</span><span class="pill">FTXcoin</span><span class="pill">Косметика</span></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">${[['Free Pack', 'каждые 24 ч', null], ['Common Pack', '200 Coins', 'Common'], ['Uncommon Pack', '800 Coins', 'Uncommon'], ['Rare Pack', '39 FTXcoin', 'Rare'], ['Epic Pack', '59 FTXcoin', 'Epic'], ['Legendary Pack', '89 FTXcoin', 'Legendary'], ['Immortal Pack', '139 FTXcoin', 'Immortal'], ['Elite Pack', '149 FTXcoin', 'Elite']].map(([n, p, r]) => `<div class="card" style="padding:10px 12px"><div class="rar" style="color:${r ? RAR[r] : '#8A93A6'}">${r || 'Бесплатно'}</div><div style="font:600 13px Poppins,Montserrat;margin-top:3px">${n}</div><div class="acc" style="font:600 12px Poppins,Montserrat;margin-top:4px">${p}</div></div>`).join('')}</div>
    <div class="card" style="padding:10px 12px"><div class="muted" style="font-size:11px;margin-bottom:6px">Пакеты FTXcoin · Telegram Stars / TON</div><div class="row" style="justify-content:space-between;font:600 12px Poppins,Montserrat">${[['30', '$1.99'], ['60', '$3.99'], ['90', '$5.99'], ['150', '$9.50'], ['400', '$24.99']].map(([a, b]) => `<div style="text-align:center"><div class="zd" style="font-size:13px">${a}</div><div class="dot">${b}</div></div>`).join('')}</div></div>
    <div class="card" style="padding:10px 12px"><div class="row" style="justify-content:space-between"><span style="font:600 13px Poppins,Montserrat">Create Player</span><span class="acc" style="font:600 12px Poppins,Montserrat">30 FTXcoin</span></div></div>
    <div class="card" style="padding:10px 12px"><div class="muted" style="font-size:10.5px">Не предусмотрены: вывод FTXcoin в деньги, конвертация Coins → FTXcoin, нечестные лутбоксы, ставки (BX-013)</div></div>
    <div class="muted" style="font-size:10px">Цены — BX-013 Approved Services Catalog v1.0</div></div>`, -1),
  'stadium-app': phone('FootureX Stadium', `<div class="wrap" style="display:flex;flex-direction:column;gap:12px">
    <div class="card" style="background:linear-gradient(135deg,#142A70,#0E1629)"><div class="muted" style="font-size:11px">Электронный билет</div><div style="font:700 18px Poppins,Montserrat;margin:4px 0">Сектор B · Ряд 12 · Место 18</div><div class="row" style="justify-content:space-between"><span class="pill a">Вход: ворота 4</span><span class="muted" style="font-size:12px">Сб 19:00</span></div>
      <div style="margin:14px auto 4px;width:140px;height:140px;background:repeating-linear-gradient(90deg,#FFFFFF 0 6px,transparent 6px 10px),#0E1629;border-radius:12px;opacity:.85"></div></div>
    <div class="row"><div class="card" style="flex:1"><div class="muted" style="font-size:11px">Заказ к месту</div><div style="font:600 15px Poppins,Montserrat">Еда и напитки</div></div><div class="card" style="flex:1"><div class="muted" style="font-size:11px">Навигация</div><div style="font:600 15px Poppins,Montserrat">Маршрут к месту</div></div></div>
    <div class="card"><div class="muted" style="font-size:11px">Live-статистика матча</div><div class="row" style="justify-content:space-between;margin-top:8px"><span class="zd" style="font-size:26px">2 : 1</span><span class="pill">67′</span></div><div class="bar" style="margin-top:10px"><i style="width:58%"></i></div><div class="muted" style="font-size:11px;margin-top:6px">Владение мячом 58%</div></div>
    <div class="card"><div class="muted" style="font-size:11px">Esports-арена</div><div style="font:600 15px Poppins,Montserrat;margin-top:4px">Финал FootureX Cup · трансляция</div></div></div>`, 2),
};

const desk = (url, sideTitle, items, on, body, h = 900) => `<div class="desk" style="height:${h}px"><div class="chrome"><i></i><i></i><i></i><div class="url">${url}</div></div><div class="app">
  <div class="side"><div style="display:flex;align-items:center;gap:8px;color:#fff;margin-bottom:18px;padding:0 0 0 4px"><img src="${MARK}" style="width:20px;height:20px"><span class="zd" style="font-size:14px">${sideTitle}</span></div>${items.map((t, i) => `<div class="${i === on ? 'on' : ''}">${t}</div>`).join('')}</div>
  <div class="main">${body}</div></div></div>`;

const DESKS = {
  'erp-dashboard': [desk('erp · демо-среда / обзор', 'ERP', ['Обзор', 'Продажи · CRM', 'Склад', 'Закупки · SRM', 'Касса · POS', 'Финансы', 'Персонал', 'Отчёты', 'AI-ассистент'], 0, `<div class="row" style="justify-content:space-between"><h1>Обзор бизнеса</h1><span class="pill">Демо-данные · концепт интерфейса</span></div>
      <div class="kpis">${[['Выручка (мес.)', '1,28 млрд сум', '+12% к пр. мес.'], ['Заказы', '4 812', '+6%'], ['Остатки на складе', '18 340 ед.', '−3%'], ['Дебиторка', '214 млн сум', '−9%']].map(([k, v, d]) => `<div class="card kpi"><div class="muted" style="font-size:13px">${k}</div><div class="v">${v}</div><div class="d acc">${d}</div></div>`).join('')}</div>
      <div class="row" style="gap:16px;align-items:stretch;flex:1"><div class="card" style="flex:2"><h2>Продажи по неделям</h2><svg width="100%" height="300" viewBox="0 0 700 300">${[120, 150, 140, 180, 170, 210, 200, 240, 230, 260, 250, 290].map((v, i) => `<rect x="${20 + i * 56}" y="${300 - v}" width="34" height="${v}" rx="6" fill="${i === 11 ? '#2593FA' : '#1d2f52'}"/>`).join('')}</svg></div>
      <div class="card" style="flex:1"><h2>Последние операции</h2><table>${[['POS-2041', 'Оплачено', '1 240 000'], ['INV-3318', 'Отгрузка', '8 900 000'], ['PO-0912', 'Закупка', '5 410 000'], ['POS-2042', 'Оплачено', '640 000'], ['CRM-771', 'Сделка', '12 000 000'], ['POS-2043', 'Возврат', '−120 000']].map((r) => `<tr><td>${r[0]}</td><td class="muted">${r[1]}</td><td style="text-align:right">${r[2]}</td></tr>`).join('')}</table></div></div>`), 900],
  'ai-console': [desk('ai-workspace · демо-среда', 'AI', ['Агенты', 'Оркестратор', 'Знания (RAG)', 'Интеграции', 'Журнал действий', 'Политики и доступы', 'Метрики качества'], 0, `<div class="row" style="justify-content:space-between"><h1>Мультиагентный контур · Продажи</h1><span class="pill">Концепт интерфейса</span></div>
      <div class="row" style="gap:16px;align-items:stretch;flex:1">
      <div class="card" style="flex:1.3;display:flex;flex-direction:column;gap:12px"><h2>Диалог с ассистентом</h2>
        <div style="align-self:flex-end;background:#142A70;border-radius:14px 14px 4px 14px;padding:12px 14px;max-width:80%;font-size:14px">Подготовь коммерческое предложение для клиента «Демо-Ритейл» и проверь остатки.</div>
        <div style="background:#0B0F0E;border:1px solid #273B51;border-radius:14px 14px 14px 4px;padding:12px 14px;max-width:85%;font-size:14px">Готово. Агент «Склад» подтвердил наличие 94% позиций, агент «Финансы» рассчитал скидку в пределах политики (5%). КП отправлено на согласование менеджеру.</div>
        <div class="row" style="gap:8px"><span class="pill a">CRM: сделка создана</span><span class="pill">ERP: резерв товара</span><span class="pill">Требует подтверждения человеком</span></div></div>
      <div class="card" style="flex:1"><h2>Агенты в контуре</h2><table>${[['Оркестратор', 'активен'], ['Агент продаж', 'активен'], ['Агент склада', 'активен'], ['Агент финансов', 'ожидает'], ['Агент поддержки', 'активен']].map((r) => `<tr><td>${r[0]}</td><td class="${r[1] === 'активен' ? 'acc' : 'dot'}">${r[1]}</td></tr>`).join('')}</table></div></div>`, 520), 520],
  'lms': [desk('academy · демо-среда / курс', 'ACADEMY', ['Мои курсы', 'Game Design', 'Unity / C#', '3D и Blender', 'UI/UX', 'AI для игр', 'Проекты', 'Карьера'], 2, `<div class="row" style="justify-content:space-between"><h1>Unity-разработчик · модуль 4 из 9</h1><span class="pill">Концепт интерфейса</span></div>
      <div class="card"><div class="row" style="justify-content:space-between"><span class="muted">Прогресс программы</span><span style="font:600 16px Poppins,Montserrat">44%</span></div><div class="bar" style="margin-top:10px;height:10px"><i style="width:44%"></i></div></div>
      <div class="kpis">${[['Лекции', '18 / 40'], ['Практика', '7 / 16'], ['Код-ревью', '5'], ['Командный проект', 'Спринт 2']].map(([k, v]) => `<div class="card kpi"><div class="muted" style="font-size:13px">${k}</div><div class="v" style="font-size:24px">${v}</div></div>`).join('')}</div>
      <div class="card" style="flex:1"><h2>Ближайшие занятия</h2><table>${[['Пн 19:00', 'Физика и коллизии в Unity', 'Онлайн'], ['Ср 19:00', 'Игровая экономика: баланс', 'Офлайн'], ['Сб 11:00', 'Демо-день командных проектов', 'Офлайн']].map((r) => `<tr><td style="font-weight:600">${r[0]}</td><td>${r[1]}</td><td class="muted">${r[2]}</td></tr>`).join('')}</table></div>`, 700), 700],
  'website': [`<div class="desk" style="height:800px"><div class="chrome"><i></i><i></i><i></i><div class="url">footurex · официальный сайт (концепт BX-006)</div></div>
    <div style="flex:1;background:radial-gradient(70% 70% at 95% 0%,#16307A 0%,#0B0F0E 60%);padding:26px 48px;display:flex;flex-direction:column;position:relative">
      <div class="row" style="justify-content:space-between;position:relative;z-index:2"><div class="row" style="gap:10px"><img src="${MARK}" style="width:28px;height:28px"><span class="zd" style="font-size:20px">FootureX</span></div>
        <div class="row" style="gap:20px;font-size:14px" >${['Home', 'About', 'Ecosystem', 'Roadmap', 'Media', 'Community', 'Partners', 'FAQ', 'Contacts'].map((t, i) => `<span class="${i === 0 ? '' : 'soft'}">${t}</span>`).join('')}<span class="btn" style="padding:9px 16px;font-size:13px">Web App</span></div></div>
      <img src="${HERO}" style="position:absolute;right:0;top:44px;width:50%;height:756px;object-fit:cover;object-position:25% 50%;-webkit-mask-image:linear-gradient(90deg,transparent 0%,#000 45%);opacity:.95">
      <div style="margin-top:110px;position:relative"><span class="pill a">DIGITAL FOOTBALL ECOSYSTEM</span>
        <div class="zd" style="font-size:64px;line-height:1.15;margin-top:22px">We will create<br>a <span style="background:linear-gradient(90deg,#2593FA,#2550FA);-webkit-background-clip:text;color:transparent">digital football era.</span></div>
        <div class="soft" style="font-size:18px;margin-top:20px;max-width:720px">Футбольный менеджер в Telegram, лиги, сезоны и сообщество — первый шаг экосистемы FootureX.</div>
        <div class="row" style="gap:14px;margin-top:30px"><span class="btn" style="padding:14px 26px">Открыть в Telegram</span><span class="btn g" style="padding:14px 26px">Roadmap</span></div></div>
      <div class="row" style="gap:14px;margin-top:auto;position:relative">${['RU · UZ · EN', 'Mobile-first · адаптивность', 'SEO · OpenGraph · Sitemap', 'Parallax · Glow · Smooth Transitions'].map((t) => `<div class="card" style="flex:1;font-size:13px" >${t}</div>`).join('')}</div>
    </div></div>`, 800],
};

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ deviceScaleFactor: 2 });
  for (const [name, html] of Object.entries(SCREENS)) {
    await p.setViewportSize({ width: 430, height: 900 });
    await p.setContent(`<style>${CSS}</style>${html}`); await p.waitForTimeout(200);
    await p.locator('.phone').screenshot({ path: path.join(OUT, name + '.png'), omitBackground: true }); console.log('ui', name);
  }
  await p.close();
  const d = await b.newPage({ deviceScaleFactor: 1.5 });
  for (const [name, [html]] of Object.entries(DESKS)) {
    await d.setViewportSize({ width: 1440, height: 900 });
    await d.setContent(`<style>${CSS}</style>${html}`); await d.waitForTimeout(200);
    await d.locator('.desk').screenshot({ path: path.join(OUT, name + '.png'), omitBackground: true }); console.log('ui', name);
  }
  await b.close();
})();
