-- CreateEnum
CREATE TYPE "ReadingAbility" AS ENUM ('None', 'Basic', 'Intermediate', 'Fluent');

-- CreateEnum
CREATE TYPE "WritingAbility" AS ENUM ('None', 'Basic', 'Intermediate', 'Fluent');

-- CreateEnum
CREATE TYPE "SpeakingAbility" AS ENUM ('None', 'Basic', 'Intermediate', 'Fluent');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female', 'Other');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('Applied', 'Longlisted', 'ShortListed', 'Interviewing', 'BackgroundChecks', 'VerifyingDocuments', 'Onboarding', 'Unsuccessful');

-- CreateEnum
CREATE TYPE "VacancyStatus" AS ENUM ('Posted', 'Cancelled', 'Archived');

-- CreateTable
CREATE TABLE "Applicant" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "verificationToken" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "tokenExpiry" TIMESTAMP(3),
    "loginAttempts" INTEGER NOT NULL DEFAULT 0,
    "otp" TEXT,
    "newOTP" TEXT,
    "otpExpiry" TIMESTAMP(3),
    "loginOTP" TEXT,
    "loginOTPExpiry" TIMESTAMP(3),
    "deviceToken" TEXT,
    "lastOtpValidation" TIMESTAMP(3),
    "sessionToken" TEXT,
    "activeSessionToken" TEXT,

    CONSTRAINT "Applicant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SMTP_Setup" (
    "id" SERIAL NOT NULL,
    "smtpServer" TEXT NOT NULL,
    "smtpServerPort" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SMTP_Setup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Personal" (
    "id" SERIAL NOT NULL,
    "applicantID" INTEGER NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "nationality" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "street" TEXT NOT NULL,
    "houseNumber" TEXT NOT NULL,
    "town" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "alternativePhoneNumber" TEXT,
    "alternativeEmail" TEXT,
    "availability" INTEGER NOT NULL,

    CONSTRAINT "Personal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Education" (
    "id" SERIAL NOT NULL,
    "applicantID" INTEGER NOT NULL,
    "institution" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "level" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "certificateName" TEXT NOT NULL,
    "issuingInstitution" TEXT NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "yearOfIssue" INTEGER NOT NULL,

    CONSTRAINT "Education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Experience" (
    "id" SERIAL NOT NULL,
    "applicantID" INTEGER NOT NULL,
    "employerName" TEXT NOT NULL,
    "workArea" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "functionalTitle" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "noOfEmployeesSupervised" TEXT NOT NULL,
    "descriptionOfDuties" TEXT NOT NULL,
    "majorAchievements" TEXT NOT NULL,
    "leavingReasons" TEXT NOT NULL,

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" SERIAL NOT NULL,
    "applicantID" INTEGER NOT NULL,
    "skillDescription" TEXT NOT NULL,
    "yearsOfExperience" INTEGER NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Language" (
    "id" SERIAL NOT NULL,
    "applicantID" INTEGER NOT NULL,
    "languageName" TEXT NOT NULL,
    "readingAbility" "ReadingAbility" NOT NULL,
    "writingAbility" "WritingAbility" NOT NULL,
    "speakingAbility" "SpeakingAbility" NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" SERIAL NOT NULL,
    "applicantID" INTEGER NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" SERIAL NOT NULL,
    "vacancyCode" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "vacancyDeadline" TIMESTAMP(3) NOT NULL,
    "vacancyStatus" "VacancyStatus" NOT NULL DEFAULT 'Posted',
    "selectedValue" TEXT NOT NULL,
    "applicantFirstName" TEXT NOT NULL,
    "applicantMiddleName" TEXT,
    "applicantLastName" TEXT NOT NULL,
    "applicantLocation" TEXT NOT NULL,
    "applicantAvailability" INTEGER NOT NULL,
    "applicantGender" TEXT NOT NULL,
    "applicantAlternativeEmail" TEXT,
    "applicantID" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "applicationStatus" "ApplicationStatus" NOT NULL DEFAULT 'Applied',

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "applicationID" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Applicant_email_key" ON "Applicant"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Personal_applicantID_key" ON "Personal"("applicantID");

-- CreateIndex
CREATE UNIQUE INDEX "Education_applicantID_key" ON "Education"("applicantID");

-- CreateIndex
CREATE UNIQUE INDEX "Experience_applicantID_key" ON "Experience"("applicantID");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_applicantID_skillDescription_key" ON "Skill"("applicantID", "skillDescription");

-- CreateIndex
CREATE UNIQUE INDEX "Language_applicantID_key" ON "Language"("applicantID");

-- CreateIndex
CREATE UNIQUE INDEX "Attachment_applicantID_key" ON "Attachment"("applicantID");

-- AddForeignKey
ALTER TABLE "Personal" ADD CONSTRAINT "Personal_applicantID_fkey" FOREIGN KEY ("applicantID") REFERENCES "Applicant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Education" ADD CONSTRAINT "Education_applicantID_fkey" FOREIGN KEY ("applicantID") REFERENCES "Applicant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Experience" ADD CONSTRAINT "Experience_applicantID_fkey" FOREIGN KEY ("applicantID") REFERENCES "Applicant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_applicantID_fkey" FOREIGN KEY ("applicantID") REFERENCES "Applicant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Language" ADD CONSTRAINT "Language_applicantID_fkey" FOREIGN KEY ("applicantID") REFERENCES "Applicant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_applicantID_fkey" FOREIGN KEY ("applicantID") REFERENCES "Applicant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_applicantID_fkey" FOREIGN KEY ("applicantID") REFERENCES "Applicant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "cover_letter_file_fkey" FOREIGN KEY ("applicationID") REFERENCES "Application"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "resume_file_fkey" FOREIGN KEY ("applicationID") REFERENCES "Application"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "other_file_fkey" FOREIGN KEY ("applicationID") REFERENCES "Application"("id") ON DELETE SET NULL ON UPDATE CASCADE;
