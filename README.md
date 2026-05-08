Для запуска локально npm run dev

Применить изменения модели: npx prisma migrate dev --name название миграции
npx prisma generate
Посмотреть базу вручную: npx prisma studio

Стили и шрифты:
Primary:     #2563EB
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