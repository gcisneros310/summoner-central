import React from 'react';
import '../../../css/SummonerMasteryCard.css';
import { getChampionAssetInfo } from '../../../api/summonerAPI';
import { useState, useEffect } from 'react';
import { Container, Image } from 'react-bootstrap/';


// import shieldbowClient from '../../../api/shieldbow';
const SummonerMasteryCard = ({ highestMasteryChamp }) => {
    const [championObject, setChampionObject] = useState({});

    useEffect(() => {
        const getChampionAsset = async () => {
            const championAssetResponse = await getChampionAssetInfo(highestMasteryChamp.name);
            const championAsset = championAssetResponse.data;
            console.log('champion asset info:', championAsset);
            setChampionObject(championAsset);
        }
        getChampionAsset();
    }, [highestMasteryChamp.name]);

    console.log('champion object:', championObject)
    return (
        <Container className='summ-mastery-card-container'>
            <div className='summ-mastery-info'>
                <div className='summ-mastery-text1'>Highest Mastery: {highestMasteryChamp.name}</div>
                <div className='summ-mastery-text2'>Mastery Rank: {highestMasteryChamp.rank}</div>
                <div className='summ-mastery-text3'>Total Points: {highestMasteryChamp.points}</div>
            </div>
            <Image className='champ-icon' src={championObject.icon} alt='champ icon' fluid />
        </Container>
    );
};

export default SummonerMasteryCard;
