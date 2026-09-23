# 0006 — Vite сборка за GitHub Pages

Дата: 2026-09-23
Статус: Прието

## Контекст

GitHub Pages сервира статични файлове под `/tic-tac-toe/`, но браузърът не може да изпълни `.svelte` изходния код. Ранният branch/root Pages режим и възстановяването на съвместим root bundle са междинни етапи от миграцията.

## Решение

Vite използва `base: "/tic-tac-toe/"` и създава `dist/`. GitHub Actions на `main` изпълнява `npm ci`, `npm run check`, качва `dist` като Pages artifact и го публикува. Amp репозиторията е изходен remote; отделното GitHub огледало обслужва Pages чрез описания в `.agents/ship.md` процес на push без force. `app.js` и `styles.css` в root не са production entry point на текущия `index.html`.

## Алтернативи

Статичен root deployment не може директно да компилира Svelte; временният допълнителен root bundle решава това, но поддържа два production изхода. Превключването към Actions artifact позволява един build изход `dist/` за сайта. Изцяло друг hosting не е нужен за статичния клиент.

## Последствия

Има проверим build и възпроизводим deployment, но проектът зависи от CI и правилния base path; Pages не хоства matchmaking Worker-а, който се публикува отделно. GitHub огледалото и Amp remote трябва да останат синхронизирани при ship. Това описва наличния workflow, а не гарантира, че всеки локален commit е публикуван.

## Източници

- [Преходът от root Pages към Vite артефакт](https://ampcode.com/threads/T-01a09776-dd00-7618-a247-39bcf8a149e6)
- [Временният съвместим root bundle и ограниченията на legacy Pages](https://ampcode.com/threads/T-01a097af-ee1c-745e-b9ce-f3f554209435)
- [Поправката за реално публикуване на Actions артефакта](https://ampcode.com/threads/T-01a09a22-45fb-763f-9501-60ae594e5e85)
