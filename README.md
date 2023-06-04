# User Management Application
This is repository for User Management Application with ExpressJs as Backend and VanillaJS as Frontend

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
1. Login - DONE
2. Register - DONE
3. Profile - DONE
4. Users - 25%
5. Roles - 25%
6. Permissions - 25%

## Layouts
1. Header Sidebar - DONE

## Components
1. Snackbar - DONE
2. Table
3. Form - 50%
4. Dialog

## Roles
1. Admin (Page Number 1, 2 ,3 ,4 ,5, and 6)
2. User (Page Number 1, 2, and 3)
3. Custom (many)

## Actions
1. Registration - DONE
2. Login (Token) - DONE
3. Read Profile - DONE
4. Update Profile
5. Delete Profile
6. Create User - 50%
7. Read User - 50%
8. Update User
9. Delete User
10. Create Role 
11. Read Role - 50%
12. Update Role
13. Delete Role
14. Read Permission - 50%

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
3. UM003 - Profile Fetched
4. UM004 - Profile Updated
5. UM005 - Profile Deleted
6. UM006 - Users Fetched
7. UM007 - User Created
8. UM008 - User Updated
9. UM009 - User Deleted
10. UM0010 - Roles Fetched
11. UM0011 - Role Created
12. UM0012 - Role Updated
13. UM0013 - Role Deleted
14. UM0014 - Permissions Fetched
15. UMER0015 - Token not found
16. UMER0016 - Token is invalid
17. UMER0017 - User unauthorized

## Internal Code (References)
1. UMREF001 - Roles Fetched
2. UMREF002 - Permissions Fetched

For Internal Code Error, Add 'ER' before the number


