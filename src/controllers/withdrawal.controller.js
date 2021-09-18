const { default: axios } = require("axios");
const Transaction = require("../models/transaction.model");

class WithdrawalController {
  static async withdrawToOwnAccount(req, res) {
    const reference = `${new Date()
      .toLocaleTimeString()
      .replace(":", "_")
      .replace(":", "_")}${req.user._id}`.replace(" ", "");

    try {
      const response = await axios
        .post(
          "https://api.flutterwave.com/v3/transfers",
          {
            account_bank: req.body.account_bank,
            account_number: req.body.account_number,
            amount: req.body.amount,
            narration: "Withdrawal to own account",
            currency: "NGN",
            reference,
            callback_url:
              "https://webhook.site/b3e505b0-fe02-430e-a538-22bbbce8ce0d",
            debit_currency: "NGN",
          },
          {
            headers: {
              Authorization:
                "Bearer FLWSECK-8784009391a9c53cc089aed215c14dea-X",
            },
          }
        )
        .catch((err) => {
          console.log("err", err.response.data);
        });
      console.log("response", response);
      if (response.data.status === "error") {
        return res.status(400).send({ message: response.data.message });
      }
      const transaction = await Transaction.create({
        user: req.user._id,
        description: "Withdrawal to own account",
        amount: req.body.amount,
        store: req.body.store,
        data: req.body,
        reference,
        type: "minus",
      });

      return res.status(201).send({
        transaction,
        message: "Transfer Approved, your account will be credited soon",
      });
    } catch (error) {
      return res.status(500).send(error);
    }
  }
}
module.exports = WithdrawalController;
