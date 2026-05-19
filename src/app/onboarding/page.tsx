"use client";

import OnboardingForm from "@/features/profile/ui/OnboardingForm";

const Onboarding = () => {
  return (
    <div className="flex flex-col items-center bg-bg">
      <div className="w-full max-w-6xl rounded-xl border border-border bg-surface px-4 py-6 md:px-10 md:py-10 shadow-card">
        <h2 className="pb-2 text-text">Заполнить данные пользователя</h2>
        <p className="pb-6 text-text-muted">
          Эти данные помогут нам подобрать подходящее питание для вас
        </p>
        <span className="mb-6 flex h-px bg-border-light" />
        <OnboardingForm />
      </div>
    </div>
  );
};

export default Onboarding;
