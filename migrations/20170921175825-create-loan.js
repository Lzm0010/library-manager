'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Loans', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      book_id: {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        references: {
          model: 'Books',
          key: 'id'
        },
        allowNull: false
      },
      patron_id: {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        references: {
          model: 'Patrons',
          key: 'id'
        },
        allowNull: false
      },
      loaned_on: {
        type: Sequelize.DATE
      },
      return_by: {
        type: Sequelize.DATE
      },
      returned_on: {
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Loans');
  }
};
