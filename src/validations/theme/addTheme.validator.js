const { check, validationResult } = require("express-validator");

/**
 *Contains AddThemeValidator Validator
 *
 *
 *
 * @class AddThemeValidator
 */
class AddThemeValidator {
  /**
   * validate AddThemeValidator data.
   * @memberof AddThemeValidator
   * @returns {null} - No response.
   */
  static validateData() {
    return [
      check("name").isString().withMessage("Name should be a String"),
      check("color").isString().withMessage("Color should be a String"),
      check("backgroundColor")
        .isString()
        .withMessage("BackgroundColor should be a String"),
    ];
  }

  /**
   * Validate results data.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @param {Response} next - The next parameter.
   * @memberof AddThemeValidator
   * @returns {JSON} - A JSON success response.
   */
  static async myValidationResult(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errArr = errors.array().map(({ msg }) => msg);
      return res.status(400).json({
        status: "400 Invalid Request",
        error: "Your request contains invalid parameters",
        errors: errArr,
      });
    }
    return next();
  }
}
module.exports = AddThemeValidator;
