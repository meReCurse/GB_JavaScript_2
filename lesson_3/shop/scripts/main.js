"use strict";

/**
 * Класс Shop.
 */
class Shop {
  constructor() {
    this._goods = [];
    this._goodsAPI = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';
  }

  /**
   * Инициализация магазина.
   */
  init() {
    this._requestGoods(() => {
      let productList = new ProductList(this._goods);
      productList.init();
      let basket = new Basket();
      basket.init();
    });
  }

  /**
   * Запрашивает и получает товары по API.
   * @param {function} cb - функция, выполняемая в асинхронности.
   * @private
   */
  _requestGoods(cb) {
    fetch(`${this._goodsAPI}/catalogData.json`)
      .then(result => result.json())
      .then(data => {
        this._goods = data;
        cb();
      });
  }
}

class ProductList {
  /**
   * Конструктор класса ProductList.
   * @param {arr} goods массив товаров.
   * @param {string} containerSelector - Селектор
   */
  constructor(goods, containerSelector = '.products') {
    this._goods = goods;
    this._containerSelector = containerSelector;
    this._allProducts = [];
  }

  /**
   * Инициализацирует работу объекта.
   */
  init() {
    this._render();
  }

  /**
   * Метод расчета суммарной стоимости всех товаров,
   * @return {int} Суммарная стоимость товаров.
   */
  get TotalPrice() {
    return this._allProducts.reduce((sum, product) => sum + product.price, 0);
  }

  /**
   * Отрисовывает элементы товары в DOM.
   * @private
   */
  _render() {
    const container = document.querySelector(`${this._containerSelector}`);
    for (let item of this._goods) {
      let product = new Product(item);
      this._allProducts.push(product);
      container.insertAdjacentHTML('beforeend', product.render())
    }
  }
}

/**
 * Класс Product.
 */
class Product {
  /**
   * Конструктор класса Product/.
   * @param {obj} product Объект со свойствами price, product)name,
   * @param img
   * @param containerSelector
   */
  constructor(product, img = "https://placehold.it/400x300", containerSelector = 'product') {
    this._title = product.product_name;
    this._price = product.price;
    this._img = img;
    this._containerSelector = containerSelector;
  }

  /**
   * Метод создает строку для использования в DOM-структуре,
   * @return {string} строка с DOM-структурой.
   */
  render() {
    return `<div class="card ${this._containerSelector}" style="width: 18rem;">
              <img src=${this._img} class="card-img-top" alt="">
              <div class="card-body">
                <h5 class="card-title">${this._title}</h5>
                <p class="card-text">${this._price}&nbspруб.</p>
                <a href="#" class="btn btn-primary buy-btn" 
                  data-price=${this._price} 
                  data-title=${this._title}
                  data-img=${this._img}>
                  Добавить
                </a>
                <a href="#" class="btn btn-secondary remove-btn" 
                  data-price=${this._price}  
                  data-title=${this._title}>
                  Удалить
                </a>
              </div>
            </div>`;
  }
}

/**
 * Класс Basket.
 */
class Basket {
  /**
   * Конструктор класса Basket
   * @param cartButtonSelector Селектор для кнопки корзина,
   * @param buyBtnSelector Селектор для кнопок добавить,
   * @param removeBtnSelector Селектор для кнопок удалить,
   * @param totalPriceSelector Селектор для поля с общей ценой,
   * @param totalQuantitySelector Селектор для поля с общим количеством.
   * @param cartSelector Селектор для контейнера с корзиной,
   */
  constructor(
    cartButtonSelector = '#cart-button',
    buyBtnSelector = '.buy-btn',
    removeBtnSelector = '.remove-btn',
    totalPriceSelector = '#total-price',
    totalQuantitySelector = '#total-quantity',
    cartSelector = '.cart'
  ) {
    this._cartButtonSelector = cartButtonSelector;
    this._buyBtnSelector = buyBtnSelector;
    this._removeBtnSelector = removeBtnSelector;
    this._totalPriceSelector = totalPriceSelector;
    this._totalQuantitySelector = totalQuantitySelector;
    this._cartSelector = cartSelector;
    this._basketList = [];
  }

  /**
   * Инициализация. Добавляет обработчик на кнопки корзина, вызывает методы добавления
   * обработчиков для множественных элементов.
   */
  init() {
    document
      .querySelector(`${this._cartButtonSelector}`)
      .addEventListener('click', () => this._basketBtnClick());

    this._addAddBtnEvent();
    this._addRemoveBtnEvent();
  }

  /*
  ================
  BasketList
  ================
  */
  /**
   * Метод расчетв сумарной стоимости объектов в массиве basketList.
   * @return {int} sum возвращает сумму товаров.
   */
  get basketTotalCost() {
    let sum = 0;
    for (let product of this._basketList) {
      sum += product.quantity * product.price;
    }
    return sum;
  }

  /**
   * Метод расчета количества товаров.
   * @return {number}
   */
  get itemsQuantity() {
    let quantity = 0;
    for (let product of this._basketList) {
      quantity += product.quantity;
    }
    return quantity;
  }

  /**
   * Отрисовывает суммарную стоимость и общее количество на странице.
   * @private
   */
  _renderTotalPriceAndQuantity() {
    document.querySelector(`${this._totalPriceSelector}`).textContent = this.basketTotalCost;
    document.querySelector(`${this._totalQuantitySelector}`).textContent = this.itemsQuantity;
  }

  /**
   * Метод обнуляет массив basketList.
   * @private
   */
  _cleanBasketList() {
    this._basketList = [];
    this._renderTotalPriceAndQuantity();
  }
  /* ========================== */

  /*
  ==========
  BasketBtn
  ==========
  */
  /**
   * Обработчик для кнопки корзина.
   * @private
   */
  _basketBtnClick() {
    if (this._isCartContainerEmpty() && this._basketList.length > 0) {
      this._renderCartContainer();
    }
  }

