import { prisma } from "@/lib/prisma";

type Props = {
    params: Promise<{ id: string }>
}

export default async function RecipeDetailPage({ params }: Props) {
    const { id } = await params;
    const recipe = await prisma.recipe.findUnique({
        where: { id },
        include: {
          ingredients: {
            include: { ingredient: true }
          }
        }
      });

    console.log(recipe)
    
    return (
        <div>
            Детализация Рецепта
        </div>
    )
  }