import { dialogComponent, formComponent, snackbarComponent } from "../components/index.js";
import { headerSidebarLayout } from "../layouts/index.js";
import { setCSS, setPage, setTitle } from "../utils.js";

export async function profilePage () {
  setTitle('Profile');

  setCSS('profile-page', ``);
  
  const { data, isError } = await setPage({
    page: ({ name, description, photo, role }) => headerSidebarLayout(
      `<div class="profile-page">
        <div class="profile-image-wrapper">
          <img src="${photo}" alt="Profile Photo">
        </div>
        <h1>${name}</h1>
        <h2>${description}</h2>
        <h3>${role}</h3>
        <button class="edit-button">Edit</button>
        <button class="delete-button">Delete Account</button>
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
          httpCode: response.httpCode,
          code: response.code,
          message: response.message,
          data: { page: 'profile-page' }
        };
      } else {
        return {
          isReady: true,
          httpCode: response.httpCode,
          code: response.code,
          message: response.message,
          data: response.data.profile
        }
      }
    }
  });

  if (isError) return;

  headerSidebarLayout.init('profile-page');

  const editButton = document.querySelector('.edit-button');

  editButton.onclick = () => {
    const closeDialog = dialogComponent(
      formComponent(
        'edit-profile',
        {
          photo: {
            type: 'text',
            label: 'Photo'
          },
          name: {
            type: 'text',
            label: 'Name'
          },
          description: {
            type: 'text',
            label: 'Description'
          },
          username: {
            type: 'text',
            label: 'Username'
          }
        },
        {
          photo: data.photo,
          name: data.name,
          description: data.description,
          username: data.username,
        }
      )
    );

    formComponent.init('edit-profile', async (payload) => {
      console.log(payload);

      const token = localStorage.getItem('token');

      const rawResponse = await fetch('http://localhost:5000/profile', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const response = await rawResponse.json();
      
      const message = `${response.code} - ${response.message}`;

      if (response.httpCode >= 400) {
        snackbarComponent('error', message, 2000);
      } else {
        closeDialog();

        snackbarComponent('success', message, 2000);

        profilePage();
      }
    });
  }
}