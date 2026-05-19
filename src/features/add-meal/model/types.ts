import { MealType } from "@prisma/client";

export interface AddMealModalProps {
  open: boolean;
  mealType: MealType | null;
  dailyMealId: string | null;
  onClose: () => void;
}
