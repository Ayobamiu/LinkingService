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

router.post(
  "/add-media-platform-sample",
  SocialMediaPlatformController.addMediaPlatformSample
);

router.get(
  "/get-user-socials",
  auth,
  SocialMediaPlatformController.getUserSocials
);

router.get(
  "/get-media-platform-samples",
  SocialMediaPlatformController.getMediaPlatformSamples
);

router.delete(
  "/:socialId/remove",
  auth,
  SocialMediaPlatformController.deleteSocialMediaPlatform
);
router.get("/:socialId", SocialMediaPlatformController.viewSocialMediaPlatform);

module.exports = router;
