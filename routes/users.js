var express = require('express');
var router = express.Router();
var users = require('../models/users');
/* GET users listing. */
var express = require('express');
var router = express.Router();


router.post('/', async (req, res) => {
  var body = req.body;
  const user = await User.create({
    username: body.username,
    email: body.email,
    phone: body.phone,
    password: body.password
  });
  user.save().then(data => (res.json(data)))
    .catch(err => res.status(400).json(err))
});

router.get('/', async (req, res) => {
  await User.findAll()
    .then(data => (res.json(data)))
    .catch(err => res.status(400).json(err))
});

router.get('/:id', async (req, res) => {
  var Id = req.params.id;
  await User.findOne({
    where: {
      id: Id
    }
  })
    .then(data => {
      if (!data) {
        return res.json("User not found");
      }
      else {
        return res.json(data);
      }
    })
    .catch(err => res.status(400).json(err))
});

router.put('/edit/:id', async (req, res) => {
  var Id = req.params.id;
  var body = req.body;
  await User.findOne({
    where: {
      id: Id
    }
  })
    .then(data => {
      if (!data) {
        return res.json("User not found");
      }
      else {
        User.update({
          username: body.username,
          email: body.email,
          phone: body.phone,
          password: body.password
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

router.delete('/delete/:id', async (req, res) => {
  var Id = req.params.id;
  await User.update({
    isDelete: true
  }, {
      where: {
        id: Id
      }
    })
  await User.destroy({
    where: {
      id: Id
    }
  })
    .then(res.json("User was remove"))
    .catch(err => res.status(400).json(err))
});

module.exports = router;
