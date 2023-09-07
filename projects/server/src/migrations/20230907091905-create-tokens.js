'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
<<<<<<<< HEAD:projects/server/src/migrations/20230904075248-create-branches.js
    await queryInterface.createTable('Branches', {
========
    await queryInterface.createTable('Tokens', {
>>>>>>>> origin/OGWA-15-,OGWA-19&OGWA-20:projects/server/src/migrations/20230907091905-create-tokens.js
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
<<<<<<<< HEAD:projects/server/src/migrations/20230904075248-create-branches.js
      name: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      logitude: {
        type: Sequelize.STRING
      },
      latitude: {
========
      token: {
>>>>>>>> origin/OGWA-15-,OGWA-19&OGWA-20:projects/server/src/migrations/20230907091905-create-tokens.js
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
<<<<<<<< HEAD:projects/server/src/migrations/20230904075248-create-branches.js
    await queryInterface.dropTable('Branches');
========
    await queryInterface.dropTable('Tokens');
>>>>>>>> origin/OGWA-15-,OGWA-19&OGWA-20:projects/server/src/migrations/20230907091905-create-tokens.js
  }
};