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

const MEAL_UI: { type: MealType; label: string }[] = [
  { type: "breakfast", label: "Завтрак" },
  { type: "lunch", label: "Обед" },
  { type: "dinner", label: "Ужин" },
  { type: "snack", label: "Перекус/другое" },
];

const DashboardPage = () => {
  const openModal = useDashboardUiStore((s) => s.openModal);
  const mealType = useDashboardUiStore((s) => s.mealType);
  const openAddMealModal = useDashboardUiStore((s) => s.openAddMealModal);
  const closeAddMealModal = useDashboardUiStore((s) => s.closeAddMealModal);

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
        <div className="flex justify-between">
          <h3 className="pb-5">Сегодня {formatDate(dailyMeal?.date)}</h3>
          <Button
            disabled={dailyMeal?.items.length === 0}
            onClick={() => createShopping()}
          >
            Сформировать список покупок
          </Button>
        </div>

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
                ) : (dailyMeal?.items ?? []).filter(
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
                          onClick={() => deleteItem(mealItem.id)}
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
                onClick={() => openAddMealModal(item.type)}
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
            <span
              className="text-2xl font-bold text-green-600"
              data-testid="daily-sum-calories"
            >
              {sumCalories}
            </span>
            <span className="text-base text-gray-400">/</span>
            <span
              className="text-base text-gray-500"
              data-testid="daily-total-calories"
            >
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
        onClose={closeAddMealModal}
      />
    </div>
  );
};

export default DashboardPage;
