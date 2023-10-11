import React, { useEffect, useState } from "react";
import HomePageNavBar from "../HomePageNavBar";
import "../../css/SummonerMainPage.css"; // Import the CSS file with a relative path
import { useLocation } from 'react-router-dom';
import SummonerInfoCard from "./SummonerInfoMainContainer/SummonerInfoCard";
import SummonerMasteryCard from "./SummonerInfoMainContainer/SummonerMasteryCard";
import { Container, Row, Image, Col } from "react-bootstrap";
import RankInfoContainer from "./SummonerInfoMainContainer/RankInfoContainer";
import MatchHistoryCard from "./MatchHistoryCard/MatchHistoryCard";

const SummonerMainPage = () => {
    const [summonerID, setSummonerID] = useState("");
    const location = useLocation();
    const summonerInfo = location.state.summonerInfo;
    const summonerId = location.state.summonerInfo.id;
    const summonerMatchHistoryObject = location.state.summonerInfo.matchInformation;
    const keys = Object.keys(summonerMatchHistoryObject);

    const summonerMatchHistory = [];

    keys.forEach(element => {
        summonerMatchHistory.push({element: summonerMatchHistoryObject[element]});
    });

    console.log('Data', summonerInfo);
    
    useEffect(()=> {
        setSummonerID(location.state.summonerInfo.id);
    }, [])
    return (
        <div className='main-container' style={{background: "#070720"}}>
            <HomePageNavBar className="homepage-nav-bar" />
            <div className="summoner-main-page">
                <div className="summoner-info-main-container">
                    <div className="summoner-info-bg-container">
                        <div className="summoner-info-bg">
                            <div className="bg-container">
                                <Image src="https://static.bigbrain.gg/assets/lol/riot_static/13.19.1/img/splash/Thresh_1.jpg" style={{ width: "100%", maxWidth: "500px"}}/>
                            </div>
                            <div className="gradient-container">
                                <div className="gradient"></div>
                            </div>
                        </div>
                    </div>
                
                  <div className="summ-card-info-container">
                  <SummonerInfoCard summonerInfo={summonerInfo} />
                    <SummonerMasteryCard highestMasteryChamp={summonerInfo.highestMasteryChamp} />
                  </div>
                    <div className="summ-stats">
                        <div className="summ-ranked-flex-wr-container">
                            <Container className='ranked-info-container'>
                                <RankInfoContainer rankinfo={summonerInfo.leagueEntries.soloQueueInfo} />
                            </Container>
                            <div className='ranked-info-container'>summone rank flex</div>
                            <div className="champ-wr-container">champ winrates</div>
                        </div>
                        <div className="summ-match-history-container">

                            {/* Make this into a component for W and L */}
                            {/* Begin */}
                            {summonerMatchHistory.map((matchHistoryData, index) => {
                                console.log(summonerId);
                                return <MatchHistoryCard matchHistoryData={matchHistoryData} summonerId={summonerID} />;
                            })}
                            {/* End */}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default SummonerMainPage;