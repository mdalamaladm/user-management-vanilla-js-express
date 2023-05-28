const express = require('express');

const { pgPool } = require('../utils/db.js');
const { authJWTMiddleware } = require('../utils/jwt.js');
const { checkAccessMiddleware } = require('../utils/validation.js');

const permissionsRouter = express.Router();

permissionsRouter.use(authJWTMiddleware);
permissionsRouter.use(checkAccessMiddleware('access-permissions'));

permissionsRouter.route('/')
  .get(async (req, res) => {})
;

module.exports = permissionsRouter;