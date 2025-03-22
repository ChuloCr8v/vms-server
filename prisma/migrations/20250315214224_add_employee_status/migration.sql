/*
  Warnings:

  - Added the required column `isActive` to the `Visitor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Visitor" ADD COLUMN     "isActive" BOOLEAN NOT NULL;
