const bcrypt = require('bcrypt');
const express = require('express');

const { pgPool } = require('../utils/db.js');
const { authJWTMiddleware } = require('../utils/jwt.js');
const { checkAccessMiddleware, requiredBodyMiddleware } = require('../utils/validation.js');

const profileRouter = express.Router();

profileRouter.use(authJWTMiddleware);
profileRouter.use(checkAccessMiddleware('access-profile'));

profileRouter.route('/')
  .get(async (req, res) => {
    try {
      const { userId } = req.user;

      const profile =
        (await pgPool.query(`SELECT users.id, users.name, users.description, users.photo, roles.name AS role FROM users INNER JOIN roles ON users.role_id = roles.id WHERE users.id = '${userId}'`)).rows[0];

      res.status(200).json({
        httpCode: 200,
        code: 'UM003',
        message: 'Profile Fetched',
        data: { profile }
      });
    } catch (e) {
      res.status(500).json({
        httpCode: 500,
        code: 'UMER003',
        message: e
      });
    }
  })
  .put(
    requiredBodyMiddleware('UMER'),
    async (req, res) => {
      try {
        const { userId } = req.user;

        const profile =
          (await pgPool.query(`SELECT users.id, users.name, users.description, users.photo, roles.name AS role FROM users INNER JOIN roles ON users.role_id = roles.id WHERE users.id = '${userId}'`)).rows[0];

        res.status(200).json({
          httpCode: 200,
          code: 'UM003',
          message: 'Profile Fetched',
          data: { profile }
        });
      } catch (e) {
        res.status(500).json({
          httpCode: 500,
          code: 'UMER003',
          message: e
        });
      }
    }
  )
  .delete(async (req, res) =>{})
;

module.exports = profileRouter;
