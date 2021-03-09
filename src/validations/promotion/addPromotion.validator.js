const { check, validationResult } = require("express-validator");
const Promotion = require("../../models/promotion.model");

/**
 *Contains AddPromotionValidator Validator
 *
 *
 *
 * @class AddPromotionValidator
 */
class AddPromotionValidator {
  /**
   * validate AddPromotionValidator data.
   * @memberof AddPromotionValidator
   * @returns {null} - No response.
   */
  static validateData() {
    return [
      check("type")
        .exists()
        .withMessage("Type is required")
        .not()
        .isEmpty()
        .withMessage("Type cannot be empty")
        .isString()
        .withMessage("Type should be a String"),
      check("title")
        .exists()
        .withMessage("Title is required")
        .not()
        .isEmpty()
        .withMessage("Title cannot be empty")
        .isString()
        .withMessage("Title should be a String"),
    ];
  }

  /**
   * check title availabilty.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @param {Response} next - The next parameter.
   * @memberof AddPromotionValidator
   * @returns {JSON} - A JSON success response.
   */
  static async checkPromotionTitleAvailability(req, res, next) {
    const promotion = await Promotion.findOne({
      title: req.body.title,
      user: req.user._id,
    });
    if (promotion) {
      return res.status(205).json({
        status: "205 resend request",
        error: "Title is already in use, try another keyword",
      });
    }
    return next();
  }

  /**
   * Validate results data.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @param {Response} next - The next parameter.
   * @memberof AddPromotionValidator
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
module.exports = AddPromotionValidator;
