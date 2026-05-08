/*
  Warnings:

  - The values [supper] on the enum `MealType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MealType_new" AS ENUM ('breakfast', 'lunch', 'dinner', 'snack');
ALTER TABLE "DailyMealItem" ALTER COLUMN "type" TYPE "MealType_new" USING ("type"::text::"MealType_new");
ALTER TYPE "MealType" RENAME TO "MealType_old";
ALTER TYPE "MealType_new" RENAME TO "MealType";
DROP TYPE "public"."MealType_old";
COMMIT;
