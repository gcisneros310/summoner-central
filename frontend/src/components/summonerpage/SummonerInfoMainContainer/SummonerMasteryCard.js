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
            const championAssetResponse = await getChampionAssetInfo(highestMasteryChamp.championId);
            const championAsset = championAssetResponse.data;
            console.log('champion asset info:', championAsset);
            setChampionObject(championAsset);
        }
        getChampionAsset();
    }, [highestMasteryChamp.championId]);

    console.log('champion object:', championObject)
    return (
        <Container className='summ-mastery-card-container'>
            <div className='summ-mastery-info'>
                <div className='summ-mastery-text1'>Highest Mastery: <span className='italic'>{championObject.name}</span></div>
                <div className='summ-mastery-text2'>Mastery Rank: <span className='italic'>{highestMasteryChamp.championLevel}</span></div>
                <div className='summ-mastery-text3'>Total Points: <span className='italic'>{highestMasteryChamp.championPoints} MR</span></div>
            </div>
            <div className='img-container'>

            </div>
            <Image className='champ-icon' src={championObject.icon} alt='champ icon' fluid />
        </Container>
    );
};

export default SummonerMasteryCard;
