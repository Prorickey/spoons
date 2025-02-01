/*
  Warnings:

  - Changed the type of `player1id` on the `TargetRules` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `player2id` on the `TargetRules` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "TargetRules" DROP COLUMN "player1id",
ADD COLUMN     "player1id" INTEGER NOT NULL,
DROP COLUMN "player2id",
ADD COLUMN     "player2id" INTEGER NOT NULL;
