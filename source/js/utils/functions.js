const body = document.body;

const disableScrolling = () => {
  body.classList.add('body-fixed');
};

const enableScrolling = () => {
  body.classList.remove('body-fixed');
};

const showError = (errorMessage, message) => {
  errorMessage.textContent = message;
  errorMessage.classList.remove('hidden');
};

const removeError = errorMessage => {
  errorMessage.classList.add('hidden');
}

export { disableScrolling, enableScrolling, showError, removeError };
