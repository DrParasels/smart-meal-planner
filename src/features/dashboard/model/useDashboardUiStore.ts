import { MealType } from "@prisma/client";
import { create } from "zustand";

export type DashboardUiState = {
    openModal: boolean;
    mealType: MealType | null;
    openAddMealModal: (type: MealType) => void;
    closeAddMealModal: () => void;
  };

export const useDashboardUiStore = create<DashboardUiState>((set) => ({
    openModal: false,
    mealType: null,
    openAddMealModal: (type) => set({ openModal: true, mealType: type }),
    closeAddMealModal: () => set({ openModal: false, mealType: null })
}))