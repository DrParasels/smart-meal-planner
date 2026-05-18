import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { AddMealModalProps } from "./types";
import { Ingredient } from "@prisma/client";
import { getIngredients } from "@/entities/ingredient";
import { addRecipe, getRecipes } from "@/entities/recipe";
import { RecipeWithIngredients } from "@/entities/recipe/model/types";

type UseAddMealReturn = {
  filters: {
    searchRecipes: string;
    ingredients: string[];
  };
  recipes: RecipeWithIngredients[];
  filteredRecipes: RecipeWithIngredients[];
  ingredients: Ingredient[];
  handleSearchRecipes: (text: string) => void;
  handleChangeIngredients: (arr: string[]) => void;
  handleAddRecipe: (recipeId: string) => void;
  onSelect: (value: string) => void;
  open: boolean;
};

export const useAddMeal = ({
  open,
  mealType,
  dailyMealId,
  onClose,
}: AddMealModalProps): UseAddMealReturn => {
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState<{
    searchRecipes: string;
    ingredients: string[];
  }>({
    searchRecipes: "",
    ingredients: [],
  });

  const { data: recipes = [] } = useQuery({
    queryFn: getRecipes,
    queryKey: ["recipes"],
  });

  const { data: ingredients = [] } = useQuery({
    queryFn: getIngredients,
    queryKey: ["ingredients"],
  });

  const { mutate: addNewRecipe } = useMutation({
    mutationFn: addRecipe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily-meal"] });
      onClose();
    },
  });

  const [filteredRecipes, setFilteredRecipes] =
    useState<RecipeWithIngredients[]>(recipes);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const filterList = recipes.filter((recipe) => {
        const matchSearchRecipes = recipe.name
          .toLowerCase()
          .includes(filters.searchRecipes.toLowerCase());
        const matchIngredients =
          filters.ingredients.length === 0 ||
          filters.ingredients.every((i) =>
            recipe.ingredients.some((ri) => ri.name === i),
          );
        return matchSearchRecipes && matchIngredients;
      });
      setFilteredRecipes(filterList);
    }, 600);
    return () => clearTimeout(timeout);
  }, [filters, recipes]);

  const handleSearchRecipes = (text: string) => {
    setFilters((prev) => ({
      ...prev,
      searchRecipes: text,
    }));
  };

  const onSelect = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      searchRecipes: value,
    }));
  };

  const handleChangeIngredients = (arr: string[]) => {
    setFilters((prev) => ({
      ...prev,
      ingredients: arr,
    }));
  };

  const handleAddRecipe = (recipeId: string) => {
    if (!dailyMealId || !mealType) return;
    addNewRecipe({ dailyMealId, recipeId, type: mealType });
  };

  return {
    open,
    filters,
    recipes,
    filteredRecipes,
    ingredients,
    handleSearchRecipes,
    handleChangeIngredients,
    handleAddRecipe,
    onSelect,
  };
};
