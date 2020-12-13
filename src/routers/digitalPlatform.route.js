const express = require("express");
const auth = require("../middlewares/auth.middleware");
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

router.delete(
  "/:platformId/remove",
  auth,
  DigitalPlatformController.deleteDigitalPlatform
);

router.patch(
  "/:platformId/update",
  auth,
  DigitalPlatformController.updateDigitalPlatform
);

module.exports = router;
