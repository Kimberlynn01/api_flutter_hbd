const express = require("express");
const router = express.Router();
const createDBConnection = require("./database");

router.get("/", (req, res) => {
  const db = createDBConnection();

  const sql = "SELECT * FROM user";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });

  db.end();
});

module.exports = router;
