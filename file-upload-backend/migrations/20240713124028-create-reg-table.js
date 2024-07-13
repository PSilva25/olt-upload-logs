'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Regs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      olt: {
        type: Sequelize.STRING
      },
      slot: {
        type: Sequelize.STRING
      },
      port: {
        type: Sequelize.STRING
      },
      ont_id: {
        type: Sequelize.STRING
      },
      sn: {
        type: Sequelize.STRING
      },
      run_state: {
        type: Sequelize.STRING
      },
      config_state: {
        type: Sequelize.STRING
      },
      match_state: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Regs');
  }
};