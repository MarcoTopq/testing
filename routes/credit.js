'use strict'
var express = require('express');
var router = express.Router();
var Credit = require('../models/credit');
var auth = require('../middleware/auth');
var expressJoi = require('express-joi-validator');
var Joi = require('joi');

var bodySchema = {
  body: {
    total_credit: Joi.number().required(),
    payment: Joi.number().required(),
    total_month: Joi.number().required(),
    month: Joi.number().required(),
    due_date: Joi.number().required(),
    arrears: Joi.number().required()
  }
};

var updateSchema = {
  body: {
    total_credit: Joi.number().allow(""),
    payment: Joi.number().allow(""),
    total_month: Joi.number().allow(""),
    month: Joi.number().allow(""),
    due_date: Joi.number().allow(""),
    arrears: Joi.number().allow("")
  }
};


router.post('/', auth.checkToken, auth.isAuthorized, expressJoi(bodySchema), async (req, res) => {
  var body = req.body;
  await Credit.create({
    total_credit: body.total_credit,
    payment: body.payment,
    total_month: body.total_month,
    month: body.month,
    due_date: body.due_date,
    arrears: body.arrears
  })
    .then(data => (res.json(data)))
    .catch(err => res.status(400).json(err))
  console.log(error)
});

router.get('/', auth.checkToken, auth.isAuthorized, async (req, res) => {
  await Credit.findAll()
    .then(data => (res.json(data)))
    .catch(err => res.status(400).json(err))
})

router.get('/:id', auth.checkToken, auth.isAuthorized, async (req, res) => {
  var Id = req.params.id;
  await Credit.findOne({
    where: {
      id: Id
    }
  })
    .then(data => {
      if (!data) {
        return res.json("Credit not found");
      }
      else {
        return res.json(data);
      }
    })
    .catch(err => res.status(400).json(err))
});

router.put('/:id', auth.checkToken, auth.isAuthorized, expressJoi(updateSchema), async (req, res) => {
  var Id = req.params.id;
  var body = req.body;
  await Credit.findOne({
    where: {
      id: Id
    }
  })
    .then(data => {
      if (!data) {
        return res.json("User not found");
      }
      else {
        Credit.update({
          total_credit: body.total_credit,
          payment: body.payment,
          total_month: body.total_month,
          month: body.month,
          due_date: body.due_date,
          arrears: body.arrears
        }, {
            where: {
              id: Id
            }
          })
      }
    })
    .then(data => {
      Credit.findOne({
        where: {
          id: Id
        }
      })
    })
    .then(data => (res.json(data)))
    .catch(err => res.status(400).json(err))
})

router.put('/payment/:id', auth.checkToken, auth.isAuthorized, expressJoi(updateSchema), async (req, res) => {
  var Id = req.params.id;
  var body = req.body;
  await Credit.findOne({
    where: {
      id: Id
    }
  })
    .then(data => {
      if (!data) {
        return res.json("User not found");
      }
      else {
        var current_total = data.total_credit - data.payment;
        var current_month = data.month - 1;
        Credit.update({
          total_credit: current_total,
          payment: body.payment,
          total_month: body.total_month,
          month: current_month,
          due_date: body.due_date,
          arrears: body.arrears
        }, {
            where: {
              id: Id
            }
          })
      }
    })
    .then(data => {
      Credit.findOne({
        where: {
          id: Id
        }
      })
    })
    .then(data => (res.json(data)))
    .catch(err => res.status(400).json(err))
})

router.put('/debt/:id', auth.checkToken, auth.isAuthorized, expressJoi(updateSchema), async (req, res) => {
  var Id = req.params.id;
  var body = req.body;
  await Credit.findOne({
    where: {
      id: Id
    }
  })
    .then(data => {
      if (!data) {
        return res.json("User not found");
      }
      else {
        var current_arrears = data.arrears + 1;
        var current_total = data.total_credit / 100 * (5 * current_arrears);
        Credit.update({
          total_credit: current_total,
          payment: body.payment,
          total_month: body.total_month,
          month: current_month,
          due_date: body.due_date,
          arrears: current_arrears
        }, {
            where: {
              id: Id
            }
          })
      }
    })
    .then(data => {
      Credit.findOne({
        where: {
          id: Id
        }
      })
    })
    .then(data => (res.json(data)))
    .catch(err => res.status(400).json(err))
})


router.delete('/:id', auth.checkToken, auth.isAuthorized, async (req, res) => {
  var Id = req.params.id;
  await Credit.update({
    isDelete: true
  }, {
      where: {
        id: Id
      }
    })
  await Credit.destroy({
    where: {
      id: Id
    }
  })
    .then(res.json("Credit was remove"))
    .catch(err => res.status(400).json(err))
});

module.exports = router;