# FootureX Uzbekistan — Corporate Vision & Strategic Development (117 слайдов)

Корпоративная презентация MChJ «FootureX Uzbekistan» (FootureX Uzbekistan LLC), Ташкент.

## Что внутри

| Файл | Назначение |
|---|---|
| `output/FootureX_Uzbekistan_Corporate_Presentation.pptx` | Редактируемая презентация PowerPoint: 16:9, ровно 117 слайдов, 12 разделов, заметки докладчика на каждом слайде |
| `output/FootureX_Uzbekistan_Corporate_Presentation.pdf` | PDF-версия для распространения, шрифты встроены |
| `output/FootureX_Catalog_and_Model_Template.xlsx` | Каталог цен BX-013, расчёты по нему (формулы) и пустой шаблон драйверной модели на 5 лет |
| `docs/AUDIT.md` | Аудит: источники BX, расхождения документов, классификация данных, соответствие брендбуку, рыночные источники, анимации, перечень 117 слайдов, открытые вопросы |
| `brand/FootureX_Brandbook.pdf` | Брендбук FootureX v1.0 — главный визуальный стандарт. Помечен «Confidential», поэтому не хранится в публичном репозитории (`.gitignore`); положите файл сюда локально |
| `brand/brand.json` | Цвета, шрифты и логотипы по брендбуку |
| `brand/logo/` | Знак, локап «знак + FootureX» и двухцветный вордмарк — извлечены из векторных страниц брендбука без перерисовки |
| `assets/video/` | Облёты концептуальных 3D-моделей Stadium и City (MP4, встраиваются в слайды 83 и 88) |
| `brand/fonts/` | Шрифты Google Fonts (OFL): Zen Dots, Poppins, Unbounded, Montserrat |
| `build/` | Генератор: 3D-сцены (three.js), облёты камеры, концепты интерфейсов, каталог и шаблон модели, сборка pptx, переходы и анимации |

## Основа содержания

- **Брендбук FootureX v1.0:**
  - тёмная база #0B0F0E, синие акценты #2550FA / #2593FA, белый текст;
  - оригинальный знак;
  - Zen Dots и Poppins;
  - нейминг FootureX / FTXcoin / FOOTX;
  - голос бренда, манифест и слоган «We will create a digital football era.»
- **Документы BX-001…BX-008 и BX-013** — основа направления FootureX Game: архитектура, игровые системы, экономика, техстек, оргструктура, инвестиционные стадии, утверждённый каталог цен.
- **Остальные направления** (Technologies, AI, студия Game Development, Game Dev Academy, Game Community, Esports, FC FootureX, Football Academy, Stadium, City) описаны по корпоративной концепции и отделены от игры. Всего в презентации 11 направлений.

## Важно перед использованием

1. **Цифр, которых нет в документах, в презентации нет.** Выручка, пользователи, инвестиции и сроки окупаемости не заданы. Финансовые слайды показывают:
   - цены BX-013;
   - расчёты только по этим ценам;
   - структуру модели с формулами.

   Значения помечены «Требуется подтверждение». Шаблон в Excel заполняется после утверждения бизнес-плана.
2. **Расхождения документов** показаны на слайдах и описаны в `docs/AUDIT.md`, раздел 3:
   - роль FTXcoin;
   - линейка редкости;
   - Stars/TON;
   - горизонт 10–12 и 10–20 лет.
3. **Шрифты не встроены в pptx** (генератор этого не умеет). В файлах Zen Dots и Poppins нет кириллицы: латиница набрана Zen Dots и Poppins, русский текст — Unbounded и Montserrat. Перед показом с чужого компьютера установите все файлы из `brand/fonts/` или один раз сохраните pptx в PowerPoint с параметром «Внедрять шрифты в файл». PDF шрифтов не требует.
4. **Переходы Morph** работают в PowerPoint 2019, 2021 и Microsoft 365. В других программах вместо Morph проигрывается Fade. Воспроизведение в PowerPoint в среде сборки не проверялось (PowerPoint недоступен) — пролистайте презентацию в режиме докладчика перед показом.
5. **Видео-облёты** на слайдах 83 и 88 запускаются автоматически. В PDF вместо видео показан первый кадр.

## Пересборка

Нужны Node.js 18+, Python 3 с `lxml` (постобработка: Morph, анимации, видео) и LibreOffice для PDF.

```bash
cd presentation/build
npm ci
pip install lxml
npm run build        # каталог и шаблон модели + 117 слайдов + переходы и анимации
python3 export_pdf.py ../output/FootureX_Uzbekistan_Corporate_Presentation.pptx   # PDF без встроенных видео (кадр-заставка)
```

`npm run build` пишет xlsx с формулами без сохранённых значений: Excel пересчитает их при открытии. Для превью без Excel пересчитайте файл в LibreOffice (открыть и сохранить).

Цвета, шрифты и логотипы берутся из `brand/brand.json`. Логотип стоит в макетах слайдов, поэтому при замене файла обновляется на всех слайдах.

## Пересборка ассетов (необязательно)

Рендеры и макеты требуют Playwright с Chromium (в `package.json` не входит, ставится отдельно), облёты — ещё и ffmpeg:

```bash
npm install --no-save playwright && npx playwright install chromium
npm run renders   # 3D-концепты (three.js в headless Chromium)
npm run video     # облёты камеры Stadium и City → assets/video/*.mp4
npm run ui        # макеты интерфейсов (HTML → PNG)
npm run model     # каталог BX-013, расчёты и шаблон модели → assets/finmodel.json + xlsx
```

## Структура

I Corporate Identity (1–10) · II Market & Strategy (11–20) · III IT Services (21–30) · IV Artificial Intelligence (31–40) · V Game Development (41–52) · VI Game Community & Esports (53–62) · VII Education & Academy (63–70) · VIII Football Development (71–82) · IX Stadium & City (83–94) · X Business & Financial Model (95–106) · XI Governance & Execution (107–113) · XII Future Vision (114–117).

Каждый слайд несёт статус в правом верхнем углу:
- «Документы BX»;
- «Брендбук v1.0»;
- «Расчёт по данным BX»;
- «Цифры не предоставлены»;
- «В разработке · Stage 0 MVP» (FootureX Game: идёт разработка MVP по BX-016/BX-017; формулировку подтверждает владелец);
- «Концепция · Фаза 1» (направления, которые планируется запускать первыми);
- «Стратегическая концепция»;
- «Долгосрочная амбиция»;
- «Рыночные данные»;
- «Требуется подтверждение».

Так видно, что подтверждено документом, что рассчитано, а что только планируется.
