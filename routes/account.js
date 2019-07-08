'use strict'
var express = require('express');
var router = express.Router();
var Account = require('../models/account');
var auth = require('../middleware/auth');
var expressJoi = require('express-joi-validator');
var Joi = require('joi');

var bodySchema = {
  body: {
    bank_name: Joi.string().required(),
    account_number: Joi.string().required(),
    account_name: Joi.string().required(),
    document_file: Joi.string().required()

  }
};

var updateSchema = {
  body: {
    bank_name: Joi.string().allow(""),
    account_number: Joi.string().allow(""),
    account_name: Joi.string().allow(""),
    document_file: Joi.string().allow("")
  }
};

router.post('/', auth.checkToken, expressJoi(bodySchema), async (req, res) => {
  var body = req.body;
  await Account.create({
    bank_name: body.bank_name,
    account_number: body.account_number,
    account_name: body.account_name,
    document_file: body.document_file
  })
  .then(data => (res.json(data)))
    .catch(err => res.status(400).json(err))
});

router.get('/', auth.checkToken, auth.isAuthorized, async (req, res) => {
  await Account.findAll()
    .then(data => (res.json(data)))
    .catch(err => res.status(400).json(err))
})

router.get('/:id', auth.checkToken, async (req, res) => {
  var Id = req.params.id;
  await Account.findOne({
    where: {
      id: Id
    }
  })
    .then(data => {
      if (!data) {
        return res.json("Account not found");
      }
      else {
        return res.json(data);
      }
    })
    .catch(err => res.status(400).json(err))
});

router.put('/:id', auth.checkToken, expressJoi(updateSchema), async (req, res) => {
  var Id = req.params.id;
  var body = req.body;
  await Account.findOne({
    where: {
      id: Id
    }
  })
    .then(data => {
      if (!data) {
        return res.json("Account not found");
      }
      else {
        Account.update({
          bank_name: body.bank_name,
          account_number: body.account_number,
          account_name: body.account_name,
          document_file: body.document_file
        }, {
            where: {
              id: Id
            }
          })
      }
    })
    .then(data => {
       Account.findOne({
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
  await Account.update({
    isDelete: true
  }, {
      where: {
        id: Id
      }
    })
  await Account.destroy({
    where: {
      id: Id
    }
  })
    .then(res.json("account was remove"))
    .catch(err => res.status(400).json(err))
});

module.exports = router;