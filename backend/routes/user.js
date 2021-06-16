const express = require("express");
const router = express.Router();
const UserController = require("../controller/user")

router.post("/signup", UserController.createdUser);

router.post("/signup", UserController.createdUser);
router.post("/login", UserController.userLogin)

module.exports = router;

