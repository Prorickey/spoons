-- CreateTable
CREATE TABLE "TargetRules" (
    "id" SERIAL NOT NULL,
    "type" INTEGER NOT NULL,
    "player1id" TEXT NOT NULL,
    "player2id" TEXT NOT NULL,

    CONSTRAINT "TargetRules_pkey" PRIMARY KEY ("id")
);
