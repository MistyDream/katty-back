const Boom = require('boom');
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
const models = require('../models');

const { Op } = Sequelize;

class UserController {
  static async getUserById(request) {
    const { id } = request.params;
    if (id) {
      const user = await models.User.findById(id).then(result => result);
      if (!user) {
        return Boom.notFound('User cannot be found');
      }
      return user.dataValues;
    }
    return Boom.badRequest('You must pass a valid identifier');
  }

  static async register(request) {
    const data = request.payload;
    const { email, username, password } = data;

    // Hash password
    const hashingPassword = bcrypt.hash(password, 10, (err, hash) => {
      data.password = hash;
    });

    // Check if an account already exist
    await models.User.findOne({
      where: {
        [Op.or]: [{ username }, { email }],
      },
    }).then((user) => {
      if (user) {
        if (user.email === email) {
          throw Boom.badRequest('An account already exist with this email address');
        }
        if (user.username === username) {
          throw Boom.badRequest('An account already exist with this username');
        }
      }
      return user;
    });

    await hashingPassword;
    const createdUser = models.User.create(data);
    delete createdUser.password;

    return createdUser;
  }
}

module.exports.UserController = UserController;
