const axios = require("axios");

// import the shieldbow library
const { Client } = require('shieldbow');
const client = new Client(process.env.RIOT_API_KEY);

client.initialize({
  cache: true,
  storage: false,
  region: 'na',
  logger: {
    enable: true,
    level: 'debug'
  },
  ratelimiter: {
    strategy: 'spread',
    throw: true, retry:
    {
      retries: 5,
      retryDelay: 5000
    }
  },
  fetch:
  {
    champions: true,
    items: true,
    runes: true,
    summonerSpells: true
  }
});

/**
 * Retrieves league entries by summoner.
 * @param {championId} championId - The champion's ID.
 * @param {Object} res - The response object.
 **/
const getChampionAssetInfo = async (championId, res) => {
  try {
    const championInfo = await client.champions.fetchByKey(championId);

    // Create a sanitized version of the championInfo object
    // this prevents any circular references from being sent to the frontend
    // thankfully the eliminated fields are not needed for the frontend
    const filteredChampionInfo = {
      championName: championInfo.name,
      championKey: championInfo.key,
      attackType: championInfo.attackType,
      allyTips: championInfo.allyTips,
      classes: championInfo.classes,
      enemyTips: championInfo.enemyTips,
      icon: championInfo.icon,
      id: championInfo.id,
      key: championInfo.key,
      lore: championInfo.lore,
      name: championInfo.name,
      passive: championInfo.passive,
      pricing: championInfo.pricing,
      ratings: championInfo.ratings,
      releaseDate: championInfo.releaseDate,
      releasePatch: championInfo.releasePatch,
      resource: championInfo.resource,
      sprite: championInfo.sprite,
      title: championInfo.title,
    };

    console.log('filteredChampionInfo:', filteredChampionInfo);

    // Send the sanitized Champion object as a JSON response to the frontend
    res.json(filteredChampionInfo);
  } catch (error) {
    console.log('Failed to retrieve champion info:', error);
    // Handle errors and send an appropriate response to the frontend
    res.status(500).json({ error: 'Failed to retrieve champion info' });
  }
};


// small helper function to create a queue info object
// returns an object with the queue info if ranked stats exist for that queue type
// otherwise, return an object with default values for unranked
/**
 * 
 * @param {queue} queue - The queue object.
 * @returns 
 */
const createQueueInfo = (queue) => {
  return queue ? {
    tier: queue.tier,
    division: queue.division,
    lp: queue.lp,
    wins: queue.wins,
    losses: queue.losses,
  } : {
    tier: 'Unranked',
    division: 'Unranked',
    lp: 0,
    wins: 0,
    losses: 0,
  };
};

/**
 * Retrieves league entries by summoner, for both solo queue and flex queue ranks.
 * @param {Object} summoner - The summoner object.
 * @returns {Promise<Object>} - Object containing league entries.
 **/
const getLeagueEntries = async (summoner) => {
  let leagues;
  let leagueEntries = {};

  try {
    leagues = await summoner.fetchLeagueEntries();
  } catch (error) {
    console.log(error);
    leagueEntries = {
      soloQueueInfo: createQueueInfo(null),
      flexQueueInfo: createQueueInfo(null),
    };
    return leagueEntries;
  }

  const soloQ = leagues.get('RANKED_SOLO_5x5');
  const flex = leagues.get('RANKED_FLEX_SR');

  if (!soloQ && !flex) {
    console.log('soloQ and flex are both null');
  }

  if (soloQ || flex) {
    leagueEntries = {
      soloQueueInfo: createQueueInfo(soloQ),
      flexQueueInfo: createQueueInfo(flex),
    };
  } else {
    leagueEntries = {
      soloQueueInfo: createQueueInfo(),
      flexQueueInfo: createQueueInfo(),
    };
  }

  return leagueEntries;
};

/**
 * Retrieves summoner information by summoner name.
 * @param {string} summonerName - The summoner's name.
 * @returns {Promise<Object>} - Object containing summoner information.
 * @throws {Error} - Throws an error if the summoner is not found or if there's an API key issue.
 */
