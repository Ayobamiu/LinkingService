const express = require("express");
const upload = require("../bucket-config/bucket");
const PromotionController = require("../controllers/promotion.controller");
const auth = require("../middlewares/auth.middleware");
const AddPromotionValidator = require("../validations/promotion/addPromotion.validator");

const router = express.Router();

router.post(
  "/add",
  auth,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  AddPromotionValidator.validateData(),
  AddPromotionValidator.myValidationResult,
  PromotionController.addPromotion
);
router.get("/:promotionId", PromotionController.viewPromotion);
// router.get("/:slug", ArtistController.viewArtist);
// router.post("/:artistId/follow", auth, ArtistController.followArtist);

module.exports = router;
