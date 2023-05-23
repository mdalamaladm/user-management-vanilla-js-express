require('dotenv').config();

const cors = require('cors');
const pg = require('pg');
const { v4: uuidv4 } = require('uuid'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');
const PORT = process.env.PORT_SERVER;
const PRIVATE_KEY_JWT = process.env.PRIVATE_KEY_JWT;

const pgPool = new pg.Pool({
  host: 'localhost',
  user: 'postgres',
  password: 'postgres',
  database: 'user_management',
});

const server = express();

server.use(cors());
server.use(express.json());

const userRouter = express.Router();

userRouter.post('/', async (req, res, next) => {
  try {
    const id = uuidv4();

    const { name, description, photo, username, password } = req.body;

    if (!name) {
      return res.status(400).json({
        httpCode: 400,
        code: 'UMER001',
        message: `'name' must be filled`
      });
    }

    if (!username) {
      return res.status(400).json({
        httpCode: 400,
        code: 'UMER001',
        message: `'username' must be filled`
      });
    }

    if (!password) {
      return res.status(400).json({
        httpCode: 400,
        code: 'UMER001',
        message: `'password' must be filled`
      });
    }

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
});

userRouter.post('/token', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user =
      (await pgPool.query(`SELECT hash FROM users WHERE users.username = '${username}'`)).rows[0];

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

    const payload = { roleId: user.role_id };

    const token = jwt.sign(payload, PRIVATE_KEY_JWT);

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
});

userRouter.post('/access', async (req, res, next) => {
  try {
    const { access } = req.body;

    const user =
      (await pgPool.query(`SELECT hash FROM users WHERE users.username = '${username}'`)).rows[0];

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

    const token = jwt.sign(payload, PRIVATE_KEY_JWT);

    res.status(200).json({
      httpCode: 200,
      code: 'UM002',
      message: 'Login Success',
      data: { token }
    });
  } catch (e) {
    res.status(500).json({
      httpCode: 500,
      code: 'UMER002',
      message: e
    });
  }
});

server.use('/user', userRouter);

server.listen(PORT, () => console.log(`Listening to User Management API server, port ${PORT}`));