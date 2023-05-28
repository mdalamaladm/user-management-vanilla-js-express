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
  .get(async (req, res) => {})
  .post(async (req, res) => {})
;

rolesRouter.route('/:id')
  .put(async (req, res) => {})
  .delete(async(req, res) => {})
;

module.exports = rolesRouter;