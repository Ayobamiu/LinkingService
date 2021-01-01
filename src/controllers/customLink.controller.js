const jwt = require("jsonwebtoken");
const CustomLink = require("../models/customLink.model");
const CustomLinkClick = require("../models/customLinkClick.model");
const User = require("../models/users.model");

/**
 *Contains CustomLink Controller
 *
 *
 *
 * @class CustomLinkController
 */
class CustomLinkController {
  /**
   * Add a CustomLink
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof CustomLinkController
   * @returns {JSON} - A JSON success response.
   *
   */
  static async addCustomLink(req, res) {
    try {
      const customLink = await CustomLink.create({
        owner: req.user._id,
        title: req.body.title,
        link: req.body.link,
      });
      return res.status(201).send(customLink);
    } catch (error) {
      return res.status(400).send();
    }
  }

  //   /**
  //    * Delete a DigitalPlatform
  //    * @param {Request} req - Response object.
  //    * @param {Response} res - The payload.
  //    * @memberof CustomLinkController
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

  /**
   * View a CustomLink
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof CustomLinkController
   * @returns {JSON} - A JSON success response.
   *
   */
  static async viewCustomLink(req, res) {
    const customLinkViewData = {
      customLink: req.params.customLinkId,
    };
    if (req.headers.authorization) {
      const token = req.headers.authorization.replace("Bearer ", "");
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      customLinkViewData.visitor = req.headers.authorization
        ? decoded._id
        : null;
    }
    try {
      const customLink = await CustomLink.findByIdAndUpdate(
        { _id: req.params.customLinkId },
        { $inc: { clickCount: 1 } },
        { new: true }
      );
      if (!customLink) {
        return res.status(404).send();
      }
      await User.findByIdAndUpdate(
        customLink.owner,
        { $inc: { clickCount: 1 } },
        { new: true }
      );
      await CustomLinkClick.create({ ...customLinkViewData });
      return res.status(200).send(customLink);
    } catch (error) {
      return res.status(500).send();
    }
  }

  //   /**
  //    * Update a DigitalPlatform
  //    * @param {Request} req - Response object.
  //    * @param {Response} res - The payload.
  //    * @memberof CustomLinkController
  //    * @returns {JSON} - A JSON success response.
  //    *
  //    */
  //   static async updateDigitalPlatform(req, res) {
  //     const updates = Object.keys(req.body);
  //     const allowedUpdates = ["mediaPlatformSample", "link"];
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
module.exports = CustomLinkController;
