const { check, validationResult } = require("express-validator");

/**
 *Contains AddSocialMediaPlatform Validator
 *
 *
 *
 * @class AddSocialMediaPlatform
 */
class AddSocialMediaPlatform {
  /**
   * validate AddSocialMediaPlatform data.
   * @memberof AddSocialMediaPlatform
   * @returns {null} - No response.
   */
  static validateData() {
    return [
      check("mediaPlatformSample")
        .exists()
        .withMessage("mediaPlatformSampleId is required")
        .not()
        .isEmpty()
        .withMessage("mediaPlatformSampleId cannot be empty")
        .isMongoId()
        .withMessage("mediaPlatformSampleId should be an ID"),
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
   * @memberof AddSocialMediaPlatform
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
module.exports = AddSocialMediaPlatform;
