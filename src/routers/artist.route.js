const express = require("express");
const UserViewController = require("../controllers/userView.controller");
const auth = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/:userName/store", UserViewController.viewArtistProducts);
router.get("/:userName", UserViewController.viewUser);
router.post(
  "/:userName/save-visitor-location",
  UserViewController.getVisitorsLocation
);
router.post("/:artistId/follow", auth, UserViewController.followArtist);
router.post("/:artistId/like", UserViewController.likeArtist);

module.exports = router;
