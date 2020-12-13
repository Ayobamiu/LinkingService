const ArtistView = require("../models/artistViews.model");
const DigitalPlatform = require("../models/digitalPlatforms.model");
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
      const artist = await User.findOneAndUpdate(
        {
          slug: req.params.slug,
        },
        { $inc: { viewCount: 1 } }
      ).populate({
        path: "platforms",
        select: "_id name link -artist",
        model: DigitalPlatform,
      });
      await ArtistView.create({ artist: artist._id });
      return res.status(201).send(artist);
    } catch (error) {
      return res.status(400).send();
    }
  }
}
module.exports = ArtistController;
