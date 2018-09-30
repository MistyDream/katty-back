const Joi = require('joi');
const UserController = require('./controllers/userController');

module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: () => 'Hello, world!',
  },
  {
    method: ['POST'],
    path: '/register',
    handler(request, h) {
      const controller = new UserController.UserController();
      controller.register(request.payload);
    },
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
          email: Joi.string()
            .min(3)
            .max(100),
          password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
        },
      },
    },
  },
];
