const router = require("express").Router();
const userController = require("../controllers/user.controller");
const ehrController = require("../controllers/ehr.controller");
const progressTrackerController = require("../controllers/progressTeacker.controller");

router.use("/users", userController);
router.use("/ehrs", ehrController);
router.use("/progress", progressTrackerController);

module.exports = router;
