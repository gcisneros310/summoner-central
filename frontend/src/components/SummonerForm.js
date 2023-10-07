import { Form, Button } from "react-bootstrap";
import "../css/SummonerForm.css";
import { useState } from "react";
// i need to import dotenv here
import { useHistory } from "react-router-dom";
import { getSummonerInformation } from "../api/summonerAPI"

const SummonerForm = (props) => {
  const [summonerName, setSummonerName] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Add this state
  const history = useHistory(); // Create an instance of history

  const handleSearch = async (event) => {
    event.preventDefault();

    console.log("Search button clicked");
    setIsLoading(true); // Set isLoading to true at the start

    try {
      const summonerInforObject = await getSummonerInformation(summonerName);
      console.log('summoner info object is:', summonerInforObject);
      
      history.push({
        pathname: '/summonerMainPage',
        state: { summonerInfo: summonerInforObject }
      });

    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false); // Set isLoading to false when done, regardless of success or failure
    }
  };

  return (
    <Form className="form-container">
      <div className="summoner-form-container">
        <Form.Label className="summoner-form-label text-center">
          <div id='form-summoner-name-header'>Summoner Name</div>
        </Form.Label>
        <Form.Control
          className="summoner-input-field"
          type="text"
          placeholder="Enter Summoner Name"
          onChange={(event) => setSummonerName(event.target.value)}
        />
        {/* Conditionally render Link based on isLoading */}
        {!isLoading ? (
          <Button
            className="summoner-form-button"
            type="submit"
            variant="custom"
            onClick={handleSearch}
          >
            Search
          </Button>
        ) : (
          <Button
            className="summoner-form-button-loading"
            type="submit"
            variant="custom"
            disabled // Disable the button when loading
          >
            Searching...
          </Button>
        )}
      </div>
    </Form>
  );
};

export default SummonerForm;