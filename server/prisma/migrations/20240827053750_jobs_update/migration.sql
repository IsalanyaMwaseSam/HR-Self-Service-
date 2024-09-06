-- DropForeignKey
ALTER TABLE `file` DROP FOREIGN KEY `other_file_fkey`;

-- DropForeignKey
ALTER TABLE `file` DROP FOREIGN KEY `resume_file_fkey`;

-- CreateTable
CREATE TABLE `PostedJob` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `vacancyCode` VARCHAR(191) NOT NULL,
    `SystemId` VARCHAR(191) NOT NULL,
    `positionCode` VARCHAR(191) NOT NULL,
    `jobTitle` VARCHAR(191) NOT NULL,
    `orgDepartment` VARCHAR(191) NOT NULL,
    `dutyStation` VARCHAR(191) NOT NULL,
    `contractType` VARCHAR(191) NOT NULL,
    `duration` VARCHAR(191) NOT NULL,
    `applicationPeriod` VARCHAR(191) NOT NULL,
    `evaluationCriteriaId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `PostedJob_vacancyCode_key`(`vacancyCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `resume_file_fkey` FOREIGN KEY (`applicationID`) REFERENCES `Application`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `other_file_fkey` FOREIGN KEY (`applicationID`) REFERENCES `Application`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PostedJob` ADD CONSTRAINT `PostedJob_evaluationCriteriaId_fkey` FOREIGN KEY (`evaluationCriteriaId`) REFERENCES `EvaluationCriteria`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
