const oxr = require("open-exchange-rates");
const Currency = require("../models/Currency");

const APP_ID = "cea0d1b9d40e4364b7ddf70163ff1cbd";

saveCurrency = async (day, next) => {
  oxr.set({ app_id: APP_ID });
  oxr.historical(day, async function(error) {
    console.log("historical");
    if (error) {
      return res.status(404).json({ error });
    }
    const USD = oxr.rates.USD;
    const EUR = oxr.rates.EUR;
    const GBP = oxr.rates.GBP;
    const newCurrency = new Currency({
      provider: "oxr",
      currencies: {
        USDEUR: USD / EUR,
        USDGBP: USD / GBP,
        EURUSD: EUR / USD,
        EURGBP: EUR / GBP,
        GBPUSD: GBP / USD,
        GBPEUR: GBP / EUR
      },
      date: day
    });
    let currency = await newCurrency.save();
    console.log("saveCurrency: ", currency);
    next();
  });
};

module.exports = saveCurrency;
