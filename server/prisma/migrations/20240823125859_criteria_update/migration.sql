/*
  Warnings:

  - Added the required column `createdByEmail` to the `EvaluationCriteria` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `EvaluationCriteria` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `file` DROP FOREIGN KEY `other_file_fkey`;

-- DropForeignKey
ALTER TABLE `file` DROP FOREIGN KEY `resume_file_fkey`;

-- AlterTable
ALTER TABLE `evaluationcriteria` ADD COLUMN `createdByEmail` VARCHAR(191) NOT NULL,
    ADD COLUMN `createdById` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `resume_file_fkey` FOREIGN KEY (`applicationID`) REFERENCES `Application`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `other_file_fkey` FOREIGN KEY (`applicationID`) REFERENCES `Application`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EvaluationCriteria` ADD CONSTRAINT `EvaluationCriteria_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `staff`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
