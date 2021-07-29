const { check, validationResult } = require("express-validator");

/**
 *Contains AddValidProduct Validator
 *
 *
 *
 * @class AddValidProduct
 */
class AddValidProduct {
  /**
   * validate AddValidProduct data.
   * @memberof AddValidProduct
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
      check("description")
        .exists()
        .withMessage("Description is required")
        .not()
        .isEmpty()
        .withMessage("Description cannot be empty")
        .isString()
        .withMessage("Description should be a String"),
    ];
  }

  /**
   * Validate results data.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @param {Response} next - The next parameter.
   * @memberof AddValidProduct
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
module.exports = AddValidProduct;
