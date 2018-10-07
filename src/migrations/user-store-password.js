module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('Users', 'password', {
    type: Sequelize.STRING,
  }),
  down: (queryInterface, Sequelize) => queryInterface.removeColumn('Users', 'password'),
};
