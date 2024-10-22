const mysql = require("mysql2/promise");

const createDBConnection = async () => {
  const db = await mysql.createConnection({
    host: "autorack.proxy.rlwy.net",
    port: 17500,
    user: "root",
    password: "RhkEcIqbDpJPYmrxYQRHMpCxKynQjDLy",
    database: "railway",
  });

  console.log("Terhubung ke database MySQL.");

  return db;
};

module.exports = createDBConnection;
