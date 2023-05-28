import { dialogComponent, snackbarComponent } from "./components/index.js";
import { loginPage, profilePage } from "./pages/index.js";
import { setCSS } from "./utils.js";

setCSS('global', `
  html, body, #app {
    margin: 0;
    height: 100%;
    min-height: 100%;
  }
`);

snackbarComponent.init();
dialogComponent.init();
initPage();

async function initPage () {
  const isLogin = localStorage.getItem('token');

  if (isLogin) {
    profilePage();
  } else {
    loginPage();
  }
}
