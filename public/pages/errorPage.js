import { snackbarComponent } from "../components/index.js";
import { headerSidebarLayout } from "../layouts/index.js";
import { removeCSS, setCSS, setPage, setTitle } from "../utils.js";
import { loginPage } from "./loginPage.js";
import { profilePage } from "./profilePage.js";

export async function errorPage (errorCode, errorMessage, fromPage) {
  setTitle(`Error ${errorCode}`);

  setCSS('error-page', ``);
  
  await setPage({
    page: () => headerSidebarLayout(`
      <div class="error-page">
        <h1>${errorCode}</h1>
        <h2>${errorMessage}</h2>
        <button class="back-button">Go To Profile</button>
        <button class="login-button">Login</button>
      </div>
      `
    ),
    loading: `<div>LOADING BOSS</div>`,
    onLoad: async () => {
      const response = { httpCode: 200 };

      if (response.httpCode >= 400) {
        snackbarComponent('error', message, 2000);

        return {
          isReady: false,
          status: 400
        };
      } else {
        return {
          isReady: true,
          status: 200,
          data: {}
        }
      }
    }
  });

  headerSidebarLayout.init('error-page');

  const backButton = document.querySelector('.back-button');
  const loginButton = document.querySelector('.login-button');

  if (fromPage === 'profile-page') {
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