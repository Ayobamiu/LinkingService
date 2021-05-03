const Notifications = require("../models/notifications.model");

/**
 *Contains notifications Controller
 *
 *
 *
 * @class NotificationsController
 */
class NotificationsController {
  /**
   * Add notification
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof NotificationsController
   * @returns {JSON} - A JSON success response.
   *
   */
  static async addNotification(req, res) {
    try {
      const notification = await Notifications.create({
        title: req.body.title,
        body: req.body.body,
        link: req.body.link,
        image: req.file ? req.file.location : "",
      });

      return res.status(201).send(notification);
    } catch (error) {
      return res.status(400).send();
    }
  }

  /**
   * Get notifications
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof NotificationsController
   * @returns {JSON} - A JSON success response.
   *
   */
  static async getNotifications(req, res) {
    try {
      const notifications = await Notifications.find({}).sort({
        createdAt: -1,
      });

      return res.status(201).send(notifications);
    } catch (error) {
      return res.status(400).send();
    }
  }
}
module.exports = NotificationsController;
