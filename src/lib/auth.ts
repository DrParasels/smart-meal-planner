import { cookies } from "next/headers";
import { JWT_SECRET } from "./jwt";
import jwt from "jsonwebtoken";

export async function getUserIdFromCookies (): Promise<string | null> {
    try {
        const token = (await cookies()).get("token")?.value;
        if (!token) return null;
        const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
        return payload.userId;
      } catch {
        return null;
      }
}