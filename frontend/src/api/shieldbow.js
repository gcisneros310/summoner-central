// this is a shieldbow instance only for requesting image and champion assets publically available from Data Dragon
// this is not a shieldbow instance for requesting data from the Riot API
// as a result, no API key is needed

const { Client } = require('shieldbow');

const shieldbowClient = new Client('no-key-needed');
shieldbowClient.initialize({
  cache: true, // cache assets since they only update every two weeks or so
  storage: false,
  fetch: // fetch options for the client to use
  {
    champions: true,
    items: true,
    runes: true,
    summonerSpells: true
  }
});

export default shieldbowClient;