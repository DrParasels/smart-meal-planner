"use client";

import { getShoppingList, updateShoppingList } from "@/shared/api/api";
import {
  FireOutlined,
  ShoppingCartOutlined,
  TableOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Checkbox, ConfigProvider, Flex, Progress, Select } from "antd";

const ShoppingPage = () => {
  const queryClient = useQueryClient();
  const { data: shoppingList, isLoading } = useQuery({
    queryFn: getShoppingList,
    queryKey: ["shopping-list"],
  });
  const { mutate: update } = useMutation({
    mutationFn: ({ id, body }: { id: string; body: { isChecked: boolean } }) =>
      updateShoppingList(id, body),
    onMutate: ({ id, body }) => {
      queryClient.setQueryData(
        ["shopping-list"],
        (old: typeof shoppingList) => {
          if (!old) return old;
          return {
            ...old,
            items: old.items.map((item) =>
              item.id === id ? { ...item, isChecked: body.isChecked } : item,
            ),
          };
        },
      );
    },
  });

  const items = shoppingList?.items ?? [];
  const totalCalories = items.reduce((acc, item) => acc + item.itemCalories, 0);

  const handleToggle = (id: string, isChecked: boolean) => {
    update({ id, body: { isChecked: !isChecked } });
  };
  return (
    <div className="lg:px-10 py-5">
      <div className="flex justify-between items-center mb-5">
        <div className="flex flex-col gap-1">
          <h1>Список покупок</h1>
          <p className="text-caption text-text-secondary">
            Ингредиенты, необходимые для приготовления запланированных блюд на
            сегодня
          </p>
        </div>
        <Button
          icon={<TableOutlined />}
          href={`/dashboard`}
          size="large"
          style={{
            borderColor: "#3c0bad",
            color: "#3c0bad",
          }}
        >
          Перейти к плану питания
        </Button>
      </div>

      <div className="flex flex-col gap-5 lg:flex-row">
        <div
          className="flex-1 rounded-xl border border-border bg-surface shadow-card"
        >
          <div className="flex justify-between items-center p-4 border-b border-border">
            <span className="font-medium">{items.length} ингредиентов</span>
            <Select
              defaultValue="asc"
              options={[{ value: "asc", label: "Сортировка: А-Я" }]}
              size="small"
            />
          </div>
          <ConfigProvider theme={{ token: { colorPrimary: "#16a34a" } }}>
            {!isLoading &&
              items
                .slice()
                .sort((a, b) =>
                  a.ingredientNameSnapshot.localeCompare(
                    b.ingredientNameSnapshot,
                    "ru",
                  ),
                )
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3"
                  >
                    <Checkbox
                      onChange={() => handleToggle(item.id, item.isChecked)}
                      checked={item.isChecked}
                    />
                    <span
                      style={{ fontSize: 18 }}
                      className={`flex-1 ${item.isChecked ? "line-through text-gray-400" : ""}`}
                    >
                      {item.ingredientNameSnapshot}
                    </span>
                    <span style={{ fontSize: 15 }} className="text-text-muted">
                      {item.totalMass} г
                    </span>
                  </div>
                ))}
          </ConfigProvider>
        </div>
        <div
          className="lg:w-[360px] lg:shrink-0 rounded-xl border border-border bg-surface shadow-card p-5"
        >
          <h3 className="text-lg font-semibold mb-4">Сводка</h3>
          <div className="flex flex-col gap-4">
            {/* Ингредиентов */}
            <div className="flex items-center gap-3">
              <div
                style={{
                  background: "#f3f0ff",
                  borderRadius: 8,
                  padding: 10,
                }}
              >
                <ShoppingCartOutlined
                  style={{ color: "#3c0bad", fontSize: 20 }}
                />
              </div>
              <div>
                <div className="text-sm text-gray-500">Ингредиентов</div>
                <div className="font-bold text-lg" style={{ color: "#3c0bad" }}>
                  {items.length}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div
                style={{
                  background: "#f3f0ff",
                  borderRadius: 8,
                  padding: 10,
                }}
              >
                <FireOutlined style={{ color: "#3c0bad", fontSize: 20 }} />
              </div>
              <div>
                <div className="text-sm text-gray-500">Калорий</div>
                <div className="font-bold text-lg" style={{ color: "#3c0bad" }}>
                  {totalCalories}{" "}
                  <span className="font-normal text-sm text-text-secondary">
                    ккал
                  </span>
                </div>
              </div>
            </div>
            <div>
              <Progress
                percent={Math.round(
                  (items.filter((item) => item.isChecked).length /
                    Math.max(items.length, 1)) *
                    100,
                )}
                strokeColor="#16a34a"
                showInfo={true}
                size={["100%", 15]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingPage;
