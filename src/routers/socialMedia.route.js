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
// router.post(
//   "/add",
//   auth,
//   AddDigitalPlatform.validateData(),
//   AddDigitalPlatform.myValidationResult,
//   DigitalPlatformController.addDigitalPlatform
// );

// router.delete(
//   "/:platformId/remove",
//   auth,
//   DigitalPlatformController.deleteDigitalPlatform
// );

// router.patch(
//   "/:platformId/update",
//   auth,
//   DigitalPlatformController.updateDigitalPlatform
// );
// router.get("/:platformId", DigitalPlatformController.viewDigitalPlatform);

module.exports = router;
