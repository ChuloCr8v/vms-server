/*
  Warnings:

  - The `verificationTokenExpiresAt` column on the `Organization` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "verificationTokenExpiresAt",
ADD COLUMN     "verificationTokenExpiresAt" TIMESTAMP(3);
