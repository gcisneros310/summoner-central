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
    level: 'WARN'
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
    champions: false,
    items: true,
    runes: true,
    summonerSpells: true
  }
});

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
    const summoner = await client.summoners.fetchBySummonerName(summonerName);
    const { accountId, id, level, name, playerId, profileIcon, region } = summoner;
    const summonerInfo = { accountId, id, level, name, puuid: playerId, profileIcon, region };

    const leagueEntries = await getLeagueEntries(summoner);

    const championMastery = summoner.championMastery;
    const highestMastery = await championMastery.highest();
    const highestMasteryInfo = {
      highestMasteryChamp: {
        id: highestMastery.champion.key,
        name: highestMastery.champion.name,
      },
      masteryLevel: highestMastery.level,
      masteryPoints: highestMastery.points,
    };

    const totalSummonerInfo = {
      ...summonerInfo,
      leagueEntries,
      ...highestMasteryInfo,
    };

    return totalSummonerInfo;
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
    console.log(error);
    throw new Error("Error retrieving summoner information");
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
    const response = await axios.get(
      `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?count=1`,
      {
        headers: {
          "X-Riot-Token": process.env.RIOT_API_KEY,
        },
      }
    );

    const matchHistory = response.data;
    console.log('the data type of match history is:', typeof matchHistory)
    console.log('Below is the matchHistory: \n\n', matchHistory)
    return matchHistory;
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
      throw new Error(`Summoner "${summonerID}" not found`);
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
  getSummonerMasteries
};