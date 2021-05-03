const jwt = require("jsonwebtoken");
const User = require("../models/users.model");
const SocialMedia = require("../models/socialMedia.model");
const socialMediaClick = require("../models/socialMediaClick.model");
const MediaPlatformSample = require("../models/mediaPlatformSample.model");

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
      const existingSocialMediaPlatform = await SocialMedia.findOneAndUpdate(
        {
          user: req.user._id,
          mediaPlatformSample: req.body.mediaPlatformSample,
        },
        { link: req.body.link },
        { new: true }
      ).populate("mediaPlatformSample");
      if (existingSocialMediaPlatform) {
        return res.status(200).send(existingSocialMediaPlatform);
      }
      const socialMediaPlatform = await SocialMedia.create({
        user: req.user._id,
        mediaPlatformSample: req.body.mediaPlatformSample,
        link: req.body.link,
      });
      await socialMediaPlatform.populate("mediaPlatformSample");
      return res.status(201).send(socialMediaPlatform);
    } catch (error) {
      return res.status(400).send();
    }
  }

  /**
   * Add a MediaPlatformSample
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof SocialMediaPlatformController
   * @returns {JSON} - A JSON success response.
   *
   */
  static async addMediaPlatformSample(req, res) {
    try {
      const mediaPlatform = await MediaPlatformSample.create({
        name: req.body.name,
        icon: req.body.icon,
      });
      return res.status(201).send(mediaPlatform);
    } catch (error) {
      return res.status(400).send();
    }
  }

  /**
   * Get MediaPlatformSamples
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof SocialMediaPlatformController
   * @returns {JSON} - A JSON success response.
   *
   */
  static async getUserSocials(req, res) {
    try {
      const socials = await SocialMedia.find({
        user: req.user._id,
      }).populate("mediaPlatformSample");
      return res.status(200).send(socials);
    } catch (error) {
      return res.status(400).send();
    }
  }

  /**
   * Get MediaPlatformSamples
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof SocialMediaPlatformController
   * @returns {JSON} - A JSON success response.
   *
   */
  static async getMediaPlatformSamples(req, res) {
    try {
      const mediaPlatforms = await MediaPlatformSample.find({});
      return res.status(200).send(mediaPlatforms);
    } catch (error) {
      return res.status(400).send();
    }
  }

  /**
   * Delete a socialMediaPlatform
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof SocialMediaPlatformController
   * @returns {JSON} - A JSON success response.
   *
   */
  static async deleteSocialMediaPlatform(req, res) {
    try {
      const socialMediaPlatform = await SocialMedia.findOneAndDelete({
        _id: req.params.socialId,
        user: req.user._id,
      });
      if (!socialMediaPlatform) {
        return res.status(404).send();
      }
      return res.status(200).send(socialMediaPlatform);
    } catch (error) {
      return res.status(500).send();
    }
  }

  /**
   * View a SocialMediaPlatform
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof SocialMediaPlatformController
   * @returns {JSON} - A JSON success response.
   *
   */
  static async viewSocialMediaPlatform(req, res) {
    const socialMediaPlatformViewData = {
      socialMedia: req.params.socialId,
    };
    if (req.headers.authorization) {
      const token = req.headers.authorization.replace("Bearer ", "");
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socialMediaPlatformViewData.visitor = req.headers.authorization
        ? decoded._id
        : null;
    }
    try {
      const socialMediaPlatform = await SocialMedia.findByIdAndUpdate(
        { _id: req.params.socialId },
        { $inc: { clickCount: 1 } }
      );
      if (!socialMediaPlatform) {
        return res.status(404).send();
      }
      await User.findByIdAndUpdate(socialMediaPlatform.user, {
        $inc: { clickCount: 1 },
      });
      await socialMediaClick.create({
        ...socialMediaPlatformViewData,
      });
      return res.status(200).send(socialMediaPlatform);
    } catch (error) {
      return res.status(500).send();
    }
  }

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
