var express = require('express');
var router = express.Router();
var Account = require('../models/account');


router.post('/', async (req, res) => {
    var body = req.body;
    const account = await Account.create({
        bank_name: body.bank_name,
        account_number: body.account_number,
        account_name: body.account_name,
        document_file: body.document_file
    });
    account.save().then(data => (res.json(data)))
        .catch(err => res.status(400).json(err))
});

router.get('/', async (req, res) => {
    await Account.findAll()
        .then(data => (res.json(data)))
        .catch(err => res.status(400).json(err))
})

router.get('/:id', async (req, res) => {
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

router.put('/:id', async (req, res) => {
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
        .then(data => (res.json(data)))
        .catch(err => res.status(400).json(err))
})

router.delete('/:id', async (req, res) => {
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