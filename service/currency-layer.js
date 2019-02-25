const API = require("currency-conversion");
const Currency = require("../models/Currency");

const access_key = "6f74e40f7402d34287a524ec46099db5";

const api = new API({
  access_key: access_key
});

historicalQuery = day => {
  return {
    date: day,
    currencies: ["EUR", "GBP"]
  };
};

saveCurrency = async (day, res, next) => {
  api.historical(historicalQuery(day), async function(error, result) {
    if (error) {
        return res.status(404).json({ error });
    }
    let currencies = {
      USDEUR: result.quotes.USDEUR,
      USDGBP: result.quotes.USDGBP,
      EURUSD: 1 / result.quotes.USDEUR,
      EURGBP: result.quotes.USDGBP / result.quotes.USDEUR,
      GBPUSD: 1 / result.quotes.USDGBP,
      GBPEUR: result.quotes.USDEUR / result.quotes.USDGBP
    };
    const newCurrency = new Currency({
      provider: "currency-layer",
      currencies: currencies,
      date: day
    });
    await newCurrency.save();
    next();
  });
};

module.exports = saveCurrency;
