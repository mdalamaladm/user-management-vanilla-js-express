import { snackbarComponent } from "../components/index.js";
import { headerSidebarLayout } from "../layouts/index.js";
import { setCSS, setPage, setTitle } from "../utils.js";

export async function profilePage () {
  setTitle('Profile');

  setCSS('profile-page', ``);
  
  await setPage({
    page: ({ name, description, photo, role }) => headerSidebarLayout(
      `<div class="profile-page">
        <div class="profile-image-wrapper">
          <img src="${photo}" alt="Profile Photo">
        </div>
        <h1>${name}</h1>
        <h2>${description}</h2>
        <h3>${role}</h3>
      </div>
      `
    ),
    loading: `<div>LOADING BOSS</div>`,
    onLoad: async () => {
      const token = localStorage.getItem('token');

      const rawResponse = await fetch('http://localhost:5000/profile', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      });

      const response = await rawResponse.json();
      
      const message = `${response.code} - ${response.message}`;

      if (response.httpCode >= 400) {
        snackbarComponent('error', message, 2000);

        return {
          isReady: false,
          status: response.code,
          message: response.message,
          data: { page: 'profile-page' }
        };
      } else {
        return {
          isReady: true,
          status: response.code,
          message: response.message,
          data: response.data.profile
        }
      }
    }
  });

  headerSidebarLayout.init('profile-page');
}