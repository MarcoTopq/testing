var express = require('express');
var router = express.Router();
var Credit = require('../models/credit');


router.post('/', async (req, res) => {
  var body = req.body;
  const credit = await Credit.create({
    total: body.total,
    payment: body.payment,
    month: body.month,
    due_date: body.due_date,
    arrears: body.arrears
  });
  credit.save().then(data => (res.json(data)))
    .catch(err => res.status(400).json(err))
});

router.get('/', async (req, res) => {
  await Credit.findAll()
    .then(data => (res.json(data)))
    .catch(err => res.status(400).json(err))
})

router.get('/:id', async (req, res) => {
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

router.put('/:id', async (req, res) => {
  var Id = req.params.id;
  var body = req.body;
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
        Credit.update({
          total: body.total,
          payment: body.payment,
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
    .then(data => (res.json(data)))
    .catch(err => res.status(400).json(err))
})

router.delete('/:id', async (req, res) => {
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