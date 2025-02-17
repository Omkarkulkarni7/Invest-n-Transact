const yahooFinance = require("yahoo-finance2").default; // Ensure `.default`

async function getStockPrice(stockSymbol) {
  try {
    const result = await yahooFinance.quoteSummary(stockSymbol, { modules: ["price"] });
    console.log(`Stock Price of ${stockSymbol}:`, result.price.regularMarketPrice);
  } catch (error) {
    console.error("Error fetching stock data:", error);
  }
}

// Fetch Reliance price from NSE
getStockPrice("RELIANCE.NS");

// Fetch TCS price from BSE
getStockPrice("TCS.BO");
