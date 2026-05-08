"use client";

import { MealType, Profile } from "@prisma/client";
import { Button, Progress } from "antd";
import { useCallback, useEffect, useState } from "react";
import AddMealModal from "./AddMealModal";
import { formatDate } from "@/lib/formatDate";

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

const MEAL_UI: { type: MealType; label: string }[] = [
  { type: "breakfast", label: "Завтрак" },
  { type: "lunch", label: "Обед" },
  { type: "dinner", label: "Ужин" },
  { type: "snack", label: "Перекус/другое" },
];

const DashboardPage = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [dailyMeal, setDailyMeal] = useState<DailyMealResponse | null>(null);

  const [openModal, setOpenModal] = useState(false);
  const [mealType, setMealType] = useState<MealType | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch("/api/profile");
      const data = await res.json();
      setProfile(data);
    };
    const fetchDailyMeal = async () => {
      const res = await fetch("/api/daily-meal");
      const data: DailyMealResponse = await res.json();
      setDailyMeal(data);
    };
    fetchProfile();
    fetchDailyMeal();
  }, []);

  const handleClose = () => {
    setOpenModal(false);
    setMealType(null);
  };

  const slotSumCalories = (type: MealType) => {
    const sum = (dailyMeal?.items ?? [])
      .filter((meal) => meal.type === type)
      .reduce((acc, meal) => acc + meal.recipe.calories, 0);
    return sum;
  };

  const sumCalories = (dailyMeal?.items ?? []).reduce(
    (acc, meal) => acc + meal.recipe.calories,
    0,
  );

  console.log(dailyMeal);

  const handleAddMealItem = (val: MealType) => {
    setOpenModal(true);
    setMealType(val);
  };

  const handleDeleteMealItem = async (id: string) => {
    await fetch(`/api/daily-meal/item?id=${id}`, { method: "DELETE" });
  };

  return (
    <div>
      {/* <div className="pb-15">
        <ul>Данные профиля:</ul>
        <li>Вес: {profile?.weight}</li>
        <li>Пол: {profile?.gender}</li>
        <li>Уровень активности: {profile?.activityLevel}</li>
        <li>Дневное потребление калорий: {profile?.dailyCalories}</li>
        <li>Белки: {profile?.protein}</li>
        <li>Жиры: {profile?.fat}</li>
        <li>Углеводы: {profile?.carbs}</li>
      </div> */}

      <div className="mb-10">
        <h3 className="pb-5">Сегодня {formatDate(dailyMeal?.date)}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {MEAL_UI.map((item) => (
            <div
              key={item.type}
              className="min-h-[320px] rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="text-lg font-semibold">{item.label}</div>
                <div className="text-sm font-semibold text-green-600">
                  {slotSumCalories(item.type)} ккал
                </div>
              </div>
              <div className="space-y-3">
                {(dailyMeal?.items ?? []).filter(
                  (meal) => meal.type === item.type,
                ).length === 0 ? (
                  <div className="text-sm text-gray-400">
                    Нет выбранных блюд
                  </div>
                ) : (
                  (dailyMeal?.items ?? [])
                    .filter((meal) => meal.type === item.type)
                    .map((mealItem) => (
                      <div
                        key={mealItem.id}
                        className="flex items-start justify-between gap-3 border-b border-gray-100 pb-3 last:border-b-0 last:pb-0"
                      >
                        <div>
                          <div className="text-base font-medium text-gray-900">
                            {mealItem.recipe.name}
                          </div>
                          <div className="mt-1 flex gap-4 text-sm text-gray-700">
                            <span>Б: {mealItem.recipe.protein}г</span>
                            <span>Ж: {mealItem.recipe.fat}г</span>
                            <span>У: {mealItem.recipe.carbs}г</span>
                          </div>
                        </div>
                        <Button
                          type="link"
                          size="small"
                          danger
                          className="!h-auto !p-0"
                          onClick={() => handleDeleteMealItem(mealItem.id)}
                        >
                          Удалить
                        </Button>
                      </div>
                    ))
                )}
              </div>
              <Button
                type="dashed"
                block
                className="mt-4"
                onClick={() => handleAddMealItem(item.type)}
              >
                Добавить блюдо
              </Button>
            </div>
          ))}
        </div>
        <div className="mt-4 mx-auto w-full max-w-sm min-h-[200px] rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-center">
            <div className="text-lg font-semibold">Итого за день</div>
          </div>
          <div className="mb-3 flex items-baseline justify-center gap-1">
            <span className="text-2xl font-bold text-green-600">
              {sumCalories}
            </span>
            <span className="text-base text-gray-400">/</span>
            <span className="text-base text-gray-500">
              {profile?.dailyCalories} ккал
            </span>
          </div>
          {profile?.dailyCalories && (
            <Progress
              percent={Math.round((sumCalories / profile.dailyCalories) * 100)}
              strokeColor="#16a34a"
              showInfo={false}
              size={["100%", 15]}
            />
          )}
          <div className="text-center text-sm text-gray-400">
            Осталось:{" "}
            <span className="font-medium text-gray-600">
              {Math.max(0, (profile?.dailyCalories ?? 0) - sumCalories)} ккал
            </span>
          </div>
        </div>
      </div>
      <AddMealModal
        open={openModal}
        mealType={mealType}
        dailyMealId={dailyMeal?.id || null}
        onClose={handleClose}
      />
    </div>
  );
};

export default DashboardPage;
