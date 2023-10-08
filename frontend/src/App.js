import HomePage from "./components/HomePage";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import SummonerMainPage from "./components/summonerpage/SummonerMainPage";
import "./css/App.css"

function App() {
  return (
    <Router>
      <div className="App">
        <div className="homepage" >
          <Switch>
            <Route exact path="/">
              <HomePage />
            </Route>
            <Route exact path='/summonerMainPage'>
              <SummonerMainPage />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
