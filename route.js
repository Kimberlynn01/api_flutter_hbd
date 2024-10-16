const express = require("express");
const router = express.Router();
const userRoute = require("./user"); // Mengimpor user.js

router.use("/user", userRoute); // Menggunakan userRoute

module.exports = router; // Mengekspor router
