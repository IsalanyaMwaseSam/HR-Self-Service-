const prisma = require('../prismaClient'); 

// Function to find or create a language record
async function upsertLanguage(applicantID, languageData) {
  try {
    const { languageName, readingAbility, writingAbility, speakingAbility } = languageData;

    // Upsert the language information
    return await prisma.language.upsert({
      where: { applicantID: applicantID },
      update: {
        languageName,
        readingAbility,
        writingAbility,
        speakingAbility,
      },
      create: {
        applicantID,
        languageName,
        readingAbility,
        writingAbility,
        speakingAbility,
      }
    });
  } catch (error) {
    throw new Error(`Error upserting language: ${error.message}`);
  }
}

// Function to get all languages for a specific applicant
async function getLanguagesByApplicantID(applicantID) {
  try {
    return await prisma.language.findMany({
      where: { applicantID }
    });
  } catch (error) {
    throw new Error(`Error fetching languages: ${error.message}`);
  }
}

module.exports = {
  upsertLanguage,
  getLanguagesByApplicantID
};
