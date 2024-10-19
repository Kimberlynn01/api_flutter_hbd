const express = require("express");
const router = express.Router();
const userRoute = require("./user");
const imageRoute = require("./image");
const loginRoute = require("./login");

router.use("/user", userRoute);
router.use("/image", imageRoute);
router.use("/login", loginRoute);

module.exports = router;
