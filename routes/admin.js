var express = require('express');
var router = express.Router();
var Admin = require('../models/admin');
var passport = require('passport');
var config = require('../config/index');
require('../config/passport')(passport);
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

router.post('/signup', async function (req, res, next) {
  var body = req.body;
  const admin = await Admin.create({
    userrname: body.username,
    email: body.email,
    phone: body.phone,
    password: body.password
  });
  admin.save().then(data => (res.json(data)))
    .catch(err => res.status(400).json(err))
});

router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  Admin.findOne({ where: { email: email } })
    .then(admin => {
      if (!admin) {
        errors.email = "No Account Found";
        return res.status(404).json(errors);
      }
      bcrypt.compare(password, admin.password)
        .then(isMatch => {
          if (isMatch) {
            const payload = {
              id: admin._id,
              name: admin.Adminname
            };
            jwt.sign(payload, config.secret, { expiresIn: 36000 },
              (err, token) => {
                if (err) res.status(500)
                  .json({
                    error: "Error signing token",
                    raw: err
                  });
                res.json({
                  success: true,
                  token: 'JWT ' + token
                });
              });
          } else {
            errors.password = "Password is incorrect";
            res.status(400).json(errors);
          }
        });
    });
});

router.post('/register', async (req, res) => {
  await Admin.findOne({ where: { email: req.body.email } })
    .then(admin => {
      if (admin) {
        let error = 'Email Address Exists in Database.';
        return res.status(400).json(error);
      } else {
        const newAdmin = new Admin({
          name: req.body.name,
          email: req.body.email,
          phone: req.body.phone,
          password: req.body.password
        });
        bcrypt.genSalt(10, (err, salt) => {
          if (err) throw err;
          bcrypt.hash(newAdmin.password, salt,
            (err, hash) => {
              if (err) throw err;
              newAdmin.password = hash;
              newAdmin.save().then(admin => res.json(admin))
                .catch(err => res.status(400).json(err));
            });
        });
      }
    });
});

getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

router.get('/', async (req, res) => {
  await Admin.findAll()
    .then(data => (res.json(data)))
    .catch(err => res.status(400).json(err))
});

router.get('/:id', async (req, res) => {
  var Id = req.params.id;
  await Admin.findOne({
    where: {
      id: Id
    }
  })
    .then(data => {
      if (!data) {
        return res.json("Admin not found");
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
  await Admin.findOne({
    where: {
      id: Id
    }
  })
    .then(data => {
      if (!data) {
        return res.json("Admin not found");
      }
      else {
        Admin.update({
          Adminname: body.Adminname,
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
  await Admin.update({
    isDelete: true
  }, {
      where: {
        id: Id
      }
    })
  await Admin.destroy({
    where: {
      id: Id
    }
  })
    .then(res.json("Admin was remove"))
    .catch(err => res.status(400).json(err))
});






module.exports = router;




