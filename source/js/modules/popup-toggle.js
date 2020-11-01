'use strict';

import { constants, popup } from '../utils/constants';
import { disableScrolling, enableScrolling } from '../utils/functions';

const ESC_KEY_CODE = constants.keyCode.ESC;
const popupOpen = document.querySelector('.page__button');
const popupOverlay = document.querySelector('.popup__overlay');
const popupCloseBtn = document.querySelector('.popup__close');

const closePopup = () => {
  popup.classList.remove('popup--active');
  enableScrolling();
};

const openPopup = () => {
  popup.classList.add('popup--active');
  disableScrolling();
  document.addEventListener('keydown', documentKeydownHandler);
  popupOverlay.addEventListener('click', overlayClickHandler);
  popupCloseBtn.addEventListener('click', closeBtnClickHandler);
};

const documentKeydownHandler = (evt) => {
  if (evt.keyCode === ESC_KEY_CODE) {
    evt.preventDefault();
    closePopup();
    document.removeEventListener('keydown', documentKeydownHandler);
  }
};

const closeBtnClickHandler = (evt) => {
  evt.preventDefault();
  closePopup();
};

const overlayClickHandler = (evt) => {
  evt.preventDefault();
  closePopup();
};

const showPopup = () => {
  if (popupOpen && popup) {
    popupOpen.addEventListener('click', (evt) => {
      evt.preventDefault();
      openPopup();
    });
  }
};

export { showPopup, closePopup };


