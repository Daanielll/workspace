/*
  Warnings:

  - The primary key for the `OrgUsers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `UserOrgRoles` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `roleId` to the `OrgUsers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserOrgRoles" DROP CONSTRAINT "UserOrgRoles_orgId_fkey";

-- DropForeignKey
ALTER TABLE "UserOrgRoles" DROP CONSTRAINT "UserOrgRoles_roleId_fkey";

-- DropForeignKey
ALTER TABLE "UserOrgRoles" DROP CONSTRAINT "UserOrgRoles_userId_fkey";

-- AlterTable
ALTER TABLE "OrgUsers" DROP CONSTRAINT "OrgUsers_pkey",
ADD COLUMN     "roleId" INTEGER NOT NULL,
ADD CONSTRAINT "OrgUsers_pkey" PRIMARY KEY ("userId", "roleId", "orgId");

-- DropTable
DROP TABLE "UserOrgRoles";

-- AddForeignKey
ALTER TABLE "OrgUsers" ADD CONSTRAINT "OrgUsers_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
