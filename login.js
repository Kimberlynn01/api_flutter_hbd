const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const axios = require("axios");
const bcrypt = require("bcryptjs");

const app = express();

app.use(bodyParser.json());

const SECRET_KEY = "8D46igOlkeUKGOjbeqFlUJa1H3xN16";
const USER_API_URL = "https://apiflutterhbd-production.up.railway.app/api/v1/user?auth=chiquine";

// Fungsi untuk memverifikasi password yang di-hash
async function verifyPassword(inputPassword, hashedPassword) {
  return bcrypt.compare(inputPassword, hashedPassword);
}

app.post("/", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Ambil data user dari API
    const response = await axios.get(USER_API_URL);
    const users = response.data;

    console.log("Received users from API:", users); // Tambahkan log untuk melihat pengguna yang diterima

    // Cari user berdasarkan username
    const user = users.find((u) => u.username === username);

    if (user) {
      console.log("User found:", user); // Log pengguna yang ditemukan

      // Verifikasi password dengan password yang di-hash
      const passwordMatch = await verifyPassword(password, user.password);

      console.log("Password match:", passwordMatch); // Log hasil perbandingan password

      if (passwordMatch) {
        // Jika password cocok, buat token JWT
        const token = jwt.sign({ userId: user.id, username: user.username }, SECRET_KEY, { expiresIn: "1h" });

        // Kirimkan token dan nama user dalam response
        res.json({
          token: token,
          name: user.name,
        });
      } else {
        // Jika password salah
        res.status(401).json({ error: "Invalid username or password" });
      }
    } else {
      // Jika user tidak ditemukan
      res.status(401).json({ error: "Invalid username or password" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = app;
