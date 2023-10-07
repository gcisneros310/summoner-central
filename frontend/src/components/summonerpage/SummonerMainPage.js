import React from "react";
import HomePageNavBar from "../HomePageNavBar";
import "../../css/SummonerMainPage.css"; // Import the CSS file with a relative path
import { useLocation } from 'react-router-dom';

const SummonerMainPage = () => {
    const location = useLocation();
    const summonerInfo = location.state.summonerInfo;
    console.log('THE SUMMONER INFO OBJ IS:', summonerInfo)
    console.log('summonerIconID:', summonerInfo.profileIconId)

    return (
        <div className="summoner-main-page">
            <HomePageNavBar className="homepage-nav-bar" />
            <div className="summoner-info-main-container">
                <div className="summ-card-info-container">
                <img
                        src={`https://ddragon.leagueoflegends.com/cdn/13.19.1/img/profileicon/${summonerInfo.profileIconId}.png`}
                        alt="Summoner Icon"
                    />
                </div>
                <div className="summ-stats">
                    <div className="summ-ranked-flex-wr-container">
                        2
                        <div className='ranked-info-container'>summoner rank solo</div>
                        <div className='ranked-info-container'>summone rank flex</div>
                        <div className="champ-wr-container">champ winrates</div>
                    </div>
                    <div className="summ-match-history-container">3</div>
                </div>
            </div>
        </div>
    );
}

export default SummonerMainPage;