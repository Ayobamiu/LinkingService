const Subscriptions = require("../models/subscriptions.model");
const moment = require("moment");
const axios = require("axios");

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
  static async getSubscription(req, res) {
    try {
      const { data } = await axios.get(
        `https://api.flutterwave.com/v3/subscriptions?email=${req.user.email}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
          },
        }
      );
      const subscription = data.data[0];

      return res.status(200).send(subscription);
    } catch (error) {
      return res.status(400).send();
    }
  }
}
module.exports = SubscriptionsController;
