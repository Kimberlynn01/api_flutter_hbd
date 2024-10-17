const express = require("express");
const router = express.Router();
const createDBConnection = require("./database");
const multer = require("multer");
const upload = multer();

router.get("/", async (req, res) => {
  const db = createDBConnection();

  const sql = "SELECT * FROM image";

  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(200).json(results);
  });
});

router.post("/add", upload.none(), async (req, res) => {
  const db = createDBConnection();
  const { name, image, description } = req.body;

  if (!name || !image || !description) {
    return res.status(400).json({ error: "Please provide all required fields." });
  }

  try {
    const sql = "INSERT INTO image (name, image, description) VALUES (?, ?, ?) ";

    db.query(sql, [name, image, description], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      return res.status(200).json({ message: "Image Successfully Added!" });
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  } finally {
    db.end();
  }
});

router.delete("/delete/:id", async (req, res) => {
  const db = createDBConnection();
  const { id } = req.params;

  const sql = "DELETE FROM image WHERE id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: "Image Successfully Deleted!" });
  });
  db.end();
});

module.exports = router;
