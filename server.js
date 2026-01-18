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
        const url = "https://stooq.com/q/d/l/?s=rb.f&i=d";
        const response = await fetch(url);
        const text = await response.text();
        const data = await csv().fromString(text);

        // On renvoie les 90 derniers jours
        res.json(data.slice(-90));
    } catch (error) {
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
