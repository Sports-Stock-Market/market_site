import React, { useState, useEffect } from 'react';
import io from 'socket.io-client'
import {
  BrowserRouter as Router, Switch, Route
} from 'react-router-dom';
import {
  AuthNavBar, LoginForm, SignUpForm, Portfolio, FormContainer, Leaderboard, TeamPage, AllTeamsPage,
} from './components';
import './App.css';

const socket = io('http://localhost:5000')

const App = (props) => {
  const [prices, setPrices] = useState({'Chicago Bulls': 1000});

  useEffect(() => {
    getPrices();
  }, []);

  const getPrices = () => {
    socket.on('prices', data => {
      console.log('recieved');
      setPrices(data);
    });
  };

  return (
    <Router>
      <AuthNavBar />
        <Switch>
          <Route path="/" exact>
            <h1> {prices['Chicago Bulls']} </h1>
          </Route>
          <Route path="/login" exact>
            <FormContainer title="Welcome to Fanbase">
              <LoginForm />
            </FormContainer>
          </Route>
          <Route path="/signup" exact>
            <FormContainer title="Build Your Fanbase">
              <SignUpForm />
            </FormContainer>
          </Route>
          <Route path="/portfolio/:username">
            <Portfolio />
          </Route>
          <Route path="/team/:abr" render={props => <TeamPage {...props} />} />
          <Route path="/teams" exact>
            <AllTeamsPage />
          </Route>
          <Route path="/leaderboard" exact>
            <Leaderboard />
          </Route>
        </Switch>
    </Router>
  );
}

export default App;