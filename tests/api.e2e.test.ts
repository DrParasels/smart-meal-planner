import request from "supertest";

const api = request("http://localhost:3000");

it("happy: register -> login -> profile", async () => {
  const email = `e2e_${Date.now()}@mail.com`;
  const password = "123456";

  const reg = await api.post("/api/auth/register").send({
    login: "e2e_user",
    email,
    password,
  });
  expect(reg.status).toBe(200);

  const login = await api.post("/api/auth/login").send({ email, password });
  expect(login.status).toBe(200);

  const cookie = login.headers["set-cookie"];
  expect(cookie).toBeDefined();

  const profile = await api.post("/api/profile").set("Cookie", cookie).send({
    name: "Dima",
    age: 30,
    height: 180,
    weight: 80,
    gender: "male",
    activityLevel: "medium",
    goal: "maintain",
  });
  expect(profile.status).toBe(200);
  expect(profile.body).toMatchObject({
    name: "Dima",
    dailyCalories: expect.any(Number),
    protein: expect.any(Number),
    fat: expect.any(Number),
    carbs: expect.any(Number),
  });
});

it("negative: shopping-list PATCH with invalid body returns 400", async () => {
  const email = `e2e_${Date.now()}@mail.com`;
  const password = "123456";

  const reg = await api.post("/api/auth/register").send({
    login: "e2e_user",
    email,
    password,
  });
  expect(reg.status).toBe(200);

  const login = await api.post("/api/auth/login").send({ email, password });
  expect(login.status).toBe(200);

  const cookie = login.headers["set-cookie"];
  expect(cookie).toBeDefined();

  const res = await api
    .patch("/api/shopping-list/item/some-id")
    .set("Cookie", cookie)
    .send({ isChecked: "yes" });
  expect(res.status).toBe(400);
  expect(res.body).toEqual({ error: "Bad request" });
});
