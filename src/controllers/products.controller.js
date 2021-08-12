const Order = require("../models/order.model");
const Product = require("../models/product.model");
const moment = require("moment");
const Cart = require("../models/cart.model");
const User = require("../models/users.model");
const { sendRecieptBuyer, sendRecieptSeller } = require("../emails/account");
const ShippingAddress = require("../models/shippingAddress.model");
const EcommerceStore = require("../models/store.model");
const { default: slugify } = require("slugify");
const Transaction = require("../models/transaction.model");

/**
 *Contains Product Controller
 *
 *
 *
 * @class ProductController
 */
class ProductController {
  /**
   * Add a Store
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof ProductController
   * @returns {JSON} - A JSON success response.
   *
   */
  static async addStore(req, res) {
    const data = {
      ...req.body,
      user: req.user._id,
    };
    if (req.body.name) {
      data.slug = slugify(req.body.name);
    }
    if (req.file) {
      data.logo = req.file.location;
    }
    try {
      const store = await EcommerceStore.create(data);
      return res.status(201).send(store);
    } catch (error) {
      console.log("error", error);
      return res.status(400).send();
    }
  }

  /**
   * Get a Stores
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof ProductController
   * @returns {JSON} - A JSON success response.
   *
   */
  static async getStores(req, res) {
    try {
      const stores = await EcommerceStore.find({
        user: req.user._id,
      });
      return res.status(200).send(stores);
    } catch (error) {
      console.log("error", error);
      return res.status(400).send();
    }
  }

  /**
   * Get a Store
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof ProductController
   * @returns {JSON} - A JSON success response.
   *
   */
  static async getStore(req, res) {
    console.log("start");
    try {
      const store = await EcommerceStore.findOne({
        slug: req.params.slug,
      }).populate({ path: "products", model: Product });
      console.log("store", store);
      return res.status(200).send(store);
    } catch (error) {
      console.log("error", error);
      return res.status(400).send();
    }
  }

  /**
   * Update store
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof ProductController
   * @returns {JSON} - A JSON success response.
   *
   */
  static async updateStore(req, res) {
    const updates = Object.keys(req.body);
    const allowedUpdates = [
      "name",
      "description",
      "phoneOne",
      "phoneTwo",
      "address",
      "city",
      "state",
      "continent",
      "country",
    ];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );
    if (!isValidOperation) {
      return res.status(400).send({ error: "Invalid Updates" });
    }

