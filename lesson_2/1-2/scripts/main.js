/*
Задания:
1. Добавьте пустые классы для корзины товаров и элемента корзины товаров.
Продумайте, какие методы понадобятся для работы с этими сущностями.

2. Добавьте для GoodsList метод, определяющий суммарную стоимость всех товаров.

Решение:
1. Реализовал часть функционала корзины. Класс BasketList выполняет основную логику работы
с корзиной, BasketItem необходим для wrapperScreen.
(137 - 286)

2. Добавил метод ProductList getAllProductsPrice() решил брать не напрямую
из goods, а из массива allProducts. Значения берутся через геттер Product.
(41 - 47)
*/
"use strict";

/**
 * Класс ProductList.
 * @param {string} containerSelector Селектор для поля с продуктами.
 */
class ProductList {
  constructor(containerSelector = '.products') {
    this.containerSelector = containerSelector;
    this.goods = [];
    this.allProducts = [];
  }

  // Инициализацирует работу объекта.
  init() {
    this._fetchGoods();
    this._setAllProducts();
    this._render();
  }

  /**
   * Метод расчета суммарной стоимости всех товаров,
   * @return {int} Суммарная стоимость товаров.
   */
  getAllProductsPrice() {
    let sumPrice = 0;
    for (let item of this.allProducts) {
      sumPrice += item.getPrice();
    }
    return sumPrice;
  }

  // эмуляция получения товаров с сервера.
  _fetchGoods() {
    this.goods = [
      {title: 'Товар1', price: 1500},
      {title: 'Товар2', price: 500},
      {title: 'Товар3', price: 3500},
      {title: 'Товар4', price: 2500},
      {title: 'Товар5', price: 2500},
      {title: 'Товар6', price: 2500},
    ];
  }

  // Метод добавления объектов класса Product в productList.
  _setAllProducts() {
    for (let item of this.goods) {
      let product = new Product(item);
      this.allProducts.push(product);
    }
  }

  // Отрисовывает элементы товары в DOM.
  _render() {
    const container = document.querySelector(`${this.containerSelector}`);
    for (let product of this.allProducts) {
      container.insertAdjacentHTML('beforeend', product.render())
    }
  }
}

/**
 * Класс Product.
 * @param {obj} item Объект со свойствами price, title,
 * @param {string} img src для картинки,
 * @param {string} containerSelector Селектор контейнера для продукта.
 */
class Product {
  constructor(item, img = "https://placehold.it/400x300", containerSelector = 'product') {
    this.title = item.title;
    this.price = item.price;
    this.img = img;
    this.containerSelector = containerSelector;
  }

  /**
   * Метод создает строку для использования в DOM-структуре,
   * @return {string} строка с DOM-структурой.
   */
  render() {
    return `<div class="card ${this.containerSelector}" style="width: 18rem;">
              <img src=${this.img} class="card-img-top" alt="">
              <div class="card-body">
                <h5 class="card-title">${this.title}</h5>
                <p class="card-text">${this.price}&nbspруб.</p>
                <a href="#" class="btn btn-primary buy-btn" 
                  data-price=${this.price} 
                  data-title=${this.title}
                  data-img=${this.img}>
                  Добавить
                </a>
                <a href="#" class="btn btn-secondary remove-btn" 
                  data-price=${this.price}  
                  data-title=${this.title}>
                  Удалить
                </a>
              </div>
            </div>`;
  }

  /**
   * Метод получает значение price объекта.
   * @return {int} price.
   */
  getPrice() {
    return this.price;
  }
}

/**
 * класс Basket.
 * @param {string} containerSelector - Селектор для контейнера с корзиной,
 * @param {string} cartButtonSelector - Селектор для кнопки корзина,
 * @param {string} buyBtnSelector - Селектор для кнопок добавить,
 * @param {string} removeBtnSelector - Селектор для кнопок удалить,
 * @param {string} totalPriceSelector - Селектор для поля с общей ценой,
 * @param {string} totalQuantitySelector - Селектор для поля с общим количеством.
 * @param {string} cartWrapperScreen - Селектор для экрана корзины.
 */
class Basket {
  constructor(
    containerSelector = '.cart',
    cartButtonSelector = '#cart-button',
    buyBtnSelector = '.buy-btn',
    removeBtnSelector = '.remove-btn',
    totalPriceSelector = '#total-price',
    totalQuantitySelector = '#total-quantity',
    cartWrapperScreenClass = 'cartWrapper__screen'
  ) {
    this.cartButtonSelector = cartButtonSelector;
    this.containerSelector = containerSelector;
    this.buyBtnSelector = buyBtnSelector;
    this.removeBtnSelector = removeBtnSelector;
    this.totalPriceSelector = totalPriceSelector;
    this.totalQuantitySelector = totalQuantitySelector;
    this.cartWrapperScreenClass = cartWrapperScreenClass;
    this.basketList = [];
  }

