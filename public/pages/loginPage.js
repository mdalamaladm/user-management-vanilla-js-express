import { snackbarComponent } from "../components/index.js";
import { removeCSS, setCSS, setPage, setTitle } from "../utils.js";
import { profilePage } from "./profilePage.js";
import { registerPage } from "./registerPage.js";

export function loginPage () {
  setTitle('Login');

  setCSS('login-page', `
  .login-page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
  
  .login-form {
    display: flex;
    flex-direction: column;
    width: 400px;
    height: 400px;
  }
  
  .login-form h1 {
    align-self: center;
  }
  
  .login-form input {
    margin: 10px 0;
  }
  `);

  setPage(`
  <div class="login-page">
    <form class="login-form">
      <h1>Login</h1>
      <label>
        <span>Username</span>
        <input type="text" name="login-username" id="login-username">
      </label>
      <label>
        <span>Password</span>
        <input type="password" name="login-password" id="login-password">
      </label>
      <button type="submit">Submit</button>
      <button class="register-button" type="button">Register</button>
    </form>
  </div>
  `);

  const loginForm = document.querySelector('.login-form');
  const registerButton = document.querySelector('.register-button');

  loginForm.onsubmit = async (event) => {
    event.preventDefault();
    try {
      const username = document.getElementById('login-username').value;
      const password = document.getElementById('login-password').value;
  
      const rawResponse = await fetch('http://localhost:5000/api/users/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
  
      const response = await rawResponse.json();
      
      const message = `${response.code} - ${response.message}`;

      if (response.httpCode >= 400) {
        snackbarComponent('error', message, 2000);
      } else {
        localStorage.setItem('token', response.data.token);

        snackbarComponent('success', message, 2000);

        removeCSS('login-page');
        profilePage();
      }  
    } catch (e) {
      snackbarComponent('error', e, 2000);
    }
  };

  registerButton.onclick = () => {
    removeCSS('login-page');
    registerPage();
  };
}