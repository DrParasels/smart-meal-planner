"use client";

import Link from "next/link";
import { RegisterForm } from "@/features/auth/register";

const RegisterPage = () => {
  return (
    <div className="main-content flex flex-col items-center bg-bg">
      <div className="w-full max-w-md rounded-xl border border-border bg-surface px-10 pt-10 pb-10 shadow-card">
        <h2 className="pb-2 text-center text-text">Регистрация</h2>
        <p className="text-text-muted text-center pb-6">
          Создайте аккаунт, чтобы начать планировать своё питание
        </p>
        <RegisterForm />
        <div className="my-4 flex items-center gap-3">
          <span className="h-px flex-1 bg-border-light" />
          <span className="text-xs uppercase tracking-wide text-text-muted">
            или
          </span>
          <span className="h-px flex-1 bg-border-light" />
        </div>
        <p className="text-center text-sm text-text-secondary">
          Уже есть аккаунт?{" "}
          <Link
            href={"/login"}
            className="font-medium text-primary hover:text-primary-hover"
          >
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
