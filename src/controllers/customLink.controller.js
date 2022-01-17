/** @format */

const jwt = require("jsonwebtoken");
const UserView = require("../models/artistViews.model");
const CustomLink = require("../models/customLink.model");
const CustomLinkClick = require("../models/customLinkClick.model");
const User = require("../models/users.model");
const worldLowRes = require("../config/world.json");

/**
 *Contains CustomLink Controller
 *
 *
 *
 * @class CustomLinkController
 */
class CustomLinkController {
  static async addCustomLink(req, res) {
    try {
      const data = {
        owner: req.user._id,
        ...req.body,
      };
      if (req.file) {
        data.image = req.file.location;
      }
      const customLink = await CustomLink.create(data);
      return res.status(201).send(customLink);
    } catch (error) {
      return res.status(400).send();
    }
  }

  static async updateCustomLink(req, res) {
    let update = { ...req.body };

    if (req.file) {
      update.image = req.file.location;
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
      const user = await User.findByIdAndUpdate(
        customLink.owner,
        { $inc: { clickCount: 1 } },
        { new: true }
      );
      await CustomLinkClick.create({ ...customLinkViewData, user: user._id });
      return res.status(200).send(customLink);
    } catch (error) {
      return res.status(500).send();
    }
  }

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

  static async getCustomLinksCount(req, res) {
    try {
      const customLinksCount = await CustomLink.countDocuments({});
      const noOfClicks = await CustomLinkClick.countDocuments({});
      const noOfVisits = await UserView.countDocuments({});
      return res.status(200).send({ customLinksCount, noOfClicks, noOfVisits });
    } catch (error) {
      return res.status(500).json({
        message: "Could not count links. Check connection!",
      });
    }
  }
  static async getCustomLinkAnalytics(req, res) {
    try {
      const filter = { user: req.user._id };
      if (req.body.startDate && req.body.endDate) {
        filter.createdAt = {
          $gte: new Date(req.body.startDate),
          $lte: new Date(req.body.endDate),
        };
      }

      const customLinks = await CustomLink.find({ owner: req.user._id }).select(
        "clicksCount title link clickCount"
      );

      let countries = await UserView.aggregate([
        { $match: filter },
        {
          $group: {
            _id: "$country",
            count: { $sum: 1 },
          },
        },
      ]);
      let cities = await UserView.aggregate([
        { $match: filter },
        {
          $group: {
            _id: "$city",
            count: { $sum: 1 },
          },
        },
      ]);
      let deviceType = await UserView.aggregate([
        { $match: filter },
        {
          $group: {
            _id: "$deviceType",
            count: { $sum: 1 },
          },
        },
      ]);

      res.send({
        deviceType,
        customLinks,
        countries,
        cities,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Could not get link analytics. Check connection!",
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
