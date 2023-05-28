require('dotenv').config();

const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT_SERVER;

const profileRouter = require('./routers/profile.js');
const usersRouter = require('./routers/users.js');
const rolesRouter = require('./routers/roles.js');
const permissionsRouter = require('./routers/permissions.js');

const server = express();

server.use(cors());
server.use(express.json());

server.use('/profile', profileRouter);
server.use('/users', usersRouter);
server.use('/roles', rolesRouter);
server.use('/permissions', permissionsRouter);


server.listen(PORT, () => console.log(`Listening to User Management API server, port ${PORT}`));