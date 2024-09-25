const express = require("express");
const busController = require("../controllers/busController");
const router = express.Router();

router.post("/create", busController.createBus);
router.get("/getBuses", busController.getBuses);

module.exports = router;
