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
const { createInvoice } = require("../documents/createInvoice");

class ProductController {
  static async addStore(req, res) {
    const data = {
      ...req.body,
      user: req.user._id,
    };
    console.log("data", data);
    if (req.body.name) {
      data.slug = slugify(req.body.name);
    }
    if (req.files && req.files.banner) {
      data.banner = req.files.banner[0].location;
    }
    if (req.files && req.files.logo) {
      data.logo = req.files.logo[0].location;
    }
    try {
      const store = await EcommerceStore.create(data);
      return res.status(201).send(store);
    } catch (error) {
      console.log("error", error);
      return res.status(400).send();
    }
  }

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

  static async addProduct(req, res) {
    let images = [];
    if (req.files && req.files.images) {
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
    if (req.files && req.files.video) {
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

  static async orderProducts(req, res) {
    try {
      const products = [];
      const data = [];
      let returnable = false;
      const sellerId = req.body.products[0].product.user;
      const storeId = req.body.products[0].product.store;
      const store = await EcommerceStore.findById(storeId);

      const invoice = {
        shipping: {},
        items: [],
        subtotal: null,
        paid: null,
        invoice_nr: null,
      };
      if (req.body.dileveryAddress) {
        const dileveryAddress = await ShippingAddress.findById(
          req.body.dileveryAddress
        );

        invoice.shipping = {
          name: dileveryAddress.name,
          address: dileveryAddress.address,
          city: dileveryAddress.city,
          country: dileveryAddress.country,
          state: dileveryAddress.state,
          postal_code: dileveryAddress.zip,
        };
      }
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
        const productDetails = await Product.findByIdAndUpdate(
          item.product._id,
          {
            $inc: { numberInStock: -1 },
          },
          { new: true }
        );
        invoice.items.push({
          item: productDetails.title,
          description: productDetails.description,
          quantity: item.quantity,
          amount: productDetails.price,
        });
      }
      invoice.subtotal = req.body.total - req.body.shippingFee;
      invoice.shipping = req.body.total;
      invoice.paid = req.body.total;

      const orderData = {
        products,
        seller: sellerId,
        buyer: req.user._id,
        amount: req.body.total,
        shippingFee: req.body.shippingFee,
        deliveryMethod: req.body.deliveryMethod,
        deliveryMerchant: req.body.deliveryMerchant,
        store: storeId,
      };
      if (req.body.dileveryAddress) {
        orderData.dileveryAddress = req.body.dileveryAddress;
      }
      const order = await Order.create(orderData);
      invoice.invoice_nr = order._id;
      //add invoice to order
      const fileTosend = await createInvoice(invoice, order._id, store);

      //delete buyer's carts

      await Cart.deleteMany({ user: req.user._id });
      const buyer = await User.findById(req.user._id);
      const seller = await User.findById(sellerId);
      sendRecieptBuyer(buyer.email, data, buyer.firstName, fileTosend);
      await order.update({ invoice: fileTosend });
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
      return res.status(400).send();
    }
  }

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

  static async updateProduct(req, res) {
    const updates = Object.keys(req.body);
    const allowedUpdates = [
      "cta",
      "description",
      "features",
      "isAssured",
      "numberInStock",
      "price",
      "shippingFee",
      "title",
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

  static async addProductImage(req, res) {
    const product = await Product.findOne({
      _id: req.params.productId,
    });
    if (!product) {
      return res.status(404).send({ error: "Not found" });
    }
    try {
      const images = product.images;
      if (req.file) {
        product.images = [...images, { image: req.file.location }];
      }
      await product.save();

      return res.status(200).send(product);
    } catch (error) {
      return res.status(400).send(error);
    }
  }

  static async deleteProductImage(req, res) {
    const product = await Product.findOne({
      _id: req.params.productId,
    });
    if (!product) {
      return res.status(404).send({ error: "Not found" });
    }
    try {
      const images = product.images;
      const indexOf = images.findIndex(
        (image) => image._id == req.params.imageId
      );
      if (indexOf !== -1) {
        images.splice(indexOf, 1);
      }
      await product.save();

      return res.status(200).send(product);
    } catch (error) {
      return res.status(400).send(error);
    }
  }

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

  static async removeProductFromCart(req, res) {
    try {
      const cart = await Cart.findByIdAndDelete(req.params.cartId);

      return res.status(200).send(cart);
    } catch (error) {
      return res.status(400).send(error);
    }
  }

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

  static async getStoreProducts(req, res) {
    try {
      const store = await EcommerceStore.findById(req.params.storeId).populate({
        path: "products",
        model: Product,
        options: { sort: { createdAt: -1 } },
      });
      return res.status(200).send({ products: store.products });
    } catch (error) {
      console.log("error", error);
      return res.status(400).send();
    }
  }

  static async getStoreAndProducts(req, res) {
    try {
      const store = await EcommerceStore.findById(req.params.storeId);
      return res.status(200).send({ store });
    } catch (error) {
      console.log("error", error);
      return res.status(400).send();
    }
  }
}
module.exports = ProductController;
