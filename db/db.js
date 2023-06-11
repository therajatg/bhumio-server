const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "daretodive",
  host: "localhost",
  port: 5432,
  database: "portfolio",
});

module.exports = pool;
