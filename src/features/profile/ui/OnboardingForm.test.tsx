import { render, screen, waitFor } from "@testing-library/react";
import type { FC, InputHTMLAttributes, ReactNode } from "react";
import userEvent from "@testing-library/user-event";
import OnboardingForm from "./OnboardingForm";
import { saveProfile } from "../api/saveProfile";
import type { Profile } from "@/entities/profile/model/types";

type WithChildren = { children?: ReactNode };
type WithLabel = WithChildren & { label?: ReactNode };
type InputProps = InputHTMLAttributes<HTMLInputElement>;

type FormItemProps = WithLabel & { name?: string | number | (string | number)[] };

type MockFormProps = WithChildren & {
  onFinish?: (values: Profile) => void | Promise<void>;
};

type FormComponent = FC<MockFormProps> & { Item: FC<FormItemProps> };

const pushMock = jest.fn();
const refreshMock = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    refresh: refreshMock,
  }),
}));
jest.mock("../api/saveProfile", () => ({
  saveProfile: jest.fn(),
}));
jest.mock("antd", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- Jest hoists mocks; need runtime React in factory
  const React = require("react") as typeof import("react");

  const MockForm: FC<MockFormProps> = ({ children, onFinish }) => (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (!onFinish) return;

        const fd = new FormData(e.currentTarget);
        const get = (key: string) => fd.get(key);

        const name = String(get("name") ?? "").trim();
        const height = Number(get("height"));
        const weight = Number(get("weight"));
        const age = Number(get("age"));
        const gender = String(get("gender") ?? "");
        const activityLevel = String(get("activityLevel") ?? "");
        const goal = String(get("goal") ?? "");

        const invalid =
          !name ||
          !Number.isFinite(height) ||
          !Number.isFinite(weight) ||
          !Number.isFinite(age) ||
          !gender ||
          !activityLevel ||
          !goal;

        if (invalid) return;

        await onFinish({
          name,
          height,
          weight,
          age,
          gender: gender as Profile["gender"],
          activityLevel: activityLevel as Profile["activityLevel"],
          goal: goal as Profile["goal"],
        });
      }}
    >
      {children}
    </form>
  );
  MockForm.displayName = "MockForm";

  const MockFormItem: FC<FormItemProps> = ({ children, label, name }) => {
    const fieldKey =
      name === undefined || name === null
        ? undefined
        : Array.isArray(name)
          ? name.map(String).join(".")
          : String(name);

    const child = React.Children.only(children) as React.ReactElement | null | undefined;
    const withName =
      fieldKey && React.isValidElement(child)
        ? React.cloneElement(child, { name: fieldKey } as never)
        : child;

    if (label == null) {
      return <>{withName}</>;
    }

    const isTextOrNumberInput =
      React.isValidElement(withName) &&
      (withName.type === MockInput || withName.type === MockInputNumber);

    if (isTextOrNumberInput && label != null) {
      return (
        <label>
          <span>{label}</span>
          {withName}
        </label>
      );
    }

    return (
      <div>
        {label != null ? <div>{label}</div> : null}
        {withName}
      </div>
    );
  };
  MockFormItem.displayName = "MockFormItem";
  (MockForm as FormComponent).Item = MockFormItem;

  const MockInput: FC<InputProps> = (props) => <input {...props} />;
  MockInput.displayName = "MockInput";

  const MockInputNumber: FC<InputProps> = (props) => (
    <input type="number" {...props} />
  );
  MockInputNumber.displayName = "MockInputNumber";

  const MockRadioGroup: FC<WithChildren & { name?: string }> = ({
    children,
    name,
  }) => (
    <div role="radiogroup">
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, { name } as never)
          : child,
      )}
    </div>
  );
  MockRadioGroup.displayName = "MockRadioGroup";

  const MockRadioButton: FC<
    WithChildren & { value?: string; name?: string }
  > = ({ children, value, name }) => (
    <label>
      <input type="radio" name={name} value={value} />
      <span>{children}</span>
    </label>
  );
  MockRadioButton.displayName = "MockRadioButton";

  const MockFlex: FC<WithChildren & { name?: string }> = ({ children, name }) => {
    const only = React.Children.only(children);
    return (
      <div>
        {React.isValidElement(only) && name
          ? React.cloneElement(only, { name } as never)
          : only}
      </div>
    );
  };
  MockFlex.displayName = "MockFlex";

  type MockButtonProps = WithChildren &
    React.ButtonHTMLAttributes<HTMLButtonElement> & {
      htmlType?: "submit" | "button";
    };

  const MockButton: FC<MockButtonProps> = ({
    children,
    htmlType = "button",
    type: antdTypeProp,
    ...rest
  }) => {
    void antdTypeProp;
    return (
      <button type={htmlType === "submit" ? "submit" : "button"} {...rest}>
        {children}
      </button>
    );
  };
  MockButton.displayName = "MockButton";

  const Radio = {
    Group: MockRadioGroup,
    Button: MockRadioButton,
  };

  return {
    Form: MockForm,
    Input: MockInput,
    InputNumber: MockInputNumber,
    Radio,
    Flex: MockFlex,
    Button: MockButton,
  };
});
describe("OnboardingForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("Отрисовка всех обязательных полей и кнопки сабмит", () => {
    render(<OnboardingForm />);
    expect(
      screen.getByRole("heading", { name: /заполнить данные пользователя/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Имя")).toBeInTheDocument();
    expect(screen.getByText("Рост")).toBeInTheDocument();
    expect(screen.getByText("Вес")).toBeInTheDocument();
    expect(screen.getByText("Возраст")).toBeInTheDocument();
    expect(screen.getByText("Пол")).toBeInTheDocument();
    expect(screen.getByText("Уровень активности")).toBeInTheDocument();
    expect(screen.getByText("Цель")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /подтвердить/i }),
    ).toBeInTheDocument();
  });

  it("Не отправляет форму, если обязательные поля пустые", async () => {
    const user = userEvent.setup();
    render(<OnboardingForm />);
    await user.click(screen.getByRole("button", { name: /подтвердить/i }));
    expect(saveProfile).not.toHaveBeenCalled();
    expect(pushMock).not.toHaveBeenCalled();
    expect(refreshMock).not.toHaveBeenCalled();
  });

  it("Отправка формы, когда все поля заполнены", async () => {
    const user = userEvent.setup();
    jest.mocked(saveProfile).mockResolvedValue({ message: "User created" });
    render(<OnboardingForm />);

    await user.type(screen.getByRole("textbox", { name: /имя/i }), "Дима");
    await user.type(screen.getByRole("spinbutton", { name: "Рост" }), "180");
    await user.type(screen.getByRole("spinbutton", { name: "Вес" }), "80");
    await user.type(screen.getByRole("spinbutton", { name: "Возраст" }), "30");

    await user.click(screen.getByRole("radio", { name: /мужской/i }));
    await user.click(screen.getByRole("radio", { name: /средняя/i }));
    await user.click(screen.getByRole("radio", { name: /похудеть/i }));

    await user.click(screen.getByRole("button", { name: /подтвердить/i }));

    await waitFor(() => {
      expect(saveProfile).toHaveBeenCalledWith({
        name: "Дима",
        height: 180,
        weight: 80,
        age: 30,
        gender: "male",
        activityLevel: "medium",
        goal: "low",
      });
    });
    expect(pushMock).toHaveBeenCalledWith("/dashboard");
    expect(refreshMock).toHaveBeenCalled();
  });

  it("Отправка формы, когда все поля заполнены с ответом-ошибкой", async () => {
    const user = userEvent.setup();
    jest.mocked(saveProfile).mockRejectedValue(new Error("API error"));
    render(<OnboardingForm />);

    await user.type(screen.getByRole("textbox", { name: /имя/i }), "Дима");
    await user.type(screen.getByRole("spinbutton", { name: "Рост" }), "180");
    await user.type(screen.getByRole("spinbutton", { name: "Вес" }), "80");
    await user.type(screen.getByRole("spinbutton", { name: "Возраст" }), "30");

    await user.click(screen.getByRole("radio", { name: /мужской/i }));
    await user.click(screen.getByRole("radio", { name: /средняя/i }));
    await user.click(screen.getByRole("radio", { name: /похудеть/i }));

    await user.click(screen.getByRole("button", { name: /подтвердить/i }));

    await waitFor(() => {
      expect(saveProfile).toHaveBeenCalled();
    });
    expect(pushMock).not.toHaveBeenCalled();
    expect(refreshMock).not.toHaveBeenCalled();
  });
});
