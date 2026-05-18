import { login } from "@/shared/api/api";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { FieldType } from "./types";
import type { FormProps } from "antd";

export const useLogin = () => {
    const router = useRouter();

    const { mutate } = useMutation({
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
        mutate({email: values.email, password: values.password})
    };
  
    const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
      errorInfo,
    ) => {
      console.log("Failed:", errorInfo);
    };

    return {
        onFinish,
        onFinishFailed,
    }
}