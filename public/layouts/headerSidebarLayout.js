import { profilePage, usersPage, rolesPage, permissionsPage, loginPage } from "../pages/index.js";
import { removeCSS, setCSS } from "../utils.js";

export function headerSidebarLayout (child) {
  setCSS('header-sidebar-layout', `
    .nav-active {
      background-color: orange;
      color: white;
    }
  `);

  return `<div class="header-sidebar">
  <div class="header-sidebar__header">
    <button class="header-sidebar__logout">
      Logout
    </button>
  </div>
  <div class="header-sidebar__main">
    <div class="header-sidebar__sidebar">
      <h1>User Management</h1>
      <div class="header-sidebar__nav">
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

headerSidebarLayout.init = (currentPage) => {
  const currentName = currentPage.split('-')[0];

  const logoutButton = document.querySelector('.header-sidebar__logout');

  logoutButton.onclick = () => {
    localStorage.removeItem('token');
    removeCSS(currentPage);
    removeCSS('header-sidebar-layout');
    loginPage();
  }

  const navButtons = document.querySelectorAll('.header-sidebar__nav > button');

  Array.from(navButtons).forEach((button) => {
    if (button.innerHTML.toLowerCase() === currentName) {
      button.classList.add('nav-active');
    } else {
      button.onclick = () => {
        removeCSS(currentPage);
        removeCSS('header-sidebar-layout');

        const name = button.innerHTML.toLowerCase();

        if (name === 'profile') profilePage();
        else if (name === 'users') usersPage();
        else if (name === 'roles') rolesPage();
        else if (name === 'permissions') permissionsPage();
      }
    }
  })
}