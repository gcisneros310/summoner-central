import "../../../css/SummonerInfoCard.css"; // Import the CSS file with a relative path
import React, { useEffect, useState } from "react";
import { getChampionAssetInfo } from "../../../api/summonerAPI"
const SummonerInfoCard = ({ summonerInfo }) => {
    let regionString = '';
    switch (summonerInfo.region) {
        case 'na':
            regionString = 'North America';
            break;
        case 'euw':
            regionString = 'Europe West';
            break;
        case 'eune':
            regionString = 'Europe Nordic & East';
            break;
        case 'kr':
            regionString = 'Korea';
            break;
        case 'jp':
            regionString = 'Japan';
            break;
        case 'br':
            regionString = 'Brazil';
            break;
        case 'las':
            regionString = 'Latin America South';
            break;
        case 'lan':
            regionString = 'Latin America North';
            break;
        case 'oce':
            regionString = 'Oceania';
            break;
        case 'ru':
            regionString = 'Russia';
            break;
        case 'tr':
            regionString = 'Turkey';
            break;
        default:
            regionString = 'Unknown';
            break;
    }


    return (
        <div className='summ-info-maincard-container'>
            <img
                className="summ-card-icon"
                src={summonerInfo.profileIcon}
                alt="Summoner Icon"
            />
            <div className="summ-card-info">
                <div className="summ-card-info-name">{summonerInfo.name}</div>
                <div className="summ-card-info-level">Level {summonerInfo.level}</div>
                <div className="summ-card-info-region">{regionString}</div>
            </div>
        </div>
    )
}

export default SummonerInfoCard;