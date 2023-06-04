import { dialogComponent, snackbarComponent } from "./components/index.js";
import { loginPage, profilePage } from "./pages/index.js";
import { setCSS } from "./utils.js";

setCSS('global', `
  html, body, #app {
    margin: 0;
    height: 100%;
    min-height: 100%;
  }

  table {
    border-right: 1px solid black;
    border-bottom: 1px solid black;
  }
  
  td,
  th {
    border-top: 1px solid black;
    border-left: 1px solid black;
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
