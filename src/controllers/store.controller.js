const Notifications = require("../models/notifications.model");
const Order = require("../models/order.model");
const Product = require("../models/product.model");
const Transaction = require("../models/transaction.model");

class StoreController {
  static async getStoreTransactions(req, res) {
    try {
      const transactions = await Transaction.find({
        store: req.query.store,
      })
        .sort({ createdAt: -1 })
        .select("description currency status amount createdAt");

      return res.status(200).send(transactions);
    } catch (error) {
      return res.status(400).send();
    }
  }
  static async getMyStoreOrders(req, res) {
    console.log("req.params.store", req.params.store);
    try {
      const orders = await Order.find({
        store: req.params.store,
      }).populate({
        path: "products",
        populate: { path: "product", model: Product, select: "title" },
      });
      console.log("orders", orders);
      return res.status(200).send(orders);
    } catch (error) {
      return res.status(500).send();
    }
  }
}
module.exports = StoreController;
