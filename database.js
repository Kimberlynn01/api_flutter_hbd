const mysql = require("mysql2");

const createDBConnection = () => {
  const db = mysql.createConnection({
    host: 'autorack.proxy.rlwy.net',
    port: 17500,
    user: 'root', 
    password: 'RhkEcIqbDpJPYmrxYQRHMpCxKynQjDLy', 
    database: 'railway'
  });

  db.connect((err) => {
    if (err) {
      console.error("Error connecting: " + err.stack);
      return;
    }
    console.log("Terhubung ke database MySQL.");
  });

  return db;
};

module.exports = createDBConnection;
