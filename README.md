Для запуска локально npm run dev

БД применение моделей и схем:
1) npx prisma validate
2) npx prisma format
3) Применить изменения модели: npx prisma migrate dev --name название миграции
4) Посмотреть базу вручную: npx prisma studio

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