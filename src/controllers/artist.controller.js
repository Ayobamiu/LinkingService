const ArtistView = require("../models/artistViews.model");
const DigitalPlatform = require("../models/digitalPlatforms.model");
const Follow = require("../models/follows.model");
const User = require("../models/users.model");

/**
 *Contains DigitalPlatform Controller
 *
 *
 *
 * @class ArtistController
 */
class ArtistController {
  /**
   * View Artist Page
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof ArtistController
   * @returns {JSON} - A JSON success response.
   *
   */
  static async viewArtist(req, res) {
    try {
      await User.findOneAndUpdate(
        {
          slug: req.params.slug,
        },
        { $inc: { viewCount: 1 } }
      ).populate({
        path: "platforms",
        select: "_id name link -artist",
        model: DigitalPlatform,
      });
      const artistView = await ArtistView.create({ artist: artist._id });
      return res.status(201).send(artistView);
    } catch (error) {
      return res.status(400).send();
    }
  }

  /**
   * Follow Artist
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof ArtistController
   * @returns {JSON} - A JSON success response.
   *
   */
  static async followArtist(req, res) {
    try {
      let follow = await Follow.findOneAndDelete({
        follower: req.user._id,
        artist: req.params.artistId,
      });
      if (!follow) {
        follow = await Follow.create({
          follower: req.user._id,
          artist: req.params.artistId,
        });
        await User.findByIdAndUpdate(req.params.artistId, {
          $inc: { followerCount: 1 },
        });
        return res.status(201).send(follow);
      }
      await User.findByIdAndUpdate(req.params.artistId, {
        $inc: { followerCount: -1 },
      });

      return res.status(201).send(follow);
    } catch (error) {
      return res.status(500).send();
    }
  }
}
module.exports = ArtistController;
