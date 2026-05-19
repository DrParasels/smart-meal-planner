import { render, screen } from "@testing-library/react";
import RegisterPage from "./page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));
jest.mock("antd", () => {
  type WithChildren = { children?: React.ReactNode };
  type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
  const Form = ({ children }: WithChildren) => <form>{children}</form>;
  const FormItem = ({ children }: WithChildren) => <div>{children}</div>;
  FormItem.displayName = "MockFormItem";
  (Form as typeof Form & { Item: typeof FormItem }).Item = FormItem;
  const Input = (props: InputProps) => <input {...props} />;
  type PasswordInputProps = InputProps & { visibilityToggle?: unknown };
  const PasswordInput = (props: PasswordInputProps) => {
    const { visibilityToggle, ...rest } = props;
    void visibilityToggle;
    return <input type="password" {...rest} />;
  };
  PasswordInput.displayName = "MockPasswordInput";
  (Input as typeof Input & { Password: typeof PasswordInput }).Password =
    PasswordInput;
  const Button = ({ children }: WithChildren) => <button>{children}</button>;
  Button.displayName = "MockButton";
  return { Form, Input, Button };
});
describe("RegisterPage (smoke)", () => {
  it("renders registration title and submit button", () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <RegisterPage />
      </QueryClientProvider>,
    );

    expect(
      screen.getByRole("heading", { name: /регистрация/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /зарегистрироваться/i }),
    ).toBeInTheDocument();
  });
});
