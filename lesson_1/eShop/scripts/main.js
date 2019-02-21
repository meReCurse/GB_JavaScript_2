/*
1. Добавьте стили для верхнего меню, товара, списка товаров и кнопки вызова корзины.

Комментарий:
Проект буду делать на bootstrap, добавил необходимые значения классов и прописал необходимые стили.

2. Добавьте значения по умолчанию для аргументов функций. Как можно упростить или
сократить запись функций?

Ответ:
  - Добавил значения по умолчанию для функции renderGoodsItem.
  - В функции renderGoodsItem единственным оператором в выражении является return, поэтому
  данную функцию можно сократить, убрав фигурные скобки и сам оператор return.
  - Функция renderGoodsList приниямает один аргумент, поэтому можно опустить круглые скобки.


3. * Сейчас после каждого товара на странице выводится запятая. Из-за чего это происходит?
Как это исправить?

Ответ:
  Запятая выводится на страницу, так как:
  Свойство innerHTML устанавливает разметку дочерних элементов. Таким образом,
  логично предположить, что в присваемом операнде парсятся тэги, благодаря которым
  интерпретатор строит структуру документа. При этом, присваемый операнд преобразуется в строку,
  это заметно, если передать в качестве операнда объект. В таком случае на страницу
  выведется [object Object], такой же результат будет при вызове метода obj.toString().
  Так как операнд преобразуется в строку, и при этом в данном случае все элементы
  массива конкатенируются, то и перобразуются в строку и резделяющие элементы запятые
  и также конкатенируются. Таким образом, если до вызова innerHTML не сделать явное преобразование операнда
  в строку с удалением разделителей, то на страницу выведутся запятые, а значит данная проблема
  может быть решена вызовом встроенного метода массивов join('').
*/
"use strict";

const goods = [
  {title: 'Товар1', price: 1500},
  {title: 'Товар2', price: 500},
  {title: 'Товар3', price: 3500},
  {title: 'Товар4', price: 2500},
  {title: 'Товар5', price: 2500},
  {title: 'Товар6', price: 2500},
];

const renderGoodsItem = (title = 'Новый товар', price = 1000) =>
  `<div class="goods-item">
    <img src="images/under-construction.png" alt="">
    <h3>${title}</h3>
    <p>${price} руб.</p>\
    <button type="button" class="btn btn-primary">Добавить</button>
  </div>`;

const renderGoodsList = list => {
  let goodsList = (list.map(item => renderGoodsItem(item.title, item.price)));
  document.querySelector('.goods-list').innerHTML = goodsList.join('');
};

renderGoodsList(goods);