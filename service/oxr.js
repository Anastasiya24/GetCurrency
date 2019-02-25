const oxr = require("open-exchange-rates");
const Currency = require("../models/Currency");

const APP_ID = "cea0d1b9d40e4364b7ddf70163ff1cbd";

saveCurrency = async (day, res, next) => {
  oxr.set({ app_id: APP_ID });
  oxr.historical(day, async function(error) {
    console.log("historical");
    if (error) {
      return res.status(404).json({ error });
    }
    let currencies = {
      USDEUR: oxr.rates.EUR,
      USDGBP: oxr.rates.GBP,
      EURUSD: 1 / oxr.rates.EUR,
      EURGBP: oxr.rates.GBP / oxr.rates.EUR,
      GBPUSD: 1 / oxr.rates.GBP,
      GBPEUR: oxr.rates.EUR / oxr.rates.GBP
    };
    const newCurrency = new Currency({
      provider: "oxr",
      currencies: currencies,
      date: day
    });
    let currency = await newCurrency.save();
    console.log("OXR saveCurrency: ", currency);
    next();
  });
};

module.exports = saveCurrency;
