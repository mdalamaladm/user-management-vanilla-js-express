const app = document.getElementById('app');

window.addEventListener('locationchange', function () {
  console.log('location changed!');
});

init();

async function init () {
  const isLogin = localStorage.getItem('token');

  if (isLogin) {
    profilePage();
  } else {
    loginPage();
  }
}

function loginPage () {
  document.title = 'Login';
  app.innerHTML = `
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
  `;

  const loginForm = document.querySelector('.login-form');
  const registerButton = document.querySelector('.register-button');

  loginForm.onsubmit = async (event) => {
    event.preventDefault();
    try {
      const username = document.getElementById('login-username').value;
      const password = document.getElementById('login-password').value;
  
      const rawResponse = await fetch('http://localhost:5000/user/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
  
      const response = await rawResponse.json();
      
      const message = `${response.code} - ${response.message}`;

      if (response.httpCode >= 400) {
        showSnackbar('error', message, 2000);
      } else {
        localStorage.setItem('token', response.data.token);

        showSnackbar('success', message, 2000);

        document.getElementById('login-username').value = '';
        document.getElementById('login-password').value = '';

        profilePage();
      }  
    } catch (e) {
      showSnackbar('error', e, 2000);
    }
  };

  registerButton.onclick = registerPage;
}

function registerPage() {
  document.title = 'Register';
  app.innerHTML = `
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
  `;

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
  
      const rawResponse = await fetch('http://localhost:5000/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, photo, username, password })
      });
  
      const response = await rawResponse.json();
      
      const message = `${response.code} - ${response.message}`;

      if (response.httpCode >= 400) {
        showSnackbar('error', message, 2000);
      } else {
        showSnackbar('success', message, 2000);

        document.getElementById('register-name').value = '';
        document.getElementById('register-description').value = '';
        document.getElementById('register-photo').value = '';
        document.getElementById('register-username').value = '';
        document.getElementById('register-password').value = '';

        loginPage();
      }
    } catch (e) {
      showSnackbar('error', e, 2000);
    }
  }

  loginButton.onclick = loginPage;
}

async function profilePage () {
  document.title = 'Profile';
  app.innerHTML = `
    <div>INI ADALAH PROFILE PAGE</div>
  `;
}

function showSnackbar (type, message, duration) {
  const snackbarSuccess = (message) => `<p class="snackbar-success">${message}</p>`;
  const snackbarError = (message) => `<p class="snackbar-error">${message}</p>`;

  const layout = document.createElement('div');
  layout.classList.add('snackbar-layout');
  
  const snackbar = type === 'error' ? snackbarError : snackbarSuccess;

  layout.innerHTML = snackbar(message);

  app.append(layout);

  setTimeout(() => {
    layout.remove();
  }, duration)
}