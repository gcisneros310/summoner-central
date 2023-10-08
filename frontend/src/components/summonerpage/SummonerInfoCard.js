import React from "react";
import "../../css/SummonerInfoCard.css"; // Import the CSS file with a relative path

const SummonerInfoCard = ({ summonerInfo }) => {
    return (
        <div className='summ-info-maincard-container'>
            <img
                className="summ-card-icon"
                src={`https://ddragon.leagueoflegends.com/cdn/13.19.1/img/profileicon/${summonerInfo.profileIconId}.png`}
                alt="Summoner Icon"
            />
            <div className="summ-card-info">
                <div className="summ-card-info-name">{summonerInfo.name}</div>
                <div className="summ-card-info-level">Level {summonerInfo.summonerLevel}</div>
            </div>
        </div>
    )
}

export default SummonerInfoCard;