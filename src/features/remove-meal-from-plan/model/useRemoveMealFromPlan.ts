
import { deleteMealItem } from "@/entities/daily-meal";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useRemoveMeal = () => {
  const queryClient = useQueryClient();
  const {
    mutate: removeMeal,
    //  isPending: isDeleting
  } = useMutation({
    mutationFn: (id: string) => deleteMealItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily-meal"] });
    },
  });

  return { removeMeal };
};
