const languageModel = require('../models/languageModel'); 

exports.addOrUpdateLanguage = async (req, res) => {
  try {
    const {
      languageName,
      readingAbility: rawReadingAbility,
      writingAbility: rawWritingAbility,
      speakingAbility: rawSpeakingAbility,
    } = req.body;

    const validAbilities = ['None', 'Basic', 'Intermediate', 'Fluent'];

    if (!validAbilities.includes(rawReadingAbility) ||
        !validAbilities.includes(rawWritingAbility) ||
        !validAbilities.includes(rawSpeakingAbility)) {
      return res.status(400).json({ error: 'Invalid ability value' });
    }

    // Use the language model to upsert language data
    await languageModel.upsertLanguage(req.user.id, {
      languageName,
      readingAbility: rawReadingAbility,
      writingAbility: rawWritingAbility,
      speakingAbility: rawSpeakingAbility,
    });

    res.status(200).json({ message: 'Your Language information has been successfully updated' });

  } catch (error) {
    console.error('Error updating Language information:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getLanguages = async (req, res) => {
  try {
    const languages = await languageModel.getLanguagesByApplicantID(req.user.id);
    res.status(200).json(languages);
  } catch (error) {
    console.error('Error fetching languages information:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
