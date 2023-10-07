const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const createToken = (user) => {
  const {
    _id,
    email,
    summonerName,
    gameHistoryIDs,
    _puuid,
    name,
    profileIconId,
    revisionDate,
    summonerLevel,
    id,
    accountId,
  } = user;
  return jwt.sign(
    {
      user: {
        _id,
        email,
        summonerName,
        gameHistoryIDs,
        _puuid,
        name,
        profileIconId,
        revisionDate,
        summonerLevel,
        id,
        accountId,
      },
    },
    process.env.SECRET_SIGNATURE,
    {
      expiresIn: "30d",
    }
  );
};

// login user
const loginUser = async (request, response) => {
  const { email, password } = request.body;
  try {
    const user = await User.login(email, password);

    console.log(user);

    const {
      _id,
      summonerName,
      gameHistoryIDs,
      _puuid,
      name,
      profileIconId,
      revisionDate,
      summonerLevel,
      id,
      accountId,
    } = user;

    //create a user token
    const token = createToken(user._id);

    response.status(201).json({
      user: {
        email,
        summonerName,
        gameHistoryIDs,
        _puuid,
        name,
        profileIconId,
        revisionDate,
        summonerLevel,
        id,
        accountId,
      },
      token,
    });
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
};

// signup user
const signupUser = async (request, response) => {
  const { email, password, summonerName } = request.body;

  console.log('request.body: ', request.body)

  try {
    const user = await User.signup(email, password, request.body.summonerName);

    //create a user token
    const token = createToken(user._id);

    console.log(user);
    const {
      _id,
      summonerName,
      gameHistoryIDs,
      _puuid,
      name,
      profileIconId,
      revisionDate,
      summonerLevel,
      id,
      accountId,
    } = user;

    response.status(201).json({
      user: {
        email,
        summonerName,
        gameHistoryIDs,
        _puuid,
        name,
        profileIconId,
        revisionDate,
        summonerLevel,
        id,
        accountId,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    response.status(400).json({ error: error.message });
  }
};

module.exports = { loginUser, signupUser };
