const express = require('express');

const { pgPool } = require('../utils/db.js');
const { authJWTMiddleware } = require('../utils/jwt.js');
const { checkAccessMiddleware } = require('../utils/validation.js');

const permissionsRouter = express.Router();

function getPermissions (internalCode, internalErrorCode) {
  return async (req, res) => {
    try {
      const permissions =
        (await pgPool.query(`SELECT permissions.id, permissions.name FROM permissions`)).rows;

      res.status(200).json({
        httpCode: 200,
        code: internalCode,
        message: 'Permissions Fetched',
        data: { permissions }
      });
    } catch (e) {
      res.status(500).json({
        httpCode: 500,
        code: internalErrorCode,
        message: e
      });
    }
  };
}

permissionsRouter.use(authJWTMiddleware);

permissionsRouter.get(
  '/references',
  checkAccessMiddleware(['access-roles-reference-permissions']),
  getPermissions('UMREF002', 'UMREFER002')
)

permissionsRouter.use(checkAccessMiddleware('access-permissions'));

permissionsRouter.route('/')
  .get(getPermissions('UM0014', 'UMER0014'))
;

module.exports = permissionsRouter;