const { v4: uuidv4 } = require('uuid'); 
const bcrypt = require('bcrypt');
const express = require('express');

const { pgPool } = require('../utils/db.js');
const { authJWTMiddleware, getJWT } = require('../utils/jwt.js');
const { checkAccessMiddleware, requiredBodyMiddleware } = require('../utils/validation.js');

const usersRouter = express.Router();

usersRouter.post('/registration',
  requiredBodyMiddleware('UMER001', ['name', 'username', 'password']),
  async (req, res) => {
    try {
      const id = uuidv4();

      const { name, description, photo, username, password } = req.body;

      const roleId =
        (await pgPool.query(`SELECT id FROM roles WHERE roles.name = 'user'`))?.rows[0].id;

      const thePassword = await bcrypt.hash(password, 10);

      const query = `
        INSERT INTO users
        VALUES (
          '${id}',
          '${name}',
          '${description}',
          '${photo}',
          '${username}',
          '${thePassword}',
          '${roleId}'
        );
      `;

      await pgPool.query(query);

      const data = { id };

      res.status(200).json({
        httpCode: 200,
        code: 'UM001',
        message: 'Registration Success',
        data
      });
    } catch (e) {
      const errorMessage = e.message;

      res.status(500).json({
        httpCode: 500,
        code: 'UMER001',
        message: errorMessage
      });
    }
  }
);

usersRouter.post('/token',
  async (req, res) => {
    try {
      const { username, password } = req.body;

      const user =
        (await pgPool.query(`SELECT id, hash, role_id FROM users WHERE users.username = '${username}'`)).rows[0];

      if (!user) {
        return res.status(400).json({
          httpCode: 400,
          code: 'UMER002',
          message: 'Username or Password is invalid'
        });
      }

      const userPassword = user.hash;

      const isPasswordValid = await bcrypt.compare(password, userPassword);

      if (!isPasswordValid) {
        return res.status(400).json({
          httpCode: 400,
          code: 'UMER002',
          message: 'Username or Password is invalid'
        });
      }

      const payload = { userId: user.id, roleId: user.role_id };

      const token = getJWT(payload);

      res.status(200).json({
        httpCode: 200,
        code: 'UM002',
        message: 'Login Success',
        data: { token }
      });
    } catch (e) {
      const errorMessage = e.message;

      res.status(500).json({
        httpCode: 500,
        code: 'UMER002',
        message: errorMessage
      });
    }
  }
);

usersRouter.use(authJWTMiddleware);
usersRouter.use(checkAccessMiddleware('access-users'));



module.exports = usersRouter;