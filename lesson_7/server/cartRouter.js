const express = require('express');
const fs = require('fs');
const router = express.Router();
const handler = require('./handler');
const log = require('./log');

const file = 'server/db/userCart.json';

router.get('/', (req, res) => {
  fs.readFile(file, 'utf-8', (err, data) => {
    if (err) {
      res.sendStatus(404, JSON.stringify({result: 0, text: err}))
    } else {
      res.send(data)
    }
  })
});

router.post('/', (req, res) => {
  handler(req, res, 'add', file);
});

router.put('/:id', (req, res) => {
  handler(req, res, 'change', file);
});

router.delete('/:id', (req, res) => {
  handler(req, res, 'remove', file);
});

router.delete('/', (req, res) => {
  fs.readFile(file, 'utf-8', (err, data) => {
    if (err) {
      res.sendStatus(404, JSON.stringify({result: 0, text: err}))
    } else {
      const nullifiedCart = {
        "amount": 0,
        "countGoods": 0,
        "contents": []
      };
      fs.writeFile(file, JSON.stringify(nullifiedCart, null, 4), (err) => {
        if (err) {
          res.sendStatus(404, JSON.stringify({result: 0, text: err}))
        } else {
          log('all', 'remove');
          res.send(JSON.stringify({result: 1}));
        }
      });
    }
  })
});

module.exports = router;