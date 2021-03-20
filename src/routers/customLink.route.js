const express = require("express");
const auth = require("../middlewares/auth.middleware");
const CustomLinkController = require("../controllers/customLink.controller");
const AddCustomLink = require("../validations/customLink/customLink.validator");

const router = express.Router();

router.post("/add", auth, CustomLinkController.addCustomLink);
router.get("/:customLinkId", CustomLinkController.viewCustomLink);
router.patch("/:customLinkId", auth, CustomLinkController.updateCustomLink);
router.delete("/:customLinkId", auth, CustomLinkController.deleteCustomLink);
router.get("/", auth, CustomLinkController.getMyCustomLinks);
// router.get("/:slug", ArtistController.viewArtist);
// router.post("/:artistId/follow", auth, ArtistController.followArtist);

module.exports = router;
