import { deleteMealItem, getDailyMeal, getProfile } from "@/shared/api/api";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor, within } from "@testing-library/react";
import { ReactElement } from "react";
import DashboardPage from "./page";

jest.mock("@/shared/api/api", () => ({
  getProfile: jest.fn(),
  getDailyMeal: jest.fn(),
  deleteMealItem: jest.fn(),
  createShoppingList: jest.fn(),
}));

jest.mock("./AddMealModal", () => ({
  __esModule: true,
  default: () => null,
}));

function renderDashboard(ui: ReactElement) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>,
  );
}

describe("Spinner", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getProfile as jest.Mock).mockResolvedValue({ dailyCalories: 2000 });
    (getDailyMeal as jest.Mock).mockImplementation(() => new Promise(() => {}));
  });

  it("при загрузке дневного рациона в карточках приёмов пищи показывается спиннер", async () => {
    const { container } = renderDashboard(<DashboardPage />);
    await waitFor(() => {
      expect(container.querySelectorAll(".ant-spin-spinning").length).toBe(4);
    });
  });
});

describe("DashboardPage (fullfiled api)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getProfile as jest.Mock).mockResolvedValue({ dailyCalories: 2000 });
    (getDailyMeal as jest.Mock).mockResolvedValue({
      id: "daily-1",
      date: "2026-05-13T12:00:00.000Z",
      items: [
        {
          id: "item-1",
          type: "breakfast",
          recipe: {
            name: "Яблоко",
            description: null,
            protein: 48,
            fat: 5,
            carbs: 23,
            calories: 344,
            mass: 280,
          },
        },
      ],
    });
  });

  it("Блок итого: сумма, лимит, прогресс", async () => {
    renderDashboard(<DashboardPage />);
    const total = await screen.findByTestId("daily-total-calories");
    const sum = await screen.findByTestId("daily-sum-calories");
    expect(sum).toHaveTextContent("344");
    expect(total).toHaveTextContent("2000 ккал");
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "17",
    );
  });

  it("Отображение сегодняшней даты", async () => {
    renderDashboard(<DashboardPage />);
    const today = await screen.findByRole("heading", { name: /сегодня/i });
    await waitFor(() =>
      expect(today).toHaveTextContent("Сегодня среда, 13 мая"),
    );
  });

  it("Отображение имени рецепта, БЖУ, ккал в карточке", async () => {
    renderDashboard(<DashboardPage />);
    const title = screen.getByText("Завтрак");
    const card = title.closest(".rounded-xl");
    expect(card).not.toBeNull();
    const scope = within(card as HTMLElement);
    expect(await scope.findByText("Яблоко")).toBeInTheDocument();
    expect(await scope.findByText("344 ккал")).toBeInTheDocument();
    expect(await scope.findByText("Б: 48г")).toBeInTheDocument();
    expect(await scope.findByText("Ж: 5г")).toBeInTheDocument();
    expect(await scope.findByText("У: 23г")).toBeInTheDocument();
  });
});

describe("DashboardPage (Empty state)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getProfile as jest.Mock).mockResolvedValue({ dailyCalories: 2000 });
    (getDailyMeal as jest.Mock).mockResolvedValue({
      id: "daily-1",
      date: "2026-05-13T12:00:00.000Z",
      items: [],
    });
  });

  it("Пустой ответ рецептов: подпись + дизейбл кнопки", async () => {
    renderDashboard(<DashboardPage />);
    const btn = screen.getByRole("button", {
      name: /^сформировать список покупок$/i,
    });
    await waitFor(() => {
      expect(btn).toBeDisabled();
    });
    expect(await screen.findAllByText("Нет выбранных блюд")).toHaveLength(4);
  });
});

