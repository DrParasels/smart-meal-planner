"use client";

import { CurrentUser } from "@/app/layout";
import { Button } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface NavbarProps {
  user: CurrentUser | undefined;
}


const Navbar = ({user}: NavbarProps) => {
  const router = useRouter();
  async function handleExit() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <nav className="flex justify-between p-5 border-b border-gray-200 h-16">
      <Link href={"/"}>Главная</Link>
      {user ? <Link href={"/dashboard"}>Dashboard</Link> : <></>}
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
            <Link href={"/login"} style={{ marginRight: 30 }}>
              Вход
            </Link>
            <Link href={"/register"}>Регистрация</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
