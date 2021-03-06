const axios = require("axios");
const Currency = require("../models/Currency");

// DATA
const endpoint = "historical";
const access_key = "cea0d1b9d40e4364b7ddf70163ff1cbd";
const apiURL = "https://openexchangerates.org/api/";

oxrService = async (day, next) => {
  let response = await axios.get(
    `${apiURL}${endpoint}/${day}.json?app_id=${access_key}`
  );
  if (response) saveCurrency(day, next, response.data.rates);
};

saveCurrency = async (day, next, result) => {
  let currencies = {
    USDEUR: result.EUR,
    USDGBP: result.GBP,
    EURUSD: 1 / result.EUR,
    EURGBP: result.GBP / result.EUR,
    GBPUSD: 1 / result.GBP,
    GBPEUR: result.EUR / result.GBP
  };
  const newCurrency = new Currency({
    provider: "oxr",
    currencies: currencies,
    date: day
  });
  await newCurrency.save();
  next();
};

module.exports = oxrService;
