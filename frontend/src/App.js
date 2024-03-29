import React, { useEffect } from 'react';
import {
  BrowserRouter as Router, Switch, Route
} from 'react-router-dom';
import {
  AuthNavBar, LoginForm, SignUpForm, Portfolio, FormContainer, NewLeaderboard, TeamPage, AllTeamsPage, LandingPage
} from './components';
import { connect } from 'react-redux';
import { initAllTeams, setAllNames, updatePrices } from './actions/teamActions'; 
import { refreshToken } from './actions/authActions';
import Cookies from 'universal-cookie';
import socketIOClient from "socket.io-client";

import './App.css';

function App(props) {

  const cookies = new Cookies();

  useEffect(() => {
    props.refreshToken(cookies.get('csrf_refresh_token'));
    props.setAllNames();
    props.initAllTeams();
  }, []);

  const socket = socketIOClient('http://localhost:5000');

  socket.on('prices', data => {
    props.updatePrices(data);
  });

  return (
    <Router>
      <AuthNavBar />
        <Switch>
          <Route path="/" exact>
            <LandingPage />
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
            <NewLeaderboard />
          </Route>
        </Switch>
    </Router>
  );
}

export default connect(null, { initAllTeams, setAllNames, refreshToken, updatePrices })(App);
