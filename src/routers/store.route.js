const express = require("express");
const StoreController = require("../controllers/store.controller");
const auth = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/orders/:store", StoreController.getMyStoreOrders);
router.get("/transactions", StoreController.getStoreTransactions);
router.get("/", auth, StoreController.getMyStores);

module.exports = router;
