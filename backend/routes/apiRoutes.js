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

router.post('/save-player-object', async (req, res) => {
  const playerObject = req.body; // Now you can directly access the JSON object in the request body
  console.log('summonerData received:', playerObject);

  // write the playerObject to a JSON file named exampleData.json
  fs.writeFile('exampleData.json', JSON.stringify(playerObject), (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error writing file');
      return;
    }
    console.log('summonerData has been saved to exampleData.json');
    res.send('summonerData has been saved to exampleData.json');
  });
})


module.exports = router;
