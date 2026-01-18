import express from "express";
import csv from "csvtojson";

const app = express();
const PORT = process.env.PORT || 3000;

/*
  ENDPOINT 1
  Fer à béton (Steel Rebar futures)
  Source open : Stooq (CSV public)
*/
app.get("/api/rebar", async (req, res) => {
    try {
        const response = await fetch(
            "http://stooq.com/q/d/l/?s=rb.f&i=d",
            {
                headers: {
                    "User-Agent": "Mozilla/5.0"
                }
            }
        );

        if (!response.ok) {
            throw new Error("Stooq unreachable");
        }

        const text = await response.text();
        const data = await csv().fromString(text);

        res.json(data.slice(-90));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur récupération fer à béton" });
    }
});
/*
  ENDPOINT 2
  Taux de change USD -> EUR
  Source open
*/
app.get("/api/fx", async (req, res) => {
    try {
        const response = await fetch("https://open.er-api.com/v6/latest/USD");
        const data = await response.json();
        res.json({ rate: data.rates.EUR });
    } catch (error) {
        res.status(500).json({ error: "Erreur récupération taux de change" });
    }
});

app.listen(PORT, () => {
    console.log(`Backend acier démarré sur le port ${PORT}`);
});
