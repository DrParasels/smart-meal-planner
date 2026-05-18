import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AddMealModal } from "./AddMealModal";
import { act, render, screen, waitFor, within } from "@testing-library/react";
import type { ReactElement } from "react";
import userEvent from "@testing-library/user-event";
import { getIngredients } from "@/entities/ingredient";
import { addRecipe, getRecipes } from "@/entities/recipe";


jest.mock("@/entities/recipe", () => ({
  getRecipes: jest.fn(),
  addRecipe: jest.fn(),
}));

jest.mock("@/entities/ingredient", () => ({
  getIngredients: jest.fn(),
}));

afterEach(() => {
  jest.useRealTimers();
});

beforeEach(() => {
  jest.clearAllMocks();
  (getRecipes as jest.Mock).mockResolvedValue([
    {
      id: "1",
      name: "Борщ",
      description: null,
      ingredients: [
        {
          name: "Свёкла",
          mass: 100,
          calories: 1,
          protein: 1,
          fat: 1,
          carbs: 1,
        },
      ],
    },
  ]);
  (getIngredients as jest.Mock).mockResolvedValue([]);
  (addRecipe as jest.Mock).mockResolvedValue(undefined);
});

function renderModal(ui: ReactElement) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>,
  );
}

it("рендер списка блюд из ответа getRecipes", async () => {
  jest.useFakeTimers({ advanceTimers: true });
  renderModal(
    <AddMealModal
      open
      mealType="breakfast"
      dailyMealId="daily-1"
      onClose={jest.fn()}
    />,
  );
  await waitFor(() => expect(getRecipes).toHaveBeenCalled());

  await act(async () => {
    jest.advanceTimersByTime(600);
  });

  expect(await screen.findByText("Борщ")).toBeInTheDocument();
});

it("Добавление блюда", async () => {
  jest.useFakeTimers({ advanceTimers: true });
  renderModal(
    <AddMealModal
      open
      mealType="breakfast"
      dailyMealId="daily-1"
      onClose={jest.fn()}
    />,
  );
  await waitFor(() => expect(getRecipes).toHaveBeenCalled());

  await act(async () => {
    jest.advanceTimersByTime(600);
  });

  expect(await screen.findByText("Борщ")).toBeInTheDocument();

  jest.useRealTimers();

  const user = userEvent.setup();
  const dialog = await screen.findByRole("dialog", { name: /добавить блюдо/i });
  const card = within(dialog).getByText("Борщ").closest(".ant-card");
  expect(card).not.toBeNull();
  const addButton = within(card as HTMLElement).getByRole("button", {
    name: /^добавить$/i,
  });

  await user.click(addButton);
  await waitFor(() => {
    expect(addRecipe).toHaveBeenCalled();
    expect((addRecipe as jest.Mock).mock.calls[0][0]).toEqual({
      dailyMealId: "daily-1",
      recipeId: "1",
      type: "breakfast",
    });
  });
});
