let championByIdCache = {};
let championJson = {};

async function getLatestChampionDDragon(language = "en_US") {
    if (championJson[language])
        return championJson[language];

    let response;
    let versionIndex = 0;
    do {
        const version = (await fetch("http://ddragon.leagueoflegends.com/api/versions.json").then(async (r) => await r.json()))[versionIndex++];

        response = await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/${language}/champion.json`);
    } while (!response.ok)

    championJson[language] = await response.json();
    return championJson[language];
}

async function getChampionByKey(key, language = "en_US") {
    if (!championByIdCache[language]) {
        let json = await getLatestChampionDDragon(language);

        championByIdCache[language] = {};
        for (var championName in json.data) {
            if (!json.data.hasOwnProperty(championName))
                continue;

            const champInfo = json.data[championName];
            championByIdCache[language][champInfo.key] = champInfo;
        }
    }

    return championByIdCache[language][key];
}

async function getChampionByID(name, language = "en_US") {
    return await getLatestChampionDDragon(language)[name];
}

module.exports = {
    getLatestChampionDDragon,
    getChampionByKey,
    getChampionByID,
};