# User Management Application

## Get Started
1. Clone the repo
```
(example, using SSH)
git clone git@github.com:mdalamaladm/user-management-vanilla-js-express.git
```
2. Go to the directory
```
cd ./user-management-vanilla-js-express
```
3. Install NPM packages
```
npm install
```
4. Init SQL
```
psql -U <username> -d <current_database> -f init.sql
```
5. Set .env with this value
```
PORT_SERVER=<port_server>
PORT_APP=<port_app>
PRIVATE_KEY_JWT=<private_key_jwt>
```
6. Start the server
```
npm run start:server
```
7. Start the app
```
npm run start:app
```

## Pages
1. Login
2. Register
3. Profile
4. Users
5. Roles
6. Permissions

## Roles
1. Admin (Page Number 1, 2 ,3 ,4 ,5, and 6)
2. User (Page Number 1, 2, and 3)
3. Custom (many)

## Actions
1. Create User (Registration)
2. Read User
3. Read User By Id
4. Update User
5. Delete User
6. Login (Token)
7. Create Role
8. Read Role
9. Update Role
10. Delete Role
11. Read Permission

## Models
1. User
- id
- name
- description
- photo
- hash
- role_id
2. Role
- id
- name
3. Permission
- id
- name
4. Role_Permission
- role_id
- permission_id

## Internal Code
1. UM001 - Registration Success
2. UM002 - Login Success
3. UM003 - User Created (Admin)
4. UM004 - User Updated
5. UM005 - User Deleted
6. UM006 - User Fetched
7. UM007 - Role Created
8. UM008 - Role Updated
9. UM009 - Role Deleted
10. UM0010 - Role Fetched
11. UM0011 - Permission Fetched

For Error, Add 'ER' after 'UM'


