var models  = require('../models');
var express = require('express');
var router = express.Router();
var formatDate = require('../utils/utils');

let filter;

/* GET books listing. */
router.get('/', function(req, res, next) {
  if(req.query.filter === "overdue"){

    models.Book.findAll({
      include: [
        {
          model: models.Loan,
          where: {
            returned_on: null,
            return_by: {
              lte: new Date()
            }
          }
        }
      ]
    })
    .then(function(books){
      res.render('all_books', {
        books: books
      });
    })
    .catch(err => {
      res.send(500);
    });

  } else if (req.query.filter === "checked_out"){

    models.Book.findAll({
      include: [
        {
          model: models.Loan,
          where: {
            returned_on: null
          }
        }
      ]
    })
    .then(function(books){
      res.render('all_books', {
        books: books
      });
    })
    .catch(err => {
      res.send(500);
    });

  } else {

    models.Book.findAll().then(function(books){
      res.render('all_books', {
        books: books
      });
    })
    .catch(err => {
      res.send(500);
    });

  }

});

/* POST books listing. */
router.post('/new', function(req, res, next){
  models.Book.create(req.body).then(function(book){
    res.redirect('/books');
  })
  .catch(err => {
    if (err.name === "SequelizeValidationError"){
      res.render('new_book', {
        book: models.Book.build(req.body),
        errors: err.errors
      });
    } else {
      throw err;
    }
  })
  .catch(err => {
    res.send(500);
  });
});

/* GET new books page. */
router.get('/new', function(req, res, next) {
  res.render('new_book', {book: models.Book.build()});
})

/* GET book by id page. */
router.get('/:id', function(req, res, next) {
  const bookQuery = models.Book.findById(req.params.id);
  const loansQuery = models.Loan.findAll({
    include: [{
      model: models.Patron
    }],
    where: {
      book_id: req.params.id
    }
  });

  Promise.all([bookQuery, loansQuery])
    .then(results => {
      if(results){
        res.render('book_detail', {
          book: results[0],
          loans: results[1],
          formatDate
        });
      } else {
        res.send(404);
      }
    })
    .catch(err => {
      res.send(500);
    });

});

/* UPDATE book by id */
router.post('/:id', function(req, res, next){
  const bookQuery = models.Book.findById(req.params.id);
  const loansQuery = models.Loan.findAll({
    include: [{
      model: models.Patron
    }],
    where: {
      book_id: req.params.id
    }
  });

  Promise.all([bookQuery, loansQuery]).then(results => {
    models.Book.update(req.body, { where: [{ id: req.params.id }] }).then((newBook) => {
      res.redirect('/books');
    })
    .catch(err => {
      if (err.name === 'SequelizeValidationError') {
        res.render('book_detail', {
          book: results[0],
          loans: results[1],
          errors: err.errors,
          formatDate
        });
      } else {
        throw err;
      }
    })
    .catch(err => {
      res.send(500);
    });

  });
});


module.exports = router;
