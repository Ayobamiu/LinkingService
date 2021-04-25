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

  /**
   * Update a CustomLink
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof CustomLinkController
   * @returns {JSON} - A JSON success response.
   *
   */
  static async updateCustomLink(req, res) {
    let update = {};
    if (req.body.link) {
      update.link = req.body.link;
    }
    if (req.body.title) {
      update.title = req.body.title;
    }
    if (req.file) {
      update.image = req.file.location;
    }
    if (req.body.visible) {
      update.visible = req.body.visible;
    }
    try {
      const customLink = await CustomLink.findByIdAndUpdate(
        req.params.customLinkId,
        update,
        { new: true }
      );
      return res.status(200).send({ customLink });
    } catch (error) {
      return res.status(400).send();
    }
  }

  /**
   * Delete a CustomLink
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof CustomLinkController
   * @returns {JSON} - A JSON success response.
   *
   */
  static async deleteCustomLink(req, res) {
    try {
      const customLink = await CustomLink.findByIdAndDelete(
        req.params.customLinkId
      );
      if (!customLink) {
        return res.status(404).send({ error: "Link not found" });
      }
      return res.status(200).send(customLink);
    } catch (error) {
      return res.status(400).send();
    }
  }

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

  /**
   * Get user a CustomLinks
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof CustomLinkController
   * @returns {JSON} - A JSON success response.
   *
   */
  static async getMyCustomLinks(req, res) {
    try {
      const customLinks = await CustomLink.find({ owner: req.user._id }).sort({
        createdAt: -1,
      });
      return res.status(200).send({ customLinks });
    } catch (error) {
      return res.status(500).json({
        message: "Could not get links. Check connection!",
      });
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
