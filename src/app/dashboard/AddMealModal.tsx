import { Ingredient, MealType } from "@prisma/client";
import { AutoComplete, Button, Card, Col, Modal, Row, Select } from "antd";
import Link from "next/link";
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
  const [recipes, setRecipes] = useState<RecipeWithIngredients[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [filters, setFilters] = useState<{
    searchRecipes: string;
    ingredients: string[];
  }>({
    searchRecipes: "",
    ingredients: [],
  });
  const [filteredRecipes, setFilteredRecipes] =
    useState<RecipeWithIngredients[]>(recipes);

  const handleOk = () => {
    console.log(mealType);
    onClose();
  };

  useEffect(() => {
    const fetchData = async () => {
      const [recipesRes, ingredientsRes] = await Promise.all([
        fetch("/api/recipes"),
        fetch("/api/ingredients"),
      ]);
      const [recipesData, ingredientsData] = await Promise.all([
        recipesRes.json(),
        ingredientsRes.json(),
      ]);
      setRecipes(recipesData);
      setIngredients(ingredientsData);
    };
    fetchData();
  }, []);

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
    console.log(recipeId);
    console.log(mealType)
    console.log(dailyMealId)
    const addRecipe = async (dailyMealId,recipeId,mealType) => {
      const res = await fetch("/api/daily-meal/item", {
        method: "POST",
        body: JSON.stringify({dailyMealId: dailyMealId, recipeId: recipeId, type: mealType})
      });
      if(res.ok) {
        console.log(res)
        onClose();
      }
    }
    addRecipe(dailyMealId,recipeId,mealType)
  };

  return (
    <Modal
      title="Добавить блюдо"
      closable={{ "aria-label": "Custom Close Button" }}
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      width={900}
      style={{ top: 40 }}
      footer={null}
    >
      <div>
        <div className="flex justify-between pb-10 pt-5">
          <div className="w-96">
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
          <div className="w-96">
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
