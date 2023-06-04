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

      const hasRole = user.role_id;

      if (!hasRole) {
        return res.status(400).json({
          httpCode: 400,
          code: 'UMER002',
          message: 'This account doesn\'t have any access to the application'
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

usersRouter.route('/')
  .get(async (req, res) => {
    try {
      const users =
        (await pgPool.query(`SELECT users.id, users.name, users.description, users.photo, users.username, users.hash, roles.name AS role_name, roles.id AS role_id FROM users LEFT JOIN roles ON users.role_id = roles.id`)).rows;

      res.status(200).json({
        httpCode: 200,
        code: 'UM006',
        message: 'Users Fetched',
        data: { users }
      });
    } catch (e) {
      res.status(500).json({
        httpCode: 500,
        code: 'UMER006',
        message: e
      });
    }
  })
  .post(
    requiredBodyMiddleware('UMER007', ['name', 'username', 'hash', 'role_id']),
    async (req, res) => {
      try {
        const id = uuidv4();

        let setValues = [];
        let columnNames = [];

        for (const name in req.body) {
          columnNames.push(name);

          if (name === 'hash') {
            setValues.push(`'${await bcrypt.hash(req.body[name], 10)}'`);
          } else {
            setValues.push(`'${req.body[name]}'`);
          }
        }

        const user =
          (await pgPool.query(`INSERT INTO users(id, ${columnNames.join(',')}) VALUES('${id}', ${setValues.join(',')});`));

        res.status(200).json({
          httpCode: 200,
          code: 'UM007',
          message: 'User Created',
          data: { user }
        });
      } catch (e) {
        res.status(500).json({
          httpCode: 500,
          code: 'UMER007',
          message: e.message
        });
      }
    }
  )

usersRouter.route('/:id')
  .put(
    requiredBodyMiddleware('UMER008', ['name', 'username', 'role_id']),
    async (req, res) => {
      try {
        const { id: userId } = req.params;

        if (!req.body.hash) delete req.body.hash;

        let setValues = []

        for (const name in req.body) {
          if (name === 'hash') {
            setValues.push(`${name} = '${await bcrypt.hash(req.body[name], 10)}'`);
          } else {
            setValues.push(`${name} = '${req.body[name]}'`);
          }
        }

        const user =
          (await pgPool.query(`UPDATE users SET ${setValues.join(',')} WHERE id = '${userId}';`));

        res.status(200).json({
          httpCode: 200,
          code: 'UM008',
          message: 'User Updated',
          data: { user }
        });
      } catch (e) {
        res.status(500).json({
          httpCode: 500,
          code: 'UMER008',
          message: e.message
        });
      }
    }
  )
  .delete(async (req, res) => {
    try {
      const { id: userId } = req.params;

      const user =
        (await pgPool.query(`DELETE FROM users WHERE id = '${userId}'`));

      res.status(200).json({
        httpCode: 200,
        code: 'UM009',
        message: 'User Deleted',
        data: { user }
      });
    } catch (e) {
      res.status(500).json({
        httpCode: 500,
        code: 'UMER009',
        message: e.message
      });
    }
  })

module.exports = usersRouter;