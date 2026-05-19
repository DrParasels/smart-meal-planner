import { apiFetch } from "@/shared/api/api";
import type { ShoppingList, UpdateShoppingList } from "@/entities/shopping-list";

export const createShoppingList = () => {
  return apiFetch("/api/shopping-list", {
    method: "POST",
  });
};

export const getShoppingList = () => {
  return apiFetch<ShoppingList | null>("/api/shopping-list");
};

export const updateShoppingList = (id: string, payload: UpdateShoppingList) => {
  return apiFetch<void>(`/api/shopping-list/item/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
};
