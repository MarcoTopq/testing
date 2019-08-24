'use strict'
var express = require('express');
var router = express.Router();
var Room = require('../models/room');
var auth = require('../middleware/auth');
var expressJoi = require('express-joi-validator');
var Joi = require('joi');
var multer = require('multer');
var upload = multer({ storage: storage })
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './upload');
     },
    filename: function (req, file, cb) {
        cb(null , file.originalname);
    }
});

var bodySchema = {
  body: {
    name: Joi.string().required(),
    address: Joi.string().required(),
  }
};

var updateSchema = {
  body: {
    name: Joi.string().allow(""),
    address: Joi.string().allow(""),
    obj: Joi.string().allow("")
  }
};

router.post('/', auth.checkToken, expressJoi(bodySchema), upload.single('profile'), async (req, res) => {
  var body = req.body;
  await Room.create({
    name: body.name,
    address: body.address,
    obj: req.files
  })
    .then(data => (res.json(data)))
    .catch(err => res.status(400).json(err))
});

router.get('/', auth.checkToken, auth.isAuthorized, async (req, res) => {
  await Room.findAll()
    .then(data => (res.json(data)))
    .catch(err => res.status(400).json(err))
})

router.get('/:id', auth.checkToken, async (req, res) => {
  var Id = req.params.id;
  await Room.findOne({
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
  await Room.findOne({
    where: {
      id: Id
    }
  })
    .then(data => {
      if (!data) {
        return res.json("Account not found");
      }
      else {
        Room.update({
          name: body.name,
          address: body.address,
          obj: req.files
        }, {
            where: {
              id: Id
            }
          })
      }
    })
    .then(data => {
      Room.findOne({
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
  await Room.update({
    isDelete: true
  }, {
      where: {
        id: Id
      }
    });
  await Room.destroy({
    where: {
      id: Id
    }
  })
    .then(res.json("Room was remove"))
    .catch(err => res.status(400).json(err))
});


module.exports = router;