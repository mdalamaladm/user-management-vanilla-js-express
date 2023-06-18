import { snackbarComponent } from "../components/index.js";
import { removeCSS, setCSS, setPage, setTitle } from "../utils.js";
import { loginPage } from "./loginPage.js";


export function registerPage() {
  setTitle('Register');

  setCSS('register-page', `
  .register-page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
  
  .register-form {
    display: flex;
    flex-direction: column;
    width: 400px;
    height: 400px;
  }
  
  .register-form h1 {
    align-self: center;
  }
  
  .register-form input {
    margin: 10px 0;
  }
  `);

  setPage(`
  <div class="register-page">
    <form class="register-form">
      <h1>Register</h1>
      <label>
        <span>Nama</span>
        <input type="text" name="register-name" id="register-name">
      </label>
      <label>
        <span>Description</span>
        <input type="text" name="register-description" id="register-description">
      </label>
      <label>
        <span>Photo</span>
        <input type="text" name="register-photo" id="register-photo">
      </label>
      <label>
        <span>Username</span>
        <input type="text" name="register-username" id="register-username">
      </label>
      <label>
        <span>Password</span>
        <input type="password" name="register-password" id="register-password">
      </label>
      <button type="submit">Submit</button>
      <button class="login-button" type="button">Login</button>
    </form>
  </div>
  `);

  const registerForm = document.querySelector('.register-form');
  const loginButton = document.querySelector('.login-button');

  registerForm.onsubmit = async (event) => {
    event.preventDefault();
    try {
      const name = document.getElementById('register-name').value;
      const description = document.getElementById('register-description').value;
      const photo = document.getElementById('register-photo').value;
      const username = document.getElementById('register-username').value;
      const password = document.getElementById('register-password').value;
  
      const rawResponse = await fetch('http://localhost:5000/api/users/registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, photo, username, password })
      });
  
      const response = await rawResponse.json();
      
      const message = `${response.code} - ${response.message}`;

      if (response.httpCode >= 400) {
        snackbarComponent('error', message, 2000);
      } else {
        snackbarComponent('success', message, 2000);

        document.getElementById('register-name').value = '';
        document.getElementById('register-description').value = '';
        document.getElementById('register-photo').value = '';
        document.getElementById('register-username').value = '';
        document.getElementById('register-password').value = '';

        removeCSS('register-page');
        loginPage();
      }
    } catch (e) {
      snackbarComponent('error', e, 2000);
    }
  }

  loginButton.onclick = () => {
    removeCSS('register-page');
    loginPage();
  };
}