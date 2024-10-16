const mysql = require("mysql2");

const createDBConnection = () => {
  const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "db_hbd",
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

module.exports = createDBConnection; // Mengekspor fungsi untuk membuat koneksi database
