import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { email, password, login } = await req.json();

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      login,
      email,
      password: hashedPassword,
    },
  });

  return NextResponse.json({ message: "User created" });
}
