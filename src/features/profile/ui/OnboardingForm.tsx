"use client"

import { Profile } from '@/entities/profile/model/types';
import { Button, Form, Radio, InputNumber, Flex, Input } from 'antd';
import { useRouter } from "next/navigation";
import { saveProfile } from '../api/saveProfile';

const OnboardingForm = () => {
    const router = useRouter();

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };

    const onFinish = async ( profile: Profile ) => {
        try {
            await saveProfile(profile);
            router.push("/dashboard");
            router.refresh();
        } catch(e) {
            console.error(e)
        }
    };
    return (
        <div>
            <h2>Заполнить данные пользователя</h2>
            <Form
                {...layout}
                name="nest-messages"
                onFinish={onFinish}
                style={{ maxWidth: 600 }}
                // validateMessages={validateMessages}
            >
                <Form.Item name='name' label="Имя" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name='height' label="Рост" rules={[{ required: true }]}>
                    <InputNumber />
                </Form.Item>
                <Form.Item name='weight' label="Вес" rules={[{ required: true }]}>
                    <InputNumber />
                </Form.Item>
                <Form.Item name='age' label="Возраст" rules={[{ required: true }]}>
                    <InputNumber />
                </Form.Item>
                <Form.Item name='gender' label="Пол" rules={[{ required: true }]}>
                    <Flex vertical gap="medium">
                        <Radio.Group
                            buttonStyle="solid"

                        >
                            <Radio.Button value="male">Мужской</Radio.Button>
                            <Radio.Button value="female">Женский</Radio.Button>
                        </Radio.Group>
                    </Flex>
                </Form.Item>
                <Form.Item name='activityLevel' label="Уровень активности" rules={[{ required: true }]}>
                    <Flex vertical gap="medium">
                        <Radio.Group
                            buttonStyle="solid"

                        >
                            <Radio.Button value="low">Слабая</Radio.Button>
                            <Radio.Button value="medium">Средняя</Radio.Button>
                            <Radio.Button value="high">Высокая</Radio.Button>
                        </Radio.Group>
                    </Flex>
                </Form.Item>
                <Form.Item name='goal' label="Цель" rules={[{ required: true }]}>
                    <Flex vertical gap="medium">
                        <Radio.Group
                            buttonStyle="solid"
                        >
                            <Radio.Button value="low">Похудеть</Radio.Button>
                            <Radio.Button value="medium">Поддерживать вес</Radio.Button>
                            <Radio.Button value="high">Набрать вес</Radio.Button>
                        </Radio.Group>
                    </Flex>
                </Form.Item>
                <Form.Item label={null}>
                    <Button type="primary" htmlType="submit">
                        Подтвердить
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default OnboardingForm