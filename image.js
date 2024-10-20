const express = require("express");
const router = express.Router();
const createDBConnection = require("./database");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const bucket = require("./firebase-config");

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

router.post("/add", upload.single("image"), async (req, res) => {
  const db = createDBConnection();
  const { name, description } = req.body;

  if (!name || !req.file || !description) {
    return res.status(400).json({ error: "Please provide all required fields." });
  }

  try {
    const fileName = `${Date.now()}_${req.file.originalname}`;
    const file = bucket.file(fileName);

    const stream = file.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    stream.on("error", (err) => {
      return res.status(500).json({ error: err.message });
    });

    stream.on("finish", async () => {
      await file.makePublic();
      const imageUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

      const sql = "INSERT INTO image (name, image, description) VALUES (?, ?, ?)";
      db.query(sql, [name, imageUrl, description], (err, results) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        return res.status(200).json({ message: "Image Successfully Added!", imageUrl });
      });
    });

    stream.end(req.file.buffer);
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
