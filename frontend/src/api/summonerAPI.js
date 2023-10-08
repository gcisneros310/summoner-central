import axios from "axios";

// sends request to apiRoutes endpoint to retrieve summoner information
const getSummonerInfoByName = async (summonerName) => {
    console.log('summonerAPI invoked for summonerinfo')
    return await axios.get(`/api/summoner/${summonerName}`)
}

// sends request to apiRoutes endpoint to retrieve match history list
const getMatchListBySummID = async (puuid, summonerName) => {
    console.log('summonerAPI invoked for matches')
    return await axios.get(`/api/match-history/${puuid}/${summonerName}`)
}

// sends request to apiRoutes endpoint to retrieve individual match info by matchID
const getMatchInfoByMatchID = async (matchID) => {
    console.log(matchID)
    return await axios.get(`/api/match-info/${matchID}`)
}

const getSummonerMasteries = async (summonerID) => {
    console.log('summonerAPI invoked for summoner masteries')
    return await axios.get(`/api/get-summoner-masteries/${summonerID}`)
}

export const getSummonerInformation = async (summonerName) => {
    const summonerInfoResponse = await getSummonerInfoByName(summonerName); // get summoner information object
    const summonerInfo = summonerInfoResponse.data;
    console.log("Summoner Info RETURNED FROM ENDPOINT: ", summonerInfo);

    console.log('getting summoner masteries')
    console.log('summonerID:', summonerInfo.id)
    const summonerMasteriesResponse = await getSummonerMasteries(summonerInfo.puuid);

    const summonerDataAndMasteries = {
        ...summonerInfo,
        summonerMasteries: summonerMasteriesResponse.data,
    }

    const matchHistoryResponse = await getMatchListBySummID(summonerInfo.puuid, summonerName); // get the list of match IDs
    const matchHistory = matchHistoryResponse.data;
    console.log("Match History RETURNED FROM ENDPOINT: ", matchHistory);
    console.log('the data type of match history is:', typeof matchHistory)

    // the match IDs and individual match information are stored in an object as a key value pair
    var matchInfoObject = {};

    // iterate through the match history array and make a request for each match ID
    for (var i = 0; i < matchHistory.length; i++) {
        const matchInfoResponse = await getMatchInfoByMatchID(matchHistory[i]);
        const matchInfo = matchInfoResponse.data;
        console.log('match info for match number', i + 1, matchInfo);
        matchInfoObject[matchHistory[i]] = matchInfo; // store the match info in the object using the match ID as the key
    }

    console.log('match info object is:', JSON.stringify(matchInfoObject));

    var completeSummonerData = {
        ...summonerDataAndMasteries,
        matchInformation: matchInfoObject,
    }

    return completeSummonerData;
};
