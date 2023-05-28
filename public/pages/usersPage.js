import { snackbarComponent } from "../components/index.js";
import { headerSidebarLayout } from "../layouts/index.js";
import { setCSS, setPage, setTitle } from "../utils.js";

export async function usersPage () {
  setTitle('Users');

  setCSS('users-page', ``);
  
  await setPage({
    page: () => headerSidebarLayout(
      `<div class="users-page">
        USERS PAGE
      </div>
      `
    ),
    loading: `<div>LOADING BOSS</div>`,
    onLoad: async () => {
      const response = { httpCode: 200 };

      if (response.httpCode >= 400) {
        snackbarComponent('error', message, 2000);

        return {
          isReady: false,
          status: 400
        };
      } else {
        return {
          isReady: true,
          status: 200,
          data: {}
        }
      }
    }
  });

  headerSidebarLayout.init('users-page');
}