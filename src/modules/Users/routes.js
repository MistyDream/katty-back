const Joi = require('joi');
const Controllers = require('./userController');

/*
 * Public schema accessible for everyone
*/
const publicSchema = {
  firstname: Joi.string(),
  username: Joi.string(),
  peoples_meet: Joi.number().allow(null),
  updatedAt: Joi.date(),
  createdAt: Joi.date(),
};

/*
** Private schema
*/
const privateSchema = {
  firstname: Joi.string(),
  lastname: Joi.string(),
  username: Joi.string(),
  peoples_meet: Joi.number().allow(null),
  email: Joi.string().email({ minDomainAtoms: 2 }),
  token: Joi.string().optional(),
  updatedAt: Joi.date(),
  createdAt: Joi.date(),
};

module.exports = [
  {
    method: 'GET',
    path: '/user/{id}',
    handler: Controllers.UserController.getUserById,
    options: {
      auth: false,
      description: 'Get public user profile',
      notes: 'Returns a user profile by the id passed in the path.',
      tags: ['api'],
      response: {
        options: {
          allowUnknown: true,
          stripUnknown: true,
          abortEarly: false,
        },
        modify: true,
        status: {
          200: publicSchema,
        },
      },
    },
  },
  {
    method: 'GET',
    path: '/user/me',
    handler: Controllers.UserController.getCurrentProfile,
    options: {
      auth: 'jwt',
      description: 'Get profile from current user',
      notes: 'Returns the profile of the currently connected user.',
      tags: ['api'],
      response: {
        options: {
          allowUnknown: true,
          abortEarly: false,
          stripUnknown: true,
        },
        modify: true,
        status: {
          200: privateSchema,
        },
      },
    },
  },
  {
    method: ['POST'],
    path: '/user/login',
    handler: Controllers.UserController.login,

    options: {
      auth: false,
      description: 'User login',
      notes: 'Login user with email and password',
      tags: ['api'],
      response: {
        options: {
          allowUnknown: true,
          stripUnknown: true,
          abortEarly: false,
        },
        modify: true,
        status: {
          200: privateSchema,
        },
      },
      validate: {
        payload: {
          email: Joi.string().email({ minDomainAtoms: 2 }),
          password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
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
      description: 'User registration',
      notes: 'Registration process with controls on email and username.',
      tags: ['api'],
      response: {
        options: {
          allowUnknown: true,
          stripUnknown: true,
          abortEarly: false,
        },
        modify: true,
        status: {
          200: privateSchema,
        },
      },
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
