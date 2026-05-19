import Link from "next/link";
import { RegisterForm } from "@/features/auth/register";
import { AuthCard } from "@/shared/ui/AuthCard";

const RegisterPage = () => {
  return (
    <AuthCard
      title="Регистрация"
      subtitle="Создайте аккаунт, чтобы начать планировать своё питание"
      footer={
        <>
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
        </>
      }
    >
      <RegisterForm />
    </AuthCard>
  );
};

export default RegisterPage;
