const express = require("express");
const upload = require("../bucket-config/bucket");
const ThemesController = require("../controllers/themes.controller");
const UserViewController = require("../controllers/userView.controller");
const auth = require("../middlewares/auth.middleware");
const AddThemeValidator = require("../validations/theme/addTheme.validator");

const router = express.Router();

router.get("/", ThemesController.getThemes);
router.post(
  "/",
  upload.single("image",),
  AddThemeValidator.validateData(),
  AddThemeValidator.myValidationResult,
  ThemesController.addTheme
);

module.exports = router;
