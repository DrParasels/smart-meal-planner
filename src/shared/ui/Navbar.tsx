"use client";

import { CurrentUser } from "@/app/layout";
import { CalendarOutlined } from "@ant-design/icons";
import { Button } from "antd";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";

interface NavbarProps {
  user: CurrentUser | undefined;
  onboarding: boolean;
}

const Navbar = ({ user, onboarding }: NavbarProps) => {
  const router = useRouter();
  async function handleExit() {
    await fetch("/api/auth/logout", { method: "POST" });

    router.refresh();
    redirect("/login");
  }

  return (
    <nav className="flex h-16 justify-between border-b border-border bg-surface p-5 text-text">
      <Link href={"/"}>FitMeal</Link>
      {user && !onboarding ? (
        <div className="flex gap-6">
          <Link href={"/dashboard"}>План питания</Link>
          <Link href={"/shopping-list"}>Список покупок</Link>
        </div>
      ) : (
        <></>
      )}
      <div>
        {user ? (
          <>
            <span className="mr-5">{user.login ?? user.email}</span>
            <Button color="default" variant="solid" onClick={handleExit}>
              Выйти
            </Button>
          </>
        ) : (
          <>
            <Link
              href={"/login"}
              className="mr-7 text-text-secondary hover:text-text"
            >
              Вход
            </Link>
            <Link
              href={"/register"}
              className="text-primary hover:text-primary-hover"
            >
              Регистрация
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
