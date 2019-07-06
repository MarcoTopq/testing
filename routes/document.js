var express = require('express');
var router = express.Router();
var Document = require('../models/document');


router.post('/', async (req, res) => {
  var body = req.body;
  const document = await Document.create({
    id_card: body.id_card,
    doc_file: body.doc_file
  });
  document.save().then(data => (res.json(data)))
    .catch(err => res.status(400).json(err))
});

router.get('/', async (req, res) => {
  await Document.findAll()
    .then(data => (res.json(data)))
    .catch(err => res.status(400).json(err))
})

router.get('/:id', async (req, res) => {
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

router.put('/edit/:id', async (req, res) => {
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
    .then(data => (res.json(data)))
    .catch(err => res.status(400).json(err))
})

router.delete('/delete/:id', async (req, res) => {
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