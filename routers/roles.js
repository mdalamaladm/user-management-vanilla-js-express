const { v4: uuidv4 } = require('uuid'); 
const bcrypt = require('bcrypt');
const express = require('express');

const { pgPool } = require('../utils/db.js');
const { authJWTMiddleware } = require('../utils/jwt.js');
const { checkAccessMiddleware } = require('../utils/validation.js');

const rolesRouter = express.Router();

rolesRouter.use(authJWTMiddleware);
rolesRouter.use(checkAccessMiddleware('access-roles'));

rolesRouter.route('/')
  .get(async (req, res) => {
    try {
      const roles =
        (await pgPool.query(`SELECT roles.id, roles.name, permissions.id AS permission_id, permissions.name AS permision FROM roles_permissions INNER JOIN roles ON roles_permissions.role_id = roles.id INNER JOIN permissions ON roles_permissions.permission_id = permissions.id`)).rows;

      res.status(200).json({
        httpCode: 200,
        code: 'UM0010',
        message: 'Roles Fetched',
        data: { roles }
      });
    } catch (e) {
      res.status(500).json({
        httpCode: 500,
        code: 'UMER0010',
        message: e
      });
    }
  })
  .post(async (req, res) => {})
;

rolesRouter.route('/:id')
  .put(async (req, res) => {})
  .delete(async(req, res) => {})
;

module.exports = rolesRouter;