import React from 'react';
import { Container, Row, Col, Card, Image } from 'react-bootstrap';
// import the JSON file named rankIcons.json from the frontend/src/assets folder
import rankIcons from '../../../api/rankIcons.json';
import '../SummonerInfoMainContainer/RankInfoContainer.css'

const RankInfoContainer = ({ rankinfo }) => {
    console.log('rank info:', rankinfo)

    const winRate = ((rankinfo.wins / (rankinfo.wins + rankinfo.losses)) * 100).toFixed(2);
    return (
        <Container className='rank-info-container'>
            <Container className='rank-info-stats-container'>
                <Container className='rank-info-stats'>
                    <Container className='rank-info-tier'>{rankinfo.tier} {rankinfo.division}</Container>
                    <Container className='rank-info-lp'>{rankinfo.lp} LP</Container>
                    <Container className='rank-info-wr'>{rankinfo.wins}W / {rankinfo.losses}L </Container>
                    <Container className='wr-percentage'>{winRate}% WR</Container>
                </Container>
            </Container>
            <Container className='rank-info-icon-container'>
                <Image className='rank-icon-img' src={rankIcons[rankinfo.tier]} alt='rank icon' fluid />
            </Container>
        </Container>
    );
};

export default RankInfoContainer;
