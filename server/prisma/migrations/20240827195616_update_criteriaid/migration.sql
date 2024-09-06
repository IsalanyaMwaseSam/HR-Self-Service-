/*
  Warnings:

  - You are about to drop the column `evaluationCriteriaId` on the `option` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `file` DROP FOREIGN KEY `other_file_fkey`;

-- DropForeignKey
ALTER TABLE `file` DROP FOREIGN KEY `resume_file_fkey`;

-- DropIndex
DROP INDEX `Option_evaluationCriteriaId_fkey` ON `option`;

-- AlterTable
ALTER TABLE `option` DROP COLUMN `evaluationCriteriaId`;

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `resume_file_fkey` FOREIGN KEY (`applicationID`) REFERENCES `Application`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `other_file_fkey` FOREIGN KEY (`applicationID`) REFERENCES `Application`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
