var models  = require('../models');
var express = require('express');
var router = express.Router();
var moment = require('moment');
var formatDate = require('../utils/utils');

/* GET loans listing. */
router.get('/', function(req, res, next) {
  if(req.query.filter==="overdue"){

    models.Loan.findAll({
      where: {
        returned_on: null,
        return_by: {
          lte: new Date()
        }
      },
      include: [
        {model: models.Patron},
        {model: models.Book}
      ]
    })
    .then(function(loans){
      res.render('all_loans', {
        loans: loans,
        formatDate
      });
    })
    .catch(err => {
      res.send(500);
    });

  } else if (req.query.filter === "checked_out"){

    models.Loan.findAll({
      where: {
        returned_on: null
      },
      include: [
        {model: models.Patron},
        {model: models.Book}
      ]
    })
    .then(function(loans){
      res.render('all_loans', {
        loans: loans,
        formatDate
      });
    })
    .catch(err => {
      res.send(500);
    });

  } else {

    models.Loan.findAll({
      include: [
        {model: models.Patron},
        {model: models.Book}
      ]
    })
    .then(function(loans){
      res.render('all_loans', {
        loans: loans,
        formatDate
      });
    })
    .catch(err => {
      res.send(500);
    });

  }
});

/* POST loans listing. */
router.post('/new', function(req, res, next){
  const booksQuery = models.Book.findAll();
  const patronsQuery = models.Patron.findAll();
  const today = moment().utc().format("YYYY-MM-DD");
  const sevenDaysFromNow = moment().add(7, 'd').format("YYYY-MM-DD");

  models.Loan.create(req.body).then(function(loan){
    res.redirect('/loans');
  })
  .catch(err => {
    if (err.name === "SequelizeValidationError"){
      Promise.all([booksQuery, patronsQuery]).then(results => {
        res.render('new_loan', {
          loan: models.Loan.build(req.body),
          books: results[0],
          patrons: results[1],
          today: today,
          sevenDaysFromNow: sevenDaysFromNow,
          errors: err.errors
        });
      });
    } else {
      throw err;
    }
  })
  .catch(err => {
    res.sendStatus(500);
  });
});

/* GET new loans page. */
router.get('/new', function(req, res, next){
  const booksQuery = models.Book.findAll();
  const patronsQuery = models.Patron.findAll();
  const today = moment().utc().format("YYYY-MM-DD");
  const sevenDaysFromNow = moment().add(7, 'd').format("YYYY-MM-DD");

  Promise.all([booksQuery, patronsQuery]).then(results => {
    res.render('new_loan', {
      loan: models.Loan.build(),
      books: results[0],
      patrons: results[1],
      today: today,
      sevenDaysFromNow: sevenDaysFromNow
    });
  })
  .catch(err => {
    res.send(500);
  });
});

/* GET Return Book page. */
router.get('/:id', function(req, res, next){
  const today = moment().utc().format("YYYY-MM-DD");

  models.Loan.findOne({
    where: {id: req.params.id},
    include: [
      {model: models.Patron},
      {model: models.Book}
    ]
  })
  .then(loan => {
    if(loan){
      res.render('return_book', {
        today,
        loan,
        formatDate
      });
    } else {
      res.send(404);
    }
  })
  .catch(err => {
    res.send(404);
  });
});

/* UPDATE Loan by id. */
router.post('/:id', function(req, res, next){
  const today = moment().utc().format("YYYY-MM-DD");
  const errors = [];

  if(!req.body.returned_on){
    errors.push({message: "Please add a returned on date"});
  }

  if (errors.length > 0) {
    models.Loan.findOne({
      where: {id: req.params.id},
      include: [
        {model: models.Patron},
        {model: models.Book}
      ]
    }).then(function(loan){
      res.render('return_book', {
        loan,
        errors,
        today,
        formatDate
      }).catch(err => {
        res.send(500);
      });
    });
  } else {
    models.Loan.findById(req.params.id).then(loan => {
      loan.update(req.body).then(loan => {
        res.redirect('/loans');
      });
    });
  }

});


module.exports = router;
