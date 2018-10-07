const Boom = require('boom');
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const models = require('../../models');

const env = process.env.NODE_ENV || 'development';
const config = require('../../config/general.js')[env];

const { Op } = Sequelize;

class UserController {
  /**
   * Login user with provided credentials
   * Return user with valid token
   * @param {request} request - Request object
   */
  static async login(request) {
    const { email, password } = request.payload;

    const userDb = await models.User.findOne({ where: { email } }).then(user => user);
    if (userDb != null) {
      if (bcrypt.compareSync(password, userDb.password)) {
        const jwtContent = {
          id: userDb.id,
          email: userDb.email,
          username: userDb.username,
        };

        userDb.dataValues.token = JWT.sign(jwtContent, config.jwt_secret);
        return userDb.dataValues;
      }
    }
    throw Boom.unauthorized('Cannot login with provided credentials');
  }

  /**
   * Get profile from current logged user
   * @param {request} request - Request object
   */
  static async getCurrentProfile(request) {
    request.params.id = request.auth.credentials.id;
    return UserController.getUserById(request);
  }

  /**
   * Get user object by id
   * @param {request} request - Request object
   */
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

  /**
   * Register user
   * @param {request} request - Request object
   */
  static async register(request) {
    const data = request.payload;
    const { email, username, password } = data;

    // Check if an account already exist with same username or email
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
    data.password = bcrypt.hashSync(password, 8);
    const createdUser = await models.User.create(data);

    return createdUser.dataValues;
  }
}

module.exports.UserController = UserController;
