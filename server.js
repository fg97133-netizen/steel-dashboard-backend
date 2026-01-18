import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/api/rebar", async (req, res) => {
  try {
    const url =
      "https://api.tradingeconomics.com/markets/commodity/STEELREBAR?c=guest:guest";

    const response = await fetch(url, { timeout: 5000 });

    if (!response.ok) {
      throw new Error("Trading Economics unreachable");
    }

    const json = await response.json();

    // On prend les dernières observations
    const data = json
      .slice(-30)
      .map(item => ({
        date: item.Date.substring(0, 10),
        value: item.Last
      }));

    const trend =
      data.at(-1).value > data.at(-2).value
        ? "up"
        : data.at(-1).value < data.at(-2).value
        ? "down"
        : "flat";

    res.json({
      source: "Trading Economics",
      unit: "USD / tonne",
      trend,
      data
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend démonstrateur acier actif sur le port ${PORT}`);
});
