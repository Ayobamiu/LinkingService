const { check, validationResult } = require("express-validator");

/**
 *Contains AddCustomLink Validator
 *
 *
 *
 * @class AddCustomLink
 */
class AddCustomLink {
  /**
   * validate AddCustomLink data.
   * @memberof AddCustomLink
   * @returns {null} - No response.
   */
  static validateData() {
    return [
      check("title")
        .exists()
        .withMessage("Title is required")
        .not()
        .isEmpty()
        .withMessage("Title cannot be empty")
        .isString()
        .withMessage("Title should be a String"),
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
   * @memberof AddCustomLink
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
module.exports = AddCustomLink;
