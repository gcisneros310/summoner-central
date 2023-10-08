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

/**
 * Retrieves summoner information by summoner name.
 * @param {string} summonerName - The summoner's name.
 * @returns {Promise<Object>} - Object containing summoner information.
 * @throws {Error} - Throws an error if the summoner is not found or if there's an API key issue.
 */
const getSummonerInfoByName = async (summonerName) => {
  try {
    console.log("INSIDE THE LOLCONTROLLER, summonerName: ", summonerName)
    const summoner = await client.summoners.fetchBySummonerName(summonerName);
    const summonerInfo = {
      accountID: summoner.accountId,
      id: summoner.id,
      level: summoner.level,
      name: summoner.name,
      puuid: summoner.playerId,
      profileIcon: summoner.profileIcon,
      region: summoner.region,
    };

    // retrieving summoner league entries (ranked stats)
    const leagues = await summoner.fetchLeagueEntries();
    const soloQ = leagues.get('RANKED_SOLO_5x5');
    const flex = leagues.get('RANKED_FLEX_SR');
    
    const leagueEntries = {
      soloQueueInfo: {},
      flexQueueInfo: {},
    };

    if (soloQ) {
      leagueEntries.soloQueueInfo = {
        soloQueueTier: soloQ.tier || 'Unranked',
        soloQueueDivision: soloQ.division  || 'Unranked',
        soloQueueLP: soloQ.lp || 0,
        soloQueueWins: soloQ.wins   || 0,
        soloQueueLosses: soloQ.losses || 0,
      };
    } else {
      leagueEntries.soloQueueInfo = {
        soloQueueTier: 'Unranked',
        soloQueueDivision: 'Unranked',
        soloQueueLP: 0,
        soloQueueWins: 0,
        soloQueueLosses: 0,
      };
    }

    if (flex) {
      leagueEntries.flexQueueInfo = {
        flexQueueTier: flex.tier || 'Unranked',
        flexQueueDivision: flex.division || 'Unranked',
        flexQueueLP: flex.lp || 0,
        flexQueueWins: flex.wins || 0,
        flexQueueLosses: flex.losses || 0,
      };
    } else {
      leagueEntries.flexQueueInfo = {
        flexQueueTier: 'Unranked',
        flexQueueDivision: 'Unranked',
        flexQueueLP: 0,
        flexQueueWins: 0,
        flexQueueLosses: 0,
      };
    }

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

    console.log('highestMastery:', highestMastery)

    const totalSummonerInfo = {
      ...summonerInfo,
      ...leagueEntries,
      ...highestMasteryInfo,
    }


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
    console.log(error)
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