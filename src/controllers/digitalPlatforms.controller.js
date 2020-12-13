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

  /**
   * Update a DigitalPlatform
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof DigitalPlatformController
   * @returns {JSON} - A JSON success response.
   *
   */
  static async updateDigitalPlatform(req, res) {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "link"];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );
    if (!isValidOperation) {
      return res.status(400).send({ error: "Invalid Updates" });
    }
    const digitalPlatform = await DigitalPlatform.findOne({
      _id: req.params.platformId,
      artist: req.user._id,
    });
    if (!digitalPlatform) {
      return res.status(404).send({ error: "Not found" });
    }
    try {
      updates.forEach((update) => (digitalPlatform[update] = req.body[update]));
      await digitalPlatform.save();

      return res.status(200).send(digitalPlatform);
    } catch (error) {
      return res.status(400).send(error);
    }
  }
}
module.exports = DigitalPlatformController;
