"use client";

import { login } from "@/shared/api/api";
import { useMutation } from "@tanstack/react-query";
import type { FormProps } from "antd";
import { Button, Checkbox, Form, Input } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";

type FieldType = {
  email: string;
  password: string;
  remember?: boolean;
};

const LoginPage = () => {
  const router = useRouter();

  const { mutate: loginUser } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      router.push("/redirect");
      router.refresh();
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    loginUser({email: values.email, password: values.password})
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo,
  ) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div className="main-content flex flex-col items-center bg-bg">
      <div className="w-full max-w-md rounded-xl border border-border bg-surface px-10 pt-10 pb-10 shadow-card">
        <h2 className="pb-2 text-center text-text">Вход</h2>
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            layout="vertical"
            label="Email"
            name="email"
            rules={[{ required: true, message: "Обязательное поле!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            layout="vertical"
            label="Пароль"
            name="password"
            rules={[{ required: true, message: "Обязательное поле!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item<FieldType>
            layout="vertical"
            name="remember"
            valuePropName="checked"
            label={null}
          >
            <Checkbox>Запомнить</Checkbox>
          </Form.Item>

          <Form.Item label={null}>
            <Button className="w-full" type="primary" htmlType="submit">
              Вход
            </Button>
          </Form.Item>
        </Form>
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
