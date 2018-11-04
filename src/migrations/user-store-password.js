module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('Users', 'password', {
    type: Sequelize.STRING,
  }),
  down: queryInterface => queryInterface.removeColumn('Users', 'password'),
};
