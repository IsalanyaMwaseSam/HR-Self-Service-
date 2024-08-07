const validator = require('email-validator');
const deepEmailValidator = require('deep-email-validator');

// Validate email format
const isValidEmail = (email) => validator.validate(email);

const validateEmail = async (email) => {
  try {
    const result = await deepEmailValidator.validate(email);
    return result;
  } catch (error) {
    console.error('Deep Email Validator error:', error);
    return { valid: false, reason: 'Validation error' };
  }
};

module.exports = { isValidEmail, validateEmail };
