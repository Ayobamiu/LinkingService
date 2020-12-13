const express = require("express");
const auth = require("../middlewares/auth.middleware");
const DigitalPlatform = require("../models/digitalPlatforms.model");
const upload = require("../bucket-config/bucket");
const DigitalPlatformController = require("../controllers/digitalPlatforms.controller");
const AddDigitalPlatform = require("../validations/digitalPlatform/addDigitalPlatform.validator");

const router = express.Router();

router.post(
  "/add",
  auth,
  AddDigitalPlatform.validateData(),
  AddDigitalPlatform.myValidationResult,
  DigitalPlatformController.addDigitalPlatform
);

module.exports = router;
