# Prisma шпаргалка (быстрый справочник)

## 1) Методы чтения

| Метод | Для чего |
|---|---|
| `findUnique` | Найти одну запись по уникальному полю (`@id`, `@unique`) |
| `findFirst` | Найти первую запись по условию |
| `findMany` | Найти список записей |

```ts
await prisma.dailyMeal.findUnique({ where: { id: "..." } })
await prisma.dailyMeal.findFirst({ where: { userId } })
await prisma.dailyMeal.findMany({ where: { userId } })
```

> Если в схеме есть `@@unique([userId, date])`, можно использовать `findUnique` с составным ключом.

---

## 2) Общая форма запроса

```ts
await prisma.model.findMany({
  where: {},     // фильтры
  select: {},    // вернуть только конкретные поля
  include: {},   // подтянуть связи
  orderBy: {},   // сортировка
  skip: 0,       // пропустить N
  take: 10,      // взять N
})
```

---

## 3) `where`: фильтры

### Базовый пример

```ts
where: { userId, date: new Date(today) }
```

Эквивалентно:

```ts
where: { userId: userId, date: new Date(today) }
```

### Частые операторы

```ts
where: {
  age: { gt: 18 },            // >
  score: { gte: 100 },        // >=
  price: { lt: 500 },         // <
  price: { lte: 500 },        // <=
  name: { contains: "A" },    // LIKE %A%
  email: { startsWith: "a" }, // LIKE a%
  OR: [{ isActive: true }, { role: "ADMIN" }],
  AND: [{ isActive: true }, { age: { gte: 18 } }],
}
```

---

## 4) `include` vs `select`

### `include` — вернуть модель + связанные данные

```ts
await prisma.dailyMeal.findFirst({
  where: { userId },
  include: { items: true },
})
```

### `select` — вернуть только нужные поля

```ts
await prisma.dailyMeal.findFirst({
  where: { userId },
  select: { id: true, date: true },
})
```

Правило:
- Нужны связи (`items`, `user`, ...): используй `include`.
- Нужен "узкий" ответ для API: используй `select`.

---

## 5) CRUD

```ts
// Create
await prisma.dailyMeal.create({
  data: { userId, date },
})

// Update
await prisma.dailyMeal.update({
  where: { id },
  data: { date },
})

// Upsert (если нет -> create, если есть -> update)
await prisma.dailyMeal.upsert({
  where: { id },
  create: { userId, date },
  update: { date },
})

// Delete
await prisma.dailyMeal.delete({
  where: { id },
})
```

---

## 6) Твой кейс (`DailyMeal` на сегодня)

Смысл запроса:

```ts
await prisma.dailyMeal.findFirst({
  where: {
    userId: currentUserId,
    date: new Date(today),
  },
})
```

Читается как:
**"Найди первую запись `DailyMeal`, где `userId` совпадает с текущим пользователем и `date` равна сегодняшней дате."**