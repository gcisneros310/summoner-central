import React from "react";
import HomePageHeaderText from "./HomePageHeaderText";
import SummonerForm from "./SummonerForm";
import "../css/HomePage.css";
import HomePageNavBar from "./HomePageNavBar";

const HomePage = () => {
  return (
    <div>
      <div className="homepage-background"></div> {/* Add a new div for the background */}
      <HomePageNavBar className="homepage-nav-bar" />
      <div className="centered">
        <HomePageHeaderText className="home-page-header-text" />
        <SummonerForm className="summoner-form" />
      </div>
    </div>
  );
};

export default HomePage;