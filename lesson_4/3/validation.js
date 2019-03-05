/*
3.
*Создать форму обратной связи с полями: Имя, Телефон, E-mail, текст, кнопка Отправить.
* При нажатии на кнопку Отправить произвести валидацию полей следующим образом:
a. Имя содержит только буквы.
b. Телефон имеет вид +7(000)000-0000.
c. E-mail имеет вид mymail@mail.ru, или my.mail@mail.ru, или my-mail@mail.ru.
d. Текст произвольный.
e. Если одно из полей не прошло валидацию, необходимо выделить
 это поле красной рамкой и сообщить пользователю об ошибке.
*/

"use strict";

class ValidationForm {
  constructor(selector = 'form') {
    this.formSelector = selector
  }
  /**
   * запускает валидацию.
   * */
  run() {
    const form = document.querySelector(`${this.formSelector}`);
    // устанавливаем обработчик событий.
    form.addEventListener('click', (event) => this.sendAction(event, form), form);
  }

  /**
   * Обработка события отправки формы
   * @param event
   * @param form
   */
  sendAction(event, form) {
    // отключаем отправление до проверки
    event.preventDefault();
    // устанавливаем область срабатывания обработчика
    if (event.target.tagName === 'BUTTON') {
      let isName, isPhone, isEmail, isText;

      let inputs = document.querySelectorAll('input');
      // цикл по выбранным элементам
      for (let input of inputs) {
        // очистка классов
        this.clearClasses(input);
        // очистка выведенных ошибок
        this.clearError(input);
        // ветвления на значения атрибутов
        switch (input.name) {
          case 'name':
            isName = this.nameValidator(input);
            break;
          case 'phoneNumber':
            isPhone = this.phoneValidator(input);
            break;
          case 'e-mail':
            isEmail = this.emailValidator(input);
            break;
        }
      }

      let textArea = document.querySelector('textarea');
      this.clearClasses(textArea);
      isText = this.textValidator(textArea);

      // отправляем форму, если валидация успешна
      if (isName && isPhone && isEmail && isText) {
        form.submit()
      }
    }
  }

  /**
   * Функция удаляет классы.
   * @param {HTMLElement} element
   */
  clearClasses(element) {
    element.classList.remove('validation-success', 'validation-danger')
  }

  /**
   * Функция добавляет класс успешной валидации.
   * @param {HTMLElement} element
   */
  addSuccessClass(element) {
    element.classList.add('validation-success');
  }

  /**
   * Функция добавляет класс провала валидации.
   * @param {HTMLElement} element
   */
  addDangerClass(element) {
    element.classList.add('validation-danger');
  }

  /**
   * Функция проводит валидацию имени
   * Если валидация не успешна, то устанавливает красную границу элементу
   * и отображает ошибку
   * @param {HTMLElement} input
   * @return {boolean} true если валидация пройдена
   * */
  nameValidator(input) {
    const error = 'Имя должно содержать только буквы.';
    if (!/^[a-zA-ZА-Яа-яЁё]+$/m.test(input.value)) {
      this.addDangerClass(input);
      this.showError(error, input);
      return false;
    }
    this.addSuccessClass(input);
    return true;
  }

  /**
   * Функция проводит валидацию телефонного номера
   * Если валидация не успешна, то устанавливает красную границу элементу
   * и запускает функцию по отображению ошибки
   * @param {HTMLElement} input
   * @return {boolean} true если валидация пройдена
   */
  phoneValidator(input) {
    const error = 'Телефон должен иметь вид +7(000)000-0000.';
    if (!/^\+\d\(\d{3}\)\d{3}-\d{4}$/m.test(input.value)) {
      this.addDangerClass(input);
      this.showError(error, input);
      return false;
    }
    this.addSuccessClass(input);
    return true;
  }

  /**
   * Функция проводит валидацию email
   * Если валидация не успешна, то устанавливает красную границу элементу
   * и запускает функцию по отображению ошибки
   * @param {HTMLElement} input
   * @return {boolean} true если валидация пройдена
   */
  emailValidator(input) {
    const error = ' E-mail имеет вид mymail@mail.ru, или my.mail@mail.ru, или my-mail@mail.ru.';
    if (!/^\w+[.|-]?\w*@\w+\.[ru|com]+$/.test(input.value)) {
      this.addDangerClass(input);
      this.showError(error, input);
      return false;
    }
    this.addSuccessClass(input);
    return true;
  }

  /**
   * Функция проводит валидацию textarea
   * Если валидация не успешна, то устанавливает красную границу элементу
   * и запускает функцию по отображению ошибки
   * @param {HTMLElement} textArea
   * @return {boolean} true если валидация пройдена
   */
  textValidator(textArea) {
    if (textArea.value) {
      this.addSuccessClass(textArea);
      return true
    }
    this.addDangerClass(textArea);
    return false
  }

  /**
   Создает элемент div под соответствующий input
   @param {string} error текст ошибки
   @param {HTMLElement} input элемент input
   */
  showError(error, input) {
    let errorDiv = document.createElement('div');
    errorDiv.textContent = error;
    input.parentNode.appendChild(errorDiv);
  }

  /**
   * Очищает DOM от div с текстом ошибки
   * @param {HTMLElement} input элемент input
  */
  clearError(input) {
    let el = input.parentNode.querySelector('div');
    if (el !== null) {
      el.remove();
    }
  }
}

let validationForm = new ValidationForm();
validationForm.run();