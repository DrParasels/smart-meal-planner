import { addRecipe, getIngredients, getRecipes } from "@/shared/api/api";
import { MealType } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AutoComplete, Button, Card, Col, Modal, Row, Select } from "antd";
import { useEffect, useState } from "react";

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

interface AddMealModalProps {
  open: boolean;
  mealType: MealType | null;
  dailyMealId: string | null;
  onClose: () => void;
}

export const AddMealModal = ({
  open,
  mealType,
  dailyMealId,
  onClose,
}: AddMealModalProps) => {
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

  return (
    <Modal
      title={<h1 className="m-0">Добавить блюдо</h1>}
      closable={{ "aria-label": "Custom Close Button" }}
      open={open}
      onCancel={onClose}
      width={900}
      style={{ top: 30 }}
      footer={null}
    >
      <div>
        <div className="flex justify-between gap-5 pb-10 pt-5">
          <div className="w-full">
            <AutoComplete
              options={recipes
                .filter((item) =>
                  item.name
                    .toLowerCase()
                    .includes(filters.searchRecipes.toLowerCase()),
                )
                .map((item) => ({ value: item.name, label: item.name }))}
              style={{ width: "100%" }}
              onSelect={onSelect}
              onChange={(text) => handleSearchRecipes(text)}
              onInputKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.stopPropagation();
                }
              }}
              placeholder="Название блюда"
            />
          </div>
          <div className="w-full">
            <Select
              mode="multiple"
              allowClear
              style={{ width: "100%" }}
              placeholder="Включающий ингредиенты"
              defaultValue={[]}
              onChange={handleChangeIngredients}
              options={ingredients.map((item) => ({ value: item.name }))}
            />
          </div>
        </div>
        <Row gutter={[16, 16]}>
          {filteredRecipes.map((item) => (
            <Col span={8} key={item.id}>
              <Card
                style={{ width: "100%", height: "100%" }}
                title={item.name}
                hoverable
                onClick={() => console.log("карточка")}
                // extra={<Link href={`/recipes/${item.id}`}>Подробнее</Link>}
              >
                {item.ingredients.map((item, idx) => (
                  <p key={idx}>{item.name}</p>
                ))}

                <div className="mt-3 flex gap-2">
                  <Button
                    style={{
                      backgroundColor: "#16a34a",
                      borderColor: "#16a34a",
                      color: "#fff",
                    }}
                    onClick={() => handleAddRecipe(item.id)}
                  >
                    Добавить
                  </Button>
                  <Button
                    type="primary"
                    href={`/recipes/${item.id}`}
                    target="_blank"
                  >
                    Подробнее
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </Modal>
  );
};

export default AddMealModal;
