let add = (cart, req) => {
  cart.contents.push(req.body);
  setValues(cart);
  return {
    newProduct: req.body.product_name,
    cart: JSON.stringify(cart, null, 4)
  };
};

let change = (cart, req) => {
  let find = cart.contents.find(el => el.id_product === +req.params.id);
  find.quantity += req.body.quantity;
  setValues(cart);
  return {
    newProduct: find.product_name,
    cart: JSON.stringify(cart, null, 4)
  }
};

let remove = (cart, req) => {
  let find = cart.contents.find(el => el.id_product === +req.params.id);
  cart.contents.splice(cart.contents.indexOf(find), 1);
  if (cart.contents.length) {
    setValues(cart);
  } else {
    cart.countGoods = 0;
    cart.amount = 0
  }
  return {
    newProduct: find.product_name,
    cart: JSON.stringify(cart, null, 4)
  }
};

function setValues(cart) {
  cart.countGoods = (cart.contents.map((product) => product.quantity)).reduce((a, v) => a + v);
  cart.amount = (cart.contents.map((product) => product.quantity * product.price)).reduce((a, v) => a + v);
}

module.exports = {
  add,
  change,
  remove
};