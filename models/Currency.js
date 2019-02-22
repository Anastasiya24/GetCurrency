const mongoose = require("mongoose");
require("mongoose-money");
const Schema = mongoose.Schema;

const CurrencySchema = new Schema({
  provider: {
    type: String,
    required: true,
    index: true
  },
  currencies: {
    USD: {
      type: Schema.Types.Money,
      required: true,
      index: true
    },
    EUR: {
      type: Schema.Types.Money,
      required: true
    },
    GBP: {
      type: Schema.Types.Money,
      required: true,
      index: true
    }
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("currency", CurrencySchema);
