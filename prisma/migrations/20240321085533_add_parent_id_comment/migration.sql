/*
  Warnings:

  - Added the required column `parentId` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "parentId" INTEGER NOT NULL;
