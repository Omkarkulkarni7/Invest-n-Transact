const axios = require("axios");
const Stock = require("../models/stocks.model"); // Import Stock model

const API_KEY = "21VK9UXGTHYGQCYP";
const BASE_URL = "https://www.alphavantage.co/query";

async function fetchStockPrice(symbol) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: "TIME_SERIES_INTRADAY",
        symbol: symbol,
        interval: "5min",
        apikey: API_KEY,
      },
    });

    const timeSeries = response.data["Time Series (5min)"];
    if (!timeSeries) {
      throw new Error("Invalid response from AlphaVantage");
    }

    // Get latest available stock data
    const latestTimestamp = Object.keys(timeSeries)[0];
    const latestData = timeSeries[latestTimestamp];

    const latestPrice = parseFloat(latestData["4. close"]);

    return {
      symbol,
      price: latestPrice,
      last_updated: latestTimestamp,
    };
  } catch (error) {
    console.error(`Error fetching stock price for ${symbol}:`, error.message);
    return null;
  }
}

// Store or update stock in the database
async function saveStockPrice(symbol) {
  const stockData = await fetchStockPrice(symbol);
  if (!stockData) return;

  await Stock.upsert({
    symbol: stockData.symbol,
    company_name: "Reliance Industries",
    price: stockData.price,
    last_updated: stockData.last_updated,
  });

  console.log(`Stock ${symbol} updated: ₹${stockData.price}`);
}

module.exports = { fetchStockPrice, saveStockPrice };
