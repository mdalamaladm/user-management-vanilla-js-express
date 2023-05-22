require('dotenv').config();

const fs = require('fs');
const express = require('express');

const app = express();

const PORT = process.env.PORT_APP;

app.use(express.static('public'));

app.listen(PORT, () => console.log(`Listening to User Management App Server, port ${PORT}`));