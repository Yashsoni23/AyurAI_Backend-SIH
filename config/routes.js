const router = require("express").Router();
const userController = require("../controllers/user.controller");

router.use("/users", userController);

module.exports = router;
