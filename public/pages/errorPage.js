import { removeCSS, setCSS, setPage, setTitle } from "../utils.js";
import { loginPage } from "./loginPage.js";
import { profilePage } from "./profilePage.js";

export function errorPage (errorHttpCode, errorMessage, fromPage) {
  const isUnauthorized = errorHttpCode === 403 && errorMessage === 'User unauthorized';
  const isTokenInvalid = errorHttpCode === 403 && errorMessage === 'Token is invalid';
  const isProfileNotFound = errorHttpCode === 404 && errorMessage === 'Profile Not Found';
  const isFromProfilePage = fromPage === 'profile-page';

  setTitle(`Error ${errorHttpCode}`);

  setCSS('error-page', ``);
  
  setPage(`
    <div class="error-page">
      <h1>${errorHttpCode}</h1>
      <h2>${errorMessage}</h2>
      <button class="back-button">Go To Profile</button>
      <button class="login-button">Login</button>
    </div>
  `);

  const backButton = document.querySelector('.back-button');
  const loginButton = document.querySelector('.login-button');

  if (isProfileNotFound || isTokenInvalid || (isFromProfilePage && isUnauthorized)) {
    backButton.hidden = true;
  } else {
    loginButton.hidden = true;
  }

  backButton.onclick = () => {
    removeCSS('error-page');
    profilePage();
  };

  loginButton.onclick = () => {
    localStorage.removeItem('token');
    removeCSS('error-page');

    loginPage();
  };
}