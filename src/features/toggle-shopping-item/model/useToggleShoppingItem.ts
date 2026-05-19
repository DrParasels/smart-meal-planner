import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { updateShoppingList } from "@/entities/shopping-list";
import type { ShoppingList } from "@/entities/shopping-list";
import { queryKeys } from "@/shared/config/queryKeys";

type ToggleArgs = {
  id: string;
  isChecked: boolean;
};

type Context = {
  previousShoppingList?: ShoppingList | null;
};

export const useToggleShoppingItem = (
  shoppingListQueryKey: QueryKey = queryKeys.shoppingList,
) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation<void, Error, ToggleArgs, Context>({
    mutationFn: ({ id, isChecked }) => updateShoppingList(id, { isChecked }),
    onMutate: async ({ id, isChecked }) => {
      await queryClient.cancelQueries({ queryKey: shoppingListQueryKey });

      const previousShoppingList =
        queryClient.getQueryData<ShoppingList | null>(shoppingListQueryKey);

      queryClient.setQueryData<ShoppingList | null>(
        shoppingListQueryKey,
        (old) => {
          if (!old) return old;
          return {
            ...old,
            items: old.items.map((item) =>
              item.id === id ? { ...item, isChecked: isChecked } : item,
            ),
          };
        },
      );
      return { previousShoppingList };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousShoppingList !== undefined) {
        queryClient.setQueryData(
          shoppingListQueryKey,
          context.previousShoppingList,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: shoppingListQueryKey });
    },
  });

  const toggleItem = (id: string, currentChecked: boolean) => {
    mutate({ id, isChecked: !currentChecked });
  };

  return { toggleItem, isPending };
};