describe("DashboardPage (Error state)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getProfile as jest.Mock).mockResolvedValue({ dailyCalories: 2000 });
    (getDailyMeal as jest.Mock).mockRejectedValue(Error);
  });

  it("Если запрос падает то отображается предупреждение", async () => {
    renderDashboard(<DashboardPage />);
    const alerts = await screen.findAllByRole("alert");
    expect(alerts).toHaveLength(4);
    const messages = await screen.findAllByText(
      /не удалось загрузить приемы пищи/i,
    );
    expect(messages).toHaveLength(4);
  });
});

describe("DashboardPage (integration)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getProfile as jest.Mock).mockResolvedValue({ dailyCalories: 2000 });
    (deleteMealItem as jest.Mock).mockResolvedValue({});
    (getDailyMeal as jest.Mock)
      .mockResolvedValueOnce({
        id: "daily-1",
        date: "2026-05-14T12:00:00.000Z",
        items: [
          {
            id: "item-1",
            type: "breakfast",
            recipe: {
              name: "Яблоко",
              description: null,
              protein: 1,
              fat: 1,
              carbs: 1,
              calories: 100,
              mass: 100,
            },
          },
        ],
      })
      .mockResolvedValueOnce({
        id: "daily-1",
        date: "2026-05-14T12:00:00.000Z",
        items: [],
      });
  });

  it("Удаление блюда по кнопке Удалить", async () => {
    renderDashboard(<DashboardPage />);
    const breakfastTitle = await screen.findByText("Завтрак");
    const breakfastCard = breakfastTitle.closest(".rounded-xl");
    expect(breakfastCard).not.toBeNull();
    const breakfastScope = within(breakfastCard as HTMLElement);

    //До обновления

    expect(await breakfastScope.findByText("Яблоко")).toBeInTheDocument();
    expect(await breakfastScope.findByText(/100\s*ккал/i)).toBeInTheDocument();
    const totalSum = await screen.findByTestId("daily-sum-calories");
    expect(totalSum).toHaveTextContent("100");

    const delBtn = screen.getByRole("button", { name: /удалить/i });
    delBtn.click();

    await waitFor(() => {
      expect(deleteMealItem).toHaveBeenCalledWith("item-1");
    });

    await waitFor(() => {
      expect(breakfastScope.queryByText("Яблоко")).not.toBeInTheDocument();
      expect(breakfastScope.getByText(/0\s*ккал/i)).toBeInTheDocument();
      expect(totalSum).toHaveTextContent("0");
    });
  });
});

describe("DashboardPage (integration) ошибка api", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getProfile as jest.Mock).mockResolvedValue({ dailyCalories: 2000 });
    (getDailyMeal as jest.Mock)
      .mockRejectedValueOnce(new Error("API error"))
      .mockResolvedValueOnce({
        id: "daily-1",
        date: "2026-05-14T12:00:00.000Z",
        items: [
          {
            id: "item-1",
            type: "breakfast",
            recipe: {
              name: "Яблоко",
              description: null,
              protein: 1,
              fat: 1,
              carbs: 1,
              calories: 100,
              mass: 100,
            },
          },
        ],
      });
  });

  it("Ошибка api + восстановление", async () => {
    renderDashboard(<DashboardPage />);

    const breakfastTitle = await screen.findByText("Завтрак");
    const breakfastCard = breakfastTitle.closest(".rounded-xl");
    expect(breakfastCard).not.toBeNull();
    const breakfastScope = within(breakfastCard as HTMLElement);

    //До обновления

    expect(await breakfastScope.findByRole("alert")).toBeInTheDocument();

    const refreshBtn = breakfastScope.getByRole("button", { name: /Повторить/i });
    refreshBtn.click();

    await waitFor(() => {
      expect(getDailyMeal).toHaveBeenCalledTimes(2);
    });

    await waitFor(() => {
      expect(breakfastScope.queryByRole("alert")).not.toBeInTheDocument();
      expect(breakfastScope.getByText("Яблоко")).toBeInTheDocument();
      expect(breakfastScope.getByText(/100\s*ккал/i)).toBeInTheDocument();
    });
  });
});
