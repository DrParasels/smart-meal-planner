import { test, expect } from "@playwright/test";

test("registration -> onboarding -> dashboard flow", async ({ page, browserName }) => {
  test.skip(browserName === "webkit", "WebKit is flaky on Ant Design auth form submission in this flow.");

  const uniqueSuffix = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const email = `pw_${test.info().project.name}_${uniqueSuffix}@example.com`;
  const password = "Qwerty123!";

  // 1) Registration
  await page.goto("/register");
  await expect(
    page.getByRole("heading", { name: "Регистрация" }),
  ).toBeVisible();
  await page.getByLabel("Логин").fill("playwright-user");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Пароль", { exact: true }).fill(password);
  await page.getByLabel("Пароль ещё раз").fill(password);
  const registerResponsePromise = page.waitForResponse(
    (response) =>
      response.url().includes("/api/auth/register") &&
      response.request().method() === "POST",
  );
  await page.getByRole("button", { name: "Регистрация" }).click();
  const registerResponse = await registerResponsePromise;
  expect(registerResponse.ok()).toBeTruthy();

   // На странице сейчас нет redirect после успешной регистрации,
  // поэтому продолжаем через login.
  await page.goto("/login");
  await expect(page.getByRole("heading", {name:"Вход"})).toBeVisible();
  await page.getByLabel("email").fill(email);
  await page.getByLabel("Пароль").fill(password);
  const loginResponsePromise = page.waitForResponse(
    (response) =>
      response.url().includes("/api/auth/login") &&
      response.request().method() === "POST",
  );
  await page.getByRole("button", { name: "Вход" }).click();
  const loginResponse = await loginResponsePromise;
  expect(loginResponse.ok()).toBeTruthy();

  // /redirect отправляет пользователя без профиля на /onboarding
  await expect(page).toHaveURL(/\/onboarding$/);
  await expect(page.getByText("Заполнить данные пользователя")).toBeVisible();

  // 3) Onboarding
  await page.getByLabel("Имя").fill("Playwright User");
  await page.getByRole("spinbutton", { name: "Рост" }).fill("180");
  await page.getByRole("spinbutton", { name: "Вес" }).fill("75");
  await page.getByRole("spinbutton", { name: "Возраст" }).fill("30");
  await page.getByText("Мужской", { exact: true }).click();
  await page.getByText("Средняя", { exact: true }).click();
  await page.getByText("Поддерживать вес", { exact: true }).click();
  await page.getByRole("button", { name: "Подтвердить" }).click();

    // 4) Dashboard
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByText("Итого за день")).toBeVisible();
    // Ключевые данные dashboard
    await expect(page.getByTestId("daily-sum-calories")).toBeVisible();
    await expect(page.getByTestId("daily-total-calories")).toBeVisible();
    await expect(page.getByText("Осталось:")).toBeVisible();
});
