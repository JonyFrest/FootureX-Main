# FootureX Uzbekistan — Corporate Vision & Strategic Development (117 слайдов)

Корпоративная презентация MChJ «FootureX Uzbekistan» (FootureX Uzbekistan LLC), Ташкент.

## Что внутри

| Файл | Назначение |
|---|---|
| `output/FootureX_Uzbekistan_Corporate_Presentation.pptx` | Редактируемая презентация PowerPoint, 16:9, ровно 117 слайдов, 12 разделов, заметки докладчика на каждом слайде |
| `output/FootureX_Uzbekistan_Corporate_Presentation.pdf` | PDF-версия для распространения (шрифты встроены) |
| `output/FootureX_Illustrative_Financial_Model.xlsx` | Иллюстративная 5-летняя модель: допущения → P&L, денежные потоки, сценарии (живые формулы) |
| `docs/AUDIT.md` | Аудит: стратегия, финансы, согласованность, источники, дизайн, читаемость, анимации, все 117 слайдов, открытые вопросы |
| `brand/brand.json` | Цвета, шрифты, пути к логотипам — **провизорные** (см. ниже) |
| `brand/fonts/` | Шрифты Google Fonts (OFL): Zen Dots, Poppins, Unbounded, Montserrat |
| `build/` | Генератор: 3D-сцены (three.js), макеты интерфейсов, финансовая модель, сборка pptx, переходы и анимации |

## Важно перед использованием

1. **Брендбук не был передан.** Файл `FootureX_Brandbook.pdf` отсутствовал в сессии и в репозитории. Поэтому:
   - палитра в `brand/brand.json` — провизорная;
   - вместо оригинального логотипа стоит **временный текстовый знак** «FootureX», набранный шрифтом Zen Dots. Это не логотип и не его замена.
2. **Финансовые документы не были переданы.** Все финансовые показатели — **иллюстративный сценарий на основе допущений**. Он явно помечен на каждом финансовом слайде и заменяется утверждённой моделью компании.
3. **Шрифты.** В Zen Dots и Poppins нет кириллицы. Латиница набрана Zen Dots и Poppins, русский текст — Unbounded и Montserrat. Чтобы редактировать pptx без подмены шрифтов, установите все файлы из `brand/fonts/`. PDF не требует установки шрифтов.
4. **Переходы Morph** работают в PowerPoint 2019, 2021 и Microsoft 365 (Windows и Mac). В других программах вместо Morph проигрывается Fade.

## Как подставить брендбук и логотип

1. Положите оригинальные логотипы в `brand/logo/`:
   - `footurex-logo-on-dark.png` — для тёмного фона;
   - `footurex-logo-on-light.png` — для светлого фона.

   Подойдёт PNG с прозрачным фоном шириной от 2000 px.
2. Перенесите фирменные HEX-цвета в `brand/brand.json` → `colors`. Если брендбук задаёт другие шрифты, обновите `fonts`.
3. Пересоберите презентацию:

```bash
cd presentation/build
npm install
npm run build        # финансовая модель + 117 слайдов + переходы и анимации
```

Логотип стоит в макетах слайдов, поэтому заменяется на всех 117 слайдах сразу. Пропорции логотипа сохраняются.

## Пересборка ассетов (необязательно)

```bash
npm run renders   # 3D-концепты (three.js в headless Chromium/Playwright)
npm run ui        # макеты интерфейсов (HTML → PNG)
npm run model     # пересчёт иллюстративной финансовой модели → assets/finmodel.json + xlsx
```

PDF-версия: `soffice --headless --convert-to pdf output/FootureX_Uzbekistan_Corporate_Presentation.pptx`.

## Структура

I Corporate Identity (1–10) · II Market & Strategy (11–20) · III IT Services (21–30) · IV Artificial Intelligence (31–40) · V Game Development (41–52) · VI Game Community & Esports (53–62) · VII Education & Academy (63–70) · VIII Football Development (71–82) · IX Stadium & City (83–94) · X Business & Financial Model (95–106) · XI Governance & Execution (107–113) · XII Future Vision (114–117).

Каждый слайд несёт статус в правом верхнем углу: «План · Фаза 1», «В разработке», «Стратегическая концепция», «Долгосрочная амбиция», «Расчётный сценарий», «Рыночные данные», «Требуется подтверждение». Так видно, что действует, что в работе, а что только планируется.