const getSummonerInfoByName = async (summonerName) => {
  try {
    console.log('summonerName:', summonerName)
    const summoner = await client.summoners.fetchBySummonerName(summonerName);
    const { id, accountId, level, name, playerId, profileIcon, region } = summoner;
    const summonerInfo = { accountId, id, level, name, puuid: playerId, profileIcon, region };

    const leagueEntries = await getLeagueEntries(summoner);

    const totalSummonerInfo = {
      ...summonerInfo,
      leagueEntries,
      // ...highestMasteryInfo,
    };
    return totalSummonerInfo;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 404) {
        console.log('error was :', error)
        throw new Error(`Summoner "${summonerName}" not found uhh idk why`);
      } else if (error.response.status === 403) {
        throw new Error("Riot API key is invalid");
      } else if (error.response.status === 400) {
        throw new Error("Summoner name is invalid");
      }
    }
    console.log(error);
  }
};

/**
 * Retrieves match history by PUUID.
 * @param {string} puuid - The player's unique identifier.
 * @param {string} summonerName - The summoner's name (for context).
 * @returns {Promise<Array>} - Array containisng match history.
 * @throws {Error} - Throws an error if the summoner is not found or if there's an API key issue.
 */
const getMatchListBySummID = async (puuid, summonerName) => {
  try {
    console.log('getting match history in lolController.js')
    const matchInformationByPuuid = await client.matches.fetchMatchListByPlayer(puuid);
    console.log('matchInformationByPuuid big success:', matchInformationByPuuid);
    return matchInformationByPuuid;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 404) {
        throw new Error(`Summoner "${summonerName}" not found`);
      } else if (error.response.status === 403) {
        throw new Error("Riot API key is invalid");
      } else if (error.response.status === 400) {
        throw new Error("Summoner name is invalid");
      }
    }

    throw new Error("Error retrieving match history");
  }
};

/**
 * Retrieves match information by match ID.
 * @param {string} matchId - The ID of the match.
 * @returns {Promise<Object>} - Object containing match information.
 * @throws {Error} - Throws an error if the match is not found.
 */
const getMatchInfoById = async (matchId) => {
  try {
    console.log('INSIDE THE LOLCONTROLLER, matchId: ', matchId)
    const response = await axios.get(
      `https://americas.api.riotgames.com/lol/match/v5/matches/${matchId}`,
      {
        headers: {
          "X-Riot-Token": process.env.RIOT_API_KEY,
        },
      }
    );

    const matchInfo = response.data;
    return matchInfo;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error(`Match "${matchId}" not found`);
    } else if (error.response && error.response.status === 403) {
      throw new Error("Riot API key is invalid");
    } else {
      throw new Error("Error retrieving match information");
    }
  }
};

/**
 * Retrieves summoner masteries by summoner ID.
 * @param {string} summonerID - The summoner's ID.
 * @returns {Promise<Array>} - Array containing summoner masteries.
 * @throws {Error} - Throws an error if the summoner is not found.
 */
const getSummonerMasteries = async (summonerID) => {
  try {
    console.log('INSIDE THE getSummonerMasteries\n');
    console.log('summonerID:', summonerID);
    console.log('\nRetrieving summoner masteries in lolController.js');

    const response = await axios.get(
      `https://na1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${summonerID}`,
      {
        headers: {
          "X-Riot-Token": process.env.RIOT_API_KEY,
        }
      }
    );

    const summonerMasteries = response.data;
    return summonerMasteries;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error(`Summoner "${summonerID}" not found for some dumb reason`);
    } else if (error.response && error.response.status === 403) {
      throw new Error("Riot API key is invalid");
    } else if (error.response && error.response.status === 400) {
      throw new Error("Summoner ID is invalid");
    } else if (error.response && error.response.status === 429) {
      throw new Error("Rate limit exceeded");
    } else if (error.response && error.response.status === 500) {
      throw new Error("Internal server error");
    } else {
      throw new Error("Error retrieving summoner masteries");
    }
  }
}

module.exports = {
  getSummonerInfoByName,
  getMatchListBySummID,
  getMatchInfoById,
  getSummonerMasteries,
  getChampionAssetInfo,
};