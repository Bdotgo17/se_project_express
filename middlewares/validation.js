const { Joi, celebrate } = require('celebrate');
const validator = require('validator');

// You can now define and export your validation schemas and celebrate middlewares here.
// Example:
// const userValidation = celebrate({
//   body: Joi.object().keys({
//     email: Joi.string().email().required(),
//     password: Joi.string().min(8).required(),
//   }),
// });

// module.exports = { userValidation };

// Custom Joi extension for URL validation using validator
const joiUrl = Joi.string().custom((value, helpers) => {
  if (!validator.isURL(value)) {
    return helpers.error('string.uri');
  }
  return value;
}, 'URL Validation');

// Custom URL validator for Joi
const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.uri');
};

// 1. Clothing item creation validation
const clothingItemValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    weather: Joi.string().required(),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'The "imageUrl" field must be a valid url',
    }),
  }),
});

// User creation validation
const userCreationValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "avatar" field must be filled in',
      "string.uri": 'The "avatar" field must be a valid url',
    }),
    email: Joi.string().email().required().messages({
      "string.empty": 'The "email" field must be filled in',
      "string.email": 'The "email" field must be a valid email',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

// Login validation
const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required().messages({
      "string.empty": 'The "email" field must be filled in',
      "string.email": 'The "email" field must be a valid email',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

// 4. ID validation (for user and clothing item IDs)
const idValidation = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().hex().length(24),
    userId: Joi.string().hex().length(24),
  }),
});

const validateId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().hex().length(24).required(),
    userId: Joi.string().hex().length(24).required(),
  }),
});

module.exports = {
  clothingItemValidation,
  userCreationValidation,
  loginValidation,
  idValidation,
  validateId,
};