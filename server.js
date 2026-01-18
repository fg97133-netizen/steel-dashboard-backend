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
        const API_KEY = 9jZExSftdNysrxe8yJRw;

        const url =
            "https://data.nasdaq.com/api/v3/datasets/CHRIS/SHFE_RB1.json" +
            "?api_key=" + API_KEY;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Nasdaq Data Link unreachable");
        }

        const json = await response.json();

        // Formatage simple pour le frontend
        const data = json.dataset.data
            .slice(0, 90)
            .reverse()
            .map(row => ({
                Date: row[0],
                Close: row[4]
            }));

        res.json(data);

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
