const pg = require('pg');

const pgPool = new pg.Pool({
  host: 'localhost',
  user: 'postgres',
  password: 'postgres',
  database: 'user_management',
});

exports.pgPool = pgPool;