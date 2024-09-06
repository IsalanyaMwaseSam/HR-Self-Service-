-- CreateTable
CREATE TABLE `Applicant` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `verificationToken` VARCHAR(191) NULL,
    `verified` BOOLEAN NOT NULL DEFAULT false,
    `tokenExpiry` DATETIME(3) NULL,
    `loginAttempts` INTEGER NOT NULL DEFAULT 0,
    `otp` VARCHAR(191) NULL,
    `newOTP` VARCHAR(191) NULL,
    `otpExpiry` DATETIME(3) NULL,
    `loginOTP` VARCHAR(191) NULL,
    `loginOTPExpiry` DATETIME(3) NULL,
    `deviceToken` VARCHAR(191) NULL,
    `lastOtpValidation` DATETIME(3) NULL,
    `sessionToken` VARCHAR(191) NULL,
    `activeSessionToken` VARCHAR(191) NULL,

    UNIQUE INDEX `Applicant_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SMTP_Setup` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `smtpServer` VARCHAR(191) NOT NULL,
    `smtpServerPort` INTEGER NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Personal` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `applicantID` INTEGER NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `middleName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `dob` DATETIME(3) NOT NULL,
    `nationality` VARCHAR(191) NOT NULL,
    `gender` ENUM('Male', 'Female', 'Other') NOT NULL,
    `street` VARCHAR(191) NOT NULL,
    `houseNumber` VARCHAR(191) NOT NULL,
    `town` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `postalCode` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `alternativePhoneNumber` VARCHAR(191) NULL,
    `alternativeEmail` VARCHAR(191) NULL,
    `availability` INTEGER NOT NULL,

    UNIQUE INDEX `Personal_applicantID_key`(`applicantID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Education` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `applicantID` INTEGER NOT NULL,
    `institution` VARCHAR(191) NOT NULL,
    `degree` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `level` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Education_applicantID_title_key`(`applicantID`, `title`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Certificate` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `applicantID` INTEGER NOT NULL,
    `certificateName` VARCHAR(191) NOT NULL,
    `issuingInstitution` VARCHAR(191) NOT NULL,
    `registrationNumber` VARCHAR(191) NOT NULL,
    `yearOfIssue` INTEGER NOT NULL,

    UNIQUE INDEX `Certificate_applicantID_certificateName_key`(`applicantID`, `certificateName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Experience` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `applicantID` INTEGER NOT NULL,
    `employerName` VARCHAR(191) NOT NULL,
    `workArea` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `functionalTitle` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `noOfEmployeesSupervised` VARCHAR(191) NOT NULL,
    `descriptionOfDuties` VARCHAR(191) NOT NULL,
    `majorAchievements` VARCHAR(191) NOT NULL,
    `leavingReasons` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Experience_applicantID_employerName_startDate_key`(`applicantID`, `employerName`, `startDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Skill` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `applicantID` INTEGER NOT NULL,
    `skillDescription` VARCHAR(191) NOT NULL,
    `yearsOfExperience` INTEGER NOT NULL,

    UNIQUE INDEX `Skill_applicantID_skillDescription_key`(`applicantID`, `skillDescription`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Language` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `applicantID` INTEGER NOT NULL,
    `languageName` VARCHAR(191) NOT NULL,
    `readingAbility` ENUM('None', 'Basic', 'Intermediate', 'Fluent') NOT NULL,
    `writingAbility` ENUM('None', 'Basic', 'Intermediate', 'Fluent') NOT NULL,
    `speakingAbility` ENUM('None', 'Basic', 'Intermediate', 'Fluent') NOT NULL,

    UNIQUE INDEX `Language_applicantID_languageName_key`(`applicantID`, `languageName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Attachment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `applicantID` INTEGER NOT NULL,
    `fileType` VARCHAR(191) NOT NULL,
    `fileName` VARCHAR(191) NOT NULL,
    `fileSize` INTEGER NOT NULL,
    `url` VARCHAR(191) NULL,
    `lastUpdated` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Attachment_applicantID_key`(`applicantID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Application` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `vacancyCode` VARCHAR(191) NOT NULL,
    `department` VARCHAR(191) NOT NULL,
    `vacancyDeadline` DATETIME(3) NOT NULL,
    `vacancyStatus` ENUM('Posted', 'Cancelled', 'Archived') NOT NULL DEFAULT 'Posted',
    `selectedValue` VARCHAR(191) NOT NULL,
    `applicantFirstName` VARCHAR(191) NOT NULL,
    `applicantMiddleName` VARCHAR(191) NULL,
    `applicantLastName` VARCHAR(191) NOT NULL,
    `applicantLocation` VARCHAR(191) NOT NULL,
    `applicantAvailability` INTEGER NOT NULL,
    `applicantGender` VARCHAR(191) NOT NULL,
    `applicantAlternativeEmail` VARCHAR(191) NULL,
    `applicantID` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `applicationStatus` ENUM('Applied', 'Longlisted', 'ShortListed', 'Interviewing', 'BackgroundChecks', 'VerifyingDocuments', 'Onboarding', 'Unsuccessful') NOT NULL DEFAULT 'Applied',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `File` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NOT NULL,
    `fileName` VARCHAR(191) NOT NULL,
    `fileType` VARCHAR(191) NOT NULL,
    `applicationID` INTEGER NULL,
    `category` ENUM('COVER_LETTER', 'RESUME', 'OTHER') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Personal` ADD CONSTRAINT `Personal_applicantID_fkey` FOREIGN KEY (`applicantID`) REFERENCES `Applicant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Education` ADD CONSTRAINT `Education_applicantID_fkey` FOREIGN KEY (`applicantID`) REFERENCES `Applicant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Certificate` ADD CONSTRAINT `Certificate_applicantID_fkey` FOREIGN KEY (`applicantID`) REFERENCES `Applicant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Experience` ADD CONSTRAINT `Experience_applicantID_fkey` FOREIGN KEY (`applicantID`) REFERENCES `Applicant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Skill` ADD CONSTRAINT `Skill_applicantID_fkey` FOREIGN KEY (`applicantID`) REFERENCES `Applicant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Language` ADD CONSTRAINT `Language_applicantID_fkey` FOREIGN KEY (`applicantID`) REFERENCES `Applicant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attachment` ADD CONSTRAINT `Attachment_applicantID_fkey` FOREIGN KEY (`applicantID`) REFERENCES `Applicant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Application` ADD CONSTRAINT `Application_applicantID_fkey` FOREIGN KEY (`applicantID`) REFERENCES `Applicant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `cover_letter_file_fkey` FOREIGN KEY (`applicationID`) REFERENCES `Application`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `resume_file_fkey` FOREIGN KEY (`applicationID`) REFERENCES `Application`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `other_file_fkey` FOREIGN KEY (`applicationID`) REFERENCES `Application`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
