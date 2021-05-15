const Subscriptions = require("../models/subscriptions.model");
const moment = require("moment");

/**
 *Contains Subscriptions Controller
 *
 *
 *
 * @class SubscriptionsController
 */
class SubscriptionsController {
  /**
   * Add subscription
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof SubscriptionsController
   * @returns {JSON} - A JSON success response.
   *
   */
  static async addSubscription(req, res) {
    try {
      const subscription = await Subscriptions.create({
        user: req.user._id,
        endDate: moment().add(1, "month").format(),
      });

      return res.status(201).send(subscription);
    } catch (error) {
      return res.status(400).send();
    }
  }

  /**
   * Get Subscriptions
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof SubscriptionsController
   * @returns {JSON} - A JSON success response.
   *
   */
  static async getSubscriptions(req, res) {
    try {
      const subscriptions = await Subscriptions.find({
        user: req.user._id,
      }).sort({
        createdAt: -1,
      });

      return res.status(200).send(subscriptions);
    } catch (error) {
      return res.status(400).send();
    }
  }
}
module.exports = SubscriptionsController;
