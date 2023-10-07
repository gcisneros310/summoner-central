const axios = require("axios");

/**
 * Retrieves summoner information by summoner name.
 * @param {string} summonerName - The summoner's name.
 * @returns {Promise<Object>} - Object containing summoner information.
 * @throws {Error} - Throws an error if the summoner is not found or if there's an API key issue.
 */
const getSummonerInfoByName = async (summonerName) => {
  try {
    console.log("INSIDE THE LOLCONTROLLER, summonerName: ", summonerName)
    const response = await axios.get(
      `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}`,
      {
        headers: {
          "X-Riot-Token": process.env.RIOT_API_KEY,
        },
      }
    );

    const summonerInfo = response.data;
    console.log('Below is the summonerInfo: \n\n', summonerInfo)
    console.log('the data type of summonerInfo is:', typeof summonerInfo)
    return summonerInfo;
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

module.exports = {
  getSummonerInfoByName,
  getMatchListBySummID,
  getMatchInfoById
};