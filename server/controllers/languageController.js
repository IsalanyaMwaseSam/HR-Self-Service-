const languageModel = require('../models/languageModel');

exports.addOrUpdateLanguage = async (req, res) => {
    try {
        const {
            languageName,
            readingAbility,
            writingAbility,
            speakingAbility,
        } = req.body;

        const validAbilities = ['None', 'Basic', 'Intermediate', 'Fluent'];

        if (!validAbilities.includes(readingAbility)) {
          return res.status(400).json({ 
              error: `Invalid ability value for readingAbility: ${readingAbility}` 
          });
        }
        if (!validAbilities.includes(writingAbility)) {
            return res.status(400).json({ 
                error: `Invalid ability value for writingAbility: ${writingAbility}` 
            });
        }
        if (!validAbilities.includes(speakingAbility)) {
            return res.status(400).json({ 
                error: `Invalid ability value for speakingAbility: ${speakingAbility}` 
            });
        }

        
        // Use the language model to upsert language data
        const updatedLanguage = await languageModel.upsertLanguage(req.user.id, {
            languageName,
            readingAbility,
            writingAbility,
            speakingAbility,
        });

        res.status(200).json(updatedLanguage);
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

exports.deleteLanguage = async (req, res) => {
  try {
      const { languageName } = req.params;

      await languageModel.deleteLanguage(req.user.id, languageName);

      res.status(204).send();
  } catch (error) {
      console.error('Error deleting language entry:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};
