/*
  Warnings:

  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "color" TEXT NOT NULL DEFAULT '#000000',
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Org" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Org_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrgUsers" (
    "userId" INTEGER NOT NULL,
    "orgId" INTEGER NOT NULL,
    "roles" TEXT[],

    CONSTRAINT "OrgUsers_pkey" PRIMARY KEY ("userId","orgId")
);

-- CreateTable
CREATE TABLE "_OrgUsers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_OrgUsers_AB_unique" ON "_OrgUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_OrgUsers_B_index" ON "_OrgUsers"("B");

-- AddForeignKey
ALTER TABLE "OrgUsers" ADD CONSTRAINT "OrgUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgUsers" ADD CONSTRAINT "OrgUsers_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Org"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrgUsers" ADD CONSTRAINT "_OrgUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Org"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrgUsers" ADD CONSTRAINT "_OrgUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
