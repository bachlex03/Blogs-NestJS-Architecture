/*
  Warnings:

  - The values [PENDDING_APPROVAL,PENDDING_DELETION] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('PENDING_APPROVAL', 'PENDING_DELETION');
ALTER TABLE "Blog" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Blog" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "Status_old";
ALTER TABLE "Blog" ALTER COLUMN "status" SET DEFAULT 'PENDING_APPROVAL';
COMMIT;

-- AlterTable
ALTER TABLE "Blog" ALTER COLUMN "status" SET DEFAULT 'PENDING_APPROVAL';
