const express = require("express");
const router = express.Router();
const createDBConnection = require("./database");
const multer = require("multer");
const upload = multer();
const axios = require("axios");
const FormData = require("form-data");

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dphacrvql/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "szlempbv";

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
  const { name, description } = req.body;
  const db = createDBConnection(); // Pindahkan ini ke luar try

  if (!name || !req.file || !description) {
    return res.status(400).json({ error: "Please provide all required fields." });
  }

  try {
    const formData = new FormData();
    formData.append("file", req.file.buffer, req.file.originalname); // Perbaiki pengiriman file
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const response = await axios.post(CLOUDINARY_URL, formData, {
      headers: {
        ...formData.getHeaders(), // Pastikan header diatur dengan benar
      },
    });

    const imageUrl = response.data.secure_url;

    // Simpan data ke database
    const sql = "INSERT INTO image (name, image, description) VALUES (?, ?, ?)";
    db.query(sql, [name, imageUrl, description], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      return res.status(200).json({ message: "Image Successfully Added!", imageUrl });
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  } finally {
    db.end(); // db.end tetap dijalankan di sini
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
