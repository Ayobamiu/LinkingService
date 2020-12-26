const jwt = require("jsonwebtoken");
const DigitalPlatform = require("../models/digitalPlatforms.model");
const DigitalPlatformView = require("../models/digitalPlatformClicks.model");
const User = require("../models/users.model");
const SocialMedia = require("../models/socialMedia.model");

/**
 *Contains SocialMediaPlatform Controller
 *
 *
 *
 * @class SocialMediaPlatformController
 */
class SocialMediaPlatformController {
  /**
   * Add a SocialMediaPlatform
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof SocialMediaPlatformController
   * @returns {JSON} - A JSON success response.
   *
   */
  static async addSocialMediaPlatform(req, res) {
    try {
      const socialMediaPlatform = await SocialMedia.create({
        user: req.user._id,
        mediaPlatformSample: req.body.mediaPlatformSample,
        link: req.body.link,
      });
      return res.status(201).send(socialMediaPlatform);
    } catch (error) {
      return res.status(400).send();
    }
  }

  //   /**
  //    * Delete a DigitalPlatform
  //    * @param {Request} req - Response object.
  //    * @param {Response} res - The payload.
  //    * @memberof SocialMediaPlatformController
  //    * @returns {JSON} - A JSON success response.
  //    *
  //    */
  //   static async deleteDigitalPlatform(req, res) {
  //     try {
  //       const digitalPlatform = await DigitalPlatform.findOneAndDelete({
  //         _id: req.params.platformId,
  //         artist: req.user._id,
  //       });
  //       if (!digitalPlatform) {
  //         return res.status(404).send();
  //       }
  //       return res.status(200).send(digitalPlatform);
  //     } catch (error) {
  //       return res.status(500).send();
  //     }
  //   }

  //   /**
  //    * View a DigitalPlatform
  //    * @param {Request} req - Response object.
  //    * @param {Response} res - The payload.
  //    * @memberof SocialMediaPlatformController
  //    * @returns {JSON} - A JSON success response.
  //    *
  //    */
  //   static async viewDigitalPlatform(req, res) {
  //     const digitalPlatformViewData = {
  //       digitalPlatform: req.params.platformId,
  //     };
  //     if (req.headers.authorization) {
  //       const token = req.headers.authorization.replace("Bearer ", "");
  //       const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //       digitalPlatformViewData.visitor = req.headers.authorization
  //         ? decoded._id
  //         : null;
  //     }
  //     try {
  //       const digitalPlatform = await DigitalPlatform.findByIdAndUpdate(
  //         { _id: req.params.platformId },
  //         { $inc: { clickCount: 1 } }
  //       );
  //       if (!digitalPlatform) {
  //         return res.status(404).send();
  //       }
  //       await User.findByIdAndUpdate(digitalPlatform.artist, {
  //         $inc: { clickCount: 1 },
  //       });
  //       await DigitalPlatformView.create({ ...digitalPlatformViewData });
  //       return res.status(200).send(digitalPlatform);
  //     } catch (error) {
  //       return res.status(500).send();
  //     }
  //   }

  //   /**
  //    * Update a DigitalPlatform
  //    * @param {Request} req - Response object.
  //    * @param {Response} res - The payload.
  //    * @memberof SocialMediaPlatformController
  //    * @returns {JSON} - A JSON success response.
  //    *
  //    */
  //   static async updateDigitalPlatform(req, res) {
  //     const updates = Object.keys(req.body);
  //     const allowedUpdates = ["name", "link"];
  //     const isValidOperation = updates.every((update) =>
  //       allowedUpdates.includes(update)
  //     );
  //     if (!isValidOperation) {
  //       return res.status(400).send({ error: "Invalid Updates" });
  //     }
  //     const digitalPlatform = await DigitalPlatform.findOne({
  //       _id: req.params.platformId,
  //       artist: req.user._id,
  //     });
  //     if (!digitalPlatform) {
  //       return res.status(404).send({ error: "Not found" });
  //     }
  //     try {
  //       updates.forEach((update) => (digitalPlatform[update] = req.body[update]));
  //       await digitalPlatform.save();

  //       return res.status(200).send(digitalPlatform);
  //     } catch (error) {
  //       return res.status(400).send(error);
  //     }
  //   }
}
module.exports = SocialMediaPlatformController;
