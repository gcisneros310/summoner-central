const express = require("express");
const router = express.Router();
const fs = require('fs');
const lolController = require("../controllers/lolController");

// Define a route to get summoner information by name
router.get("/summoner/:summonerName", async (req, res) => {
  const summonerName = req.params.summonerName;
  try {
    const summonerInfo = await lolController.getSummonerInfoByName(summonerName);
    res.json(summonerInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Define a route to get match history by PUUID
router.get("/match-history/:puuid/:summonerName", async (req, res) => {
  const { puuid, summonerName } = req.params;
  try {
    const matchHistory = await lolController.getMatchListBySummID(puuid, summonerName);
    res.json(matchHistory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/match-info/:matchID', async (req, res) => {
  const { matchID } = req.params;
  try {
    const matchInfo = await lolController.getMatchInfoById(matchID);
    res.json(matchInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

router.get('/get-summoner-masteries/:summonerID', async (req, res) => {
  const { summonerID } = req.params;
  console.log('get-summoner-masteries invoked in apiRoutes.js')
  console.log('summonerID:', summonerID)
  try {
    const summonerMasteries = await lolController.getSummonerMasteries(summonerID);
    res.json(summonerMasteries);
  } catch (error) {
    console.log('Failed to get summoner masteries:', error);
  }
})


module.exports = router;
