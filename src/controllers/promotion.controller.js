const jwt = require("jsonwebtoken");
const DigitalPlatform = require("../models/digitalPlatforms.model");
const Promotion = require("../models/promotion.model");

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

    try {
      for (let index = 0; index < req.body.digitalPlatforms.length; index++) {
        const digitalPlatform = req.body.digitalPlatforms[index];
        const newDigitalPlatform = await DigitalPlatform.create({
          ...digitalPlatform,
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
      const promotion = await Promotion.create(promotionData);
      return res.status(201).send(promotion);
    } catch (error) {
      return res.status(400).send();
    }
  }

  //   /**
  //    * Delete a DigitalPlatform
  //    * @param {Request} req - Response object.
  //    * @param {Response} res - The payload.
  //    * @memberof DigitalPlatformController
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
  //    * @memberof DigitalPlatformController
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
  //    * @memberof DigitalPlatformController
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
module.exports = PromotionController;
