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

function authJWT (req, res, next) {
  const headerAuth = req.headers.authorization;

  if (headerAuth) {
    const token = headerAuth.split(' ')[1];

    jwt.verify(token, PRIVATE_KEY_JWT, (err, user) => {
      if (err) {
        return res.status(403).json({
          httpCode: 403,
          code: 'UMER0013',
          message: 'Token is invalid'
        });
      }

      req.user = user;
      next();
    })
  } else {
    return res.status(401).json({
      httpCode: 401,
      code: 'UMER0012',
      message: 'Token not found'
    });
  }
};

function checkAccess (permission) {
  return async function (req, res, next) {
    const { roleId } = req?.user;

    const rolesPermissions = await pgPool.query(`SELECT permissions.name FROM roles_permissions INNER JOIN permissions ON permissions.id = roles_permissions.permission_id WHERE roles_permissions.role_id = '${roleId}'`);

    const permissions = rolesPermissions.rows.map(data => data.name);

    if (!permissions.includes(permission)) {
      return res.status(403).json({
        httpCode: 403,
        code: 'UMER0014',
        message: 'User unauthorized'
      });
    }

    next();
  }
}

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

    const token = jwt.sign(payload, PRIVATE_KEY_JWT, { expiresIn: '1h' });

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

userRouter.use(authJWT);

userRouter.get('/profile', checkAccess('access-profile'), async (req, res, next) => {
  try {
    const { userId } = req.user;

    const profile =
      (await pgPool.query(`SELECT users.id, users.name, users.description, users.photo, roles.name AS role FROM users INNER JOIN roles ON users.role_id = roles.id WHERE users.id = '${userId}'`)).rows[0];

    res.status(200).json({
      httpCode: 200,
      code: 'UM0015',
      message: 'User By Id Fetched',
      data: { profile }
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