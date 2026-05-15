/** @jest-environment node */
import { getUserIdFromCookies } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PATCH } from "./route";

jest.mock("@/lib/auth", () => ({
  getUserIdFromCookies: jest.fn(),
}));

jest.mock("@/lib/prisma", () => ({
  prisma: {
    shoppingListItem: {
      updateMany: jest.fn(),
    },
  },
}));

describe("PATCH /api/shopping-list/item/[id]", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("happy path: обновляет isChecked и возвращает 204", async () => {
        (getUserIdFromCookies as jest.Mock).mockResolvedValue("user-1");
        (prisma.shoppingListItem.updateMany as jest.Mock).mockResolvedValue({count: 1});

        const req = new Request("http://localhost/api/shopping-list/item/item-1", {
            method: "PATCH",
            body: JSON.stringify({isChecked: true}),
            headers: {"Content-Type": "application/json"},
        });

        const res = await PATCH(req, { params: Promise.resolve({ id: "item-1" }) });
        expect(res.status).toBe(204);
        expect(prisma.shoppingListItem.updateMany).toHaveBeenCalledWith({
            where: {id: "item-1", shoppingList: {userId: "user-1"}},
            data: { isChecked: true}
        });
    });

    it("error: невалидное тело (isChecked не boolean) -> 400", async () => {
        (getUserIdFromCookies as jest.Mock).mockResolvedValue("user-1");
        const req = new Request("http://localhost/api/shopping-list/item/item-1", {
            method: "PATCH",
            body: JSON.stringify({isChecked: "yes"}),
            headers: {"Content-Type": "application/json"},
        });

        const res = await PATCH(req, {params: Promise.resolve({ id: "item-1" }) });
        const body = await res.json();
        expect(res.status).toBe(400);
        expect(body).toEqual({error: "Bad request"});
        expect(prisma.shoppingListItem.updateMany).not.toHaveBeenCalled();
    });

    it("edge case: item не принадлежит пользователю -> 403", async () => {
        (getUserIdFromCookies as jest.Mock).mockResolvedValue("user-1");
        (prisma.shoppingListItem.updateMany as jest.Mock).mockResolvedValue({count: 0});
        const req = new Request("http://localhost/api/shopping-list/item/item-1", {
            method: "PATCH",
            body: JSON.stringify({isChecked: true}),
            headers: {"Content-Type": "application/json"},
        });
        const res = await PATCH(req, {params: Promise.resolve({ id: "item-1" }) });
        const body = await res.json();
        expect(res.status).toBe(403);
        expect(body).toEqual({error: "Forbidden"});
    });
})