import React from 'react';
import {
  BrowserRouter as Router, Switch, Route
} from 'react-router-dom';
import {
  BaseNavBar, AuthNavBar, LoginForm, SignUpForm, Portfolio, FormContainer, Leaderboard, TeamPage,
} from './components';

import './App.css';

function App() {

  return (
    <Router>
      <AuthNavBar />
        <Switch>
          <Route path="/" exact>
            <h1> Fanbase Market </h1>
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
          <Route path="/leaderboard" exact>
            <Leaderboard />
          </Route>
        </Switch>
    </Router>
  );
}

export default App;
