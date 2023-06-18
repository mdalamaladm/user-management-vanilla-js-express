require('dotenv').config();

const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT;

const profileRouter = require('./routers/profileRouter.js');
const usersRouter = require('./routers/usersRouter.js');
const rolesRouter = require('./routers/rolesRouter.js');
const permissionsRouter = require('./routers/permissionsRouter.js');

const app = express();

app.use(express.static('public'));

app.use(cors());
app.use(express.json());

app.use('/profile', profileRouter);
app.use('/users', usersRouter);
app.use('/roles', rolesRouter);
app.use('/permissions', permissionsRouter);


app.listen(PORT, () => console.log(`Listening to User Management, port ${PORT}`));