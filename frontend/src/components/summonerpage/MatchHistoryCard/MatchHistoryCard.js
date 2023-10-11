import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Row, Image, Col } from "react-bootstrap";
import './MatchHistoryCard.css';
const MatchHistoryCard = (matchHistoryData, summonerId) => {
    const [winStatus, setWinStatus] = useState(false);
    const [summonerGameInfo, setSummonerGameInfo] = useState({});
    const [summonerGameChampion, setSummonerGameChampion] = useState("");
    const [teamOne, setTeamOne] = useState([]);
    const [teamTwo, setTeamTwo] = useState([]);
    const location = useLocation();
    const id = location.state.summonerInfo.id;
    // console.log("PROPS", matchHistoryData.matchHistoryData.element.info);
    const tempTeamOne = [];
    const tempTeamTwo = [];
    useEffect(()=>{
        matchHistoryData.matchHistoryData.element.info.participants.forEach((participant, index) => {
            if (index <= 4) {
                tempTeamOne.push(participant.summonerName);
            } else if (index > 4) {
                tempTeamTwo.push(participant.summonerName);
            }
            if (participant.summonerId === id)
            {
                setSummonerGameInfo(participant);
                setWinStatus(participant.win);
                setSummonerGameChampion(participant.championName);
            }
        })

        setTeamOne(tempTeamOne);
        setTeamTwo(tempTeamTwo);
    },[])

    // console.log("GameStatus", winStatus);

    return (
        <Container className={winStatus === true ? ("win-banner-color") : ("loss-banner-color")} style={{display: "flex", minHeight: "80px", borderRadius: "4px", marginBottom: "16px"}}>
            <Col>
                <Row>
                    <Col style={{maxWidth: "100px"}}>
                    <div>
                        <p>{matchHistoryData.matchHistoryData.element.info.gameMode}</p>
                        {winStatus === true ? (<p className='win-label'>WIN</p>) : (<p className='loss-label'>LOSS</p>)}
                    </div>
                    </Col>
                    <Col>
                        <Container>
                            <Row>
                                <Col> {summonerGameChampion} </Col>
                                <Col>
                                    <Row>{summonerGameInfo.summoner1Id}</Row>
                                    <Row>{summonerGameInfo.summoner2Id}</Row>
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                </Row>
            </Col>
            <Col>
                <Row>
                    <Col>
                        <p>{summonerGameInfo.kills } / {summonerGameInfo.deaths} / {summonerGameInfo.assists}</p>
                        <p>{((summonerGameInfo.kills + summonerGameInfo.assists) / summonerGameInfo.deaths).toFixed(2)} KDA</p>
                        <p>{summonerGameInfo.totalMinionsKilled} CS</p>
                        <p>{summonerGameInfo.visionScore !== 0 && (summonerGameInfo.visionScore)} Vision</p>
                    </Col>
                    <Col>
                        <Row>
                            <Col>{summonerGameInfo.item0}</Col>
                            <Col>{summonerGameInfo.item1}</Col>
                            <Col>{summonerGameInfo.item2}</Col>
                            <Col>{summonerGameInfo.item6}</Col>
                        </Row>
                        <Row>
                            <Col>{summonerGameInfo.item3}</Col>
                            <Col>{summonerGameInfo.item4}</Col>
                            <Col>{summonerGameInfo.item5}</Col>
                        </Row>
                    </Col>
                </Row>
            </Col>
            <Col>
                <Row>
                    <Col>
                    {teamOne.map((name) => {
                        return <p style={{ fontSize: "12px"}}>{name}</p>;
                    })}
                    </Col>
                    <Col>
                    {teamTwo.map((name) => {
                        return <p style={{ fontSize: "12px"}}>{name}</p>;
                    })}
                    </Col>
                </Row>
            </Col>
    </Container>
    )
}

export default MatchHistoryCard;