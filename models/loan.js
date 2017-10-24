'use strict';
module.exports = (sequelize, DataTypes) => {
  var Loan = sequelize.define('Loan', {
    book_id: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: "Must be associated to a book"
        }
      }
    },
    patron_id: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: "Must be associated to a patron"
        }
      }
    },
    loaned_on: {
      type: DataTypes.DATE,
      validate: {
        notEmpty: {
          msg: "Must be loaned on a date"
        }
      }
    },
    return_by: {
      type: DataTypes.DATE,
      validate: {
        notEmpty: {
          msg: "Must have a return date"
        }
      }
    },
    returned_on: DataTypes.DATE
  });

  Loan.associate = function(models) {
    Loan.belongsTo(models.Book, {
      onDelete: "CASCADE",
      foreignKey: {
        name: 'book_id'
      }
    });

    Loan.belongsTo(models.Patron, {
      onDelete: "CASCADE",
      foreignKey: {
        name: 'patron_id'
      }
    });
  };

  return Loan;
};
