/** @format */

const jwt = require("jsonwebtoken");
const UserView = require("../models/artistViews.model");
const DigitalPlatform = require("../models/digitalPlatforms.model");
const Follow = require("../models/follows.model");
const Like = require("../models/likes.model");
const Product = require("../models/product.model");
const SocialMedia = require("../models/socialMedia.model");
const Themes = require("../models/themes.model");
const User = require("../models/users.model");

/**
 *Contains DigitalPlatform Controller
 *
 *
 *
 * @class UserViewController
 */
class UserViewController {
  /**
   * View User's Page
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof UserViewController
   * @returns {JSON} - A JSON success response.
   *
   */
  static async viewUser(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        {
          userName: req.params.userName,
        },
        { $inc: { viewCount: 1 } },
        { new: true }
      )
        .populate({
          path: "platforms",
          select: "_id name link -artist",
          model: DigitalPlatform,
        })
        .populate({
          path: "socialMediaplatforms",
          model: SocialMedia,
          populate: "mediaPlatformSample",
        })
        .populate({
          path: "customLinks",
          options: { sort: { createdAt: -1 } },
          select: "_id visible link title image -owner",
        })
        .populate({ path: "theme", model: Themes });
      if (!user) {
        return res.status(404).send({
          status: "404 not found",
          error: "Username is not registered",
        });
      }
      return res.status(201).send(user);
    } catch (error) {
      return res.status(400).send();
    }
  }

  /**
   * store visitors location
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof UserViewController
   * @returns {JSON} - A JSON success response.
   *
   */
  static async getVisitorsLocation(req, res) {
    try {
      const user = await User.findOne({
        userName: req.params.userName,
      });

      let viewData = { user: user._id };
      if (req.body.visitorLocation) {
        viewData.visitorLocation = req.body.visitorLocation;
      }
      if (req.body.city) {
        viewData.city = req.body.city;
      }
      if (req.body.country) {
        viewData.country = req.body.country;
      }
      const viewResult = await UserView.create(viewData);
      return res.status(201).send(viewResult);
    } catch (error) {
      return res.status(400).send();
    }
  }

  /**
   * View Artist Prodcut Page
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof UserViewController
   * @returns {JSON} - A JSON success response.
   *
   */
  static async viewArtistProducts(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        {
          userName: req.params.userName,
        },
        { $inc: { viewCount: 1 } }
      ).populate({
        path: "products",
        select: "_id images title description price cta user",
        model: Product,
      });
      // .select("products storeName firstName lastName");
      return res.status(200).send(user);
    } catch (error) {
      return res.status(400).send();
    }
  }

  /**
   * Follow Artist
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof UserViewController
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

  /**
   * Like Artist
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof UserViewController
   * @returns {JSON} - A JSON success response.
   *
   */
  static async likeArtist(req, res) {
    const likeData = {
      artist: req.params.artistId,
    };
    if (req.headers.authorization) {
      const token = req.headers.authorization.replace("Bearer ", "");
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      likeData.visitor = req.headers.authorization ? decoded._id : null;
    }
    try {
      let like = await Like.findOneAndDelete(likeData);
      if (!like) {
        like = await Like.create(likeData);
        await User.findByIdAndUpdate(req.params.artistId, {
          $inc: { likeCount: 1 },
        });
        return res.status(201).send(like);
      }
      await User.findByIdAndUpdate(req.params.artistId, {
        $inc: { likeCount: -1 },
      });

      return res.status(201).send(like);
    } catch (error) {
      return res.status(500).send();
    }
  }
}
module.exports = UserViewController;
