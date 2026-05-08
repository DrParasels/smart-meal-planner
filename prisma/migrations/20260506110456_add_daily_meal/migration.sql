-- CreateEnum
CREATE TYPE "MealType" AS ENUM ('breakfast', 'dinner', 'supper', 'lunch');

-- CreateTable
CREATE TABLE "DailyMeal" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyMeal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyMealItem" (
    "id" TEXT NOT NULL,
    "dailyMealId" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "type" "MealType" NOT NULL,

    CONSTRAINT "DailyMealItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DailyMeal_userId_key" ON "DailyMeal"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DailyMeal_userId_date_key" ON "DailyMeal"("userId", "date");

-- AddForeignKey
ALTER TABLE "DailyMeal" ADD CONSTRAINT "DailyMeal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyMealItem" ADD CONSTRAINT "DailyMealItem_dailyMealId_fkey" FOREIGN KEY ("dailyMealId") REFERENCES "DailyMeal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyMealItem" ADD CONSTRAINT "DailyMealItem_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
