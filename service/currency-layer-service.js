const axios = require("axios");
const Currency = require("../models/Currency");

// DATA
const endpoint = "historical";
const access_key = "6f74e40f7402d34287a524ec46099db5";
const apiURL = "http://apilayer.net/api/";

currencyLayerService = async (day, next) => {
  let response = await axios.get(
    `${apiURL}${endpoint}?date=${day}&access_key=${access_key}`
  );
  if (response) saveCurrencyCL(day, next, response.data.quotes);
};

saveCurrencyCL = async (day, next, result) => {
  let currencies = {
    USDEUR: result.USDEUR,
    USDGBP: result.USDGBP,
    EURUSD: 1 / result.USDEUR,
    EURGBP: result.USDGBP / result.USDEUR,
    GBPUSD: 1 / result.USDGBP,
    GBPEUR: result.USDEUR / result.USDGBP
  };
  const newCurrency = new Currency({
    provider: "currency-layer",
    currencies: currencies,
    date: day
  });
  await newCurrency.save();
  next();
};

module.exports = currencyLayerService;
