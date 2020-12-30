const express = require("express");
const auth = require("../middlewares/auth.middleware");
const ProductController = require("../controllers/products.controller");
const upload = require("../bucket-config/bucket");
const AddValidProduct = require("../validations/product/addProduct.controller");

const router = express.Router();

router.post(
  "/add",
  auth,
  upload.array("images", 4),
  AddValidProduct.validateData(),
  AddValidProduct.myValidationResult,
  ProductController.addProduct
);

// router.delete(
//   "/:platformId/remove",
//   auth,
//   DigitalPlatformController.deleteDigitalPlatform
// );

// router.patch(
//   "/:platformId/update",
//   auth,
//   DigitalPlatformController.updateDigitalPlatform
// );
// router.get("/:platformId", DigitalPlatformController.viewDigitalPlatform);

module.exports = router;
