const Themes = require("../models/themes.model");

/**
 *Contains Themes Controller
 *
 *
 *
 * @class ThemesController
 */
class ThemesController {
  /**
   * Add theme
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof ThemesController
   * @returns {JSON} - A JSON success response.
   *
   */
  static async addTheme(req, res) {
    try {
      const theme = await Themes.create({
        name: req.body.name,
        color: req.body.color,
        backgroundColor: req.body.backgroundColor,
        backgroundImage: req.file ? req.file.location : "",
      });

      return res.status(201).send(theme);
    } catch (error) {
      return res.status(400).send();
    }
  }

  /**
   * Get themes
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof ThemesController
   * @returns {JSON} - A JSON success response.
   *
   */
  static async getThemes(req, res) {
    try {
      const themes = await Themes.find({}).sort({ name: 1 });

      return res.status(201).send(themes);
    } catch (error) {
      return res.status(400).send();
    }
  }
}
module.exports = ThemesController;
