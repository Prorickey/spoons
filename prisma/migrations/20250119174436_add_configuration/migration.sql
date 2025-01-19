-- CreateTable
CREATE TABLE "GameConfiguration" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "GameConfiguration_key_key" ON "GameConfiguration"("key");
