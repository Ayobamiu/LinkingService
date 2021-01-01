const express = require("express");
const upload = require("../bucket-config/bucket");
const auth = require("../middlewares/auth.middleware");
const CustomLinkController = require("../controllers/customLink.controller");
const AddCustomLink = require("../validations/customLink/customLink.validator");

const router = express.Router();

router.post(
  "/add",
  auth,
  AddCustomLink.validateData(),
  AddCustomLink.myValidationResult,
  CustomLinkController.addCustomLink
);
// router.get("/:promotionId", PromotionController.viewPromotion);
// router.get("/:slug", ArtistController.viewArtist);
// router.post("/:artistId/follow", auth, ArtistController.followArtist);

module.exports = router;
