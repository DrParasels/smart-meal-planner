model User {
  id       String   @id @default(uuid())
  email    String   @unique
  password String
  profile  Profile?
  name     String?
}

model Profile {
  id            String  @id @default(uuid())
  userId        String  @unique
  user          User    @relation(fields: [userId], references: [id])

  height        Int
  weight        Int
  age           Int
  gender        String
  activityLevel String
  goal          String

  dailyCalories Int
  protein       Int
  fat           Int
  carbs         Int
}

✅ PostgreSQL
✅ Prisma
✅ Next.js (app router)
✅ JWT в cookie

1) Спроектировать модель Profile ✅

2) Сделать POST /api/profile ✅

3) Сделать GET /api/profile ✅

4) Сделать страницу /onboarding ✅

5) После сохранения — редирект ✅

6) Рефакторинг компонента страницы onboarding ✅

7) Логика перехода на страницу onboarding (сейчас она кривая с заглушкой)

8) Логика перехода дальше (тут поменять одну строчку всего + проверить логику ещё раз)