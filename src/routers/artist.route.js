const express = require("express");
const ArtistController = require("../controllers/artist.controller");
const auth = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/:userName/store", ArtistController.viewArtistProducts);
router.get("/:userName", ArtistController.viewArtist);
router.post("/:artistId/follow", auth, ArtistController.followArtist);
router.post("/:artistId/like", ArtistController.likeArtist);

module.exports = router;
