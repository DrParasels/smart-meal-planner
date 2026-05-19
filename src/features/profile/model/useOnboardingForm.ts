import { saveProfile } from "@/entities/profile";
import type { SaveProfile } from "@/entities/profile";
import { queryKeys } from "@/shared/config/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useOnboardingForm = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { mutate: saveProfileFn } = useMutation({
      mutationFn: (profile: SaveProfile) => saveProfile(profile),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.profile });
        router.push("/dashboard");
        router.refresh();
      },
    });
  
    const onFinish = async (profile: SaveProfile) => {
      saveProfileFn(profile);
    };
    return {
        onFinish 
    }
}