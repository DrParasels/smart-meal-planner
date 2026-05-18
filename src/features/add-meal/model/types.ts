import { MealType } from "@prisma/client";

export type RecipeIngredient = {
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
};

export type RecipeWithIngredients = {
  id: string;
  name: string;
  description: string | null;
  ingredients: RecipeIngredient[];
};

export interface AddMealModalProps {
  open: boolean;
  mealType: MealType | null;
  dailyMealId: string | null;
  onClose: () => void;
}
