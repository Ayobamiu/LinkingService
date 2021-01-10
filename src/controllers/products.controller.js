const Order = require("../models/order.model");
const Product = require("../models/product.model");
const moment = require("moment");

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

  /**
   * Order a Product
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof ProductController
   * @returns {JSON} - A JSON success response.
   *
   */
  static async orderProduct(req, res) {
    try {
      const product = await Product.findByIdAndUpdate(
        req.params.productId,
        { $inc: { numberInStock: -1 } },
        { new: true }
      );
      if (!product) {
        return res.status(404).send({ message: "product is unavailable" });
      }
      const order = await Order.create({
        product: req.params.productId,
        buyer: req.user._id,
        amount: product.price,
        quantity: req.query.quantity || 1,
        shippingFee: product.shippingFee,
      });
      // if (product.isAssured) {
      //   /* delay payment */
      // } else {
      //   /* pay seller instantly */
      // }
      return res.status(201).send(order);
    } catch (error) {
      return res.status(400).send();
    }
  }

  /**
   * Update an Order
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof ProductController
   * @returns {JSON} - A JSON success response.
   *
   */
  static async updateOrder(req, res) {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["status", "dileveryAddress", "quantity", "eta"];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );
    if (!isValidOperation) {
      return res.status(400).send({ error: "Invalid Updates" });
    }
    const order = await Order.findOne({
      _id: req.params.orderId,
      buyer: req.user._id,
    });
    if (!order) {
      return res.status(404).send({ error: "Not found" });
    }
    try {
      if (updates.includes("eta")) {
        order.eta = moment(order.eta).add(req.body.eta, "days").toDate();
      }
      updates.forEach((update) => {
        if (update !== "eta") {
          order[update] = req.body[update];
        }
      });
      await order.save();

      return res.status(200).send(order);
    } catch (error) {
      return res.status(400).send(error);
    }
  }

  /**
   * Delete a Product
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof ProductController
   * @returns {JSON} - A JSON success response.
   *
   */
  static async deleteProduct(req, res) {
    try {
      const product = await Product.findOneAndDelete({
        _id: req.params.productId,
        user: req.user._id,
      });
      if (!product) {
        return res.status(404).send();
      }
      return res.status(200).send(product);
    } catch (error) {
      return res.status(500).send();
    }
  }

  /**
   * View a Product
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof ProductController
   * @returns {JSON} - A JSON success response.
   *
   */
  static async viewProduct(req, res) {
    try {
      const product = await Product.findById(req.params.productId);
      if (!product) {
        return res.status(404).send();
      }

      return res.status(200).send(product);
    } catch (error) {
      return res.status(500).send();
    }
  }

  /**
   * Update a Product
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof ProductController
   * @returns {JSON} - A JSON success response.
   *
   */
  static async updateProduct(req, res) {
    const updates = Object.keys(req.body);
    const allowedUpdates = [
      "title",
      "description",
      "price",
      "shippingFee",
      "numberInStock",
      "isAssured",
      "cta",
    ];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );
    if (!isValidOperation) {
      return res.status(400).send({ error: "Invalid Updates" });
    }
    const product = await Product.findOne({
      _id: req.params.productId,
      user: req.user._id,
    });
    if (!product) {
      return res.status(404).send({ error: "Not found" });
    }
    try {
      updates.forEach((update) => (product[update] = req.body[update]));
      await product.save();

      return res.status(200).send(product);
    } catch (error) {
      return res.status(400).send(error);
    }
  }
}
module.exports = ProductController;
