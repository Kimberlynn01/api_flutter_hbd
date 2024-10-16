const express = require("express");
const app = express();
const port = 3000;
const route = require("./route");
const db = require("./database");

const Middleware = (req, res, next) => {
  const { auth } = req.query;

  if (auth === "chiquine") {
    next();
  } else {
    res.status(403).json({ error: "Access denied" });
  }
};

app.use(express.json());
app.use("/api/v1", Middleware);
app.use("/api/v1", route);

app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found 404" });
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
