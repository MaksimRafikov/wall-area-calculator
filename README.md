# Калькулятор площади стен

Веб-приложение для сметы **внутренней отделки**: площадь стен по комнатам (с учётом общих перегородок), вычет проёмов, отдельно **откосы окон** и **откосы проёмов**.

## Ссылки

| | |
|--|--|
| **Репозиторий** | https://github.com/MaksimRafikov/wall-area-calculator |
| **Онлайн** | https://maksimrafikov.github.io/wall-area-calculator/ |

## Запуск

```powershell
npm install
npm run dev          # http://localhost:5173
npm run build        # production
npm run deploy:pages # обновить GitHub Pages
```

## Тесты

```powershell
npm test              # unit (Vitest)
npm run test:e2e      # браузер (Playwright)
npm run typecheck
```

## Возможности

- Ввод в **миллиметрах**, итоги в **м²**
- Пресет **«Видинеевский»** (7 комнат с плана)
- Откосы: **окна** и **проёмы** отдельно, по глубине с плана
- CSV для Excel, автосохранение в браузере

## Дорожная карта

| Этап | Статус |
|------|--------|
| MVP: комнаты, стены, проёмы, смета | ✅ |
| Пресет Видинеевский, GitHub Pages | ✅ |
| Unit + E2E тесты | ✅ |
| Импорт плана (PNG/PDF) + правка размеров | 🔜 |
| Режим «контур по сегментам» для сложных комнат | 🔜 |
| Экспорт PDF-сметы | 🔜 |

## Структура

- `src/calculations.ts` — формулы
- `src/presets/vidineevsky.ts` — эталонный объект
- `e2e/` — сценарии Playwright
