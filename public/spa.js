const app = document.getElementById('app');

setCSS('global', `
  html, body, #app {
    height: 100%;
    min-height: 100%;
  }
`);

initSnackbar();
initPage();

async function initPage () {
  const isLogin = localStorage.getItem('token');

  if (isLogin) {
    profilePage();
  } else {
    loginPage();
  }
}

function loginPage () {
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

        removeCSS('login-page');
        profilePage();
      }  
    } catch (e) {
      showSnackbar('error', e, 2000);
    }
  };

  registerButton.onclick = () => {
    removeCSS('login-page');
    registerPage();
  };
}

function registerPage() {
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

        removeCSS('register-page');
        loginPage();
      }
    } catch (e) {
      showSnackbar('error', e, 2000);
    }
  }

  loginButton.onclick = () => {
    removeCSS('register-page');
    loginPage();
  };
}

async function profilePage () {
  setTitle('Profile');

  setCSS('profile-page', ``);
  
  await setPage({
    page: 
      layoutComponent(
        `<div class="profile-page">
          <div class="profile-image-wrapper">
            <img src="" alt="">
          </div>
          <h1>Nama</h1>
          <h2>Deskripsi</h2>
          <h3>Peran</h3>
          <button class="profile-logout-button">Logout</button>
        </div>
        `
      ),
    loading: `<div>LOADING BOSS</div>`,
    isReady: () => new Promise(resolve => setTimeout(() => resolve(true), 3000)) 
  });

  const logoutButton = document.querySelector('.profile-logout-button');

  logoutButton.onclick = () => {
    localStorage.removeItem('token');
    removeCSS('profile-page');
    removeCSS('layout-component');
    loginPage();
  }
}

function layoutComponent (child) {
  setCSS('layout-component', `
  `);

  return `<div class="layout">
  <div class="layout-header"></div>
  <div class="layout-main">
    <div class="layout-sidebar">
      <h1>User Management</h1>
      <div class="layout-nav">
        <button>Profile</button>
        <button>Users</button>
        <button>Roles</button>
        <button>Permissions</button>
      </div>
    </div>
    <div>
      ${child}
    </div>
  </div>
</div>`
}

function initSnackbar () {
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

function showSnackbar (type, message, duration) {
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

function setTitle (title) {
  document.title = title;
}

function setCSS (name, rulesets) {
  const style = document.createElement('style');
  style.classList.add(`${name}-styles`);
  style.innerHTML = rulesets;
  document.head.append(style);
}

function removeCSS (name) {
  const style = document.head.querySelector(`.${name}-styles`);

  style?.remove();
}

async function setPage (pageOption) {
  if (typeof pageOption === 'string') {
    app.innerHTML = pageOption;
  } else {
    app.innerHTML = pageOption.loading;

    if (await pageOption.isReady()) {
      app.innerHTML = pageOption.page;
    }
  }
}