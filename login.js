const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const axios = require("axios");
const bcrypt = require("bcryptjs"); // Import bcryptjs

const app = express();

app.use(bodyParser.json());

const SECRET_KEY = "8D46igOlkeUKGOjbeqFlUJa1H3xN16";
const USER_API_URL = "https://apiflutterhbd-production.up.railway.app/api/v1/user?auth=chiquine";

app.post("/", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Ambil data pengguna dari API
    const response = await axios.get(USER_API_URL);
    const users = response.data;

    // Temukan pengguna berdasarkan username
    const user = users.find((u) => u.username === username);

    // Jika pengguna ditemukan, verifikasi password
    if (user) {
      // Bandingkan password yang diinput dengan password yang di-hash
      const isPasswordValid = bcrypt.compareSync(password, user.password);

      if (isPasswordValid) {
        // Jika password valid, buat token
        const token = jwt.sign({ userId: user.id, username: user.username }, SECRET_KEY, { expiresIn: "1h" });

        // Kirimkan token dan nama pengguna dalam respons
        res.json({
          token: token,
          name: user.name,
        });
      } else {
        // Jika password tidak valid
        res.status(401).json({ error: "Invalid username or password" });
      }
    } else {
      // Jika pengguna tidak ditemukan
      res.status(401).json({ error: "Invalid username or password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = app;
