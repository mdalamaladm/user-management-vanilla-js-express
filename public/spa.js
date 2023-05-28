import { snackbarComponent } from "./components/index.js";
import { loginPage, profilePage } from "./pages/index.js";
import { setCSS } from "./utils.js";

setCSS('global', `
  html, body, #app {
    height: 100%;
    min-height: 100%;
  }
`);

snackbarComponent.init();
initPage();

async function initPage () {
  const isLogin = localStorage.getItem('token');

  if (isLogin) {
    profilePage();
  } else {
    loginPage();
  }
}
