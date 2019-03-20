const cart = require('./cart');
const fs = require('fs');
const log = require('./log');

const actions = {
  add: cart.add,
  change: cart.change,
  remove: cart.remove
};

let handler = (req, res, action, file) => {
  fs.readFile(file, 'utf-8', (err, data) => {
    if (err) {
      res.sendStatus(404, JSON.stringify({result: 0, text: err}))
    } else {
      let changes = actions[action](JSON.parse(data), req);
      fs.writeFile(file, changes.cart, (err) => {
        if (err) {
          res.sendStatus(404, JSON.stringify({result: 0, text: err}))
        } else {
          log(changes.newProduct, action);
          res.send(JSON.stringify({result: 1}))
        }
      })
    }
  })
};

module.exports = handler;