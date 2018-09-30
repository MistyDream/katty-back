const UserController = require('./controllers/user');

module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: () => 'Hello, world!',
  },
  {
    method: 'GET',
    path: '/user/{id}',
    handler: UserController.user,
  },
];
