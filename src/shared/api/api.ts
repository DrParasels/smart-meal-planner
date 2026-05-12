import { DailyMealItem, Ingredient, MealType, Profile } from "@prisma/client";

async function apiFetch<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`);
  }

  // DELETE часто возвращает 204 No Content (пустое тело)
  if (res.status === 204) {
    return undefined as T;
  }
  // Если тело пустое — тоже не пытаемся парсить JSON
  const contentLength = res.headers.get("content-length");
  if (contentLength === "0") {
    return undefined as T;
  }
  // Иногда сервер может вернуть не JSON
  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return undefined as T;
  }

  return (await res.json()) as T;
}

export const getProfile = () => {
  return apiFetch<Profile>("/api/profile");
};

type DailyMealResponse = {
  id: string;
  date: string;
  items: {
    id: string;
    type: MealType;
    recipe: {
      name: string;
      description: string | null;
      protein: number;
      fat: number;
      carbs: number;
      calories: number;
    };
  }[];
};

export const getDailyMeal = () => {
  return apiFetch<DailyMealResponse>("/api/daily-meal");
};

export const deleteMealItem = (id: string) => {
  return apiFetch<void>(`/api/daily-meal/item/${id}`, {
    method: "DELETE",
  });
};

export const getIngredients = () => {
  return apiFetch<Ingredient[]>("/api/ingredients");
};

type RecipeIngredient = {
  name: string;
  mass: number;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
};

type RecipeWithIngredients = {
  id: string;
  name: string;
  description: string | null;
  ingredients: RecipeIngredient[];
};

export const getRecipes = () => {
  return apiFetch<RecipeWithIngredients[]>("/api/recipes");
};

type AddRecipePayload = {
  dailyMealId: string;
  recipeId: string;
  type: MealType;
};

export const addRecipe = (payload: AddRecipePayload) => {
  return apiFetch<DailyMealItem>("/api/daily-meal/item", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const createShoppingList = () => {
  return apiFetch("/api/shopping-list", {
    method: "POST",
  });
};

type ShoppingListItem = {
  id: string;
  ingredientId: string;
  ingredientNameSnapshot: string;
  isChecked: boolean;
  shoppingListId: string;
  totalMass: number;
  itemCalories: number;
};

type ShoppingList = {
  id: string;
  date: string;
  userId: string;
  dailyMealId: string;
  items: ShoppingListItem[];
};

export const getShoppingList = () => {
  return apiFetch<ShoppingList | null>("/api/shopping-list");
};

type updateShoppingList = {
  isChecked: boolean;
};

export const updateShoppingList = (id: string, payload: updateShoppingList) => {
  return apiFetch<void>(`/api/shopping-list/item/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
};
