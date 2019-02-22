const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CurrencySchema = new Schema({
  provider: {
    type: String,
    required: true
  },
  currencies: {
    USDEUR: {
      type: Number,
      required: true
    },
    USDGBP: {
      type: Number,
      required: true
    },
    EURUSD: {
      type: Number,
      required: true
    },
    EURGBP: {
      type: Number,
      required: true
    },
    GBPUSD: {
      type: Number,
      required: true
    },
    GBPEUR: {
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
