const express = require("express");
const auth = require("../middlewares/auth.middleware");
const ProductController = require("../controllers/products.controller");
const upload = require("../bucket-config/bucket");
const AddValidProduct = require("../validations/product/addProduct.validator");

const router = express.Router();

router.post(
  "/add",
  auth,
  upload.array("images", 4),
  AddValidProduct.validateData(),
  AddValidProduct.myValidationResult,
  ProductController.addProduct
);

router.delete("/:productId/remove", auth, ProductController.deleteProduct);
router.post("/:productId/order", auth, ProductController.orderProduct);

router.patch("/:orderId/update-order", auth, ProductController.updateOrder);
router.patch("/:productId/update", auth, ProductController.updateProduct);
router.get("/:productId", ProductController.viewProduct);

module.exports = router;
