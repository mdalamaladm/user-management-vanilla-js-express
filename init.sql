DROP DATABASE user_management;

CREATE DATABASE user_management;

\c user_management;

CREATE TABLE roles (
  id UUID PRIMARY KEY,
  name VARCHAR
);

CREATE TABLE permissions (
  id UUID PRIMARY KEY,
  name VARCHAR
);

CREATE TABLE roles_permissions (
  role_id UUID,
  permission_id UUID,
  FOREIGN KEY(role_id) REFERENCES roles(id),
  FOREIGN KEY(permission_id) REFERENCES permissions(id)
);

CREATE TABLE users (
  id UUID PRIMARY KEY,
  name VARCHAR,
  description VARCHAR,
  photo VARCHAR,
  username VARCHAR NOT NULL UNIQUE,
  hash VARCHAR,
  role_id UUID,
  FOREIGN KEY(role_id) REFERENCES roles(id)
);

DO $$
DECLARE
  id_user_permission uuid = gen_random_uuid();
  id_profile_permission uuid = gen_random_uuid();
  id_role_permission uuid = gen_random_uuid();
  id_permission_permission uuid = gen_random_uuid();
  id_admin uuid = gen_random_uuid();
  id_user uuid = gen_random_uuid();
  id_admin_user uuid = gen_random_uuid();
BEGIN
  INSERT INTO permissions
  VALUES
    (id_profile_permission, 'access-profile'),
    (id_user_permission, 'access-users'),
    (id_role_permission, 'access-roles'),
    (id_permission_permission, 'access-permissions')
  ;

  INSERT INTO roles
  VALUES
    (id_admin, 'admin'),
    (id_user, 'user')
  ;

  INSERT INTO roles_permissions
  VALUES
    (id_admin, id_user_permission),
    (id_admin, id_profile_permission),
    (id_admin, id_role_permission),
    (id_admin, id_permission_permission),
    (id_user, id_profile_permission)
  ;

  INSERT INTO users
  VALUES (
    id_admin_user,
    'Main Admin',
    'this is Main Admin account',
    'https://picsum.photos/id/8/300/300',
    'admin',
    '$2b$10$2P/p/LXWJmSL43Fu7FqMLePIhTqen0zZDioDnh.hngrpocUpHJAQq',
    id_admin
  );
END $$;
