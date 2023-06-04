const { v4: uuidv4 } = require('uuid'); 
const express = require('express');

const { pgPool } = require('../utils/db.js');
const { authJWTMiddleware } = require('../utils/jwt.js');
const { checkAccessMiddleware, requiredBodyMiddleware } = require('../utils/validation.js');

const rolesRouter = express.Router();

function getRoles (internalCode, internalErrorCode) {
  return async (req, res) => {
    try {
      let roles =
        (await pgPool.query(`SELECT roles.id, roles.name, permissions.id AS permission_id, permissions.name AS permission_name FROM roles_permissions INNER JOIN roles ON roles_permissions.role_id = roles.id INNER JOIN permissions ON roles_permissions.permission_id = permissions.id`)).rows;
  
      roles = roles.reduce((allRoles, current) => {
        const foundIndex = allRoles.findIndex(item => item.id === current.id);
  
        if (foundIndex > -1) {
          allRoles[foundIndex].permission_ids.push(current.permission_id);
          allRoles[foundIndex].permission_names.push(current.permission_name);
        } else {
          allRoles.push({
            id: current.id,
            name: current.name,
            permission_ids: [current.permission_id],
            permission_names: [current.permission_name],
          });
        }
  
        return allRoles;
      }, []);
  
      res.status(200).json({
        httpCode: 200,
        code: internalCode,
        message: 'Roles Fetched',
        data: { roles }
      });
    } catch (e) {
      res.status(500).json({
        httpCode: 500,
        code: internalErrorCode,
        message: e
      });
    }
  }
}

rolesRouter.use(authJWTMiddleware);

rolesRouter.get(
  '/references',
  checkAccessMiddleware(['access-users-reference-roles']),
  getRoles('UMREF001', 'UMREFR001'),
);

rolesRouter.use(checkAccessMiddleware('access-roles'));

rolesRouter.route('/')
  .get(getRoles('UM0010', 'UMER0010'))
  .post(
    requiredBodyMiddleware('UMER0011', ['name', 'permission_ids']),
    async (req, res) => {
      try {
        const id = uuidv4();
        const { name, permission_ids } = req.body;

        await pgPool.query('BEGIN');

        const role =
          (await pgPool.query(`INSERT INTO roles VALUES('${id}', '${name}');`));

        for (const permissionId of permission_ids) {
          await pgPool.query(`INSERT INTO roles_permissions VALUES('${id}', '${permissionId}');`);
        }

        await pgPool.query('COMMIT');

        res.status(200).json({
          httpCode: 200,
          code: 'UM0011',
          message: 'Role Created',
          data: { role }
        });
      } catch (e) {
        await pgPool.query('ROLLBACK')

        res.status(500).json({
          httpCode: 500,
          code: 'UMER0011',
          message: e.message
        });
      }
    }
  )

rolesRouter.route('/:id')
  .put(
    requiredBodyMiddleware('UMER0012', ['name', 'permission_ids']),
    async (req, res) => {
      try {
        const { id: roleId } = req.params;
        const { name, removed_permission_ids, added_permission_ids } = req.body;

        await pgPool.query('BEGIN');

        const role =
          (await pgPool.query(`UPDATE roles SET name = '${name}' WHERE id = '${roleId}';`));

        for (const permissionId of removed_permission_ids) {
          await pgPool.query(`DELETE FROM roles_permissions WHERE role_id = '${roleId}' AND permission_id = '${permissionId}';`);
        }

        for (const permissionId of added_permission_ids) {
          await pgPool.query(`INSERT INTO roles_permissions VALUES('${roleId}', '${permissionId}');`);
        }

        await pgPool.query('COMMIT');

        res.status(200).json({
          httpCode: 200,
          code: 'UM0012',
          message: 'Role Updated',
          data: { role }
        });
      } catch (e) {
        await pgPool.query('ROLLBACK')

        res.status(500).json({
          httpCode: 500,
          code: 'UMER0012',
          message: e.message
        });
      }
    }
  )
  .delete(async(req, res) => {
    try {
      const { id: roleId } = req.params;

      const role =
        (await pgPool.query(`DELETE FROM roles WHERE id = '${roleId}'`));

      res.status(200).json({
        httpCode: 200,
        code: 'UM0013',
        message: 'User Deleted',
        data: { role }
      });
    } catch (e) {
      res.status(500).json({
        httpCode: 500,
        code: 'UMER0013',
        message: e.message
      });
    }
  })
;

module.exports = rolesRouter;