import { prisma } from "../src/lib/prisma";

async function main() {
  // 🥗 INGREDIENTS

  const ingredients = await prisma.ingredient.createMany({
    data: [
      // мясо
      { name: "Куриная грудка", calories: 120, protein: 23, fat: 2, carbs: 0 },

      // крупы
      { name: "Рис", calories: 130, protein: 2, fat: 1, carbs: 28 },
      { name: "Гречка", calories: 110, protein: 4, fat: 2, carbs: 20 },

      // овощи
      { name: "Огурец", calories: 15, protein: 1, fat: 0, carbs: 3 },
      { name: "Помидор", calories: 20, protein: 1, fat: 0, carbs: 4 },
      { name: "Капуста", calories: 25, protein: 1, fat: 0, carbs: 6 },
      { name: "Картошка", calories: 82, protein: 2, fat: 1, carbs: 17 },

      // фрукты
      { name: "Яблоко", calories: 52, protein: 0, fat: 0, carbs: 14 },
      { name: "Банан", calories: 89, protein: 1, fat: 0, carbs: 23 },

      // молочка
      { name: "Творог 5%", calories: 121, protein: 17, fat: 5, carbs: 3 },
      { name: "Кефир 1%", calories: 40, protein: 3, fat: 1, carbs: 4 },
      { name: "Кефир 5%", calories: 60, protein: 3, fat: 5, carbs: 4 },

      // прочее
      { name: "Яйцо", calories: 155, protein: 13, fat: 11, carbs: 1 },
      { name: "Хлеб", calories: 250, protein: 8, fat: 2, carbs: 50 },
      { name: "Масло", calories: 720, protein: 1, fat: 80, carbs: 1 },
      { name: "Мёд", calories: 320, protein: 0, fat: 0, carbs: 80 },
      { name: "Кешью", calories: 553, protein: 18, fat: 44, carbs: 30 },

      // junk
      { name: "Чипсы", calories: 536, protein: 7, fat: 34, carbs: 53 },
      { name: "Кола", calories: 42, protein: 0, fat: 0, carbs: 11 },
      { name: "Кола zero", calories: 1, protein: 0, fat: 0, carbs: 0 },

      // готовые
      { name: "Пельмени", calories: 275, protein: 12, fat: 12, carbs: 30 },
    ],
    skipDuplicates: true,
  });

  // 🔁 получаем все ингредиенты
  const allIngredients = await prisma.ingredient.findMany();

  const get = (name: string) =>
    allIngredients.find((i: (typeof allIngredients)[number]) => i.name === name)!;

  // 🍲 RECIPES

  const recipes = await prisma.recipe.createMany({
    data: [
      { name: "Курица с рисом", description: "Курица + рис" },
      { name: "Омлет (2 яйца)", description: "Простой омлет" },
      { name: "Гречка", description: "Отварная гречка" },
      { name: "Салат огурец-помидор", description: "Лёгкий салат" },
      { name: "Бутерброд с маслом и мёдом", description: "Хлеб + масло + мёд" },
      { name: "Творог 5%", description: "Просто творог" },
      { name: "Яблоко", description: "Фрукт" },
      { name: "Банан", description: "Фрукт" },
      { name: "Пельмени", description: "Готовый продукт" },
      { name: "Кола", description: "Кола" },
      { name: "Кешью", description: "Кешью" },
      { name: "Кола zero", description: "Кола zero" },
      { name: "Чипсы", description: "Чипсы" },
      { name: "Картошка", description: "Картошка" },
      { name: "Куриная грудка", description: "Продукт без добавок" },
    ],
    skipDuplicates: true,
  });

  const allRecipes = await prisma.recipe.findMany();
  const r = (name: string) =>
    allRecipes.find((i: (typeof allRecipes)[number]) => i.name === name)!;

  // 🔗 RELATIONS

  await prisma.recipeIngredient.createMany({
    data: [
      // курица + рис
      {
        recipeId: r("Курица с рисом").id,
        ingredientId: get("Куриная грудка").id,
        mass: 200,
      },
      {
        recipeId: r("Курица с рисом").id,
        ingredientId: get("Рис").id,
        mass: 80,
      },

      // омлет
      {
        recipeId: r("Омлет (2 яйца)").id,
        ingredientId: get("Яйцо").id,
        mass: 120,
      },

      // гречка
      {
        recipeId: r("Гречка").id,
        ingredientId: get("Гречка").id,
        mass: 200,
      },

      // салат
      {
        recipeId: r("Салат огурец-помидор").id,
        ingredientId: get("Огурец").id,
        mass: 100,
      },
      {
        recipeId: r("Салат огурец-помидор").id,
        ingredientId: get("Помидор").id,
        mass: 100,
      },

      // бутер
      {
        recipeId: r("Бутерброд с маслом и мёдом").id,
        ingredientId: get("Хлеб").id,
        mass: 40,
      },
      {
        recipeId: r("Бутерброд с маслом и мёдом").id,
        ingredientId: get("Масло").id,
        mass: 10,
      },
      {
        recipeId: r("Бутерброд с маслом и мёдом").id,
        ingredientId: get("Мёд").id,
        mass: 15,
      },

      // одиночные
      {
        recipeId: r("Творог 5%").id,
        ingredientId: get("Творог 5%").id,
        mass: 200,
      },
      {
        recipeId: r("Яблоко").id,
        ingredientId: get("Яблоко").id,
        mass: 150,
      },
      {
        recipeId: r("Банан").id,
        ingredientId: get("Банан").id,
        mass: 120,
      },
      {
        recipeId: r("Пельмени").id,
        ingredientId: get("Пельмени").id,
        mass: 200,
      },
      {
        recipeId: r("Куриная грудка").id,
        ingredientId: get("Куриная грудка").id,
        mass: 200,
      },
    ],
  });

  console.log("✅ Seed готов");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());