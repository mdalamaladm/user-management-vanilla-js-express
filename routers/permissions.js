const express = require('express');

const { pgPool } = require('../utils/db.js');
const { authJWTMiddleware } = require('../utils/jwt.js');
const { checkAccessMiddleware } = require('../utils/validation.js');

const permissionsRouter = express.Router();

permissionsRouter.use(authJWTMiddleware);
permissionsRouter.use(checkAccessMiddleware('access-permissions'));

permissionsRouter.route('/')
  .get(async (req, res) => {
    try {
      const roles =
        (await pgPool.query(`SELECT permissions.id, permissions.name FROM permissions`)).rows;

      res.status(200).json({
        httpCode: 200,
        code: 'UM0014',
        message: 'Permissions Fetched',
        data: { roles }
      });
    } catch (e) {
      res.status(500).json({
        httpCode: 500,
        code: 'UMER0014',
        message: e
      });
    }
  })
;

module.exports = permissionsRouter;