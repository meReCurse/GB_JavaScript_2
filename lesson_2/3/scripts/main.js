/*
3. *Некая сеть фастфуда предлагает несколько видов гамбургеров:

### Маленький (50 рублей, 20 калорий).
### Большой (100 рублей, 40 калорий).

### Гамбургер может быть
с одним из нескольких видов начинок (обязательно):

### С сыром (+10 рублей, +20 калорий).
### С салатом (+20 рублей, +5 калорий).
### С картофелем (+15 рублей, +10 калорий).

### Дополнительно гамбургер можно посыпать
приправой (+15 рублей, +0 калорий) и полить майонезом (+20 рублей, +5 калорий).

###
Напишите программу, рассчитывающую стоимость и калорийность гамбургера. Можно использовать
примерную архитектуру класса из методички, но можно использовать и свою.
*/
"use strict";

class Hamburger {
  constructor(size, filling, optional) {
    let calories, price;
    // this.calories, this.price

    switch (size) {
      case 'большой':
        this.size = size;
        calories = 40;
        price = 100;
        break;
      case 'маленький':
        this.size = size;
        calories = 20;
        price = 50;
        break;
    }

    switch (filling) {
      case 'с сыром':
        this.filling = filling;
        price += 10;
        calories += 20;
        break;
      case 'с салатом':
        this.filling = filling;
        price += 20;
        calories += 5;
        break;
      case 'с картофелем':
        this.filling = filling;
        price += 15;
        calories += 10;
        break;
    }

    switch (optional) {
      case ' ':
        this.optionalTopping = 'без наполнителя';
        this.price = price;
        this.calories = calories;
        break;
      case 'посыпать приправой':
        this.optionalTopping = optional;
        price += 15;
        this.price = price;
        this.calories = calories;
        break;
      case 'полить майонезом':
        this.optionalTopping = optional;
        price += 20;
        this.price = price;
        calories += 5;
        this.calories = calories;
        break;
    }
  }

  getSize() {
    return this.size
  }

  getFillings() {
    return this.filling
  }

  getOptional() {
    return this.optionalTopping
  }

  getPrice() {
    return this.price
  }

  getCalories() {
    return this.calories
  }
}

class HamburgerShop {
  constructor(choicesBtnSelector = '.choice-btn' ) {
    this.choicesBtnSelector = choicesBtnSelector;
    this.size = '';
    this.filling = '';
    this.optional = '';
    this.orderList = [];
  }

  init() {
    this.addListeners();
  }

  addListeners() {
    const buttons = document.querySelectorAll(`${this.choicesBtnSelector}`);
    for (let button of buttons) {
      button.addEventListener('click', (event) => this.clickChoice(event) )
    }
  }

  clickChoice(event) {
    if (event.target.dataset.size) {
      this.setSize(event.target.dataset.size)
    } else if (event.target.dataset.filling) {
      this.setFilling(event.target.dataset.filling)
    } else {
      this.setOptional(event.target.dataset.optional)
    }

    if (this.isOrderFull()) {
      this.order();
    }
  }

  setSize(size) {
   this.size = size;
  }

  setFilling(filling) {
    this.filling = filling
  }

  setOptional(optional) {
    this.optional = optional
  }

  isOrderFull() {
    return this.size && this.filling && this.optional;
  }

  order() {
    let hamburger = new Hamburger(this.size, this.filling, this.optional);
    this.setOrderList(hamburger);
    this.renderOrder();
  }

  setOrderList(product) {
    this.orderList.push(product);
  }

  getOrderList() {
    return this.orderList
  }

  renderOrder() {
    const container = document.querySelector('.order');
    container.classList.remove('d-none');
    let textNode = document.querySelector('.order-detail');
    textNode.innerHTML = 'Заказ:';

    let i = 1;
    for (let product of this.getOrderList()) {
      let text = `
        <p>${i}. гамбургер:</p>
        <p>размер: ${product.getSize()}</p>
        <p>дополнительно: ${product.getFillings()}, ${product.getOptional()}</p>
        <p>калории: ${product.getCalories()}</p>
        <p>цена: ${product.getPrice()}</p>
      `;
      textNode.insertAdjacentHTML('beforeend', text);
      i++;
    }

    this.nullifyProperties();
  }

  nullifyProperties() {
    this.size = '';
    this.filling = '';
    this.optional = '';
  }
}

let shop = new HamburgerShop();
shop.init();