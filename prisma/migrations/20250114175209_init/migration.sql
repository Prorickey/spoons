-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "gamemaster" BOOLEAN NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "hallId" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "totalKills" INTEGER NOT NULL DEFAULT 0,
    "currentTarget" TEXT,
    "previousKills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "killed" BOOLEAN NOT NULL DEFAULT false,
    "killedBy" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
