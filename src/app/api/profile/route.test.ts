/** @jest-environment node */
import { getUserIdFromCookies } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GET, POST } from "./route";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

jest.mock("@/lib/auth", () => ({
  getUserIdFromCookies: jest.fn(),
}));

jest.mock("@/lib/prisma", () => ({
  prisma: {
    profile: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
    },
  },
}));

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  __esModule: true,
  default: {
    verify: jest.fn(),
  },
}));

const validBody = {
  name: "Dima",
  age: 31,
  height: 176,
  weight: 92,
  gender: "male",
  activityLevel: "medium",
  goal: "maintain",
};

describe("GET /api/profile", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("happy path: возвращает профиль", async () => {
    (getUserIdFromCookies as jest.Mock).mockResolvedValue("user-1");
    (prisma.profile.findUnique as jest.Mock).mockResolvedValue({
      userId: "user-1",
      name: "Dima",
      dailyCalories: 2500,
      protein: 160,
      fat: 72,
      carbs: 318,
    });
    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.name).toBe("Dima");
    expect(prisma.profile.findUnique).toHaveBeenCalledWith({
      where: { userId: "user-1" },
    });
  });

  it("error: неавторизован -> 401", async () => {
    (getUserIdFromCookies as jest.Mock).mockResolvedValue(null);
    const res = await GET();
    const body = await res.json();
    expect(res.status).toBe(401);
    expect(body).toEqual({ error: "Unauthorized" });
  });

  it("edge case: профиля нет -> null с 200", async () => {
    (getUserIdFromCookies as jest.Mock).mockResolvedValue("user-1");
    (prisma.profile.findUnique as jest.Mock).mockResolvedValue(null);
    const res = await GET();
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body).toBeNull();
  });
});

describe("POST /api/profile", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("happy path: валидный токен + upsert -> 200", async () => {
    (cookies as jest.Mock).mockResolvedValue({
      get: jest.fn().mockReturnValue({ value: "token-123" }),
    });
    (jwt.verify as jest.Mock).mockReturnValue({ userId: "user-1" });
    (prisma.profile.upsert as jest.Mock).mockResolvedValue({
      userId: "user-1",
      name: "Dima",
      dailyCalories: 2641,
      protein: 160,
      fat: 72,
      carbs: 351,
    });
    const req = new Request("http://localhost/api/profile", {
        method: "POST",
        body: JSON.stringify(validBody),
        headers: { "Content-Type": "application/json" },
      });
      const res = await POST(req as unknown as Parameters<typeof POST>[0]);
      const body = await res.json();
      expect(res.status).toBe(200);
      expect(body.userId).toBe("user-1");
      expect(prisma.profile.upsert).toHaveBeenCalled();
  });
  it("error: нет токена -> 401", async () => {
    (cookies as jest.Mock).mockResolvedValue({
      get: jest.fn().mockReturnValue(undefined),
    });
    const req = new Request("http://localhost/api/profile", {
      method: "POST",
      body: JSON.stringify(validBody),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req as unknown as Parameters<typeof POST>[0]);
    const body = await res.json();
    expect(res.status).toBe(401);
    expect(body).toEqual({ error: "Unauthorized" });
  });
  it("edge/error: prisma.upsert кидает ошибку -> 500", async () => {
    (cookies as jest.Mock).mockResolvedValue({
      get: jest.fn().mockReturnValue({ value: "token-123" }),
    });
    (jwt.verify as jest.Mock).mockReturnValue({ userId: "user-1" });
    (prisma.profile.upsert as jest.Mock).mockRejectedValue(new Error("db fail"));
    const req = new Request("http://localhost/api/profile", {
      method: "POST",
      body: JSON.stringify(validBody),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req as unknown as Parameters<typeof POST>[0]);
    const body = await res.json();
    expect(res.status).toBe(500);
    expect(body).toEqual({ error: "Error" });
  });
});
