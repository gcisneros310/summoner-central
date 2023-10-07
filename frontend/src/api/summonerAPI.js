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

const savePlayerObject = async (playerObject) => {
    axios.post('/api/save-player-object', playerObject, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.error(error);
        });
}


// sends multiple requests to API to return one object
// one request is made to the API to retrieve summoner information
// another request is made to the API to retrieve match history
// multiple requests are made to get each match's information, at the moment the total is 10
export const getSummonerInformation = async (summonerName) => {
    const summonerInfoResponse = await getSummonerInfoByName(summonerName); // get summoner information object
    const summonerInfo = summonerInfoResponse.data;
    console.log("Summoner Info RETURNED FROM ENDPOINT: ", summonerInfo);

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

    const summonerData = {
        ...summonerInfo,
        matchInformation: matchInfoObject,
    }

    // invoke saveplayerobject to save the summonerData object to a JSON file
    // const savePlayerObjectResponse = await savePlayerObject(summonerData);
    // if (savePlayerObjectResponse.status === 200) {
    //     console.log('summonerData has been saved to exampleData.json');
    // } else {
    //     console.log('Error saving summonerData to exampleData.json');
    // }

    return summonerData;
};
