const express = require("express");
const auth = require("../middlewares/auth.middleware");
const ProductController = require("../controllers/products.controller");
const upload = require("../bucket-config/bucket");
const AddValidProduct = require("../validations/product/addProduct.validator");

const router = express.Router();

router.post(
  "/add",
  auth,
  upload.fields([{ name: "images" }, { name: "video", maxCount: 1 }]),
  AddValidProduct.validateData(),
  AddValidProduct.myValidationResult,
  ProductController.addProduct
);
router.post("/store", auth, upload.single("image"), ProductController.addStore);
router.get("/store/:slug", ProductController.getStore);
router.get("/stores", auth, ProductController.getStores);
router.patch("/store/:storeId", ProductController.updateStore);
router.patch(
  "/store/:storeId/logo",
  upload.single("image"),
  ProductController.updateStoreLogo
);

router.delete("/:productId/remove", auth, ProductController.deleteProduct);
router.post("/order", auth, ProductController.orderProducts);
router.get("/orders", auth, ProductController.getMyOrders);
router.get("/orders/:orderId", ProductController.getSingleOrder);

router.patch("/:orderId/update-order", auth, ProductController.updateOrder);
router.get("/carts", auth, ProductController.loadMyCarts);
router.post("/:productId/add-cart", auth, ProductController.addProductToCart);
router.post(
  "/:cartId/remove-cart",
  auth,
  ProductController.removeProductFromCart
);
router.patch("/:cartId/update-cart", ProductController.updateProductInCart);
router.patch("/:productId/update", auth, ProductController.updateProduct);
router.get("/:productId", ProductController.viewProduct);

module.exports = router;
