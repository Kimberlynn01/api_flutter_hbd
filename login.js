const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const axios = require("axios");
const bcrypt = require("bcryptjs");

const app = express();

// Middleware untuk mem-parsing JSON dan form-data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // Ini untuk mendukung form-data

const SECRET_KEY = "8D46igOlkeUKGOjbeqFlUJa1H3xN16";
const USER_API_URL = "https://apiflutterhbd-production.up.railway.app/api/v1/user?auth=chiquine";

// Endpoint untuk login
app.post("/login", async (req, res) => {
  const { username, password } = req.body; // Mengambil username dan password dari form-data

  try {
    const response = await axios.get(USER_API_URL);
    const users = response.data;

    // Temukan user berdasarkan username
    const user = users.find((u) => u.username === username);

    if (user) {
      // Periksa kecocokan password
      const isPasswordValid = bcrypt.compareSync(password, user.password);

      if (isPasswordValid) {
        // Jika password valid, buat token JWT
        const token = jwt.sign({ userId: user.id, username: user.username }, SECRET_KEY, { expiresIn: "1h" });

        res.json({
          token: token,
          name: user.name,
        });
      } else {
        res.status(401).json({ error: "Invalid username or password" });
      }
    } else {
      res.status(401).json({ error: "Invalid username or password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
