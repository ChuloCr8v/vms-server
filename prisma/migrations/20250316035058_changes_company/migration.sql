/*
  Warnings:

  - Added the required column `company` to the `Visitor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Visitor" ADD COLUMN     "company" TEXT NOT NULL;
