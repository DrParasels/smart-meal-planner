import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import Navbar from "@/shared/ui/Navbar";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

export interface CurrentUser {
  login: string;
  email: string;
}

const rubik = Rubik({
  subsets: ["latin", "cyrillic"],
  variable: "--font-rubik",
});

export const metadata: Metadata = {
  title: "Smart Meal Planner",
  description: "Smart Meal Planner application",
};

export default async function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  const token = (await cookies()).get("token")?.value;
  let user: CurrentUser | undefined;
  try {
    if (token) {
      const payload = jwt.verify(token, JWT_SECRET) as {userId: string};
      const findUser = await prisma.user.findUnique({ where: { id: payload.userId } });
      if (findUser) {
        user = {login: findUser.login ?? findUser.email, email: findUser.email}
      }
    }
  } catch {
    user = undefined
  }
  
  return (
    <html lang="en" className={rubik.variable}>
      <body>
        <Navbar user={user} />
        <main className="main-content">{children}</main>
      </body>
    </html>
  );
}
