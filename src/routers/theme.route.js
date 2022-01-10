/** @format */

const express = require("express");
const upload = require("../bucket-config/bucket");
const ThemesController = require("../controllers/themes.controller");
const UserViewController = require("../controllers/userView.controller");
const auth = require("../middlewares/auth.middleware");
const AddThemeValidator = require("../validations/theme/addTheme.validator");

const router = express.Router();

router.patch("/:themeId", upload.single("image"), ThemesController.updateTheme);
router.delete("/:themeId", auth, ThemesController.deleteTheme);
router.get("/my-themes", auth, ThemesController.getMyThemes);
router.get("/", ThemesController.getThemes);
router.post(
  "/add-my-theme",
  auth,
  upload.single("image"),
  AddThemeValidator.validateData(),
  AddThemeValidator.myValidationResult,
  ThemesController.addTheme
);
router.post(
  "/",
  upload.single("image"),
  AddThemeValidator.validateData(),
  AddThemeValidator.myValidationResult,
  ThemesController.addTheme
);

module.exports = router;
