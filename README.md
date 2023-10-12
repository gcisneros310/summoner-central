
# Summoner Central

Summoner Central is a tool for League of Legends players to search and view summoner information. Users are allowsed to type in a summoner name and summoner information is retrieved, such as the summoner's name, ranks, winrates, and match history with details. 

Project frontend is a bit barren for now as its still a work in progress. However, almost all of the backend functionality has been implemented.


# Deployment

There is no deployment... yet
## Screenshots

[<img src="[https://i.imgur.com/k4ZYqy7.png](https://i.imgur.com/BRJgtvE.png)" width="300">](https://i.imgur.com/BRJgtvE.png)


## Features

- Account log in & sign up
- Summoner look up (currently limited to NA accounts only)
- Summoner information displays (ranks, winrates, match history, etc)
- Match information displays


## Tech Stack

**Client:** React, React Bootstrap, React Router, Axios, CSS

**Server:** Node, Express, Axios, MongoDB


## Run Locally

This project will eventually be deployed once it is near completion, so installation won't be necessary. However, if it's still something you want to do, I won't stop you. The two main things you will need prior to running the application locally are:

- A MongoDB URI from a currently existing MongoDB instance
- A Riot API key (it can be either a development, personal, or professional key). If you are using a development key, keep in mind you will need to replace it every 24 hours. [Instructions for getting Riot API key](https://developer.riotgames.com/docs/portal) 


Clone the repository

```bash
  cd my-project
```

Install dependencies. First use a standard npm install command to install any root dependencies. Then use the following command at the root of the project to instal both frontend and backend dependencies simultaneously:

```bash
  npm install:all
```

Make sure to add a .env file to the backend folder to contain three things:

```bash
  PORT=<PORT_NO_GOES_HERE>
  MONGO_URI=<YOUR_MONGO_URI_GOES_HERE>
  SECRET_SIGNATURE=<YOUR_SECRET_SIG_GOES_HERE>
  RIOT_API_KEY=<YOUR_API_KEY_GOES_HERE>
```

Once all of that is configured, you can invoke the frontend and backend by using the following command

```bash
  npm run start:dev
```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT`: Your localhost port. Choose one to your liking.

`MONGO_URI`: The MongoDB URI for your currently existing collections database.

`SECRET_SIGNATURE`: The secret signature required for the JSON web token generation.

`RIOT_API_KEY`: Your personal Riot API key
## Optimizations

Currently, Summoner Central makes 12 API requests in total per search
- One for retrieving summoner information, such as rank, profile ID, summoner level, etc.
- One for retrieving a list of matches the player has participated in. The match history is returned as an object list of IDs by region. Currently the API endpoint is configured to retrieve ten match IDs.
- One individual request for collecting the information of each match, which contains most of the important statistics for each match, such as CS, gold earned, K/D/A, etc. 

API caching is being planned to help against rate limiting for common API requests. Currently, multiple third party LoL API clients with built in caching functionalty are being explored as well as Redis and node-cache for asset caching locally. Champion splash arts, game and item icons, and other similar images are also being hosted locally for now using DataDragon's provided .tgz file ([read here for more information](https://developer.riotgames.com/docs/lol#data-dragon))


## Authors

This was pretty much made solely by me as a fun little project to learn how to use an API and handle requests, along with helping strengthen my overall frontend and backend skills. I got some other interesting projects as well if you want to take a look:
- [@gcisneros310](https://www.github.com/gcisneros310)


## Feedback

If you have any feedback, you're always free to contact me at gustavo.cisneros.3@gmail.com

