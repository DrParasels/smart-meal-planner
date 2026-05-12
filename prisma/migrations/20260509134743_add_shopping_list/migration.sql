-- CreateTable
CREATE TABLE "ShoppingList" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "dailyMealId" TEXT NOT NULL,

    CONSTRAINT "ShoppingList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShoppingListItem" (
    "id" TEXT NOT NULL,
    "shoppingListId" TEXT NOT NULL,
    "ingredientNameSnapshot" TEXT NOT NULL,
    "totalMass" INTEGER NOT NULL,
    "isChecked" BOOLEAN NOT NULL DEFAULT false,
    "ingredientId" TEXT,

    CONSTRAINT "ShoppingListItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShoppingList_dailyMealId_key" ON "ShoppingList"("dailyMealId");

-- CreateIndex
CREATE UNIQUE INDEX "ShoppingList_userId_date_key" ON "ShoppingList"("userId", "date");

-- CreateIndex
CREATE INDEX "ShoppingListItem_shoppingListId_idx" ON "ShoppingListItem"("shoppingListId");

-- AddForeignKey
ALTER TABLE "ShoppingList" ADD CONSTRAINT "ShoppingList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShoppingList" ADD CONSTRAINT "ShoppingList_dailyMealId_fkey" FOREIGN KEY ("dailyMealId") REFERENCES "DailyMeal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShoppingListItem" ADD CONSTRAINT "ShoppingListItem_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShoppingListItem" ADD CONSTRAINT "ShoppingListItem_shoppingListId_fkey" FOREIGN KEY ("shoppingListId") REFERENCES "ShoppingList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
