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
const { sendPushNotification } = require("../utilities/pushNotifications");
const { default: axios } = require("axios");
const sgMail = require("@sendgrid/mail");
const fromEmail = "contact@monaly.co";
const fromname = "Monaly";
const linkToMonaly = "https://www.monaly.co";
const linktoDashboard = `${linkToMonaly}/dashboard`;
const linktoPricing = `${linkToMonaly}/pricing`;
const linktoInvite = `${linkToMonaly}/invite`;
const linktoOrders = `${linkToMonaly}/orders`;

class ProductController {
  static async addStore(req, res) {
    const data = {
      ...req.body,
      user: req.user._id,
    };
    if (req.body.name) {
      data.slug = slugify(req.body.name);
    }
    if (req.body.location) {
      data.location = JSON.parse(req.body.location);
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
      return res.status(400).send();
    }
  }

  static async getStore(req, res) {
    try {
      const store = await EcommerceStore.findOne({
        slug: req.params.slug,
      }).populate({ path: "products", model: Product });
      return res.status(200).send(store);
    } catch (error) {
      return res.status(400).send();
    }
  }
  static async getStoreById(req, res) {
    try {
      const store = await EcommerceStore.findById(req.params.storeId).populate({
        path: "products",
        model: Product,
      });
      return res.status(200).send(store);
    } catch (error) {
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
      "location",
      "allowPickup",
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
      if (req.files && req.files.banner) {
        store.banner = req.files.banner[0].location;
      }
      if (req.files && req.files.logo) {
        store.logo = req.files.logo[0].location;
      }

      await store.save();
      return res.status(200).send(store);
    } catch (error) {
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
    if (req.body.features) {
      data.features = JSON.parse(req.body.features);
    }
    if (req.files && req.files.video) {
      data.video = req.files.video[0].location;
    }

    try {
      const product = await Product.create(data);
      return res.status(201).send(product);
    } catch (error) {
      return res.status(400).send();
    }
  }

  static async callForDispatch(req, res) {
    try {
      console.log("req.body.orderId", req.params.orderId);
      const order = await Order.findById(req.params.orderId);
      console.log("order", order);
      const shipment = await axios
        .post(
          "https://sandbox.staging.sendbox.co/shipping/shipments",
          { ...order.shippingData },
          {
            headers: {
              Authorization: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiI2MTZkN2YwYTljMjY3ZjAwNDU1MmZmYWYiLCJhaWQiOiI2MTZkN2ZjZTljMjY3ZjAwNDU1MmZmYjQiLCJ0d29fZmEiOmZhbHNlLCJpc3MiOiJzZW5kYm94LmF1dGgiLCJleHAiOjE2Mzk2NjM3MjZ9.YLbKMT2zYp29bwxro3QMAbeaOzZJa9NcVJpdXgGxiNI".trim(),
            },
          }
        )
        .catch((error) => console.log("error", error));
      console.log("shipment", shipment);

      await order.update(
        {
          shipping: shipment.data,
          tracking_code: shipment.data.tracking_code,
        },
        { new: true }
      );
      return res.status(201).send(order);
    } catch (error) {
      return res.status(400).send();
    }
  }
  static async orderProducts(req, res) {
    try {
      const products = [];
      const data = [];
      let returnable = false;
      const sellerId = req.body.products[0].user;
      const storeId = req.body.products[0].store;
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
        products.push({ product: item._id, quantity: item.quantity });

        data.push({
          item: item.title,
          quantity: item.quantity,
          price: item.price,
        });
        if (item.returnable) {
          returnable = true;
        }
        const productDetails = await Product.findByIdAndUpdate(
          item._id,
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
        shippingData: req.body.shippingData,
        deliveryMerchant: req.body.deliveryMerchant,
        store: storeId,
      };
      if (req.body.dileveryAddress) {
        orderData.dileveryAddress = req.body.dileveryAddress;
      }
      const order = await Order.create(orderData);
      //Create shipment with sandbox

      // const shipment = await axios.post(
      //   "https://sandbox.staging.sendbox.co/shipping/shipments",
      //   { ...req.body.shippingData },
      //   {
      //     headers: {
      //       Authorization: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiI2MTZkN2YwYTljMjY3ZjAwNDU1MmZmYWYiLCJhaWQiOiI2MTZkN2ZjZTljMjY3ZjAwNDU1MmZmYjQiLCJ0d29fZmEiOmZhbHNlLCJpc3MiOiJzZW5kYm94LmF1dGgiLCJleHAiOjE2Mzk2NjM3MjZ9.YLbKMT2zYp29bwxro3QMAbeaOzZJa9NcVJpdXgGxiNI".trim(),
      //     },
      //   }
      // );

      // await order.update({
      //   shipping: shipment.data,
      //   tracking_code: shipment.data.tracking_code,
      // });

      //Update order status to 'pending'
      //drafted
      //This means the shipment hasn't been paid for. User might need to fund their account to complete their shipment request. it comes back with code:"drafted" as the status code in the response.
      //This means the shipment request was successful and is waiting to be picked up.  comes back with code:"pending" as the status code in the response.
      //This means shipment has been picked up. comes back with code:"pickup_started" as the status code in the response.
      //This means the pick up process has been completed. comes back with code:"pickup_completed" in the status code response.
      //This means the delivery process has started. comes back with code:in_delivery in the status code response.
      //This means delivery is in transit and it's updated in real-time. Comes back with code:"in_transit" as the status code in the response.
      //This means the entire process has been completed and the shipment has been delivered. Comes back with code:"deliverd" as the status code in the response.
      // if status_code==='pending' or status_code === 'drafted', Update order status to 'started'
      // if status_code === 'pickup_started', Update order status to 'started', inform seller that transit is here
      // if status_code === 'pickup_completed', Update order status to 'sent', inform buyer that package is in transit
      // if status_code === 'in_transit', Update order status to 'sent', inform buyer that package is in transit
      // if status_code === 'deliverd', Update order status to 'completed', inform seller that package is delivered and ask buyer for feedback

      invoice.invoice_nr = order._id;
      //add invoice to order
      const fileTosend = await createInvoice(invoice, order._id, store);

      //delete buyer's carts

      // await Cart.deleteMany({ user: req.user._id });
      await Transaction.create({
        user: req.user._id,
        description: `Order for ${products.length} product${
          products.length > 1 ? "s" : ""
        }`,
        amount: req.body.total,
        store: storeId,
      });
      const buyer = await User.findById(req.user._id);
      const seller = await User.findById(sellerId);
      // sendRecieptBuyer(buyer.email, data, buyer.firstName, fileTosend);
      await order.update({ invoice: fileTosend });
      // sendRecieptSeller(seller.email, data, seller.firstName);
      const populatedOrder = await Order.findById(order._id).populate(
        "products.product"
      );
      await sendPushNotification(
        "You have a new Order",
        `Order for ${products.length} product${products.length > 1 ? "s" : ""}`,
        seller.expoPushToken,
        {
          order: populatedOrder,
          type: "order",
        }
      );

      // if (returnable) {
      //   /* delay payment */
      //   seller.ledgerBalance += req.body.total;
      // } else {
      //   /* pay seller instantly */
      //   seller.availableBalance += req.body.total;
      // }
      await seller.save();
      return res.status(201).send(order);
    } catch (error) {
      return res.status(400).send();
    }
  }

  static async updateOrderFromSandbox(req, res) {
    try {
      const shipment = req.body;
      const order = await Order.findOne({
        tracking_code: shipment.tracking_code,
      }).populate("products.product");

      const seller = await User.findById(order.seller);
      const buyer = await User.findById(order.buyer);
      // if status_code==='pending' or status_code === 'drafted', Update order status to 'started'
      if (shipment.status_code === "pending" || status_code === "drafted") {
        await order.update({ status: "started" });
      }
      // if status_code === 'pickup_started', Update order status to 'started', inform seller that transit is here
      if (shipment.status_code === "pickup_started") {
        await order.update({ status: "started" });
        //inform seller that transit is here
        await sendPushNotification(
          "Transit is here for Pick Up",
          `Dispacht is here to pick up order of ${
            order.products.length
          } product${products.length > 1 ? "s" : ""}`,
          seller.expoPushToken,
          {
            order,
            type: "order",
          }
        );
      }
      // if status_code === 'pickup_completed', Update order status to 'sent', inform buyer that package is in transit
      if (shipment.status_code === "pickup_completed") {
        await order.update({ status: "sent" });
      }
      // if status_code === 'in_transit', Update order status to 'sent', inform buyer that package is in transit
      if (shipment.status_code === "in_transit") {
        await order.update({ status: "sent" });
        //inform buyer that package is in transit
        await sendPushNotification(
          "Your Package is now in Transit",
          `Your order of ${order.products.length} product${
            products.length > 1 ? "s" : ""
          } is being shipped.`,
          buyer.expoPushToken,
          {
            order,
            type: "order",
          }
        );
        sgMail
          .send({
            to: buyer.email,
            from: {
              email: fromEmail,
              name: fromname,
            },

            subject: "Your Package is in Transit",
            text: `Your order of ${order.products.length} product${
              products.length > 1 ? "s" : ""
            } is being shipped. \n Track your order here ${linktoOrders}/${
              order._id
            }`,
          })
          .then((response) => {
            console.log("Email sent");
          })
          .catch((error) => {
            console.error(error);
          });
      }
      // if status_code === 'deliverd', Update order status to 'completed', inform seller that package is delivered and ask buyer for feedback
      if (shipment.status_code === "delivered") {
        await order.update({ status: "completed" });
        //inform seller that package is delivered and ask buyer for feedback
        await sendPushNotification(
          "Package delivered Successfully.",
          `Your order of ${order.products.length} product${
            products.length > 1 ? "s" : ""
          } has been delivered.`,
          seller.expoPushToken,
          {
            order,
            type: "order",
          }
        );
        sgMail
          .send({
            to: buyer.email,
            from: {
              email: fromEmail,
              name: fromname,
            },

            subject: "Package Delivered.",
            text: `Thank you for trusting us. Your Package has being delivered. \n Kindly tell us about your Monaly experience, It'll help us get better.`,
          })
          .then((response) => {
            console.log("Email sent");
          })
          .catch((error) => {
            console.error(error);
          });
      }

      await order.save();

      return res.status(200).send(order);
    } catch (error) {
      return res.status(400).send(error);
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
      })
        .populate({
          path: "products",
          populate: { path: "product", model: Product },
        })
        .sort("createdAt", -1);

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
      "returnable",
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
      if (req.files && req.files.image) {
        product.images = [...images, { image: req.files.image[0].location }];
      }
      if (req.files && req.files.video) {
        product.video = req.files.video[0].location;
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
      const products = await Product.find({ store: req.params.storeId })
        .sort({
          createdAt: -1,
        })
        .limit(Number(req.query.perPage))
        .skip(Number(req.query.page));
      return res.status(200).send({ products });
    } catch (error) {
      return res.status(400).send();
    }
  }

  static async getStoreAndProducts(req, res) {
    try {
      const store = await EcommerceStore.findById(req.params.storeId);
      return res.status(200).send({ store });
    } catch (error) {
      return res.status(400).send();
    }
  }
  static async loadSandBox(req, res) {
    try {
      const result = await axios.post(
        "https://sandbox.staging.sendbox.co/shipping/shipment_delivery_quote",
        { ...req.body },
        {
          headers: {
            Authorization: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiI2MTZkN2YwYTljMjY3ZjAwNDU1MmZmYWYiLCJhaWQiOiI2MTZkN2ZjZTljMjY3ZjAwNDU1MmZmYjQiLCJ0d29fZmEiOmZhbHNlLCJpc3MiOiJzZW5kYm94LmF1dGgiLCJleHAiOjE2Mzk2NjM3MjZ9.YLbKMT2zYp29bwxro3QMAbeaOzZJa9NcVJpdXgGxiNI".trim(),
          },
        }
      );
      return res.status(200).send(result.data);
    } catch (error) {
      return res.status(400).send();
    }
  }
}
module.exports = ProductController;
