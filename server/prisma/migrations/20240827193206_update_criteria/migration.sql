/*
  Warnings:

  - Added the required column `evaluationCriteriaId` to the `Option` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `file` DROP FOREIGN KEY `other_file_fkey`;

-- DropForeignKey
ALTER TABLE `file` DROP FOREIGN KEY `resume_file_fkey`;

-- AlterTable
ALTER TABLE `option` ADD COLUMN `evaluationCriteriaId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `resume_file_fkey` FOREIGN KEY (`applicationID`) REFERENCES `Application`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `other_file_fkey` FOREIGN KEY (`applicationID`) REFERENCES `Application`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Option` ADD CONSTRAINT `Option_evaluationCriteriaId_fkey` FOREIGN KEY (`evaluationCriteriaId`) REFERENCES `EvaluationCriteria`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
