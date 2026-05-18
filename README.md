# Калькулятор площади стен

Веб-приложение для сметы **внутренней отделки**: площадь стен по комнатам, вычет проёмов, отдельно **откосы окон** и **откосы проёмов**.

## Ссылки

| | |
|--|--|
| **Репозиторий** | https://github.com/MaksimRafikov/wall-area-calculator |
| **Калькулятор в браузере** | https://maksimrafikov.github.io/wall-area-calculator/ |

После обновления кода сайт обновляется командой `npm run deploy:pages` (см. ниже).

## Запуск на компьютере

```powershell
cd "c:\Users\Пользователь\Desktop\Coursor\Рассчет площадей"
npm install
npm run dev
```

Откройте в браузере адрес из терминала (обычно http://localhost:5173).

## Обновление сайта на GitHub Pages

```powershell
npm run deploy:pages
```

Подождите 1–3 минуты и обновите страницу калькулятора.

## Сохранение изменений в Git

```powershell
git add .
git commit -m "Кратко: что изменили"
git push
```

## Пресет «Видинеевский»

В приложении: кнопка **«Видинеевский»** или **«Загрузить «Видинеевский»»**.

Исходник данных: `src/presets/vidineevsky.ts`.

## Структура проекта

- `src/calculations.ts` — расчёты
- `src/components/` — интерфейс
- `src/presets/` — готовые объекты
