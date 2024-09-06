/*
  Warnings:

  - Added the required column `criterionId` to the `Criterion` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `file` DROP FOREIGN KEY `other_file_fkey`;

-- DropForeignKey
ALTER TABLE `file` DROP FOREIGN KEY `resume_file_fkey`;

-- DropForeignKey
ALTER TABLE `option` DROP FOREIGN KEY `Option_id_fkey`;

-- DropIndex
DROP INDEX `Option_criterionId_fkey` ON `option`;

-- AlterTable
ALTER TABLE `criterion` ADD COLUMN `criterionId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `resume_file_fkey` FOREIGN KEY (`applicationID`) REFERENCES `Application`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `other_file_fkey` FOREIGN KEY (`applicationID`) REFERENCES `Application`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Option` ADD CONSTRAINT `Option_criterionId_fkey` FOREIGN KEY (`criterionId`) REFERENCES `Criterion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
