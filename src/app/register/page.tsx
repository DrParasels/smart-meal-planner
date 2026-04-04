"use client";

import { useState } from "react";
import type { FormProps } from "antd";
import { Button, Form, Input } from "antd";
import { useRouter } from "next/navigation";

type FieldType = {
  login?: string;
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
  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    const res = await fetch('/api/auth/register', {
      method: "POST",
      body: JSON.stringify({email: values.email, password: values.password, login: values.login})
    })
    if(res.ok) {
      // router.push("/login")
    }
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <div className="flex flex-col items-center justify-center h-full main-content pb-40">
      <div className="w-full max-w-lg border-2 border-indigo-600 rounded-lg px-6 pt-6">
        <h1 className="pb-10 text-center">Регистрация</h1>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="Логин"
            name="login"
            rules={[{ required: false, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Пароль"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
            />
          </Form.Item>

          <Form.Item<FieldType>
            label="Пароль ещё раз"
            name="repeat_password"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please input your password!" },
              ({ getFieldValue }) => validatePasswordMatch(getFieldValue),
            ]}
          >
            <Input.Password
              visibilityToggle={{ visible: repeatPasswordVisible, onVisibleChange: setRepeatPasswordVisible }}
            />
          </Form.Item>

          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              Регистрация
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default RegisterPage;
