const express = require("express");
const StoreController = require("../controllers/store.controller");
const auth = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/orders/:store", StoreController.getMyStoreOrders);
router.get("/transactions", StoreController.getStoreTransactions);
router.get("/orders-highlights", StoreController.getOrdersByWeek);
router.get("/:storeId", StoreController.getStore);
router.get("/", auth, StoreController.getMyStores);

module.exports = router;
