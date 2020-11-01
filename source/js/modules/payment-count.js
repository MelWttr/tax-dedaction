'use strict';

import { popup } from '../utils/constants';
import { showError, removeError } from '../utils/functions';

export default () => {
  if (!popup) return
  const fieldSalary = popup.querySelector('#salary-amount');
  const fieldPrice = popup.querySelector('#flat-price');
  const priceInvalidMsg = fieldPrice.nextSibling;
  const salaryInvalidMsg = fieldSalary.nextSibling;
  const calculateBtn = popup.querySelector('.popup__calculate-btn');
  const paymentGroup = popup.querySelector('.popup__payment-group');
  const loader = popup.querySelector('.popup__loader');


  let salaryFieldMask = window.iMask(
    fieldSalary,
    {
      mask: '₽ num',
      blocks: {
        num: {
          mask: Number,
          thousandsSeparator: ' '
        }
      }
    });

  let priceFieldMask = window.iMask(
    fieldPrice,
    {
      mask: '₽ num',
      blocks: {
        num: {
          mask: Number,
          thousandsSeparator: ' '
        }
      }
    });

  // Функция разделения разрядов числа пробелами. Входные данные: любое целое число. Выходные данные: строка.
  const splitNumber = num => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }


  // функция для склонения числительных. Вход: требуемое целое число, Выход - строка (число с окончанием)

  const pluralize = (number) => {
    let forms = ['-ый', '-ой', '-ий']
    let numberOne = Math.abs(number) % 100;
    let numberTwo = number % 10;
    if (numberOne >= 12 && numberOne <= 18) { return number + forms[0] };
    if (numberTwo === 3) {
      return number + forms[2]
    } else if ((numberTwo >= 0 && numberTwo <= 1) || (numberTwo >= 4 && numberTwo <= 5) || (numberTwo >= 9 && numberTwo <= 10)) {
      return number + forms[0]
    } else if (numberTwo === 2 || (numberTwo >= 6 && numberTwo <= 8)) {
      return number + forms[1]
    }
  }

  const loaderToggle = loader => {
    loader.classList.toggle('popup__loader--visible')
  }

  calculateBtn.addEventListener('click', () => {
    let priceValue = +priceFieldMask.unmaskedValue;
    let salaryValue = +salaryFieldMask.unmaskedValue;
    let isValidationAccepted = true;

    //Валидация полей стоимости квартиры и зарплаты
    if (!priceValue || priceValue < 100000) {
      let message = priceValue <= 0 ? 'Поле обязательно для заполнения' : 'Минимальное значение 100 000';
      showError(priceInvalidMsg, message);
      fieldPrice.style.borderColor = '#ea0029';
      isValidationAccepted = false;
    }

    if (!salaryValue || salaryValue < 5000) {
      let message = salaryValue <= 0 ? 'Поле обязательно для заполнения' : 'Минимальное значение 5 000';
      showError(salaryInvalidMsg, message);
      fieldSalary.style.borderColor = '#ea0029';
      isValidationAccepted = false;
    }

    if (isValidationAccepted) {
      let deductionPerYear = Math.round(salaryValue * 12 * 0.13);
      let sumToReturn = priceValue < 2000000 ? Math.round(priceValue * 0.13) : 260000;
      let payments = document.createDocumentFragment();
      let count = 0;
      while (sumToReturn > 0) {
        count++;
        let paymentNode = document.querySelector('#payment').content;
        let newPayment = paymentNode.cloneNode(true);
        let sum = newPayment.querySelector('.check__sum');
        let year = newPayment.querySelector('.check__year');
        year.textContent = count === 2 ? `во ${pluralize(count)} год` : `в ${pluralize(count)} год`;
        sum.textContent = sumToReturn > deductionPerYear ? `${splitNumber(deductionPerYear)} рублей ` : `${splitNumber(sumToReturn)} рублей `;
        sum.appendChild(year);
        payments.appendChild(newPayment);
        sumToReturn -= deductionPerYear;
      }
      window.setTimeout(() => {
        loaderToggle(loader);
        let paymentCurrentNodes = popup.querySelectorAll('.check');
        paymentCurrentNodes.forEach(payment => {
          paymentGroup.removeChild(payment);
        });
        paymentGroup.appendChild(payments);
        paymentGroup.classList.remove('hidden');
      }, 2000);
      loaderToggle(loader);
    }
  });

  fieldSalary.addEventListener('focus', (evt) => {
    evt.target.style = '';
    removeError(salaryInvalidMsg);
  });

  fieldPrice.addEventListener('focus', (evt) => {
    evt.target.style = '';
    removeError(priceInvalidMsg);
  });
}
