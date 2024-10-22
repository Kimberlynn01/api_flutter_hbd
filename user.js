const express = require("express");
const router = express.Router();
const createDBConnection = require("./database");
const bcryptjs = require("bcryptjs");
const multer = require("multer");
const upload = multer();
const jwt = require("jsonwebtoken");

const SECRET_KEY = "8D46igOlkeUKGOjbeqFlUJa1H3xN16";
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dphacrvql/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "szlempbv";

router.get("/", (req, res) => {
  const db = createDBConnection();

  const sql = "SELECT * FROM USER";
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

    const sql = "INSERT INTO USER (username, name, password) VALUES (?, ?, ?)";
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

router.put(
  "/update/:id",
  upload.fields([
    { name: "banner", maxCount: 1 },
    { name: "picture", maxCount: 1 },
  ]),
  async (req, res) => {
    const db = createDBConnection();
    const { id } = req.params;
    const { banner, picture } = req.body;

    if (!banner && !picture) {
      return res.status(400).json({ error: "Please provide at least one field to update." });
    }

    const updates = [];
    const params = [];

    let bannerUrl = null;
    let pictureUrl = null;

    try {
      if (req.files.banner && req.files.banner.length > 0) {
        const formData = new FormData();
        formData.append("file", req.files.banner[0].buffer, req.files.banner[0].originalname);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

        const response = await axios.post(CLOUDINARY_URL, formData, {
          headers: {
            ...formData.getHeaders(),
          },
        });

        bannerUrl = response.data.secure_url;
        updates.push("banner = ?");
        params.push(bannerUrl);
      }

      if (req.files.picture && req.files.picture.length > 0) {
        const formData = new FormData();
        formData.append("file", req.files.picture[0].buffer, req.files.picture[0].originalname);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

        const response = await axios.post(CLOUDINARY_URL, formData, {
          headers: {
            ...formData.getHeaders(),
          },
        });

        pictureUrl = response.data.secure_url;
        updates.push("picture = ?");
        params.push(pictureUrl);
      }

      params.push(id);

      const sql = `UPDATE USER SET ${updates.join(", ")} WHERE id = ?`;

      db.query(sql, params, (err, results) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        const token = jwt.sign(
          {
            userId: id,
            username: req.body.username,
            name: req.body.name,
            picture: pictureUrl || undefined,
            banner: bannerUrl || undefined,
          },
          SECRET_KEY,
          { expiresIn: "1h" }
        );

        res.status(200).json({ message: "User successfully updated!", token });
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    } finally {
      db.end();
    }
  }
);

router.delete("/delete/:id", async (req, res) => {
  const db = createDBConnection();
  const { id } = req.params;
  const sql = "DELETE FROM USER WHERE id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: "User Successfully Deleted!" });
  });
  db.end();
});

module.exports = router;
