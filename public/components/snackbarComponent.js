import { setCSS } from "../utils.js";

export function snackbarComponent (type, message, duration) {
  const snackbarSuccess = (message) => `<p class="snackbar-success">${message}</p>`;
  const snackbarError = (message) => `<p class="snackbar-error">${message}</p>`;

  const snackbarLayout = document.body.querySelector('.snackbar-layout');

  const snackbar = type === 'error' ? snackbarError : snackbarSuccess;

  const wrapper = document.createElement('div');

  wrapper.innerHTML = snackbar(message);

  snackbarLayout.append(wrapper);

  setTimeout(() => {
    wrapper.remove();
  }, duration);
}

snackbarComponent.init = function () {
  setCSS('snackbar-component', `
  .snackbar-layout {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    position: fixed;
    bottom: 50px;
  }
  
  .snackbar-success {
    margin: 10px;
    padding: 20px;
    background-color: rgb(51, 51, 51);
    color: white;
  }
  
  .snackbar-error {
    margin: 10px;
    padding: 20px;
    background-color: rgb(124, 10, 10);
    color: white;
  }
  `);

  const snackbarLayout = document.createElement('div');
  snackbarLayout.classList.add('snackbar-layout');
  document.body.append(snackbarLayout);
}
