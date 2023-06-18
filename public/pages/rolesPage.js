import { dialogComponent, formComponent, snackbarComponent, tableComponent } from "../components/index.js";
import { headerSidebarLayout } from "../layouts/index.js";
import { setCSS, setPage, setTitle } from "../utils.js";

export async function rolesPage () {
  setTitle('Roles');

  setCSS('roles-page', ``);

  const columns = {
    name: 'Name',
    permission_names: 'Permissions'
  };
  
  const { data, isError } = await setPage({
    page: (data) => headerSidebarLayout(
      `<div class="roles-page">
        <button class="add-button">Add</button>
        ${tableComponent('roles', {
          columns,
          data: data.roles,
          edit: true,
          remove: true,
        })}
      </div>
      `
    ),
    loading: `<div>LOADING BOSS</div>`,
    onLoad: async () => {
      const token = localStorage.getItem('token');

      const rawResponseRoles = await fetch('http://localhost:5000/api/roles', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      });
      const rawResponsePermissions = await fetch('http://localhost:5000/api/permissions/references', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      });

      const responseRoles = await rawResponseRoles.json();
      const responsePermissions = await rawResponsePermissions.json();
      
      const messageRoles = `${responseRoles.code} - ${responseRoles.message}`;
      const messagePermissions = `${responsePermissions.code} - ${responsePermissions.message}`;

      if (responsePermissions.httpCode >= 400) {
        snackbarComponent('error', messagePermissions, 2000);
      }

      if (responseRoles.httpCode >= 400) {
        snackbarComponent('error', messageRoles, 2000);

        return {
          isReady: false,
          httpCode: responseRoles.httpCode,
          code: responseRoles.code,
          message: responseRoles.message,
          data: { page: 'roles-page' },
        };
      } else {
        return {
          isReady: true,
          httpCode: responseRoles.httpCode,
          code: responseRoles.code,
          message: responseRoles.message,
          data: {
            roles: responseRoles.data.roles,
            permissions: responsePermissions?.data?.permissions,
          },
        }
      }
    }
  });

  if (isError) return;

  headerSidebarLayout.init('roles-page');
  tableComponent.init({
    name: 'roles',
    edit: (index) => {
      const closeDialog = dialogComponent(
        formComponent(
          'edit-roles',
          {
            name: {
              type: 'text',
              label: 'Name'
            },
            permission_ids: {
              type: 'multicheckbox',
              label: 'Permission',
              items: data.permissions || [],
              itemText: 'name',
              itemValue: 'id',
            }
          },
          data.roles[index]
        )
      );
  
      formComponent.init('edit-roles', async (payload) => {
        const token = localStorage.getItem('token');

        const removed_permission_ids = data.roles[index].permission_ids.filter(permissionId => !payload.permission_ids.includes(permissionId));
        const added_permission_ids = payload.permission_ids.filter(permissionId => !data.roles[index].permission_ids.includes(permissionId));

        payload.removed_permission_ids = removed_permission_ids;
        payload.added_permission_ids = added_permission_ids;

        const id = data.roles[index].id
  
        const rawResponse = await fetch(`http://localhost:5000/api/roles/${id}`, {
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
  
          rolesPage();
        }
      });
    },
    remove: (index) => {
      const closeDialog = dialogComponent(`
        <div>
          <p>Are You sure want to remove this role?</p>
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

        const id = data.roles[index].id
  
        const rawResponse = await fetch(`http://localhost:5000/api/roles/${id}`, {
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
  
          rolesPage();
        }
      }
    }
  });

  const addButton = document.querySelector('.add-button');

  addButton.onclick = () => {
    const closeDialog = dialogComponent(
      formComponent(
        'add-roles',
        {
          name: {
            type: 'text',
            label: 'Name'
          },
          permission_ids: {
            type: 'multicheckbox',
            label: 'Role',
            items: data.permissions || [],
            itemText: 'name',
            itemValue: 'id',
          }
        }
      )
    );

    formComponent.init('add-roles', async (payload) => {
      const token = localStorage.getItem('token');

      const rawResponse = await fetch(`http://localhost:5000/api/roles`, {
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

        rolesPage();
      }
    });
  }
}