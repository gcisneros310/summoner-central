import React from 'react';
import { Container, Row, Col, Card, Image } from 'react-bootstrap';
// import the JSON file named rankIcons.json from the frontend/src/assets folder
import rankIcons from '../../../api/rankIcons.json';

const RankInfoContainer = ({ rankinfo }) => {
    return (
        <Container className='rank-info-main-container'>
            <Container className='tier-stats-container'>
                <div className='rank-tier-text'></div>
                <div className='rank-lp'></div>
                <div className='rank-winrate'></div>
            </Container>
            {/* <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title>{rankinfo.tier} {rankinfo.rank}</Card.Title>
                            <Card.Subtitle>{rankinfo.lp} LP</Card.Subtitle>
                            <Card.Text>{rankinfo.wins}W / {rankinfo.losses}L</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
        
            </Row> */}
        </Container>
    );
};

export default RankInfoContainer;
