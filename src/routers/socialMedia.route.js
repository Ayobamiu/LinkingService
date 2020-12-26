const express = require("express");
const auth = require("../middlewares/auth.middleware");
const DigitalPlatformController = require("../controllers/digitalPlatforms.controller");
const AddSocialMediaPlatform = require("../validations/socialMedia/addSocialMedia.validator");
const SocialMediaPlatformController = require("../controllers/socialMedias.controller");

const router = express.Router();

router.post(
  "/add",
  auth,
  AddSocialMediaPlatform.validateData(),
  AddSocialMediaPlatform.myValidationResult,
  SocialMediaPlatformController.addSocialMediaPlatform
);

router.delete(
  "/:socialId/remove",
  auth,
  SocialMediaPlatformController.deleteSocialMediaPlatform
);

module.exports = router;
