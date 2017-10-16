var models  = require('../models');
var express = require('express');
var router = express.Router();
var formatDate = require('../utils/utils');

/* GET patrons listing. */
router.get('/', function(req, res, next) {
  models.Patron.findAll({
    include: [{
      model: models.Loan
    }]
  })
  .then(function(patrons){
    res.render('all_patrons', {
      patrons: patrons
    });
  })
  .catch(err => {
    res.send(500);
  });
});

/* POST patrons listing. */
router.post('/new', function(req, res, next){
  models.Patron.create(req.body).then(function(patron){
    res.redirect('/patrons');
  })
  .catch(err => {
    if (err.name === "SequelizeValidationError"){
      res.render('new_patron', {
        book: models.Patron.build(req.body),
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


/* GET new patrons page. */
router.get('/new', function(req, res, next){
  res.render('new_patron', {patron: models.Patron.build()});
});

/* GET patron by id */
router.get('/:id', function(req, res, next){
  const patronQuery = models.Patron.findById(req.params.id);
  const loansQuery = models.Loan.findAll({
    include: [{
      model: models.Book
    }],
    where: {
      patron_id: req.params.id
    }
  });

  Promise.all([patronQuery, loansQuery])
    .then(results => {
      if (results) {
        res.render('patron_detail', {
          patron: results[0],
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

/* UPDATE patron by id */
router.post('/:id', function(req, res, next){
  const patronQuery = models.Patron.findById(req.params.id);
  const loansQuery = models.Loan.findAll({
    include: [{
      model: models.Book
    }],
    where: {
      patron_id: req.params.id
    }
  });

  Promise.all([patronQuery, loansQuery]).then(results => {
    models.Patron.update(req.body, {where: [{ id: req.params.id }] }).then((newPatron) => {
      res.redirect('/patrons');
    })
    .catch(err => {
      if (err.name === 'SequelizeValidationError') {
        res.render('patron_detail', {
          patron: results[0],
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
