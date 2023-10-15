const router = require("express").Router();
const userController = require("../controllers/user.controller");
const ehrController = require("../controllers/ehr.controller");
router.use("/users", userController);
router.use("/ehrs", ehrController);

module.exports = router;
