module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('Questions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM('dissertative', 'objective'),
        allowNull: false
      },
      keyWords: {
        type: Sequelize.JSON
      },
      alternatives: {
        type: Sequelize.JSON
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: Sequelize.DATE
    });
  },

  down(queryInterface) {
    return queryInterface.dropTable('Questions');
  }
};
