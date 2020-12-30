const Product = require("../models/product.model");
const User = require("../models/users.model");

/**
 *Contains Product Controller
 *
 *
 *
 * @class ProductController
 */
class ProductController {
  /**
   * Add a Product
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof ProductController
   * @returns {JSON} - A JSON success response.
   *
   */
  static async addProduct(req, res) {
    let images = [];
    for (let index = 0; index < req.files.length; index++) {
      const element = req.files[index];
      images.push({ image: element.location });
    }
    try {
      const product = await Product.create({
        user: req.user._id,
        title: req.body.title,
        description: req.body.description,
        cta: req.body.cta,
        price: req.body.price,
        images,
      });
      return res.status(201).send(product);
    } catch (error) {
      return res.status(400).send();
    }
  }

  // /**
  //  * Delete a DigitalPlatform
  //  * @param {Request} req - Response object.
  //  * @param {Response} res - The payload.
  //  * @memberof DigitalPlatformController
  //  * @returns {JSON} - A JSON success response.
  //  *
  //  */
  // static async deleteDigitalPlatform(req, res) {
  //   try {
  //     const digitalPlatform = await DigitalPlatform.findOneAndDelete({
  //       _id: req.params.platformId,
  //       artist: req.user._id,
  //     });
  //     if (!digitalPlatform) {
  //       return res.status(404).send();
  //     }
  //     return res.status(200).send(digitalPlatform);
  //   } catch (error) {
  //     return res.status(500).send();
  //   }
  // }

  // /**
  //  * View a DigitalPlatform
  //  * @param {Request} req - Response object.
  //  * @param {Response} res - The payload.
  //  * @memberof DigitalPlatformController
  //  * @returns {JSON} - A JSON success response.
  //  *
  //  */
  // static async viewDigitalPlatform(req, res) {
  //   const digitalPlatformViewData = {
  //     digitalPlatform: req.params.platformId,
  //   };
  //   if (req.headers.authorization) {
  //     const token = req.headers.authorization.replace("Bearer ", "");
  //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //     digitalPlatformViewData.visitor = req.headers.authorization
  //       ? decoded._id
  //       : null;
  //   }
  //   try {
  //     const digitalPlatform = await DigitalPlatform.findByIdAndUpdate(
  //       { _id: req.params.platformId },
  //       { $inc: { clickCount: 1 } }
  //     );
  //     if (!digitalPlatform) {
  //       return res.status(404).send();
  //     }
  //     await User.findByIdAndUpdate(digitalPlatform.artist, {
  //       $inc: { clickCount: 1 },
  //     });
  //     await DigitalPlatformView.create({ ...digitalPlatformViewData });
  //     return res.status(200).send(digitalPlatform);
  //   } catch (error) {
  //     return res.status(500).send();
  //   }
  // }

  // /**
  //  * Update a DigitalPlatform
  //  * @param {Request} req - Response object.
  //  * @param {Response} res - The payload.
  //  * @memberof DigitalPlatformController
  //  * @returns {JSON} - A JSON success response.
  //  *
  //  */
  // static async updateDigitalPlatform(req, res) {
  //   const updates = Object.keys(req.body);
  //   const allowedUpdates = ["name", "link"];
  //   const isValidOperation = updates.every((update) =>
  //     allowedUpdates.includes(update)
  //   );
  //   if (!isValidOperation) {
  //     return res.status(400).send({ error: "Invalid Updates" });
  //   }
  //   const digitalPlatform = await DigitalPlatform.findOne({
  //     _id: req.params.platformId,
  //     artist: req.user._id,
  //   });
  //   if (!digitalPlatform) {
  //     return res.status(404).send({ error: "Not found" });
  //   }
  //   try {
  //     updates.forEach((update) => (digitalPlatform[update] = req.body[update]));
  //     await digitalPlatform.save();

  //     return res.status(200).send(digitalPlatform);
  //   } catch (error) {
  //     return res.status(400).send(error);
  //   }
  // }
}
module.exports = ProductController;
