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

const apiRouter = express.Router();

apiRouter.use(cors());
apiRouter.use(express.json());

apiRouter.use('/profile', profileRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/roles', rolesRouter);
apiRouter.use('/permissions', permissionsRouter);

app.use('/api', apiRouter);


app.listen(PORT, () => console.log(`Listening to User Management, port ${PORT}`));