    try {
      const store = await EcommerceStore.findById(req.params.storeId);
      updates.forEach((update) => (store[update] = req.body[update]));

      await store.save();
      return res.status(200).send(store);
    } catch (error) {
      console.log("error", error);
      return res.status(400).send();
    }
  }

  /**
   * Update store logo
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof ProductController
   * @returns {JSON} - A JSON success response.
   *
   */
  static async updateStoreLogo(req, res) {
    if (!req.file) {
      return res.status(400).send({ error: "Invalid Update" });
    }
    try {
      const store = await EcommerceStore.findByIdAndUpdate(
        req.params.storeId,
        {
          logo: req.file.location,
        },
        { new: true }
      );
      return res.status(200).send({ logo: store.logo });
    } catch (error) {
      console.log("error", error);
      return res.status(400).send();
    }
  }

  /**
   * Add a Product
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof ProductController
   * @returns {JSON} - A JSON success response.
   *
   */
  static async addProduct(req, res) {
    let images = [];
    let video = "";

    if (req.files.images) {
      for (let index = 0; index < req.files.images.length; index++) {
        const element = req.files.images[index];
        images.push({ image: element.location });
      }
    }
    const data = {
      user: req.user._id,
      images,
      ...req.body,
    };
    if (req.files.video) {
      data.video = req.files.video[0].location;
    }

    try {
      const product = await Product.create(data);
      return res.status(201).send(product);
    } catch (error) {
      console.log("error", error);
      return res.status(400).send();
    }
  }

  /**
   * Order a Product
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof ProductController
   * @returns {JSON} - A JSON success response.
   *
   */
  static async orderProducts(req, res) {
    try {
      const products = [];
      const data = [];
      let returnable = false;
      const sellerId = req.body.products[0].product.user;
      for (let index = 0; index < req.body.products.length; index++) {
        const item = req.body.products[index];
        products.push({ product: item.product._id, quantity: item.quantity });
        data.push({
          item: item.product.title,
          quantity: item.quantity,
          price: item.product.price,
        });
        if (item.product.returnable) {
          returnable = true;
        }
        await Product.findByIdAndUpdate(
          item.product._id,
          {
            $inc: { numberInStock: -1 },
          },
          { new: true }
        );
      }

      const order = await Order.create({
        products,
        seller: sellerId,
        buyer: req.user._id,
        amount: req.body.total,
        shippingFee: req.body.shippingFee,
        deliveryMethod: req.body.deliveryMethod,
        deliveryMerchant: req.body.deliveryMerchant,
        dileveryAddress: req.body.dileveryAddress,
      });
      //delete buyer's carts
      await Cart.deleteMany({ user: req.user._id });
      const buyer = await User.findById(req.user._id);
      const seller = await User.findById(sellerId);
      sendRecieptBuyer(buyer.email, data, buyer.firstName);
      sendRecieptSeller(seller.email, data, seller.firstName);

      if (returnable) {
        /* delay payment */
        seller.ledgerBalance += req.body.total;
      } else {
        /* pay seller instantly */
        seller.availableBalance += req.body.total;
      }
      await seller.save();
      return res.status(201).send(order);
    } catch (error) {
      console.log(error);
      return res.status(400).send();
    }
  }

  /**
   * Update an Order
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof ProductController
   * @returns {JSON} - A JSON success response.
   *
   */
  static async updateOrder(req, res) {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["status", "dileveryAddress", "quantity", "eta"];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );
    if (!isValidOperation) {
      return res.status(400).send({ error: "Invalid Updates" });
    }
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).send({ error: "Not found" });
    }
    try {
      if (updates.includes("eta")) {
        order.eta = moment(order.eta).add(req.body.eta, "days").toDate();
      }
      updates.forEach((update) => {
        if (update !== "eta") {
          order[update] = req.body[update];
        }
      });
      await order.save();

      return res.status(200).send(order);
    } catch (error) {
      return res.status(400).send(error);
    }
  }

  /**
   * Get my orders
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof ProductController
   * @returns {JSON} - A JSON success response.
   *
   */
  static async getMyOrders(req, res) {
    try {
      const orders = await Order.find({
        $or: [{ seller: req.user._id }, { buyer: req.user._id }],
      }).populate({
        path: "products",
        populate: { path: "product", model: Product },
      });

      return res.status(200).send(orders);
    } catch (error) {
      return res.status(500).send();
    }
  }

  /**
   * Get single order
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof ProductController
   * @returns {JSON} - A JSON success response.
   *
   */
  static async getSingleOrder(req, res) {
    try {
      const order = await Order.findById(req.params.orderId).populate({
        path: "products",
        populate: { path: "product", model: Product },
      });

      return res.status(200).send(order);
    } catch (error) {
      return res.status(500).send();
    }
  }

  /**
   * Delete a Product
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof ProductController
   * @returns {JSON} - A JSON success response.
   *
   */
  static async deleteProduct(req, res) {
    try {
      const product = await Product.findOneAndDelete({
        _id: req.params.productId,
        user: req.user._id,
      });
      if (!product) {
        return res.status(404).send();
      }
      return res.status(200).send(product);
    } catch (error) {
      return res.status(500).send();
    }
  }

  /**
   * View a Product
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof ProductController
   * @returns {JSON} - A JSON success response.
   *
   */
  static async viewProduct(req, res) {
    try {
      const product = await Product.findById(req.params.productId);
      if (!product) {
        return res.status(404).send();
      }

      return res.status(200).send(product);
    } catch (error) {
      return res.status(500).send();
    }
  }

  /**
   * Update a Product
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof ProductController
   * @returns {JSON} - A JSON success response.
   *
   */
  static async updateProduct(req, res) {
    const updates = Object.keys(req.body);
    const allowedUpdates = [
      "title",
      "description",
      "price",
      "shippingFee",
      "numberInStock",
      "isAssured",
      "cta",
    ];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );
    if (!isValidOperation) {
      return res.status(400).send({ error: "Invalid Updates" });
    }
    const product = await Product.findOne({
      _id: req.params.productId,
      user: req.user._id,
    });
    if (!product) {
      return res.status(404).send({ error: "Not found" });
    }
    try {
      updates.forEach((update) => (product[update] = req.body[update]));
      await product.save();

      return res.status(200).send(product);
    } catch (error) {
      return res.status(400).send(error);
    }
  }

  /**
   * Add a Product to cart
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof ProductController
   * @returns {JSON} - A JSON success response.
   *
   */
  static async addProductToCart(req, res) {
    try {
      const product = await Product.findById(req.params.productId);
      const carts = await Cart.find({ user: req.user._id }).populate("product");
      const isFromDifferentStore = carts.find(
        (item) => item.product.store !== product.store
      );
      if (isFromDifferentStore) {
        await Cart.deleteMany({ user: req.user._id });
      }
      const existing = await Cart.findOne({
        product: req.params.productId,
        user: req.user._id,
      });
      if (existing) {
        return res.status(400).send(error);
      }

      await Cart.create({
        product: req.params.productId,
        user: req.user._id,
      });
      const cartsNew = await Cart.find({ user: req.user._id }).populate(
        "product"
      );

      return res.status(200).send({ carts: cartsNew });
    } catch (error) {
      return res.status(400).send(error);
    }
  }

  /**
   * Remove a Product from cart
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof ProductController
   * @returns {JSON} - A JSON success response.
   *
   */
  static async removeProductFromCart(req, res) {
    try {
      const cart = await Cart.findByIdAndDelete(req.params.cartId);

      return res.status(200).send(cart);
    } catch (error) {
      return res.status(400).send(error);
    }
  }

  /**
   * Update cart
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof ProductController
   * @returns {JSON} - A JSON success response.
   *
   */
  static async updateProductInCart(req, res) {
    try {
      const cart = await Cart.findByIdAndUpdate(
        req.params.cartId,
        {
          quantity: req.body.quantity,
        },
        { new: true }
      );

      return res.status(200).send(cart);
    } catch (error) {
      return res.status(400).send(error);
    }
  }

  /**
   * Load my carts
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof ProductController
   * @returns {JSON} - A JSON success response.
   *
   */
  static async loadMyCarts(req, res) {
    try {
      const carts = await Cart.find({
        user: req.user._id,
      }).populate("product");

      let storeAddress = "";
      if (carts.length > 0) {
        const store = await EcommerceStore.findById(carts[0].product.store);
        storeAddress = store;
      }

      return res.status(200).send({ carts, storeAddress });
    } catch (error) {
      return res.status(400).send(error);
    }
  }

  /**
   * Add shipping Address
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof ProductController
   * @returns {JSON} - A JSON success response.
   *
   */
  static async addShippingAdress(req, res) {
    try {
      const carts = await ShippingAddress.create({
        user: req.user._id,
      }).populate("product");

      let storeAddress = "";
      if (carts.length > 0) {
        const seller = await User.findById(carts[0].product.user);
        storeAddress = seller.storeAddress;
      }

      return res.status(200).send({ carts, storeAddress });
    } catch (error) {
      return res.status(400).send(error);
    }
  }

  /**
   * Add transaction
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof ProductController
   * @returns {JSON} - A JSON success response.
   *
   */
  static async addTransaction(req, res) {
    try {
      const transaction = await Transaction.create({
        user: req.user._id,
        ...req.body,
      });

      return res.status(201).send({ transaction });
    } catch (error) {
      return res.status(400).send(error);
    }
  }
}
module.exports = ProductController;
