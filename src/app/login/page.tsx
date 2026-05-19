import { LoginForm } from "@/features/auth/login";
import { AuthCard } from "@/shared/ui/AuthCard";
import Link from "next/link";

const LoginPage = () => {
  return (
    <AuthCard
      title="Вход"
      footer={
        <>
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
        </>
      }
    >
      <LoginForm />
    </AuthCard>
  );
};

export default LoginPage;