  /**
   * Проверяет наличие дочерних элементов в DOM элементе.
   * @return {boolean}
   * @private
   */
  _isCartContainerEmpty() {
    const container = document.querySelector(`${this._cartSelector}`);
    return !container.hasChildNodes()
  }

  /**
   * Отрисовывает DOM элемент cart
   * @private
   */
  _renderCartContainer() {
    this._cleanCartContainer();
    const container = document.querySelector(`${this._cartSelector}`);

    let innerStructure = `<div class="card">
                            <div class="card-header">
                              <h5>Корзина</h5>
                              <a href="#" class="btn btn-info">
                                <i class="far fa-times-circle"></i>
                              </a>
                            </div>
                            <div class="card-body">
                              <a href="#" class="btn btn-primary">Купить</a>
                              <a href="#" class="btn btn-danger">Очистить корзину</a>
                            </div>
                          </div>`;

    container.insertAdjacentHTML('beforeend', innerStructure);
    container
      .querySelector('a')
      .addEventListener('click', () => this._cleanCartContainer());

    container
      .querySelector('.btn-danger')
      .addEventListener('click', () => {
        this._cleanBasketBtn();
      });

    container
      .querySelector('.btn-primary')
      .addEventListener('click', () => {
        this._buyBtn();
      });

    let body = container.querySelector('.card-body');

    for (let product of this._basketList) {
      let basketProduct = new BasketItem(product);
      body.insertAdjacentHTML('afterbegin', basketProduct.render());
    }
  }

  /**
   * Событие при клике купить.
   * @return {string} JSONBasketList JSON строка
   * @private
   */
  _buyBtn() {
    let JSONBasketList = JSON.stringify(this._basketList, ['title', 'price', 'quantity']);
    alert('Ваш заказ сформирован');
    console.log(JSONBasketList);
    return JSONBasketList;
  }

  /**
   * Событие при клике очистить корзину.
   * @private
   */
  _cleanBasketBtn() {
    this._cleanBasketList();
    this._cleanCartContainer();
  }

  /**
   * Очищает внутреннюю структуру DOM элемента
   * @private
   */
  _cleanCartContainer() {
    const container = document.querySelector(`${this._cartSelector}`);
    container.innerHTML = '';
  }
  /* ===================================== */

  /*
  ==========
  aadBtn
  ==========
  */

  /**
   * Добавляет обработчик при клике на кнопку добавить.
   * @private
   */
  _addAddBtnEvent() {
    const buttons = document.querySelectorAll(`${this._buyBtnSelector}`);
    for (let button of buttons) {
      button.addEventListener('click', (event) => this._addBtnClick(event))
    }
  }

  /**
   * Обрабатывает событие клика на кнопку купить.
   * Вызывает метод для отрисовывания общей стоимости и количества добавленных товаров.
   * Добавляет товары в DOM элемент, если DOM элемент открыт.
   * @param event
   * @private
   */
  _addBtnClick(event) {
    let title = event.target.dataset.title;
    let price = +event.target.dataset.price;
    let img = event.target.dataset.img;

    this._addToCartList(title, price, img);
    this._renderTotalPriceAndQuantity();

    if (!this._isCartContainerEmpty()) {
      this._renderCartContainer();
    }
  }

  /**
   * Добавляет продукт в массив _cartList
   * @param title - название товара
   * @param price - стоимость товара
   * @param img - адрес картинка
   * @return {number}
   * @private
   */
  _addToCartList(title, price, img) {
    if (this._basketList.length > 0) {
      for (let product of this._basketList) {
        if (product.title === title) {
          return product.quantity += 1
        }
      }
    }
    this._basketList.push({
      title: title,
      price: price,
      img: img,
      quantity: 1
    });
  }

  /* ===================================== */
  /*
  ===========
  RemoveBtn
  ===========
  */

  /**
   * Метод добавляет обработчики для кнопок удалить.
   * @private
   */
  _addRemoveBtnEvent() {
    const buttons = document.querySelectorAll(`${this._removeBtnSelector}`);
    for (let button of buttons) {
      button.addEventListener('click', (event) => this._removeBtnClick(event))
    }
  }

  /**
   * Обрабатывает событие клика на кнопку удалить. Сравнивает значение data-атрибута со значениями
   * title в массиве basketList. Вызывает метод для отрисовывания общей стоимости и количества добавленных товаров.
   * @param event
   * @private
   */
  _removeBtnClick(event) {
    for (let i in this._basketList) {
      if (this._basketList[i].title === event.target.dataset.title) {
        if (this._basketList[i].quantity === 1) {
          this._basketList.splice(i, 1);
        } else {
          this._basketList[i].quantity -= 1;
        }

      }
    }
    this._renderTotalPriceAndQuantity();

    if (!this._isCartContainerEmpty()) {
      this._cleanCartContainer();
      this._renderCartContainer();
    }
  }
  /* ====================================== */
}

/**
 * класс BasketItem.
 */
class BasketItem {
  /**
   * Конструктор класса BasketItem.
   * @param {obj} item - объект со свойствами title, price, img,
   * @param {string} container Селектор для элемента.
   */
  constructor(item, container = 'basket-item') {
    this._title = item.title;
    this._price = item.price;
    this._quantity = item.quantity;
    this._img = item.img;
    this._container = container
  }

  /**
   * Метод создает строку для использования в DOM-структуре,
   * @return {string}
   */
  render() {
    return `<ul>
              <li> Товар: ${this._title}</li>
              <li>Цена: ${this._price} руб.</li>
              <li>Количество: ${this._quantity}</li>
            </ul>`;
  }
}

let shop = new Shop();
shop.init();