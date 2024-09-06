/*
  Warnings:

  - Added the required column `postedJobId` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `file` DROP FOREIGN KEY `other_file_fkey`;

-- DropForeignKey
ALTER TABLE `file` DROP FOREIGN KEY `resume_file_fkey`;

-- AlterTable
ALTER TABLE `application` ADD COLUMN `postedJobId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Application` ADD CONSTRAINT `Application_postedJobId_fkey` FOREIGN KEY (`postedJobId`) REFERENCES `PostedJob`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `resume_file_fkey` FOREIGN KEY (`applicationID`) REFERENCES `Application`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `other_file_fkey` FOREIGN KEY (`applicationID`) REFERENCES `Application`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
