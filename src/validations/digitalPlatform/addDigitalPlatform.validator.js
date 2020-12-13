const { check, validationResult } = require("express-validator");

/**
 *Contains AddDigitalPlatform Validator
 *
 *
 *
 * @class AddDigitalPlatform
 */
class AddDigitalPlatform {
  /**
   * validate AddDigitalPlatform data.
   * @memberof AddDigitalPlatform
   * @returns {null} - No response.
   */
  static validateData() {
    return [
      check("name")
        .exists()
        .withMessage("Name is required")
        .not()
        .isEmpty()
        .withMessage("Name cannot be empty")
        .isString()
        .withMessage("Results should be a String"),
      check("link")
        .exists()
        .withMessage("Link is required")
        .not()
        .isEmpty()
        .withMessage("Link cannot be empty")
        .isURL()
        .withMessage("Link should be a URL"),
    ];
  }

  /**
   * Validate results data.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @param {Response} next - The next parameter.
   * @memberof AddDigitalPlatform
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
module.exports = AddDigitalPlatform;
