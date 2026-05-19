"use client";

import { Button, Form, Radio, InputNumber, Input, Grid } from "antd";
import { useOnboardingForm } from "../model/useOnboardingForm";

const OnboardingForm = () => {
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const isMobile = !screens.md; // md = 768+
  const { onFinish } = useOnboardingForm();
  return (

      <Form
        name="nest-messages"
        onFinish={onFinish}
        layout={isMobile ? "vertical" : "horizontal"}
        labelCol={isMobile ? undefined : { span: 6 }}
        wrapperCol={isMobile ? undefined : { span: 18 }}
        labelAlign="left"
      >
        <Form.Item
          name="name"
          label="Имя"
          rules={[{ required: true, message: "Обязательное поле" }]}
        >
          <Input
            className="w-full md:max-w-xs"
            placeholder="Введите ваше имя"
          />
        </Form.Item>
        <Form.Item
          name="height"
          label="Рост"
          rules={[{ required: true, message: "Обязательное поле" }]}
        >
          <InputNumber className="!w-full md:!w-auto" placeholder="см" />
        </Form.Item>
        <Form.Item
          name="weight"
          label="Вес"
          rules={[{ required: true, message: "Обязательное поле" }]}
        >
          <InputNumber className="!w-full md:!w-auto" placeholder="кг" />
        </Form.Item>
        <Form.Item
          name="age"
          label="Возраст"
          rules={[{ required: true, message: "Обязательное поле" }]}
        >
          <InputNumber className="!w-full md:!w-auto" placeholder="лет" />
        </Form.Item>
        <Form.Item
          name="gender"
          label="Пол"
          rules={[{ required: true, message: "Обязательное поле" }]}
        >
          <Radio.Group className="radio-group" buttonStyle="outline">
            <Radio.Button value="male">Мужской</Radio.Button>
            <Radio.Button value="female">Женский</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="activityLevel"
          label="Уровень активности"
          rules={[{ required: true, message: "Обязательное поле" }]}
        >
          <Radio.Group className="radio-group" buttonStyle="outline">
            <Radio.Button value="low">Слабая</Radio.Button>
            <Radio.Button value="medium">Средняя</Radio.Button>
            <Radio.Button value="high">Высокая</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="goal"
          label="Цель"
          rules={[{ required: true, message: "Обязательное поле" }]}
        >
          <Radio.Group className="radio-group" buttonStyle="outline">
            <Radio.Button value="low">Похудеть</Radio.Button>
            <Radio.Button value="medium">Поддерживать вес</Radio.Button>
            <Radio.Button value="high">Набрать вес</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item wrapperCol={isMobile ? undefined : { span: 18, offset: 0 }}>
          <Button type="primary" htmlType="submit" className="w-full md:w-40">
            Подтвердить
          </Button>
        </Form.Item>
      </Form>
  );
};

export default OnboardingForm;
