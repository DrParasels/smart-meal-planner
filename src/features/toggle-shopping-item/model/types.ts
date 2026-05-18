type ShoppingListItem = {
  id: string;
  ingredientId: string;
  ingredientNameSnapshot: string;
  isChecked: boolean;
  shoppingListId: string;
  totalMass: number;
  itemCalories: number;
};

export type ShoppingList = {
  id: string;
  date: string;
  userId: string;
  dailyMealId: string;
  items: ShoppingListItem[];
};
