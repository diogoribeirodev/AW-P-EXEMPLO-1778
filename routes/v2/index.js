const router = require("express").Router();
const studentRouter = require("./students");
const schoolRouter = require("./schools");
const courseRouter = require("./courses");
const authRouter = require("./auth");

router.use("/students", studentRouter);
router.use("/schools", schoolRouter);
router.use("/courses", courseRouter);
router.use("/auth", authRouter);

module.exports = router;
