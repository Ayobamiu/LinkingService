const Notifications = require("../models/notifications.model");
const Order = require("../models/order.model");
const Product = require("../models/product.model");
const EcommerceStore = require("../models/store.model");
const Transaction = require("../models/transaction.model");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

class StoreController {
  static async getStoreTransactions(req, res) {
    try {
      const transactions = await Transaction.find({
        store: req.query.store,
      }).sort({ createdAt: -1 });
      // .select("description currency status amount createdAt type");

      return res.status(200).send(transactions);
    } catch (error) {
      return res.status(400).send();
    }
  }
  static async getMyStoreOrders(req, res) {
    try {
      const orders = await Order.find({
        store: req.params.store,
      })
        .populate({
          path: "products",
          populate: { path: "product", model: Product, select: "title" },
        })
        .sort({ createdAt: -1 });
      return res.status(200).send(orders);
    } catch (error) {
      return res.status(500).send();
    }
  }
  static async getMyStores(req, res) {
    try {
      const stores = await EcommerceStore.find({
        user: req.user._id,
      });
      const data = [];
      for (let index = 0; index < stores.length; index++) {
        const store = stores[index];
        const transactions = await Transaction.find({ store: store._id });
        let minus = 0;
        let plus = 0;
        for (let index = 0; index < transactions.length; index++) {
          const transaction = transactions[index];
          if (transaction.type === "plus") {
            plus += transaction.amount;
          }
          if (transaction.type === "minus") {
            minus += transaction.amount;
          }
        }
        const destOb = store.toObject();
        destOb.availableBalance = plus - minus;

        data.push(destOb);
      }
      return res.status(200).send(data);
    } catch (error) {
      return res.status(500).send();
    }
  }
}
module.exports = StoreController;
