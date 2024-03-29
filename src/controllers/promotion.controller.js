const jwt = require("jsonwebtoken");
const uniqueSlug = require("unique-slug");
const mongoose = require("mongoose");

const DigitalPlatform = require("../models/digitalPlatforms.model");
const Promotion = require("../models/promotion.model");
const PromotionView = require("../models/promotionView.model");
const User = require("../models/users.model");
const CustomLink = require("../models/customLink.model");
const Follow = require("../models/follows.model");

/**
 *Contains Promotion Controller
 *
 *
 *
 * @class PromotionController
 */
class PromotionController {
  /**
   * Add a Promotion
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof PromotionController
   * @returns {JSON} - A JSON success response.
   *
   */
  static async addPromotion(req, res) {
    const digitalPlatforms = [];
    const promotionId = new mongoose.Types.ObjectId();

    try {
      for (let index = 0; index < req.body.digitalPlatforms.length; index++) {
        const digitalPlatform = req.body.digitalPlatforms[index];
        const newDigitalPlatform = await DigitalPlatform.create({
          ...digitalPlatform,
          promotion: promotionId,
        });
        digitalPlatforms.push({ digitalPlatform: newDigitalPlatform._id });
      }
      const promotionData = {
        ...req.body,
        digitalPlatforms,
        user: req.user._id,
      
      };
      if (req.files.image) {
        promotionData.image = req.files.image[0].location;
      }
      if (req.files.video) {
        promotionData.video = req.files.video[0].location;
      }
      const customLinkData = {
        title: req.body.title,
        owner: req.user._id,
        link: `/promotions/${promotionId}`,
      };
      await CustomLink.create(customLinkData);
      const promotion = await Promotion.create({
        ...promotionData,
        _id: promotionId,
      });
      const followersList = [];
      const followers = await Follow.find({ artist: req.user._id })
        .select("follower")
        .populate("follower");
      followers.forEach((follower) => {
        followersList.push({
          name: follower.follower.fisrtName
            ? follower.follower.fisrtName
            : "User",
          email: follower.follower.email,
        });
      });
      return res.status(201).send(promotion);
    } catch (error) {
      return res.status(400).send();
    }
  }

  /**
   * View a Promotion
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof PromotionController
   * @returns {JSON} - A JSON success response.
   *
   */
  static async viewPromotion(req, res) {
    const promotionViewData = {
      promotion: req.params.promotionId,
    };
    if (req.headers.authorization) {
      const token = req.headers.authorization.replace("Bearer ", "");
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      promotionViewData.visitor = req.headers.authorization
        ? decoded._id
        : null;
    }
    try {
      const promotion = await Promotion.findByIdAndUpdate(
        { _id: req.params.promotionId },
        { $inc: { viewCount: 1 } },
        { new: true }
      );
      if (!promotion) {
        return res.status(404).send();
      }
      await User.findByIdAndUpdate(promotion.user, {
        $inc: { viewCount: 1 },
      });
      await PromotionView.create({ ...promotionViewData });
      return res.status(200).send(promotion);
    } catch (error) {
      return res.status(500).send();
    }
  }
}
module.exports = PromotionController;
