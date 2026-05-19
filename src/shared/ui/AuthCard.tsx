import { ReactNode } from "react";

type AuthCardProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export const AuthCard = (props: AuthCardProps) => {
  return (
    <div className="pt-5 flex flex-col items-center bg-bg">
      <div className="w-full max-w-md rounded-xl border border-border bg-surface px-10 pt-10 pb-10 shadow-card">
        <div className="pb-6 text-center">
          <h2 className="pb-2">{props.title}</h2>
          {props.subtitle && (
            <p className="text-text-muted">{props.subtitle}</p>
          )}
        </div>
        {props.children}
        {props.footer}
      </div>
    </div>
  );
};
