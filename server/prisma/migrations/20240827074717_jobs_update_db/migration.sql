/*
  Warnings:

  - You are about to drop the column `createdById` on the `evaluationcriteria` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `evaluationcriteria` DROP FOREIGN KEY `EvaluationCriteria_createdById_fkey`;

-- DropForeignKey
ALTER TABLE `file` DROP FOREIGN KEY `other_file_fkey`;

-- DropForeignKey
ALTER TABLE `file` DROP FOREIGN KEY `resume_file_fkey`;

-- AlterTable
ALTER TABLE `evaluationcriteria` DROP COLUMN `createdById`;

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `resume_file_fkey` FOREIGN KEY (`applicationID`) REFERENCES `Application`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `other_file_fkey` FOREIGN KEY (`applicationID`) REFERENCES `Application`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EvaluationCriteria` ADD CONSTRAINT `EvaluationCriteria_createdByEmail_fkey` FOREIGN KEY (`createdByEmail`) REFERENCES `staff`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;
