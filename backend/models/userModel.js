var mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const axios = require("axios");
require("dotenv").config();

var UserSchema = new mongoose.Schema({
  summonerName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  gameHistoryIDs: {
    type: [String],
    required: false,
  },
  _puuid: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  profileIconId: {
    type: Number,
    required: true,
  },
  revisionDate: {
    type: Number,
    required: true,
  },
  summonerLevel: {
    type: Number,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  accountId: {
    type: String,
    required: true,
  },
});

const retrieveSummonerInfo = async (summonerName) => {
  console.log("Summoner Name: ", summonerName);

  try {
    const response = await axios.get(
      `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}`,
      {
        headers: {
          "X-Riot-Token": process.env.RIOT_API_KEY,
        },
      }
    );
    const {
      accountId,
      profileIconId,
      revisionDate,
      name,
      id,
      puuid,
      summonerLevel,
    } = response.data;
    console.log("Account ID: ", accountId);
    console.log("Profile Icon ID: ", profileIconId);
    console.log("Revision Date: ", revisionDate);
    console.log("Name: ", name);
    console.log("ID: ", id);
    console.log("PUUID: ", puuid);
    console.log("Summoner Level: ", summonerLevel);

    return {
      accountId,
      profileIconId,
      revisionDate,
      name,
      id,
      puuid,
      summonerLevel,
    };
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error(`Summoner "${summonerName}" not found`);
    } else if (error.response && error.response.status === 403) {
      throw new Error("Riot API key is invalid");
    }
    throw new Error("Error retrieving user puuid");
  }
};

const retrieveMatchHistory = async (puuid, summonerName) => {
  try {
    const response = await axios.get(
      `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?count=10`,
      {
        headers: {
          "X-Riot-Token": process.env.RIOT_API_KEY,
        },
        params: {
          summonerName: summonerName,
        },
      }
    );

    const matchHistory = response.data;
    return matchHistory;
  } catch(error) {
    if (error.response && error.response.status === 404) {
      throw new Error(`Summoner "${summonerName}" not found`);
    } else if (error.response && error.response.status === 403) {
      throw new Error("Riot API key is invalid");
    }
    else if (error.response && error.response.status === 400) {
      throw new Error("Summoner name is invalid");
    }
    throw new Error("Error retrieving match history");
  }
}


// static signup method
UserSchema.statics.signup = async function (email, password, summonerName) {
  // check if email is valid
  if (!email || !password || !summonerName) {
    throw Error("Please fill all email, password, and summoner name fields.");
  }
  if (!validator.isEmail(email)) {
    throw Error("Please enter a valid email.");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error("Please enter a stronger password.");
  }

  const exists = await this.findOne({ email });
  if (exists) {
    throw new Error("Email already in use");
  }

  // salt generating tool
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  // retrieve summoner puuid
  const {
    accountId,
    profileIconId,
    revisionDate,
    name,
    id,
    puuid,
    summonerLevel,
  } = await retrieveSummonerInfo(summonerName);

  const matchHistory = await retrieveMatchHistory(puuid);
  const gameHistoryIDs = matchHistory.map((match) => match);
  console.log("Match History: ", matchHistory)
  const user = await this.create({
    email: email,
    password: hash,
    summonerName: summonerName,
    _puuid: puuid,
    name: name,
    profileIconId: profileIconId,
    revisionDate: revisionDate,
    summonerLevel: summonerLevel,
    id: id,
    accountId: accountId,
    gameHistoryIDs: gameHistoryIDs,
  });

  console.log("SUCCESSFUL SIGNUP!");
  return user;
};

// static login method
UserSchema.statics.login = async function (email, password) {
  // check if email is valid
  if (!email || !password) {
    throw Error("Please fill all email and password fields.");
  }

  const user = await this.findOne({ email });
  if (!user) {
    throw new Error("Incorrect email");
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new Error("Incorrect password");
  }

  console.log("SUCCESSFUL LOGIN!");
  return user;
};

module.exports = mongoose.model("User", UserSchema);
