const Notifications = require("../models/notifications.model");
const Order = require("../models/order.model");
const Product = require("../models/product.model");
const EcommerceStore = require("../models/store.model");
const Transaction = require("../models/transaction.model");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const moment = require("moment");

const getDayName = (dateString) => {
  var days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
  var d = new Date(dateString);
  var dayName = days[d.getDay()];
  return dayName;
};

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

  static async getOrdersByWeek(req, res) {
    const comments = {
      todayEqualsYesterday:
        "Today and yesterday, you got almost the same number of orders.",
      todayGreaterThanYesterday:
        "You received more orders today than yesterday.",
      todayLessThanYesterday: "Your order count today is lower than yesterday.",
      yesterdayEqualsThreeDaysAgo:
        "Yesterday and the day before, you received a similar number of orders.",
      yesterdayGreaterThanThreeDaysAgo:
        "You got more orders yesterday than you did the day before.",
      yesterdayLessThanThreeDaysAgo:
        "You got less orders yesterday than you did the day before.",

      thisWeekEqualsLastWeek:
        "You're averaging about the same number of orders this week and last week.",
      thisWeekGreaterThanLastWeek:
        "Your order count this week is more on average than last week.",
      thisWeekLessThanLastWeek:
        "Your order count this week is less on average than last week.",
      lastWeekEqualsThreeWeeksAgo:
        "You're averaging about the same number of orders last week and the week before.",
      lastWeekGreaterThanThreeWeeksAgo:
        "Your order count last week was more on average than the week before.",
      lastWeekLessThanThreeWeeksAgo:
        "Your order count last week was lower on average than the week before.",

      thisMonthEqualsLastMonth:
        "This month and last month, you're averaging a similar number of orders each day.",
      thisMonthGreaterThanLastMonth:
        "Your order count this month is more on average than last month.",
      thisMonthLessThanLastMonth:
        "Your order count this month is less on average than last month.",
      lastMonthEqualsThreeMonthsAgo:
        "You're averaging about the same number of orders last month and the month before.",
      lastMonthGreaterThanThreeMonthsAgo:
        "Your order count last month was more on average than the month before.",
      lastMonthLessThanThreeMonthsAgo:
        "Your order count last month was lower on average than the month before.",
    };
    try {
      var onedayAgo = moment(new Date()).subtract(1, "day");
      var twodaysAgo = moment(new Date()).subtract(2, "day");
      var threedaysAgo = moment(new Date()).subtract(3, "day");
      var fourdaysAgo = moment(new Date()).subtract(4, "day");
      var fivedaysAgo = moment(new Date()).subtract(5, "day");
      var sixdaysAgo = moment(new Date()).subtract(6, "day");
      var sevendaysAgo = moment(new Date()).subtract(7, "day");

      const orderDay1 = await Order.countDocuments({
        createdAt: { $gte: onedayAgo, $lte: new Date() },
      });
      const ordersDay2 = await Order.countDocuments({
        createdAt: { $gte: twodaysAgo, $lte: onedayAgo },
      });
      const ordersDay3 = await Order.countDocuments({
        createdAt: { $gte: threedaysAgo, $lte: twodaysAgo },
      });
      const ordersDay4 = await Order.countDocuments({
        createdAt: { $gte: fourdaysAgo, $lte: threedaysAgo },
      });
      const ordersDay5 = await Order.countDocuments({
        createdAt: { $gte: fivedaysAgo, $lte: fourdaysAgo },
      });
      const ordersDay6 = await Order.countDocuments({
        createdAt: { $gte: sixdaysAgo, $lte: fivedaysAgo },
      });
      const ordersDay7 = await Order.countDocuments({
        createdAt: { $gte: sevendaysAgo, $lte: sixdaysAgo },
      });

      var oneWeekAgo = moment(new Date()).subtract(1, "week");
      var twoWeeksAgo = moment(new Date()).subtract(2, "week");
      var threeWeeksAgo = moment(new Date()).subtract(3, "week");
      var fourWeeksAgo = moment(new Date()).subtract(4, "week");

      const ordersWeek1 = await Order.countDocuments({
        createdAt: { $gte: oneWeekAgo, $lte: new Date() },
      });
      const ordersWeek2 = await Order.countDocuments({
        createdAt: { $gte: twoWeeksAgo, $lte: oneWeekAgo },
      });
      const ordersWeek3 = await Order.countDocuments({
        createdAt: { $gte: threeWeeksAgo, $lte: twoWeeksAgo },
      });
      const ordersWeek4 = await Order.countDocuments({
        createdAt: { $gte: fourWeeksAgo, $lte: threeWeeksAgo },
      });

      const startOfCurrentYear = moment().startOf("year").toDate();
      const month1 = moment().month(1).startOf("month").toDate();
      const month2 = moment().month(2).startOf("month").toDate();
      const month3 = moment().month(3).startOf("month").toDate();
      const month4 = moment().month(4).startOf("month").toDate();
      const month5 = moment().month(5).startOf("month").toDate();
      const month6 = moment().month(6).startOf("month").toDate();
      const month7 = moment().month(7).startOf("month").toDate();
      const month8 = moment().month(8).startOf("month").toDate();
      const month9 = moment().month(9).startOf("month").toDate();
      const month10 = moment().month(10).startOf("month").toDate();
      const month11 = moment().month(11).startOf("month").toDate();
      const month12 = moment().month(12).startOf("month").toDate();

      const ordersMonth1 = await Order.countDocuments({
        createdAt: { $lte: month1, $gte: startOfCurrentYear },
      });
      const ordersMonth2 = await Order.countDocuments({
        createdAt: { $lte: month2, $gte: month1 },
      });
      const ordersMonth3 = await Order.countDocuments({
        createdAt: { $lte: month3, $gte: month2 },
      });
      const ordersMonth4 = await Order.countDocuments({
        createdAt: { $lte: month4, $gte: month3 },
      });
      const ordersMonth5 = await Order.countDocuments({
        createdAt: { $lte: month5, $gte: month4 },
      });
      const ordersMonth6 = await Order.countDocuments({
        createdAt: { $lte: month6, $gte: month5 },
      });
      const ordersMonth7 = await Order.countDocuments({
        createdAt: { $lte: month7, $gte: month6 },
      });
      const ordersMonth8 = await Order.countDocuments({
        createdAt: { $lte: month8, $gte: month7 },
      });
      const ordersMonth9 = await Order.countDocuments({
        createdAt: { $lte: month9, $gte: month8 },
      });
      const ordersMonth10 = await Order.countDocuments({
        createdAt: { $lte: month10, $gte: month9 },
      });
      const ordersMonth11 = await Order.countDocuments({
        createdAt: { $lte: month11, $gte: month10 },
      });
      const ordersMonth12 = await Order.countDocuments({
        createdAt: { $lte: month12, $gte: month11 },
      });

      //comparision
      //Today vs Yesterday
      //Yesterday vs three days ago
      //This vs last week
      //last week vs three weeks ago
      //This vs last month
      //last month vs three months ago

      //Today
      const today = moment().format("l");
      const yesterday = moment().add(-1, "days").format("l");
      const d1Orders = await Order.countDocuments({
        createdAt: { $gte: today },
      });
      const d2Orders = await Order.countDocuments({
        createdAt: { $gte: yesterday, $lte: today },
      });
      const d3Orders = await Order.countDocuments({
        createdAt: { $gte: threedaysAgo, $lte: yesterday },
      });

      const currentweek = moment().startOf("week").toDate();
      const aweekAgo = moment().subtract(1, "week").startOf("week").toDate();
      const twoweeksAgo = moment().subtract(2, "week").startOf("week").toDate();
      const threeweeksAgo = moment()
        .subtract(3, "week")
        .startOf("week")
        .toDate();
      const w1Orders = await Order.countDocuments({
        createdAt: { $gte: aweekAgo, $lte: currentweek },
      });
      const w2Orders = await Order.countDocuments({
        createdAt: { $gte: twoweeksAgo, $lte: aweekAgo },
      });
      const w3Orders = await Order.countDocuments({
        createdAt: { $gte: threeweeksAgo, $lte: twoweeksAgo },
      });

      const currentMonth = moment().startOf("month").toDate();
      var oneMonthAgo = moment(new Date()).subtract(1, "month").toDate();
      var twoMonthsAgo = moment(new Date()).subtract(2, "month").toDate();
      var threeMonthsAgo = moment(new Date()).subtract(3, "month").toDate();
      var currentYear = moment(new Date()).format("YYYY");
      console.log("currentYear", currentYear);

      const m1Orders = await Order.countDocuments({
        createdAt: { $gte: oneMonthAgo, $lte: currentMonth },
      });
      const m2Orders = await Order.countDocuments({
        createdAt: { $gte: twoMonthsAgo, $lte: oneMonthAgo },
      });
      const m3Orders = await Order.countDocuments({
        createdAt: { $gte: threeMonthsAgo, $lte: twoMonthsAgo },
      });
      const yOrders = await Order.countDocuments({
        createdAt: {
          $gte: moment().startOf("year").toDate(),
          $lte: moment().endOf("year").toDate(),
        },
      });

      // console.log("currentweek", currentweek);
      // console.log("aweekAgo", aweekAgo);
      // console.log("twoweeksAgo", twoweeksAgo);

      // console.log("currentMonth", currentMonth);
      // console.log("oneMonthAgo", oneMonthAgo);
      // console.log("twoMonthsAgo", twoMonthsAgo);

      const comparisions = {
        d1vd2: {
          comment: "",
          d1: {
            startDate: today,
            endDate: today,
            value: d1Orders,
          },
          d2: {
            startDate: yesterday,
            endDate: today,
            value: d2Orders,
          },
        },
        d2vd3: {
          comment: "",
          d3: {
            startDate: threedaysAgo,
            endDate: yesterday,
            value: d3Orders,
          },
          d2: {
            startDate: yesterday,
            endDate: today,
            value: d2Orders,
          },
        },
        w1Vw2: {
          comment: "",
          w1: {
            startDate: aweekAgo,
            endDate: currentweek,
            value: w1Orders,
          },
          w2: {
            startDate: twoweeksAgo,
            endDate: aweekAgo,
            value: w2Orders,
          },
        },
        w2Vw3: {
          comment: "",
          w2: {
            startDate: twoweeksAgo,
            endDate: aweekAgo,
            value: w2Orders,
          },
          w3: {
            startDate: threeweeksAgo,
            endDate: twoweeksAgo,
            value: w3Orders,
          },
        },
        m1Vm2: {
          comment: "",
          m1: {
            startDate: oneMonthAgo,
            endDate: currentMonth,
            value: m1Orders,
          },
          m2: {
            startDate: twoMonthsAgo,
            endDate: oneMonthAgo,
            value: m2Orders,
          },
        },
        m2Vm3: {
          comment: "",
          m3: {
            startDate: threeMonthsAgo,
            endDate: twoMonthsAgo,
            value: m3Orders,
          },
          m2: {
            startDate: twoMonthsAgo,
            endDate: oneMonthAgo,
            value: m2Orders,
          },
        },
      };

      console.log("startOfCurrentYear", startOfCurrentYear);
      return res.status(200).send({
        thisWeek: {
          startDate: aweekAgo,
          endDate: currentweek,
          value: w1Orders,
          date: "This Week",
        },
        thisMonth: {
          startDate: oneMonthAgo,
          endDate: currentMonth,
          value: m1Orders,
          date: `${moment(oneMonthAgo).format("MMM DD")} - ${moment(
            currentMonth
          ).format("MMM DD")}`,
        },
        thisYear: {
          startDate: moment().startOf("year").toDate(),
          endDate: moment().endOf("year").toDate(),
          value: yOrders,
          date: currentYear,
        },
        days: [
          {
            endDate: sevendaysAgo,
            startDate: sixdaysAgo,
            displayedLabel: moment(sevendaysAgo).format("MMM Do YY"),
            label: getDayName(sevendaysAgo),
            value: ordersDay7,
          },
          {
            endDate: sixdaysAgo,
            startDate: fivedaysAgo,
            displayedLabel: moment(sixdaysAgo).format("MMM Do YY"),
            label: getDayName(sixdaysAgo),
            value: ordersDay6,
          },
          {
            endDate: fivedaysAgo,
            startDate: fourdaysAgo,
            displayedLabel: moment(fivedaysAgo).format("MMM Do YY"),
            label: getDayName(fivedaysAgo),
            value: ordersDay5,
          },
          {
            endDate: fourdaysAgo,
            startDate: threedaysAgo,
            displayedLabel: moment(fourdaysAgo).format("MMM Do YY"),
            label: getDayName(fourdaysAgo),
            value: ordersDay4,
          },
          {
            endDate: threedaysAgo,
            startDate: twodaysAgo,
            displayedLabel: moment(threedaysAgo).format("MMM Do YY"),
            label: getDayName(threedaysAgo),
            value: ordersDay3,
          },
          {
            endDate: twodaysAgo,
            startDate: onedayAgo,
            displayedLabel: moment(twodaysAgo).format("MMM Do YY"),
            label: getDayName(twodaysAgo),
            value: ordersDay2,
          },
          {
            endDate: onedayAgo,
            startDate: new Date(),
            displayedLabel: moment(onedayAgo).format("MMM Do YY"),
            label: getDayName(onedayAgo),
            value: orderDay1,
          },
        ],
        weeks: [
          {
            endDate: fourWeeksAgo,
            startDate: threeWeeksAgo,
            value: ordersWeek4,
            label: `${new Date(fourWeeksAgo).getDate()} - ${new Date(
              threeWeeksAgo
            ).getDate()}`,
            displayedLabel: `${moment(fourWeeksAgo).format(
              "MMM DD"
            )} - ${moment(threeWeeksAgo).format("MMM DD")}`,
          },
          {
            endDate: threeWeeksAgo,
            startDate: twoWeeksAgo,
            value: ordersWeek3,
            label: `${new Date(threeWeeksAgo).getDate()} - ${new Date(
              twoWeeksAgo
            ).getDate()}`,
            displayedLabel: `${moment(threeWeeksAgo).format(
              "MMM DD"
            )} - ${moment(twoWeeksAgo).format("MMM DD")}`,
          },
          {
            endDate: twoWeeksAgo,
            startDate: oneWeekAgo,
            value: ordersWeek2,
            label: `${new Date(twoWeeksAgo).getDate()} - ${new Date(
              oneWeekAgo
            ).getDate()}`,
            displayedLabel: `${moment(twoWeeksAgo).format("MMM DD")} - ${moment(
              oneWeekAgo
            ).format("MMM DD")}`,
          },
          {
            endDate: oneWeekAgo,
            startDate: new Date(),
            value: ordersWeek1,
            label: `${new Date(
              oneWeekAgo
            ).getDate()} - ${new Date().getDate()}`,
            displayedLabel: `${moment(oneWeekAgo).format(
              "MMM DD"
            )} - ${moment().format("MMM DD")}`,
          },
        ],
        months: [
          {
            startDate: startOfCurrentYear,
            endDate: month1,
            value: ordersMonth1,
            displayedLabel: moment(month1).format("MMM YYYY"),
            label: moment(startOfCurrentYear).format("MMM"),
          },
          {
            startDate: month1,
            endDate: month2,
            value: ordersMonth2,
            displayedLabel: moment(month2).format("MMM YYYY"),
            label: moment(month1).format("MMM"),
          },
          {
            startDate: month2,
            endDate: month3,
            value: ordersMonth3,
            displayedLabel: moment(month3).format("MMM YYYY"),
            label: moment(month2).format("MMM"),
          },

          {
            startDate: month3,
            endDate: month4,
            value: ordersMonth4,
            displayedLabel: moment(month4).format("MMM YYYY"),
            label: moment(month3).format("MMM"),
          },
          {
            startDate: month4,
            endDate: month5,
            value: ordersMonth5,
            displayedLabel: moment(month5).format("MMM YYYY"),
            label: moment(month4).format("MMM"),
          },
          {
            startDate: month5,
            endDate: month6,
            value: ordersMonth6,
            displayedLabel: moment(month6).format("MMM YYYY"),
            label: moment(month5).format("MMM"),
          },
          {
            startDate: month6,
            endDate: month7,
            value: ordersMonth7,
            displayedLabel: moment(month7).format("MMM YYYY"),
            label: moment(month6).format("MMM"),
          },
          {
            startDate: month7,
            endDate: month8,
            value: ordersMonth8,
            displayedLabel: moment(month8).format("MMM YYYY"),
            label: moment(month7).format("MMM"),
          },
          {
            startDate: month8,
            endDate: month9,
            value: ordersMonth9,
            displayedLabel: moment(month9).format("MMM YYYY"),
            label: moment(month8).format("MMM"),
          },
          {
            startDate: month9,
            endDate: month10,
            value: ordersMonth10,
            displayedLabel: moment(month10).format("MMM YYYY"),
            label: moment(month9).format("MMM"),
          },
          {
            startDate: month10,
            endDate: month11,
            value: ordersMonth11,
            displayedLabel: moment(month11).format("MMM YYYY"),
            label: moment(month10).format("MMM"),
          },
          {
            startDate: month11,
            endDate: month12,
            value: ordersMonth12,
            displayedLabel: moment(month12).format("MMM YYYY"),
            label: moment(month11).format("MMM"),
          },
        ],
        comparisions,
      });
    } catch (error) {
      console.log("error", error);
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
  static async getStore(req, res) {
    try {
      const store = await EcommerceStore.findById(req.params.storeId);

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

      return res.status(200).send(destOb);
    } catch (error) {
      return res.status(500).send();
    }
  }
}
module.exports = StoreController;
