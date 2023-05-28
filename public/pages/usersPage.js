import { snackbarComponent } from "../components/index.js";
import { headerSidebarLayout } from "../layouts/index.js";
import { setCSS, setPage, setTitle } from "../utils.js";

export async function usersPage () {
  setTitle('Users');

  setCSS('users-page', ``);
  
  await setPage({
    page: (data) => headerSidebarLayout(
      `<div class="users-page">
        ${JSON.stringify(data)}
      </div>
      `
    ),
    loading: `<div>LOADING BOSS</div>`,
    onLoad: async () => {
      const token = localStorage.getItem('token');

      const rawResponse = await fetch('http://localhost:5000/users', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      });

      const response = await rawResponse.json();
      
      const message = `${response.code} - ${response.message}`;

      if (response.httpCode >= 400) {
        snackbarComponent('error', message, 2000);

        return {
          isReady: false,
          httpCode: response.httpCode,
          code: response.code,
          message: response.message,
          data: { page: 'users-page' },
        };
      } else {
        return {
          isReady: true,
          httpCode: response.httpCode,
          code: response.code,
          message: response.message,
          data: response.data,
        }
      }
    }
  });

  headerSidebarLayout.init('users-page');
}