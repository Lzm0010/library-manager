'use strict';
module.exports = (sequelize, DataTypes) => {
  var Book = sequelize.define('Book', {
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Must have a title"
        }
      }
    },
    author: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Must have an author"
        }
      }
    },
    genre: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Must have a genre"
        }
      }
    },
    first_published: DataTypes.INTEGER
  });

  Book.associate = function(models) {
    Book.hasMany(models.Loan, {foreignKey: "book_id"});
  };

  return Book;
};
