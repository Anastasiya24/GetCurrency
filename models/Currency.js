const mongoose = require("mongoose");
require("mongoose-money");
const Schema = mongoose.Schema;

const CurrencySchema = new Schema({
  provider: {
    type: String,
    required: true
  },
  currencies: {
    USD: {
      type: Number,
      required: true
    },
    EUR: {
      type: Number,
      required: true
    },
    GBP: {
      type: Number,
      required: true
    }
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("currency", CurrencySchema);
