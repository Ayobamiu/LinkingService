const jwt = require("jsonwebtoken");
const DigitalPlatform = require("../models/digitalPlatforms.model");
const DigitalPlatformView = require("../models/digitalPlatformClicks.model");
const User = require("../models/users.model");
const SocialMedia = require("../models/socialMedia.model");
const socialMediaClick = require("../models/socialMediaClick.model");

/**
 *Contains VisitorsView Controller
 *
 *
 *
 * @class VisitorsViewController
 */
class VisitorsViewController {
  //   /**
  //    * Add a VisitorsView
  //    * @param {Request} req - Response object.
  //    * @param {Response} res - The payload.
  //    * @memberof VisitorsViewController
  //    * @returns {JSON} - A JSON success response.
  //    *
  //    */
  //   static async addSocialMediaPlatform(req, res) {
  //     try {
  //       const socialMediaPlatform = await SocialMedia.create({
  //         user: req.user._id,
  //         mediaPlatformSample: req.body.mediaPlatformSample,
  //         link: req.body.link,
  //       });
  //       return res.status(201).send(socialMediaPlatform);
  //     } catch (error) {
  //       return res.status(400).send();
  //     }
  //   }

  //   /**
  //    * Delete a socialMediaPlatform
  //    * @param {Request} req - Response object.
  //    * @param {Response} res - The payload.
  //    * @memberof SocialMediaPlatformController
  //    * @returns {JSON} - A JSON success response.
  //    *
  //    */
  //   static async deleteSocialMediaPlatform(req, res) {
  //     try {
  //       const socialMediaPlatform = await SocialMedia.findOneAndDelete({
  //         _id: req.params.socialId,
  //         user: req.user._id,
  //       });
  //       if (!socialMediaPlatform) {
  //         return res.status(404).send();
  //       }
  //       return res.status(200).send(socialMediaPlatform);
  //     } catch (error) {
  //       return res.status(500).send();
  //     }
  //   }

  /**
   * View a user products
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof VisitorsViewController
   * @returns {JSON} - A JSON success response.
   *
   */
  static async viewUserProduct(req, res) {
    // const userViewData = {
    //   socialMedia: req.params.socialId,
    // };
    // if (req.headers.authorization) {
    //   const token = req.headers.authorization.replace("Bearer ", "");
    //   const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //   userViewData.visitor = req.headers.authorization
    //     ? decoded._id
    //     : null;
    // }
    // try {
    //   const socialMediaPlatform = await SocialMedia.findByIdAndUpdate(
    //     { _id: req.params.socialId },
    //     { $inc: { clickCount: 1 } }
    //   );
    //   if (!socialMediaPlatform) {
    //     return res.status(404).send();
    //   }
    //   await User.findByIdAndUpdate(socialMediaPlatform.user, {
    //     $inc: { clickCount: 1 },
    //   });
    //   await socialMediaClick.create({
    //     ...userViewData,
    //   });
    return res.status(200).send("socialMediaPlatform");
  }
  catch(error) {
    return res.status(500).send();
  }
  //   }
}
module.exports = VisitorsViewController;
