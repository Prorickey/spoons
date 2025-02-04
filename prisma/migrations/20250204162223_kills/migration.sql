-- CreateTable
CREATE TABLE "Kill" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "killerId" INTEGER NOT NULL,
    "victimId" INTEGER NOT NULL,
    "killedAt" TIMESTAMP(3) NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "long" DOUBLE PRECISION NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "contest" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Kill_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Kill_victimId_key" ON "Kill"("victimId");

-- AddForeignKey
ALTER TABLE "Kill" ADD CONSTRAINT "Kill_killerId_fkey" FOREIGN KEY ("killerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kill" ADD CONSTRAINT "Kill_victimId_fkey" FOREIGN KEY ("victimId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
