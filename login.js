const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();

app.use(bodyParser.json());

const SECRET_KEY = "8D46igOlkeUKGOjbeqFlUJa1H3xN16";
const USER_API_URL = "https://apiflutterhbd-production.up.railway.app/api/v1/user?auth=chiquine";

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const response = await axios.get(USER_API_URL);
    const users = response.data;

    const user = users.find((u) => u.username === username && u.password === password);

    if (user) {
      const token = jwt.sign({ userId: user.id, username: user.username }, SECRET_KEY, { expiresIn: "1h" });

      res.json({
        token: token,
        name: user.name,
      });
    } else {
      res.status(401).json({ error: "Invalid username or password" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = app;
