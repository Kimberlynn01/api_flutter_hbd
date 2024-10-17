const express = require("express");
const router = express.Router();
const createDBConnection = require("./database");
const bcryptjs = require("bcryptjs");
const multer = require("multer");
const upload = multer();

router.get("/", (req, res) => {
  const db = createDBConnection();

  const sql = "SELECT * FROM railway.user";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });

  db.end();
});

router.post("/add", upload.none(), async (req, res) => {
  console.log("Request body:", req.body);
  const db = createDBConnection();
  const { username, name, password } = req.body;

  if (!username || !name || !password) {
    return res.status(400).json({ error: "Please provide all required fields." });
  }

  try {
    const hashedPassword = await bcryptjs.hash(password, 10);

    const sql = "INSERT INTO user (username, name, password) VALUES (?, ?, ?)";
    db.query(sql, [username, name, hashedPassword], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      return res.status(201).json({ message: "User Successfully Added!", userId: results.insertId });
    });
  } catch (error) {
    return res.status(500).json({ error: "Error Adding User", details: error.message });
  } finally {
    db.end();
  }
});

router.delete("/delete/:id", async (req, res) => {
  const db = createDBConnection();
  const { id } = req.params;
  const sql = "DELETE FROM user WHERE id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: "User Successfully Deleted!" });
  });
  db.end();
});

module.exports = router;
