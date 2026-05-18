import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body.email ?? "")
      .trim()
      .toLowerCase();
    const password = String(body.password ?? "");
    const login = String(body.login ?? "").trim();

    if (!email || !password || !login) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk || password.length < 6) {
      return NextResponse.json(
        { error: "Invalid email or password too short" },
        { status: 422 },
      );
    }

    const existing = await prisma.user.findFirst({
      where: {
        OR: [ { email }, {login} ],
      },
    });
    if (existing?.email === email) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 },
      );
    }
    if (existing?.login === login) {
      return NextResponse.json(
        { error: "Login already registered" },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        login,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({ message: "User created" }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 },
    );
  }
}
