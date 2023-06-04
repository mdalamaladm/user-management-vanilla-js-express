import { dialogComponent, formComponent, snackbarComponent, tableComponent } from "../components/index.js";
import { headerSidebarLayout } from "../layouts/index.js";
import { setCSS, setPage, setTitle } from "../utils.js";

export async function usersPage () {
  setTitle('Users');

  setCSS('users-page', ``);

  const columns = {
    name: 'Name',
    description: 'Description',
    photo: 'Photo',
    username: 'Username',
    role_name: 'Role'
  };
  
  const { data, isError } = await setPage({
    page: (data) => headerSidebarLayout(
      `<div class="users-page">
        <button class="add-button">Add</button>
        ${tableComponent('users', {
          columns,
          data: data.users,
          edit: true,
          remove: true,
        })}
      </div>
      `
    ),
    loading: `<div>LOADING BOSS</div>`,
    onLoad: async () => {
      const token = localStorage.getItem('token');

      const rawResponseUsers = await fetch('http://localhost:5000/users', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      });
      const rawResponseRoles = await fetch('http://localhost:5000/roles/references', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      });

      const responseUsers = await rawResponseUsers.json();
      const responseRoles = await rawResponseRoles.json();
      
      const messageUsers = `${responseUsers.code} - ${responseUsers.message}`;
      const messageRoles = `${responseRoles.code} - ${responseRoles.message}`;

      if (responseRoles.httpCode >= 400) {
        snackbarComponent('error', messageRoles, 2000);
      }

      if (responseUsers.httpCode >= 400) {
        snackbarComponent('error', messageUsers, 2000);

        return {
          isReady: false,
          httpCode: responseUsers.httpCode,
          code: responseUsers.code,
          message: responseUsers.message,
          data: { page: 'users-page' },
        };
      } else {
        return {
          isReady: true,
          httpCode: responseUsers.httpCode,
          code: responseUsers.code,
          message: responseUsers.message,
          data: {
            users: responseUsers.data.users,
            roles: responseRoles?.data?.roles,
          },
        }
      }
    }
  });

  if (isError) return;

  headerSidebarLayout.init('users-page');
  tableComponent.init({
    name: 'users',
    edit: (index) => {
      const closeDialog = dialogComponent(
        formComponent(
          'edit-users',
          {
            name: {
              type: 'text',
              label: 'Name'
            },
            description: {
              type: 'text',
              label: 'Description'
            },
            photo: {
              type: 'text',
              label: 'Photo'
            },
            username: {
              type: 'text',
              label: 'Username'
            },
            hash: {
              type: 'password',
              label: 'Password'
            },
            role_id: {
              type: 'select',
              label: 'Role',
              items: data.roles?.filter((value, index, arr) =>
                index === arr.findIndex((val) => (
                  val.id === value.id
                ))
              ) || [],
              itemText: 'name',
              itemValue: 'id',
            }
          },
          {
            ...data.users[index],
            hash: '',
          }
        )
      );
  
      formComponent.init('edit-users', async (payload) => {
        const token = localStorage.getItem('token');

        const id = data.users[index].id
  
        const rawResponse = await fetch(`http://localhost:5000/users/${id}`, {
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
  
          usersPage();
        }
      });
    },
    remove: (index) => {
      const closeDialog = dialogComponent(`
        <div>
          <p>Are You sure want to remove this user?</p>
          <div>
            <button class="cancel-button-dialog">Cancel</button>
            <button class="remove-button-dialog">Remove</button>
          </div>
        </div>
      `);

      const cancelButtonDialog = document.querySelector('.cancel-button-dialog');
      const removeButtonDialog = document.querySelector('.remove-button-dialog');

      cancelButtonDialog.onclick = closeDialog;

      removeButtonDialog.onclick = async () => {
        const token = localStorage.getItem('token');

        const id = data.users[index].id
  
        const rawResponse = await fetch(`http://localhost:5000/users/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
  
        const response = await rawResponse.json();
        
        const message = `${response.code} - ${response.message}`;
  
        if (response.httpCode >= 400) {
          snackbarComponent('error', message, 2000);
        } else {
          closeDialog();
  
          snackbarComponent('success', message, 2000);
  
          usersPage();
        }
      }
    }
  });

  const addButton = document.querySelector('.add-button');

  addButton.onclick = () => {
    const closeDialog = dialogComponent(
      formComponent(
        'add-users',
        {
          name: {
            type: 'text',
            label: 'Name'
          },
          description: {
            type: 'text',
            label: 'Description'
          },
          photo: {
            type: 'text',
            label: 'Photo'
          },
          username: {
            type: 'text',
            label: 'Username'
          },
          hash: {
            type: 'password',
            label: 'Password'
          },
          role_id: {
            type: 'select',
            label: 'Role',
            items: data.roles?.filter((value, index, arr) =>
              index === arr.findIndex((val) => (
                val.id === value.id
              ))
            ) || [],
            itemText: 'name',
            itemValue: 'id',
          }
        }
      )
    );

    formComponent.init('add-users', async (payload) => {
      const token = localStorage.getItem('token');

      const rawResponse = await fetch(`http://localhost:5000/users`, {
        method: 'POST',
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

        usersPage();
      }
    });
  }
}