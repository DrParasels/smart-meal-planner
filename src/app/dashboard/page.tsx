"use client";

import { Ingredient, Profile } from "@prisma/client";
import { AutoComplete, Card, Col, Row, Select } from "antd";
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

const DashboardPage = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
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

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch("/api/profile");
      const data = await res.json();
      setProfile(data);
    };
    const fetchRecipes = async () => {
      const res = await fetch("/api/recipes");
      const data = await res.json();
      setRecipes(data);
    };
    const fetchIngredients = async () => {
      const res = await fetch("/api/ingredients");
      const data = await res.json();
      setIngredients(data)
    }
    fetchProfile();
    fetchRecipes();
    fetchIngredients();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const filterList = recipes.filter((recipe) => {
        const matchSearchRecipes = recipe.name
          .toLowerCase()
          .includes(filters.searchRecipes.toLowerCase());
        const matchIngredients = filters.ingredients.length === 0 || filters.ingredients.every(i => 
          recipe.ingredients.some(ri => ri.name === i)
        )  
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
    console.log(arr)
    setFilters((prev) => ({
      ...prev,
      ingredients: arr,
    }));
  }

  return (
    <div>
      <div className="pb-15">
        <ul>Данные профиля:</ul>
        <li>Вес: {profile?.weight}</li>
        <li>Пол: {profile?.gender}</li>
        <li>Уровень активности: {profile?.activityLevel}</li>
        <li>Дневное потребление калорий: {profile?.dailyCalories}</li>
        <li>Белки: {profile?.protein}</li>
        <li>Жиры: {profile?.fat}</li>
        <li>Углеводы: {profile?.carbs}</li>
      </div>

      <div>
        <h3 className="pb-5">Рецепты</h3>
        <div className="w-96 pb-10">
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

        <div className="w-96 pb-10">
          <Select
            mode="multiple"
            allowClear
            style={{ width: "100%" }}
            placeholder="Включающий ингредиенты"
            defaultValue={[]}
            onChange={handleChangeIngredients}
            options={ingredients.map(item => ({value:item.name}))}
          />
        </div>

        <Row gutter={[16, 16]}>
          {filteredRecipes.map((item) => (
            <Col span={6} key={item.id}>
              <Card
                title={item.name}
                hoverable
                // onClick={() => console.log('sdsdsd')}
                extra={<Link href={`/recipes/${item.id}`}>Подробнее</Link>}
              >
                {item.ingredients.map((item, idx) => (
                  <p key={idx}>{item.name}</p>
                ))}
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default DashboardPage;
