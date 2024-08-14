const prisma = require('../prismaClient');

// Function to upsert language information
async function upsertLanguage(applicantID, languageData) {
    try {
        const { languageName, readingAbility, writingAbility, speakingAbility } = languageData;

        return await prisma.language.upsert({
            where: {
                applicantID_languageName: {
                    applicantID: applicantID,
                    languageName: languageName,
                }
            },
            update: {
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
            },
        });
    } catch (error) {
        throw new Error(`Error upserting language: ${error.message}`);
    }
}

// Function to delete a language entry
async function deleteLanguage(applicantID, languageName) {
  try {
      await prisma.language.delete({
          where: {
              applicantID_languageName: {
                  applicantID: applicantID,
                  languageName: languageName,
              }
          }
      });
  } catch (error) {
      throw new Error(`Error deleting language: ${error.message}`);
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
  getLanguagesByApplicantID,
  deleteLanguage
};


