const DigitalPlatform = require("../models/digitalPlatforms.model");

/**
 *Contains DigitalPlatform Controller
 *
 *
 *
 * @class DigitalPlatformController
 */
class DigitalPlatformController {
  /**
   * Add a DigitalPlatform
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof DigitalPlatformController
   * @returns {JSON} - A JSON success response.
   *
   */
  static async addDigitalPlatform(req, res) {
    try {
      const digitalPlatform = await DigitalPlatform.create({
        artist: req.user._id,
        name: req.body.name,
        link: req.body.link,
      });
      return res.status(201).send(digitalPlatform);
    } catch (error) {
      return res.status(400).send();
    }
  }

  /**
   * Delete a DigitalPlatform
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof DigitalPlatformController
   * @returns {JSON} - A JSON success response.
   *
   */
  static async deleteDigitalPlatform(req, res) {
    try {
      const digitalPlatform = await DigitalPlatform.findOneAndDelete({
        _id: req.params.platformId,
        artist: req.user._id,
      });
      if (!digitalPlatform) {
        return res.status(404).send();
      }
      return res.status(200).send(digitalPlatform);
    } catch (error) {
      return res.status(500).send();
    }
  }
}
module.exports = DigitalPlatformController;
