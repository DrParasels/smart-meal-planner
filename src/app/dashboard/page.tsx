"use client";

import { MealType } from "@prisma/client";
import { Alert, Button, Progress, Spin } from "antd";
import AddMealModal from "./AddMealModal";
import { formatDate } from "@/lib/formatDate";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createShoppingList,
  deleteMealItem,
  getDailyMeal,
  getProfile,
} from "@/shared/api/api";
import { useDashboardUiStore } from "@/features/dashboard/model/useDashboardUiStore";
import { useState } from "react";

const MEAL_UI: { type: MealType; label: string }[] = [
  { type: "breakfast", label: "Завтрак" },
  { type: "lunch", label: "Обед" },
  { type: "dinner", label: "Ужин" },
  { type: "snack", label: "Перекус/другое" },
];
const MAX_VISIBLE_MEALS = 3;

const DashboardPage = () => {
  const openModal = useDashboardUiStore((s) => s.openModal);
  const mealType = useDashboardUiStore((s) => s.mealType);
  const openAddMealModal = useDashboardUiStore((s) => s.openAddMealModal);
  const closeAddMealModal = useDashboardUiStore((s) => s.closeAddMealModal);
  const [expandedByType, setExpandedByType] = useState<
    Record<MealType, boolean>
  >({
    breakfast: false,
    lunch: false,
    dinner: false,
    snack: false,
  });

  const queryClient = useQueryClient();

  const {
    data: profile,
    isLoading: isLoadingProfile,
    isError: isProfileError,
    error: profileError,
    refetch: refetchProfile,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  const {
    data: dailyMeal,
    isLoading: isLoadingDailyMeal,
    isError: isDailyMealError,
    error: dailyMealError,
    refetch: refetchDailyMeal,
  } = useQuery({
    queryKey: ["daily-meal"],
    queryFn: getDailyMeal,
  });

  const { mutate: deleteItem, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deleteMealItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily-meal"] });
    },
  });

  const { mutate: createShopping } = useMutation({
    mutationFn: () => createShoppingList(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shopping-list"] });
    },
  });

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
  const toggleMealsExpanded = (type: MealType) => {
    setExpandedByType((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
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
        <div className="flex justify-between items-center mb-5">
          <h2>Сегодня {formatDate(dailyMeal?.date)}</h2>
          <Button
            type="primary"
            disabled={dailyMeal?.items.length === 0}
            onClick={() => createShopping()}
          >
            Сформировать список покупок
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-4 lg:auto-rows-fr">
            {MEAL_UI.map((item) => {
              const slotItems = (dailyMeal?.items ?? []).filter(
                (meal) => meal.type === item.type,
              );
              const hasOverflow = slotItems.length > MAX_VISIBLE_MEALS;
              const isExpanded = expandedByType[item.type];
              const visibleItems =
                isExpanded || !hasOverflow
                  ? slotItems
                  : slotItems.slice(0, MAX_VISIBLE_MEALS);

              return (
                <div
                  key={item.type}
                  className="flex h-full w-full min-h-[300px] flex-col justify-between rounded-2xl border border-border bg-surface p-5 shadow-card"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h3>{item.label}</h3>
                    <div className="text-sm font-semibold text-text-green">
                      {slotSumCalories(item.type)} ккал
                    </div>
                  </div>
                  <div className="space-y-3">
                    {isDailyMealError ? (
                      <Alert
                        type="error"
                        showIcon
                        title="Не удалось загрузить приемы пищи"
                        description={
                          dailyMealError instanceof Error
                            ? dailyMealError.message
                            : "Попробуйте еще раз"
                        }
                        action={
                          <Button onClick={() => refetchDailyMeal()}>
                            Повторить
                          </Button>
                        }
                      />
                    ) : isLoadingDailyMeal ? (
                      <Spin />
                    ) : slotItems.length === 0 ? (
                      <div className="text-center text-sm text-text-muted">
                        Нет выбранных блюд
                      </div>
                    ) : (
                      <div className="pb-2 mb-0">
                        {visibleItems.map((mealItem) => (
                          <div
                            key={mealItem.id}
                            className="flex items-center justify-between gap-3 border-b border-border pb-1 mb-1 last:border-b-0 last:pb-0"
                          >
                            <div>
                              <div className="text-body-sm font-medium">
                                {mealItem.recipe.name}
                              </div>
                              <div className="mt-1 flex gap-4 text-sm">
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
                              onClick={() => deleteItem(mealItem.id)}
                            >
                              Удалить
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    {!isDailyMealError &&
                      !isLoadingDailyMeal &&
                      hasOverflow &&
                      slotItems.length > 0 && (
                        <button
                          type="button"
                          className="w-full inline-flex mb-2 cursor-pointer items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary-hover"
                          onClick={() => toggleMealsExpanded(item.type)}
                        >
                          <span className="h-px flex-1 bg-border-light" />
                          {isExpanded
                            ? "Свернуть"
                            : `Показать еще ${slotItems.length - MAX_VISIBLE_MEALS}`}
                          <span
                            className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
                          >
                            ▼
                          </span>
                          <span className="h-px flex-1 bg-border-light" />
                        </button>
                      )}
                  </div>
                  <Button
                    type="dashed"
                    block
                    className="mt-1"
                    onClick={() => openAddMealModal(item.type)}
                  >
                    + Добавить блюдо
                  </Button>
                </div>
              );
            })}
          </div>

          <div className="w-full lg:w-[360px] lg:shrink-0 mt-4 lg:mt-0 rounded-2xl border border-border bg-surface p-5 shadow-card">
            <div className="mb-4 flex items-center justify-center">
              <h3>Итого за день</h3>
            </div>
            <div className="mb-3 flex items-baseline justify-center gap-1">
              <span
                className="text-2xl font-bold text-text-green"
                data-testid="daily-sum-calories"
              >
                {sumCalories}
              </span>
              <span className="text-base text-text-muted">/</span>
              <span
                className="text-text-secondary"
                data-testid="daily-total-calories"
              >
                {profile?.dailyCalories} ккал
              </span>
            </div>
            {profile?.dailyCalories && (
              <Progress
                percent={Math.round(
                  (sumCalories / profile.dailyCalories) * 100,
                )}
                strokeColor="#16a34a"
                showInfo={false}
                size={["100%", 15]}
              />
            )}
            <div className="text-center text-sm text-text-muted">
              Осталось:{" "}
              <span className="font-medium text-text-secondary">
                {Math.max(0, (profile?.dailyCalories ?? 0) - sumCalories)} ккал
              </span>
            </div>
            <span className="flex h-px bg-border-light mb-6 mt-8" />
          </div>
        </div>
      </div>
      <AddMealModal
        open={openModal}
        mealType={mealType}
        dailyMealId={dailyMeal?.id || null}
        onClose={closeAddMealModal}
      />
    </div>
  );
};

export default DashboardPage;
