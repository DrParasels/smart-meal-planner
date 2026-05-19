Для запуска локально npm run dev

БД применение моделей и схем:
1) npx prisma validate
2) npx prisma format
3) Применить изменения модели: npx prisma migrate dev --name название миграции
4) Посмотреть базу вручную: npx prisma studio

Тесты:
1) `npm test` — unit/integration тесты через Jest (UI-компоненты и API-роуты из `src/**/*.test.ts(x)`).
   Когда запускать: после локальных изменений в логике, компонентах, хуках, API.
   
2) `npm run test:api:e2e` — API E2E через Jest + Supertest (сценарии в `tests/*.api-e2e.test.ts` и `tests/api.e2e.test.ts`).
   Когда запускать: перед PR, после изменений в авторизации, профиле, shopping-list, валидации API.
   Важно: приложение должно быть запущено на `http://localhost:3000` (например, `npm run dev` в отдельном терминале).

3) `npm run test:e2e` — браузерные E2E через Playwright (UI-сценарии `tests/**/*.spec.ts`).
   Когда запускать: перед релизом/демо и после изменений пользовательских флоу.
   Важно: Playwright сам поднимает dev-сервер (`webServer.command = npm run dev`).



Стили и шрифты:
Primary:     #3c0bad
Accent:      #16a34a
Text:        #0F172A
Background:  #F8FAFC

body { font-size: 16px; }
h1 {
  font-size: clamp(32px, 5vw, 48px);
}

h2 {
  font-size: clamp(20px, 3vw, 32px);
}

@media (max-width: 768px) {
  h1 { font-size: 32px; }
  h2 { font-size: 24px; }
  body { font-size: 16px; }
}

body { font-weight: 400; }
button, label { font-weight: 500; }
h2 { font-weight: 600; }
h1 { font-weight: 700; }