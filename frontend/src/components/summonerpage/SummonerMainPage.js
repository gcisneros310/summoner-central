import React from "react";
import HomePageNavBar from "../HomePageNavBar";
import "../../css/SummonerMainPage.css"; // Import the CSS file with a relative path
import { useLocation } from 'react-router-dom';
import SummonerInfoCard from "./SummonerInfoCard";
import { useEffect, useState } from "react";
import axios from "axios";

const SummonerMainPage = () => {

    const [championData, setChampionData] = useState(null);

    useEffect(() => {
      // Check if champion data is cached in localStorage
      const cachedChampionData = localStorage.getItem("championData");
      
      if (cachedChampionData) {
        // If cached data is found, parse and set it in state
        setChampionData(JSON.parse(cachedChampionData));
      } else {
        // If not cached, fetch the data from the API and cache it
        axios.get("https://ddragon.leagueoflegends.com/cdn/13.19.1/data/en_US/champion.json")
          .then((response) => {
            const champions = response.data.data;
            setChampionData(champions);
  
            // Cache the data in localStorage for future use
            localStorage.setItem("championData", JSON.stringify(champions));
          })
          .catch((error) => {
            console.error("Error fetching champion data:", error);
          });
      }
    }, []);

    const location = useLocation();
    const summonerInfo = location.state.summonerInfo;
    console.log('THE SUMMONER INFO OBJ IS:', summonerInfo)
    console.log('summonerIconID:', summonerInfo.profileIconId)

    return (
        <div className='main-container'>
            <HomePageNavBar className="homepage-nav-bar" />
            <div className="summoner-main-page">
                <div className="summoner-info-main-container">
                    <SummonerInfoCard summonerInfo={summonerInfo} />
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
        </div>

    );
}

export default SummonerMainPage;