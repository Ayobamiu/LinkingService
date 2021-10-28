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
  // AddValidProduct.validateData(),
  // AddValidProduct.myValidationResult,
  ProductController.addProduct
);
router.post(
  "/store",
  auth,
  upload.fields([{ name: "logo" }, { name: "banner" }]),
  ProductController.addStore
);
router.post("/load-sandBox", ProductController.loadSandBox);
router.post("/add-transaction", auth, ProductController.addTransaction);
router.get("/store/products/:storeId", ProductController.getStoreProducts);
router.get("/store/:storeId", ProductController.getStoreAndProducts);
router.get("/store-by-slug/:slug", ProductController.getStore);
router.get("/store-by-id/:storeId", ProductController.getStoreById);
router.get("/stores", auth, ProductController.getStores);
router.patch(
  "/store/:storeId",
  upload.fields([{ name: "banner" }, { name: "logo" }]),
  ProductController.updateStore
);
router.patch(
  "/store/:storeId/logo",
  upload.single("image"),
  ProductController.updateStoreLogo
);

router.patch(
  "/remove-image/:productId/:imageId",
  ProductController.deleteProductImage
);
router.delete("/:productId/remove", ProductController.deleteProduct);
router.post("/order", auth, ProductController.orderProducts);
router.get("/orders", auth, ProductController.getMyOrders);
// router.get("/orders/:store",  ProductController.getMyStoreOrders);
router.get("/orders/:orderId", ProductController.getSingleOrder);

router.patch("/:orderId/update-order", ProductController.updateOrder);
router.patch("/:orderId/call-for-dispatch", ProductController.callForDispatch);
router.get("/carts", auth, ProductController.loadMyCarts);
router.post("/:productId/add-cart", auth, ProductController.addProductToCart);
router.post(
  "/:cartId/remove-cart",
  auth,
  ProductController.removeProductFromCart
);
router.patch("/:cartId/update-cart", ProductController.updateProductInCart);
router.patch("/:productId/update", ProductController.updateProduct);
router.get("/:productId", ProductController.viewProduct);
router.patch(
  "/add-image/:productId",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  ProductController.addProductImage
);
module.exports = router;
