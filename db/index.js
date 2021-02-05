const mysql = require('mysql');
const util = require('util');
const db = mysql.createConnection({
  host: 'localhost',
  user: 'bangjekss',
  password: 'lolipop9098',
  database: 'backend_2021',
  port: 3306,
});

const query = util.promisify(db.query).bind(db);

module.exports = query;
