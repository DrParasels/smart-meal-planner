"use client"

import { Button, Form, Input } from "antd";
import type { FieldType } from "../model/types";
import { useRegister } from "../model/useRegister";

export const RegisterForm = () => {
    const {
        onFinish,
        passwordVisible,
        repeatPasswordVisible,
        setPasswordVisible,
        setRepeatPasswordVisible,
        validatePasswordMatch
    } = useRegister();
  return (
    <Form
      name="basic"
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item<FieldType>
        layout="vertical"
        label="Логин"
        name="login"
        rules={[
          { required: true, message: "Поле обязательно для заполнения" },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        layout="vertical"
        label="Email"
        name="email"
        rules={[{ required: true, message: "Поле обязательно для заполнения" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        layout="vertical"
        label="Пароль"
        name="password"
        rules={[{ required: true, message: "Поле обязательно для заполнения" }]}
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
  );
};