  // Инициализация. Добавляет обработчик на кнопки корзина, вызывает методы добавления
  // обработчиков для множественных элементов.
  init() {
    const cart = document.querySelector(`${this.cartButtonSelector}`);
    cart.addEventListener('click', () => this._basketBtnClick());
    this._addBuyBtnEvent();
    this._addRemoveBtnEvent();
  }

  // Обработчик для кнопки корзина.
  _basketBtnClick() {
    this.createWrapperScreen();
    this.addProductToWrapper();
  }

  // Метод добавляет обработчики для кнопок купить.
  _addBuyBtnEvent() {
    const buttons = document.querySelectorAll(`${this.buyBtnSelector}`);
    for (let button of buttons) {
      button.addEventListener('click', (event) => this._buyBtnClick(event))
    }
  }

  // Обрабатывает событие клика на кнопку купить.
  // Вызывает метод для отрисовывания общей стоимости и количества добавленных товаров.
  _buyBtnClick(event) {
    this._setBasketList(
      event.target.dataset.title,
      +event.target.dataset.price,
      event.target.dataset.img,
    );
    this._renderTotalPriceAndQuantity()
  }

  /**
   * Метод добавляет объекты в массив basketList.
   * @param {string} title Название товара,
   * @param {int} price Цена товара,
   * @param {string} img src картинки товара.
   */
  _setBasketList(title, price, img) {
    let product = {title: title, price: price, img: img};
    this.basketList.push(product);
  }

  // Метод добавляет обработчики для кнопок удалить.
  _addRemoveBtnEvent() {
    const buttons = document.querySelectorAll(`${this.removeBtnSelector}`);
    for (let button of buttons) {
      button.addEventListener('click', (event) => this._removeBtnClick(event))
    }
  }

  // Обрабатывает событие клика на кнопку удалить. Сравнивает значение data-атрибута со значениями
  // title в массиве basketList.
  // Вызывает метод для отрисовывания общей стоимости и количества добавленных товаров.
  _removeBtnClick(event) {
    for (let i in this.basketList) {
      if (this.basketList[i].title === event.target.dataset.title) {
        this.basketList.splice(i, 1);
      }
    }
    this._renderTotalPriceAndQuantity();
  }

  // Отрисовывает суммарную стоимость и общее количество на странице.
  _renderTotalPriceAndQuantity() {
    document.querySelector(`${this.totalPriceSelector}`).textContent = this.totalSumOfBasketList();
    document.querySelector(`${this.totalQuantitySelector}`).textContent = this.basketList.length;
  }

  /**
   * Метод расчетв сумарной стоимости объектов в массиве basketList.
   * @return {int} sum возвращает сумму товаров.
   */
  totalSumOfBasketList() {
    let sum = 0;
    for (let product of this.basketList) {
      sum += product.price;
    }
    return sum;

  }

  // Метод обнуляет массив basketList.
  _nullifyBasketList() {
    this.basketList = [];
  }

  // Метод создает экран с z-index с каталогом выбранных товаров.
  createWrapperScreen() {
    const container = document.querySelector(`${this.containerSelector}`);
    let wrapperEl = document.createElement('div');
    wrapperEl.classList.add(`${this.cartWrapperScreenClass}`);
    container.appendChild(wrapperEl);
  }

  // Добавляет товары из basketList во wrapperScreen.
  addProductToWrapper() {
    const wrapperScreen = document.querySelector(`.${this.cartWrapperScreenClass}`);
    for (let product of this.basketList) {
      let basketProduct = new BasketItem(product);
      wrapperScreen.insertAdjacentHTML('beforeend', basketProduct.render());
    }
  }
}

/**
 * класс BasketItem.
 * @param {obj} item - объект со свойствами title, price, img,
 * @param {string} container Селектор для элемента.
 */
class BasketItem {
  constructor(item, container = 'basket-item') {
    this.title = item.title;
    this.price = item.price;
    this.img = item.img;
    this.container = container
  }
  render() {
    return `<div class=card ${this.container} style="width: 18rem;">
              <img src=${this.img} class="card-img-top" alt="">
              <div class="card-body">
                <p class="card-text">${this.title}</p>
                <p class="card-text">${this.price}</p>
              </div>
            </div>`
  }
}

let productList = new ProductList();
productList.init();
let basket = new Basket();
basket.init();