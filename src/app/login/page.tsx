"use client";

import type { FormProps } from "antd";
import { Button, Checkbox, Form, Input } from "antd";
import { useRouter } from "next/navigation";

type FieldType = {
    email?: string;
  password?: string;
  remember?: string;
};

const LoginPage = () => {
  const router = useRouter();
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const res = await fetch('/api/auth/login', {
        method: "POST",
        body: JSON.stringify({email: values.email, password: values.password})
    })
    if (res.ok) {
        router.push("/redirect")
        router.refresh();
      }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo,
  ) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div className="flex flex-col items-center justify-center h-full main-content pb-40">
      <div className="w-full max-w-lg border-2 border-indigo-600 rounded-lg px-6 pt-6">
      <h1 className="pb-10 text-center">Вход</h1>
      <Form
        name="basic"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 19 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="email"
          name="email"
        //   labelCol={{ style: { paddingRight: 12 } }}
          rules={[{ required: true, message: "Обязательное поле!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Пароль"
          name="password"
        //   labelCol={{ style: { paddingRight: 12 } }}
          rules={[{ required: true, message: "Обязательное поле!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item<FieldType>
          name="remember"
          valuePropName="checked"
          label={null}
        >
          <Checkbox>Запомнить</Checkbox>
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit" block>
            Вход
          </Button>
        </Form.Item>
      </Form>
      </div>
    </div>
  );
};

export default LoginPage;
