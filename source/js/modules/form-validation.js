'use strict'
import { popup } from '../utils/constants'
import { closePopup } from '../modules/popup-toggle'

// Функция валидации формы делает кнопку валидации недоступной для пользователя, пока не будет выбран хотя бы один чекбокс.

export default () => {
  if (!popup) return
  const submitButton = popup.querySelector('.popup__form-submit');
  const form = popup.querySelector('form');
  const fields = form.querySelectorAll('.popup__field input[type="text"]');
  const paymentGroup = form.querySelector('.popup__payment-group');

  submitButton.disabled = true;

  const isAnyChecked = (checkboxes) => {
    let isChecked = false;
    checkboxes.forEach(checkbox => {
      if (checkbox.checked) {
        isChecked = true;
        return;
      }
    });

    return !isChecked;
  }

  paymentGroup.addEventListener('click', evt => {
    let targetParent = evt.target.closest('.check__label');
    if (targetParent) {
      let paymentChecks = paymentGroup.querySelectorAll('input[name="платеж"]');
      submitButton.disabled = isAnyChecked(paymentChecks);
    }
  });

  submitButton.addEventListener('click', evt => {
    evt.preventDefault();
    form.submit();
    fields.forEach(field => {
      field.value = '';
      field.style = '';
    });
    paymentGroup.classList.add('hidden');
    closePopup();
  });

}


