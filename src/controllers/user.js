const models = require('../models');

exports.user = async (request) => {
  const { id } = request.params;
  if (id) {
    const user = await models.User.findById(id).then((result) => {
      return result;
    });
    return user.dataValues;
  }
  return '404';
};
