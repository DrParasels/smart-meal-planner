"use client";

import { useState } from "react";
import type { FormProps } from "antd";
import { Button, Form, Input } from "antd";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { register } from "@/shared/api/api";

type FieldType = {
  login: string;
  email: string;
  password: string;
  repeat_password: string;
};

const validatePasswordMatch = (getFieldValue: (name: string) => string) => ({
  validator(_: unknown, value: string) {
    if (!value || getFieldValue("password") === value) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("Пароли не совпадают!"));
  },
});

const RegisterPage = () => {
  const router = useRouter();

  const [passwordVisible, setPasswordVisible] = useState(true);
  const [repeatPasswordVisible, setRepeatPasswordVisible] = useState(true);

  const { mutate: registration } = useMutation({
    mutationFn: register,
    onSuccess: () => {
      router.push("/login");
    },
    onError: () => {
      console.log("Ошибка создания");
    },
  });

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    registration({
      login: values.login,
      password: values.password,
      email: values.email,
    });
  };
  return (
    <div className="main-content flex flex-col items-center bg-bg">
      <div className="w-full max-w-md rounded-xl border border-border bg-surface px-10 pt-10 pb-10 shadow-card">
        <h2 className="pb-2 text-center text-text">Регистрация</h2>
        <p className="text-text-muted text-center pb-6">
          Создайте аккаунт, чтобы начать планировать своё питание
        </p>
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            layout="vertical"
            label="Логин"
            name="login"
            rules={[
              { required: false, message: "Поле обязательно для заполнения" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            layout="vertical"
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Поле обязательно для заполнения" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            layout="vertical"
            label="Пароль"
            name="password"
            rules={[
              { required: true, message: "Поле обязательно для заполнения" },
            ]}
          >
            <Input.Password
              visibilityToggle={{
                visible: passwordVisible,
                onVisibleChange: setPasswordVisible,
              }}
            />
          </Form.Item>

          <Form.Item<FieldType>
            layout="vertical"
            label="Подтвердите пароль"
            name="repeat_password"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Поле обязательно для заполнения" },
              ({ getFieldValue }) => validatePasswordMatch(getFieldValue),
            ]}
          >
            <Input.Password
              visibilityToggle={{
                visible: repeatPasswordVisible,
                onVisibleChange: setRepeatPasswordVisible,
              }}
            />
          </Form.Item>

          <Form.Item label={null} className="!pt-5">
            <Button className="w-full" type="primary" htmlType="submit">
              Зарегистрироваться
            </Button>
          </Form.Item>
        </Form>
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
