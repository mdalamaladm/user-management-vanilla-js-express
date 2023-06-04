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
        (await pgPool.query(`SELECT users.id, users.name, users.description, users.photo, users.username, roles.name AS role FROM users INNER JOIN roles ON users.role_id = roles.id WHERE users.id = '${userId}'`)).rows[0];

      if (!profile) {
        return res.status(404).json({
          httpCode: 404,
          code: 'UMER003',
          message: 'Profile Not Found',
        });
      }

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
    requiredBodyMiddleware('UMER004', ['name', 'username']),
    async (req, res) => {
      try {
        const { userId } = req.user;

        if (!req.body.password) delete req.body.password;

        let setValues = []

        for (const name in req.body) {
          if (name === 'password') {
            setValues.push(`${name} = '${await bcrypt.hash(req.body[name], 10)}'`);
          } else {
            setValues.push(`${name} = '${req.body[name]}'`);
          }
        }

        const profile =
          (await pgPool.query(`UPDATE users SET ${setValues.join(',')} WHERE id = '${userId}';`));

        res.status(200).json({
          httpCode: 200,
          code: 'UM004',
          message: 'Profile Updated',
          data: { profile }
        });
      } catch (e) {
        res.status(500).json({
          httpCode: 500,
          code: 'UMER004',
          message: e.message
        });
      }
    }
  )
  .delete(async (req, res) => {
    try {
      const { userId } = req.user;

      const profile =
        (await pgPool.query(`DELETE FROM users WHERE id = '${userId}'`));

      res.status(200).json({
        httpCode: 200,
        code: 'UM005',
        message: 'Profile Deleted',
        data: { profile }
      });
    } catch (e) {
      res.status(500).json({
        httpCode: 500,
        code: 'UMER005',
        message: e
      });
    }
  })
;

module.exports = profileRouter;
