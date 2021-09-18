const express = require("express");
const StoreController = require("../controllers/store.controller");

const router = express.Router();

router.get("/orders/:store", StoreController.getMyStoreOrders);
router.get("/", StoreController.getStoreTransactions);

module.exports = router;
