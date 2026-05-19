"use client"

import { Button, Checkbox, Form, Input } from "antd";
import type { FieldType } from "../model/types";
import { useLogin } from "../model/useLogin";

export const LoginForm = () => {
  const { onFinish, onFinishFailed } = useLogin();
  return (
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
  );
};
