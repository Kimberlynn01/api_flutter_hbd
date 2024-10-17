const express = require("express");
const router = express.Router();
const userRoute = require("./user");
const imageRoute = require("./image");

router.use("/user", userRoute);
router.use("/image", imageRoute);

module.exports = router;
