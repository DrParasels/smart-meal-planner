import type { FormProps } from "antd";
import type { FieldType } from "./types";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/shared/api/api";

export const useRegister = () => {
  const validatePasswordMatch = (getFieldValue: (name: string) => string) => ({
    validator(_: unknown, value: string) {
      if (!value || getFieldValue("password") === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error("Пароли не совпадают!"));
    },
  });

  const router = useRouter();

  const [passwordVisible, setPasswordVisible] = useState(true);
  const [repeatPasswordVisible, setRepeatPasswordVisible] = useState(true);

  const { mutate } = useMutation({
    mutationFn: register,
    onSuccess: () => {
      router.push("/login");
    },
    onError: () => {
      console.log("Ошибка создания");
    },
  });

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    mutate({
      login: values.login,
      password: values.password,
      email: values.email,
    });
  };

  return {
    onFinish,
    passwordVisible,
    repeatPasswordVisible,
    setPasswordVisible,
    setRepeatPasswordVisible,
    validatePasswordMatch,
  };
};
