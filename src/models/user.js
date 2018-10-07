module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      firstname: DataTypes.STRING,
      lastname: DataTypes.STRING,
      email: DataTypes.STRING,
      username: DataTypes.STRING,
      peoples_meet: DataTypes.INTEGER,
      password: DataTypes.STRING,
    },
    {},
  );
  return User;
};
