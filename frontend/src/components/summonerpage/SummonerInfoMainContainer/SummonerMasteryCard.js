import React from 'react';
// import './SummonerMasteryCard.css';
import { getChampionAssetInfo } from '../../../api/summonerAPI';
import { useState, useEffect } from 'react';

// import shieldbowClient from '../../../api/shieldbow';
const SummonerMasteryCard = ({highestMasteryChamp}) => {
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
        <div className='summ-mastery-card-container'>
            {highestMasteryChamp.name}
        </div>
    );
};

export default SummonerMasteryCard;
