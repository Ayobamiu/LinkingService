const Notifications = require("../models/notifications.model");
const Order = require("../models/order.model");
const Product = require("../models/product.model");
const EcommerceStore = require("../models/store.model");
const Transaction = require("../models/transaction.model");

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
        const transaction = await Transaction.aggregate([
          {
            $group: {
              _id: { type: "$type" },
              total: { $sum: "$amount" },
            },
          },
        ]);
        const plus = transaction.find((i) => i._id.type === "plus");
        const minus = transaction.find((i) => i._id.type === "minus");
        const total = transaction.find((i) => i._id.type === "plus");
        const destOb = store.toObject();
        destOb.availableBalance = plus.total - minus.total;

        data.push(destOb);
      }

      return res.status(200).send(data);
    } catch (error) {
      return res.status(500).send();
    }
  }
}
module.exports = StoreController;
