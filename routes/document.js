'use strict'
var express = require('express');
var router = express.Router();
var Document = require('../models/document');
var auth = require('../middleware/auth');
var expressJoi = require('express-joi-validator');
var Joi = require('joi');

var bodySchema = {
  body: {
    id_card: Joi.string().required(),
    doc_file: Joi.string().required()

  }
};

var updateSchema = {
  body: {
    id_card: Joi.string().allow(""),
    doc_file: Joi.string().allow(""),
  }
};

router.post('/', auth.checkToken, expressJoi(bodySchema), async (req, res) => {
  var body = req.body;
  await Document.create({
    id_card: body.id_card,
    doc_file: body.doc_file
  })
    .then(data => (res.json(data)))
    .catch(err => res.status(400).json(err))
});

router.get('/', auth.checkToken, auth.isAuthorized, async (req, res) => {
  await Document.findAll()
    .then(data => (res.json(data)))
    .catch(err => res.status(400).json(err))
})

router.get('/:id', auth.checkToken, async (req, res) => {
  var Id = req.params.id;
  await Document.findOne({
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

router.put('/edit/:id', auth.checkToken, expressJoi(updateSchema), async (req, res) => {
  var Id = req.params.id;
  var body = req.body;
  await Document.findOne({
    where: {
      id: Id
    }
  })
    .then(data => {
      if (!data) {
        return res.json("Account not found");
      }
      else {
        Document.update({
          id_card: body.id_card,
          doc_file: body.doc_file
        }, {
            where: {
              id: Id
            }
          })
      }
    })
    .then(data => {
      Document.findOne({
        where: {
          id: Id
        }
      })
    })
    .then(data => (res.json(data)))
    .catch(err => res.status(400).json(err))
})

router.delete('/delete/:id', auth.checkToken, auth.isAuthorized, async (req, res) => {
  var Id = req.params.id;
  await Document.update({
    isDelete: true
  }, {
      where: {
        id: Id
      }
    });
  await Document.destroy({
    where: {
      id: Id
    }
  })
    .then(res.json("document was remove"))
    .catch(err => res.status(400).json(err))
});


module.exports = router;