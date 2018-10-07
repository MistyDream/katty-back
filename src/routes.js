const Joi = require('joi');
const Controllers = require('./controllers/userController');

const dataSchema = {
  firstname: Joi.string(),
  lastname: Joi.string(),
  username: Joi.string(),
  peoples_meet: Joi.number().allow(null),
  email: Joi.string().email({ minDomainAtoms: 2 }),
};

module.exports = [
  {
    method: 'GET',
    path: '/user/{id}',
    handler: Controllers.UserController.getUserById,
    options: {
      auth: false,
      description: 'Get user profile',
      notes:
        'Returns a user profile by the id passed in the path. You must be authenticated to access it',
      tags: ['api'], // ADD THIS TAG
      response: {
        options: {
          allowUnknown: true,
          abortEarly: false,
          stripUnknown: true,
        },
        modify: true,
        status: {
          200: dataSchema,
        },
      },
    },
  },
  {
    method: ['POST'],
    path: '/user/register',
    handler: Controllers.UserController.register,

    options: {
      auth: false,
      validate: {
        payload: {
          username: Joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required(),
          firstname: Joi.string()
            .min(3)
            .max(100),
          lastname: Joi.string()
            .min(3)
            .max(100),
          email: Joi.string().email({ minDomainAtoms: 2 }),
          password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
        },
      },
    },
  },
];
