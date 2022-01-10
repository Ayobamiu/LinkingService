/** @format */

const Themes = require("../models/themes.model");

/**
 *Contains Themes Controller
 *
 *
 *
 * @class ThemesController
 */
class ThemesController {
  static async addTheme(req, res) {
    try {
      const data = {
        name: req.body.name,
        color: req.body.color,
        blur: req.body.blur,
        dark: req.body.dark,
        backgroundColorImageReplace: req.body.backgroundColorImageReplace,
        blured: req.body.blured,
        backgroundColor: req.body.backgroundColor,
        backgroundImage: req.file ? req.file.location : "",
      };
      if (req.user._id) {
        data.user = req.user._id;
      }
      const theme = await Themes.create(data);

      return res.status(201).send(theme);
    } catch (error) {
      return res.status(500).send({
        error: "500 server error",
        message: "Error creating theme",
      });
    }
  }
  static async deleteTheme(req, res) {
    try {
      const theme = await Themes.findByIdAndDelete(req.params.themeId);

      if (req.user.theme && req.user.theme.toString() == req.params.themeId) {
        req.user.theme = "6085c02da2d19336940c8509";
        await req.user.save();
      }
      return res.status(200).send(theme);
    } catch (error) {
      return res.status(500).send({
        error: "500 server error",
        message: "Error deleting theme",
      });
    }
  }
  static async updateTheme(req, res) {
    try {
      const data = {
        ...req.body,
      };
      if (req.file) {
        data.backgroundImage = req.file.location;
      }
      const theme = await Themes.findByIdAndUpdate(req.params.themeId, data, {
        new: true,
      });

      return res.status(200).send(theme);
    } catch (error) {
      return res.status(500).send({
        error: "500 server error",
        message: "Error deleting theme",
      });
    }
  }

  static async getThemes(req, res) {
    try {
      const themes = await Themes.find({ user: null }).sort({ name: 1 });

      return res.status(201).send(themes);
    } catch (error) {
      return res.status(400).send();
    }
  }
  static async getMyThemes(req, res) {
    try {
      const themes = await Themes.find({ user: req.user._id }).sort({
        name: 1,
      });

      return res.status(201).send(themes);
    } catch (error) {
      return res.status(400).send();
    }
  }
}
module.exports = ThemesController;
