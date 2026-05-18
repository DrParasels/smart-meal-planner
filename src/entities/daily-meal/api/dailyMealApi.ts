import { apiFetch } from "@/shared/api/api";
import { DailyMealResponse } from "../model/types";

export const getDailyMeal = () => {
  return apiFetch<DailyMealResponse>("/api/daily-meal");
};

export const deleteMealItem = (id: string) => {
  return apiFetch<void>(`/api/daily-meal/item/${id}`, {
    method: "DELETE",
  });
};
