"use client";

import { LoginForm } from "@/features/auth/login";
import Link from "next/link";

const LoginPage = () => {
  return (
    <div className="main-content flex flex-col items-center bg-bg">
      <div className="w-full max-w-md rounded-xl border border-border bg-surface px-10 pt-10 pb-10 shadow-card">
        <h2 className="pb-2 text-center text-text">Вход</h2>
        <LoginForm />
        <span className="flex h-px bg-border-light mb-6 mt-8" />
        <p className="text-center text-sm text-text-secondary">
          Забыли пароль?{" "}
          <Link
            href={"/"}
            className="font-medium text-primary hover:text-primary-hover"
          >
            Восстановить
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
